import React from 'react';
import { Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './useAuth';

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const { currentUser } = useAuth();
  const location = useLocation();

  return (
    <Route
      {...rest}
      render={(props) =>
        currentUser ? (
          <Component {...props} />
        ) : (
          <Navigate to="/login" state={{ from: location }} />
        )
      }
    />
  );
};

export default ProtectedRoute;
