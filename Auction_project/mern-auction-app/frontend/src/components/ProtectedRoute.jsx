import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

// This component wraps any route that should only be accessible to logged-in users.
const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext);

  // If there is no user, automatically redirect them to the login page.
  // We use replace to prevent them from going "back" to the protected route.
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If they are logged in, render the protected component (children).
  return children;
};

export default ProtectedRoute;
