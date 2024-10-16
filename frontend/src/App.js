
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import ArticleCreate from './pages/ArticleCreate';
import ArticleDetail from './pages/ArticleDetail';
import ArticleApproval from './pages/ArticleApproval';
import ArticlesEdited from './pages/ArticlesEdited';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/article/create"
          element={
            <PrivateRoute>
              <ArticleCreate />
            </PrivateRoute>
          }
        />
        <Route
          path="/article/:id"
          element={
            <PrivateRoute>
              <ArticleDetail />
            </PrivateRoute>
          }
        />
        <Route
          path="/article-approval"
          element={
            <PrivateRoute isEditorRoute={true}>
              <ArticleApproval />
            </PrivateRoute>
          }
        />
        <Route
          path="/articles-edited"
          element={
            <PrivateRoute isEditorRoute={true}>
              <ArticlesEdited />
            </PrivateRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;
