import axios from 'axios';

// Create an Axios instance
// This will point to API Gateway once backend is ready
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://ni2hj37f4h.execute-api.ap-south-1.amazonaws.com/',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
