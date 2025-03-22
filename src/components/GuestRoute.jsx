// src/components/GuestRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const GuestRoute = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();

  // Dacă user există, redirecționează către dashboard
  if (user) {
    return <Navigate to="/dashboard" state={{ from: location }} replace />;
  }
  return children;
};

export default GuestRoute;
