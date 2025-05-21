import { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../components/firebase/firebaseClient';
import { useAuth } from '../context/useAuth';
import { useNavigate } from 'react-router-dom';
import { Timestamp } from 'firebase/firestore';
import { doc, updateDoc } from 'firebase/firestore';
import { toast } from 'react-hot-toast';


type Message = {
  id: string;
  name: string;
  email: string;
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
  const [filter, setFilter] = useState<'all' | 'new' | 'considering' | 'inprogress' | 'completed' | 'replied'>('all');
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [replyToggles, setReplyToggles] = useState<{ [id: string]: boolean }>({});
  const [replyContent, setReplyContent] = useState<{ [id: string]: string }>({});


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
  if (filter === 'all') return true;
  if (filter === 'replied') return !!msg.reply;
  return (msg.status ?? 'new') === filter;
});

  return (
    <>
      <div className="mb-6 flex space-x-3">
        {['all', 'new', 'considering', 'inprogress', 'completed', 'replied'].map((status) => (
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
      <div className="min-h-screen bg-slate-100 dark:bg-slate-900 p-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">Admin Dashboard</h1>
      {filteredMessages.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">No messages in this status.</p>
      ) : (
        <ul className="space-y-4">
          {filteredMessages.map((msg) => (
           <li key={msg.id} className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-500 dark:text-gray-300">
                <strong>{msg.name}</strong> ({msg.email}) – <em>{msg.status ?? 'new'}</em>
                    {msg.reply && (
                      <span className="ml-2 text-green-600 dark:text-green-400 text-xs font-semibold">
                        Replied
                      </span>
                    )}
              </p>
              <div className="flex space-x-2">
                <button
                  onClick={() => updateStatus(msg.id, 'considering')}
                  className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
                >
                  Considering
                </button>
                <button
                  onClick={() => updateStatus(msg.id, 'inprogress')}
                  className="bg-yellow-500 text-white px-3 py-1 rounded text-sm"
                >
                  In Progress
                </button>
                <button
                  onClick={() => updateStatus(msg.id, 'completed')}
                  className="bg-green-500 text-white px-3 py-1 rounded text-sm"
                >
                  Completed
                </button>
              </div>
            </div>

            <p className="mt-2 text-slate-800 dark:text-white">{msg.message}</p>
            <p className="mt-1 text-xs text-gray-400">
              {msg.createdAt?.toDate?.().toLocaleString() ?? 'No timestamp'}
            </p>
            {/* Toggle Reply */}
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
