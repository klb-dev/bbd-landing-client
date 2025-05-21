import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../components/firebase/firebaseClient';
import { toast } from 'react-hot-toast';
import { FirebaseError } from 'firebase/app';


const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success('Login successful!');
      navigate('/admin-dashboard'); 
    } catch (err: unknown) {
          if (err instanceof FirebaseError) {
            switch (err.code) {
              case 'auth/user-not-found':
                toast.error('No user found with that email.');
                break;
              case 'auth/wrong-password':
                toast.error('Incorrect password.');
                break;
              case 'auth/too-many-requests':
                toast.error('Too many attempts. Try again later.');
                break;
              case 'auth/network-request-failed':
                toast.error('Network error. Check your connection.');
                break;
              default:
                toast.error(err.message); // fallback to Firebase error message
            }
          } else {
            toast.error('An unknown error occurred.');
          } 
        } finally {
            setLoading(false);
          }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-900">
      <form onSubmit={handleLogin} className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-6 text-center text-slate-900 dark:text-white">Admin Login</h1>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mb-4 rounded border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-6 rounded border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
          required
        />
        <button
          type="submit"
          className="w-full bg-cyan-700 hover:bg-cyan-600 text-white font-semibold py-2 px-4 rounded flex items-center justify-center"
          disabled={loading}
        >
          {loading ? (
            <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
          ) : (
            'Log In'
          )}
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;
