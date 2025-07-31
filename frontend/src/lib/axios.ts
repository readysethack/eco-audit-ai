import axios from 'axios';

// Create an axios instance with custom config
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds - increased from 10 seconds
});

// Request interceptor for API calls
api.interceptors.request.use(
  (config) => {
    // You can add auth tokens here if needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for API calls
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle errors globally
    if (error.code === 'ECONNABORTED') {
      console.error('API Timeout Error: The request took too long to complete. The server might be under heavy load or the request involves complex processing.');
    } else {
      console.error('API Error:', error);
    }
    return Promise.reject(error);
  }
);

export default api;
