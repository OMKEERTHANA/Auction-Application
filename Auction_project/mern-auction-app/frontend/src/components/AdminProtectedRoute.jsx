import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

// This component wraps any route that should only be accessible to admin users.
const AdminProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext);

  // If there is no user, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If user is not admin, redirect to home
  if (user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  // If they are logged in AND are admin, render the admin component
  return children;
};

export default AdminProtectedRoute;
