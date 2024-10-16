
import axios from 'axios';

const API_URL = 'http://localhost:8000/'; // Adjust if necessary

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers['Authorization'] = 'Bearer ' + token;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

export default api;
