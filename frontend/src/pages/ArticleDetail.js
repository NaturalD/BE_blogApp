
import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useParams } from 'react-router-dom';

function ArticleDetail() {
  const [article, setArticle] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    api.get(`articles/${id}/`)
      .then(response => {
        setArticle(response.data);
      })
      .catch(error => {
        console.error(error);
        alert('Error fetching article.');
      });
  }, [id]);

  const handleSubmit = event => {
    event.preventDefault();
    api.put(`articles/${id}/`, {
      title: article.title,
      content: article.content,
    })
      .then(response => {
        alert('Article updated successfully!');
      })
      .catch(error => {
        console.error(error);
        alert('Error updating article.');
      });
  };

  if (!article) return <div>Loading...</div>;

  return (
    <div>
      <h1>Edit Article</h1>
      <p>Status: {article.status}</p>
      <form onSubmit={handleSubmit}>
        <label>Title:</label><br />
        <input
          type="text"
          value={article.title}
          onChange={e => setArticle({ ...article, title: e.target.value })}
          required
        /><br />
        <label>Content:</label><br />
        <textarea
          value={article.content}
          onChange={e => setArticle({ ...article, content: e.target.value })}
          required
        ></textarea><br />
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
}

export default ArticleDetail;
