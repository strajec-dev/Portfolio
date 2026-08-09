import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { isAuthenticated } from '../utils/auth';

export default function ProtectedRoute() {
  if (!isAuthenticated()) {
    // Redirect to login page if not authenticated
    return <Navigate to="/admin/login" replace />;
  }

  // Render child routes if authenticated
  return <Outlet />;
}
