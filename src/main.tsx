import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css';
import { router } from './App';

import { ToastContainer } from "react-toastify";

import { RouterProvider } from 'react-router-dom';
import AuthProvider from './contexts/AuthContext';

import { register } from "swiper/element/bundle";

register();
import 'swiper/css';
import "swiper/css/navigation";
import 'swiper/css/scrollbar';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ToastContainer autoClose={3000} />
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
)
