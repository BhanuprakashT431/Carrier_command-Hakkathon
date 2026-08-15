import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import Navbar from '../layout/Navbar.jsx';
import Breadcrumbs from '../layout/Breadcrumbs.jsx';

const AdminGuard = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  // Allow if user is admin, or if demo mode is active
  const isAdmin = user?.role === 'admin' || import.meta.env.VITE_DEMO_MODE === 'true';

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="flex flex-col min-h-[100dvh]">
      <Navbar />
      <Breadcrumbs />
      <main className="flex-1 flex flex-col relative overflow-x-hidden">
        {children}
      </main>
    </div>
  );
};

export default AdminGuard;
