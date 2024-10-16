
import React, { useEffect, useState } from 'react';
import api from '../services/api';

function ArticlesEdited() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    api.get('articles/', { params: { edited_by: 'me' } })
      .then(response => {
        setArticles(response.data);
      })
      .catch(error => {
        console.error(error);
        alert('Error fetching articles.');
      });
  }, []);

  return (
    <div>
      <h1>Articles Edited</h1>
      <table border="1">
        <thead>
          <tr>
            <th>Title</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {articles.map(article => (
            <tr key={article.id}>
              <td>{article.title}</td>
              <td>{article.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ArticlesEdited;
