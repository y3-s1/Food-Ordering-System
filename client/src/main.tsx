import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { AuthProvider } from './auth/AuthContext';
import { Toaster } from 'react-hot-toast';
import 'leaflet/dist/leaflet.css';
import { CartProvider } from './context/cartContext.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <CartProvider>
        <App />
        <Toaster position="top-right" />
      </CartProvider>
    </AuthProvider>
  </React.StrictMode>
);
