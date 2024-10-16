
import React from 'react';
import { Navigate } from 'react-router-dom';

function PrivateRoute({ children, isEditorRoute }) {
  const isAuthenticated = !!localStorage.getItem('access_token');
  const isEditor = localStorage.getItem('is_editor') === 'true';

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (isEditorRoute && !isEditor) {
    return <Navigate to="/" />;
  }

  return children;
}

export default PrivateRoute;
