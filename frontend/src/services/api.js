import axios from 'axios';

// Create an Axios instance
// This points to our local Vite proxy (/api) to bypass CORS during development,
// or uses VITE_API_URL if deployed/configured.
const api = axios.create({
  baseURL: 'https://ni2hj37f4h.execute-api.ap-south-1.amazonaws.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
