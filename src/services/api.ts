import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message || error.message;
    
    if (status === 401) {
      // Unauthorized - clear auth and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Use replace instead of href to avoid history entry
      window.location.replace('/login');
    } else if (status === 403) {
      // Forbidden - log but don't redirect (component will handle)
      console.error('403 Forbidden:', message);
    } else if (status === 404) {
      // Not found - component will handle
      console.error('404 Not Found:', message);
    } else if (status >= 500) {
      // Server error
      console.error('Server Error:', message);
    }
    
    return Promise.reject(error);
  }
);

