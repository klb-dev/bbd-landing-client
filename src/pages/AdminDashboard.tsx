import { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../components/firebase/firebaseClient';
import { useAuth } from '../context/useAuth';
import { useNavigate } from 'react-router-dom';
import { doc, updateDoc } from 'firebase/firestore';
import { toast } from 'react-hot-toast';
import { deleteDoc } from 'firebase/firestore';
import MessageCard from './MessageCard';
import FilterBar from './FilterBar'; 
import BulkActionsBar from './BulkActionsBar';
import type { ProjectType, Message, FilterStatus } from '@shared/dataTypes';
import { allProjectTypes } from '@shared/dataTypes';
const AdminDashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [filter, setFilter] = useState<FilterStatus>('all');
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [replyToggles, setReplyToggles] = useState<{ [id: string]: boolean }>({});
  const [replyContent, setReplyContent] = useState<{ [id: string]: string }>({});
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



  if (loading || loadingMessages) {
    return <div className="text-center mt-32 text-white">Loading dashboard...</div>;
  }

  const updateStatus = async (id: string, newStatus: string) => {
  try {
    await updateDoc(doc(db, 'messages', id), {
      status: newStatus,
    });
    toast.success(`Status updated to "${newStatus}"`);
    setMessages((prev: Message[]) =>
      prev.map((msg: Message) =>
        msg.id === id ? { ...msg, status: newStatus } : msg
      )
    );
  } catch (err) {
    console.error('Error updating status:', err);
    toast.error('Failed to update status.');
  }
};

const deleteMessage = async (id: string) => {
  const confirmed = window.confirm("Are you sure you want to delete this message? This cannot be undone.");
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
  const confirmed = window.confirm(`Delete ${selectedIds.length} selected messages? This will move them to the recycle bin.`);
  if (!confirmed) return;

  try {
    const updates = selectedIds.map((id) =>
      updateDoc(doc(db, 'messages', id), { status: 'deleted' })
    );
    await Promise.all(updates);

    setMessages((prev) =>
      prev.map((msg) =>
        selectedIds.includes(msg.id) ? { ...msg, status: 'deleted' } : msg
      )
    );

    toast.success(`${selectedIds.length} messages moved to recycle bin.`);
    setSelectedIds([]); // clear selection
  } catch (err) {
    console.error('Batch delete error:', err);
    toast.error('Failed to delete selected messages.');
  }
};

const sendReply = async (id: string) => {
  const message = messages.find((m) => m.id === id);
  const replyText = replyContent[id];

  if (!message || !replyText?.trim()) {
    toast.error("Reply can't be empty.");
    return;
  }


  try {
    const response = await fetch('bbd-landing-server-production.up.railway.app', {
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
      const errorText = await response.text(); // get the raw message
      console.error("🔻 Server error response:", errorText);
      throw new Error('Failed to send message');
    }

    let result;
    try {
      result = await response.json(); // <-- only if you know backend is sending JSON
      console.log("✅ Response JSON:", result);
    } catch (err) {
      console.warn("⚠️ Could not parse JSON:", err);
    }

    toast.success('Reply sent!');

    // Optionally save to Firestore
    await updateDoc(doc(db, 'messages', id), {
      reply: replyText,
      repliedAt: new Date(),
    });

    // Reset UI state
    setReplyToggles((prev) => ({ ...prev, [id]: false }));
    setReplyContent((prev) => ({ ...prev, [id]: '' }));
  } catch (err) {
    console.error(err);
    toast.error('Failed to send reply.');
  }
};


const filteredMessages = messages.filter((msg) => {
  const matchStatus =
    filter === 'all'
      ? true
      : filter === 'replied'
        ? !!msg.reply
        : (msg.status ?? 'new') === filter;

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
  const headers = [
    "Name", "Email", "Phone", "Project Type", "Budget", "Timeframe", "Status", "Message", "Created At"
  ];

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

  const csvContent =
    [headers, ...rows]
      .map((row) => row.map(String).join(","))
      .join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "messages.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const statuses: typeof filter[] = [
  'all',
  'new',
  'considering',
  'inprogress',
  'completed',
  'replied',
  'archived',
  'deleted'
];

const statusCounts: Record<string, number> = statuses.reduce((acc, key) => {
  acc[key] = key === 'all'
    ? messages.length
    : key === 'replied'
      ? messages.filter((m) => !!m.reply).length
      : messages.filter((m) => (m.status ?? 'new') === key).length;
  return acc;
}, {} as Record<string, number>);


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
      <div className="min-h-screen bg-slate-100 dark:bg-slate-900 p-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">Admin Dashboard</h1>
      {filteredMessages.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">No messages in this status.</p>
      ) : (
        <ul className="space-y-4">
          {filteredMessages.map((msg) => (
            <MessageCard
              key={msg.id}
              msg={msg}
              isSelected={selectedIds.includes(msg.id)}
              onSelect={(checked) => {
                setSelectedIds((prev) =>
                  checked ? [...prev, msg.id] : prev.filter((id) => id !== msg.id)
                );
              }}
              onReplyToggle={() =>
                setReplyToggles((prev) => ({ ...prev, [msg.id]: !prev[msg.id] }))
              }
              isReplyOpen={!!replyToggles[msg.id]}
              replyContent={replyContent[msg.id] || ''}
              onReplyChange={(val) =>
                setReplyContent((prev) => ({ ...prev, [msg.id]: val }))
              }
              onSendReply={() => sendReply(msg.id)}
              onDelete={() => deleteMessage(msg.id)}
              onArchive={() => updateStatus(msg.id, 'archived')}
              onRestore={() => updateStatus(msg.id, 'archived')}
            />
          ))}
        </ul>
      )}
      </div>
    </>
  );
};

export default AdminDashboard;
