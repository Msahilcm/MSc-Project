import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedAdminRoute = ({ children }) => {
  const adminToken = localStorage.getItem('adminToken');
  const adminUser = localStorage.getItem('adminUser');

  // Check if admin is authenticated
  if (!adminToken || !adminUser) {
    // Redirect to login form if not authenticated
    return <Navigate to="/login/form" replace />;
  }

  // If authenticated, render the admin dashboard
  return children;
};

export default ProtectedAdminRoute; 