import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

function CreateArticle() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [status] = useState('Pending');
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    api.post('/article/create/', { title, content, status })
      .then(response => {
        alert('Article created successfully!');
        navigate('/');
      })
      .catch(error => {
        console.error(error);
        alert('Error creating the article.');
      });
  };

  return (
    <div style={styles.container}>
      <h1>Create Article</h1>
      <form onSubmit={handleSubmit}>
        <label>Title:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <label>Content:</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        {/* Read-only Status Field */}
        <label>Status:</label>
        <select value={status} disabled>
          <option value="Pending">Pending</option>
        </select>
        <button type="submit">Create</button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
  },
};

export default CreateArticle;
