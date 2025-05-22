import { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../components/firebase/firebaseClient';
import { useAuth } from '../context/useAuth';
import { useNavigate } from 'react-router-dom';
import { Timestamp } from 'firebase/firestore';
import { doc, updateDoc } from 'firebase/firestore';
import { toast } from 'react-hot-toast';
import { deleteDoc } from 'firebase/firestore';


type Message = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  projectType?: string;
  budget?: string;
  timeframe?: string;
  message: string;
  createdAt?: Timestamp;
  status?: string;
  reply?: string;
  repliedAt?: Timestamp;
};



const AdminDashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [filter, setFilter] = useState<'all' | 'new' | 'considering' | 'inprogress' | 'completed' | 'replied' | 'archived'>('all');
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [replyToggles, setReplyToggles] = useState<{ [id: string]: boolean }>({});
  const [replyContent, setReplyContent] = useState<{ [id: string]: string }>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);



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
        const docs = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Message[];
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

const sendReply = async (id: string) => {
  const message = messages.find((m) => m.id === id);
  const replyText = replyContent[id];

  if (!message || !replyText?.trim()) {
    toast.error("Reply can't be empty.");
    return;
  }

  try {
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: message.email,
        subject: `Reply to your message`,
        body: replyText,
      }),
    });

    if (!response.ok) throw new Error('Failed to send email.');

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
  const matchStatus = filter === 'all' ? true : (filter === 'replied' ? !!msg.reply : (msg.status ?? 'new') === filter);
  const matchSearch = msg.name.toLowerCase().includes(searchQuery) || msg.email.toLowerCase().includes(searchQuery);
  return matchStatus && matchSearch;
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


  return (
    <>
      <div className="mb-6 flex flex-wrap gap-3 items-center">
        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2">
          {['all', 'new', 'considering', 'inprogress', 'completed', 'replied', 'archived'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status as typeof filter)}
              className={`px-4 py-2 rounded text-sm font-medium ${
                filter === status
                  ? 'bg-cyan-700 text-white'
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white'
              }`}
            >
              {status === 'inprogress' ? 'In Progress' : status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
        {/* Search Input */}
        <input
          type="text"
          placeholder="Search by name or email..."
          className="px-4 py-2 border border-gray-300 rounded dark:bg-slate-800 dark:text-white"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value.toLowerCase())}
        />
        {/* Export Button */}
        <button
          onClick={exportToCSV}
          className="bg-indigo-600 text-white px-4 py-2 rounded shadow hover:bg-indigo-500"
        >
          Export as CSV
        </button>
      </div>

      <div className="min-h-screen bg-slate-100 dark:bg-slate-900 p-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">Admin Dashboard</h1>
      {filteredMessages.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">No messages in this status.</p>
      ) : (
        <ul className="space-y-4">
          {filteredMessages.map((msg) => (
            <li key={msg.id} className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow">
              <div className="flex justify-between items-center">
                {/* Checkbox + name/email/status */}
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(msg.id)}
                    onChange={(e) => {
                      setSelectedIds((prev) =>
                        e.target.checked
                          ? [...prev, msg.id]
                          : prev.filter((id) => id !== msg.id)
                      );
                    }}
                  />
                  <p className="text-sm text-gray-500 dark:text-gray-300">
                    <strong>{msg.name}</strong> ({msg.email}) – <em>{msg.status ?? 'new'}</em>
                    {msg.reply && (
                      <span className="ml-2 text-green-600 dark:text-green-400 text-xs font-semibold">
                        Replied
                      </span>
                    )}
                  </p>
                </div>
                {/* Dropdown menu */}
                <div className="relative group">
                  <button className="bg-slate-600 text-white px-3 py-1 rounded text-sm hover:bg-slate-700">
                    ⋮
                  </button>
                  <div className="absolute right-0 mt-1 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                    <button
                      onClick={() => updateStatus(msg.id, 'archived')}
                      className="block w-full px-4 py-2 text-left text-sm text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-slate-700"
                    >
                      Archive
                    </button>
                    <button
                      onClick={() => deleteMessage(msg.id)}
                      className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-100 dark:hover:bg-red-900"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
              {/* Message body and project metadata */}
              <p className="mt-2 text-slate-800 dark:text-white">{msg.message}</p>
              <div className="mt-2 text-sm text-gray-600 dark:text-gray-300 space-y-1">
                {msg.phone && <p><strong>Phone:</strong> {msg.phone}</p>}
                {msg.projectType && <p><strong>Project Type:</strong> {msg.projectType}</p>}
                {msg.budget && <p><strong>Budget:</strong> {msg.budget}</p>}
                {msg.timeframe && <p><strong>Timeframe:</strong> {msg.timeframe}</p>}
              </div>
              <p className="mt-1 text-xs text-gray-400">
                {msg.createdAt?.toDate?.().toLocaleString() ?? 'No timestamp'}
              </p>
              {/* Reply toggle + textarea + send button */}
              <button
                onClick={() =>
                  setReplyToggles((prev) => ({ ...prev, [msg.id]: !prev[msg.id] }))
                }
                className="mt-3 text-sm text-blue-500 hover:underline"
              >
                {replyToggles[msg.id] ? 'Cancel Reply' : 'Reply'}
              </button>
              {replyToggles[msg.id] && (
                <div className="mt-2">
                  <textarea
                    className="w-full p-2 border border-gray-300 rounded dark:bg-slate-700 dark:text-white"
                    rows={3}
                    placeholder="Type your reply..."
                    value={replyContent[msg.id] || ''}
                    onChange={(e) =>
                      setReplyContent((prev) => ({ ...prev, [msg.id]: e.target.value }))
                    }
                  />
                  <button
                    onClick={() => sendReply(msg.id)}
                    className="mt-2 bg-blue-600 text-white px-4 py-2 rounded"
                  >
                    Send Reply
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
      </div>
    </>
  );
};

export default AdminDashboard;
