import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; 
import { AuthProvider } from './context/AuthProvider.tsx';
import { inject } from '@vercel/analytics';
import './index.css';
import App from './App.tsx';

inject();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter> 
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);

