// src/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './useAuth';

const ProtectedRoute = ({ element: Element, ...rest }) => {
  const { currentUser } = useAuth();

  return currentUser ? (
    <Element {...rest} />
  ) : (
    <Navigate to="/" />
  );
};

export default ProtectedRoute;
