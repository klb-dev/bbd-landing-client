import { useEffect, useState } from 'react';
import { doc, updateDoc, deleteDoc, Timestamp, collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../components/firebase/firebaseClient';
import { useAuth } from '../context/useAuth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import FilterBar from './FilterBar'; 
import BulkActionsBar from './BulkActionsBar';
import type { ProjectType, Message, FilterStatus } from '@shared/dataTypes';
import { allProjectTypes } from '@shared/dataTypes';
import MessageList from './MessageList';
import useReplyManager from '../components/hooks/useReplyManager';
import DashboardWrapper from './DashboardWrapper';


const AdminDashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const [messages, setMessages] = useState<Message[]>([]);
  const [filter, setFilter] = useState<FilterStatus>('all');
  const [loadingMessages, setLoadingMessages] = useState(true);
  const {
    replyToggles,
    replyContent,
    toggleReply,
    updateReply,
  } = useReplyManager();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedProjectType, setSelectedProjectType] = useState('all');

  useEffect(() => {
    if (!loading && !user) {
      navigate('/admin');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);

        const validTypes: ProjectType[] = allProjectTypes;

        const docs: Message[] = snapshot.docs.map((doc) => {
          const data = doc.data();

          return {
            id: doc.id,
            name: data.name,
            email: data.email,
            phone: data.phone ?? '',
            projectType: validTypes.includes(data.projectType)
              ? data.projectType
              : 'Other',
            budget: data.budget ?? '',
            timeframe: data.timeframe ?? '',
            message: data.message,
            createdAt: data.createdAt,
            status: data.status ?? 'new',
            reply: data.reply,
            repliedAt: data.repliedAt,
          };
        });

        setMessages(docs);
      } catch (err) {
        console.error('Error fetching messages:', err);
      } finally {
        setLoadingMessages(false);
      }
    };

    if (user) fetchMessages();
  }, [user]);

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, 'messages', id), { status: newStatus });
      toast.success(`Status updated to "${newStatus}"`);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === id ? { ...msg, status: newStatus } : msg
        )
      );
    } catch (err) {
      console.error('Error updating status:', err);
      toast.error('Failed to update status.');
    }
  };

  const deleteMessage = async (id: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this message?");
    if (!confirmed) return;

    try {
      await deleteDoc(doc(db, 'messages', id));
      setMessages((prev) => prev.filter((msg) => msg.id !== id));
      toast.success("Message deleted.");
    } catch (err) {
      console.error("Error deleting message:", err);
      toast.error("Failed to delete.");
    }
  };

  const handleBatchDelete = async () => {
    const confirmed = window.confirm(`Delete ${selectedIds.length} selected messages?`);
    if (!confirmed) return;

    try {
      await Promise.all(
        selectedIds.map((id) =>
          updateDoc(doc(db, 'messages', id), { status: 'deleted' })
        )
      );

      setMessages((prev) =>
        prev.map((msg) =>
          selectedIds.includes(msg.id)
            ? { ...msg, status: 'deleted' }
            : msg
        )
      );

      toast.success(`${selectedIds.length} messages moved to recycle bin.`);
      setSelectedIds([]);
    } catch (err) {
      console.error('Batch delete error:', err);
      toast.error('Failed to delete selected messages.');
    }
  };

  const sendReply = async (message: Message, replyText: string) => {
    if (!replyText?.trim()) {
      toast.error("Reply can't be empty.");
      return;
    }

    const toastId = toast.loading('Sending reply...');

    try {
      const response = await fetch('https://bbd-landing-server-production.up.railway.app/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: message.email,
          subject: `Reply to your message`,
          body: replyText,
          isReply: true,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Server error:", errorText);
        throw new Error('Failed to send message');
      }

      await updateDoc(doc(db, 'messages', message.id), {
        reply: replyText,
        repliedAt: Timestamp.fromDate(new Date()),
        status: 'replied',
      });

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === message.id
            ? { ...msg, reply: replyText, repliedAt: Timestamp.fromDate(new Date()), status: 'replied' }
            : msg
        )
      );

      toast.success('Reply sent!', { id: toastId });
    } catch (err) {
      console.error(err);
      toast.error('Failed to send reply.', { id: toastId });
    }
  };

  const filteredMessages = messages.filter((msg) => {
    const matchStatus =
      filter === 'all' ? true : (msg.status ?? 'new') === filter;

    const matchSearch =
      msg.name.toLowerCase().includes(searchQuery) ||
      msg.email.toLowerCase().includes(searchQuery);

    const created = msg.createdAt?.toDate?.();
    const matchDate =
      (!startDate || (created && new Date(startDate) <= created)) &&
      (!endDate || (created && created <= new Date(endDate + 'T23:59:59')));

    const matchProjectType =
      selectedProjectType === 'all' || msg.projectType === selectedProjectType;

    return matchStatus && matchSearch && matchDate && matchProjectType;
  });

  const exportToCSV = () => {
    const headers = ["Name", "Email", "Phone", "Project Type", "Budget", "Timeframe", "Status", "Message", "Created At"];

    const rows = messages.map((msg) => [
      msg.name,
      msg.email,
      msg.phone || "",
      msg.projectType || "",
      msg.budget || "",
      msg.timeframe || "",
      msg.status || "new",
      `"${msg.message.replace(/"/g, '""')}"`,
      msg.createdAt?.toDate()?.toLocaleString() ?? ""
    ]);

    const csvContent = [headers, ...rows].map((row) => row.map(String).join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "messages.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const statuses: typeof filter[] = ['all', 'new', 'considering', 'inprogress', 'completed', 'replied', 'archived', 'deleted'];

  const statusCounts: Record<string, number> = statuses.reduce((acc, key) => {
    acc[key] = key === 'all'
      ? messages.length
      : messages.filter((m) => (key === 'replied' ? !!m.reply : (m.status ?? 'new') === key)).length;
    return acc;
  }, {} as Record<string, number>);

  if (loadingMessages) {
    return (
      <DashboardWrapper>
        <MessageList
          messages={filteredMessages}
          selectedIds={selectedIds}
          replyToggles={replyToggles}
          replyContent={replyContent}
          onSelect={(id, checked) =>
            setSelectedIds((prev) =>
              checked ? [...prev, id] : prev.filter((existing) => existing !== id)
            )
          }
          onReplyToggle={toggleReply}
          onReplyChange={updateReply}
          onSendReply={sendReply}
          onDelete={deleteMessage}
          onArchive={(id) => updateStatus(id, 'archived')}
          onRestore={(id) => updateStatus(id, 'archived')}
          onUpdateStatus={updateStatus}
        />
      </DashboardWrapper>
    );
  }

  return (
    <>
      <div className="m-6 flex flex-wrap gap-3 items-center">
        <FilterBar
          filter={filter}
          setFilter={setFilter}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          selectedProjectType={selectedProjectType}
          setSelectedProjectType={setSelectedProjectType}
          statusCounts={statusCounts}
        />
        <BulkActionsBar
          selectedCount={selectedIds.length}
          onDeleteSelected={handleBatchDelete}
          onExport={exportToCSV}
        />
      </div>
      <DashboardWrapper>
        <MessageList
          messages={filteredMessages}
          selectedIds={selectedIds}
          replyToggles={replyToggles}
          replyContent={replyContent}
          onSelect={(id, checked) =>
            setSelectedIds((prev) =>
              checked ? [...prev, id] : prev.filter((existing) => existing !== id)
            )
          }
          onReplyToggle={toggleReply}
          onReplyChange={updateReply}
          onSendReply={sendReply}
          onDelete={deleteMessage}
          onArchive={(id) => updateStatus(id, 'archived')}
          onRestore={(id) => updateStatus(id, 'archived')}
          onUpdateStatus={updateStatus}
        />
      </DashboardWrapper>
    </>
  );
};

export default AdminDashboard;