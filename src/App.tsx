import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './components/layout/Layout';
import HomePage from './components/HomePage';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <>
    <Toaster position="top-right" reverseOrder={false} />
    <Routes>
      <Route 
        path="/"
        element = {
          <Layout>
            <HomePage />
          </Layout>
        }
      />
      <Route 
        path="/admin"
        element = {
          <AdminLogin />
        }
      />
      <Route 
        path="/admin-dashboard"
        element = {
          <AdminDashboard />
        }
      />
    </Routes>
    </>
  );
}
export default App;

