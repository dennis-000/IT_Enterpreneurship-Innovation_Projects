import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { AppDataProvider } from './context/AppDataContext.tsx';
import { AdminAuthProvider } from './context/AdminAuthContext.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AdminAuthProvider>
      <AppDataProvider>
        <App />
      </AppDataProvider>
    </AdminAuthProvider>
  </StrictMode>
);
