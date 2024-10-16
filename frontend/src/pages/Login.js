
import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = event => {
    event.preventDefault();
    api.post('api/token/', { username, password })
      .then(response => {
        const accessToken = response.data.access;
        const isEditor = response.data.is_editor;

        localStorage.setItem('access_token', accessToken);
        localStorage.setItem('is_editor', isEditor);
        api.defaults.headers['Authorization'] = 'Bearer ' + accessToken;

        alert('Login successful!');

        if (isEditor === true || isEditor === 'true') {
          navigate('/article-approval');
        } else {
          navigate('/');
        }
      })
      .catch(error => {
        console.error(error);
        alert('Invalid credentials.');
      });
  };

   return (
    <div style={styles.container}>
      <div style={styles.loginBox}>
        <h1 style={styles.title}>Login</h1>
        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>Username:</label>
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            style={styles.input}
          />

          <label style={styles.label}>Password:</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={styles.input}
          />

          <button type="submit" style={styles.button}>Login</button>
        </form>

        <div style={styles.links}>
          <a href="/register" style={styles.link}>Register</a>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f0f0f0',
  },
  loginBox: {
    backgroundColor: '#fff',
    padding: '40px',
    borderRadius: '8px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
    width: '300px',
    textAlign: 'center',
  },
  title: {
    marginBottom: '20px',
    color: '#333',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    marginBottom: '8px',
    textAlign: 'left',
    color: '#555',
    fontSize: '14px',
  },
  input: {
    padding: '10px',
    fontSize: '16px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    marginBottom: '20px',
  },
  button: {
    padding: '10px',
    backgroundColor: '#4CAF50',
    color: 'white',
    fontSize: '16px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  links: {
    marginTop: '20px',
  },
  link: {
    color: '#4CAF50',
    textDecoration: 'none',
    fontSize: '14px',
  }
};

export default Login;
