
import React, { useEffect, useState } from 'react';
import api from '../services/api';

function ArticleApproval() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    api.get('articles/', { params: { status: 'pending' } })
      .then(response => {
        setArticles(response.data);
      })
      .catch(error => {
        console.error(error);
        alert('Error fetching articles.');
      });
  }, []);

  const handleAction = (id, action) => {
    api.patch(`articles/${id}/`, { status: action })
      .then(response => {
        setArticles(articles.filter(article => article.id !== id));
        alert(`Article ${action}!`);
      })
      .catch(error => {
        console.error(error);
        alert('Error updating article.');
      });
  };

  return (
    <div>
      <h1>Article Approval</h1>
      <table border="1">
        <thead>
          <tr>
            <th>Title</th>
            <th>Written By</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {articles.map(article => (
            <tr key={article.id}>
              <td>{article.title}</td>
              <td>{article.written_by.name}</td>
              <td>
                <button onClick={() => handleAction(article.id, 'approved')}>Approve</button>
                <button onClick={() => handleAction(article.id, 'rejected')}>Reject</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ArticleApproval;
