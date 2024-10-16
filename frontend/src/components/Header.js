import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = !!localStorage.getItem('access_token');
  const isEditor = localStorage.getItem('is_editor') === 'true';

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('is_editor');
    alert('Logged out successfully.');
    navigate('/login');
  };

  // Don't show the header on login and register pages
  if (location.pathname === '/login' || location.pathname === '/register') {
    return null;
  }

  return (
    <div>
      <Link to="/">Dashboard</Link> |{' '}
      {isAuthenticated ? (
        <>
          <Link to="/article/create">Create Article</Link> |{' '}
          {isEditor && (
            <>
              <Link to="/article-approval">Article Approval</Link> |{' '}
              <Link to="/articles-edited">Articles Edited</Link> |{' '}
            </>
          )}
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <>
          <Link to="/login">Login</Link> |{' '}
          <Link to="/register">Register</Link>
        </>
      )}
    </div>
  );
}

export default Header;
