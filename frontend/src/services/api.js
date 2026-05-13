import axios from 'axios';

// Create an Axios instance
// This will point to API Gateway once backend is ready
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
