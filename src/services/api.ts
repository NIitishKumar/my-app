import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://my-app-ujzz.onrender.com/api';
// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

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
    const responseData = error.response?.data;
    
    // Extract error message
    let errorMessage = error.message;
    if (responseData) {
      if (typeof responseData === 'object' && 'error' in responseData && responseData.error?.message) {
        errorMessage = responseData.error.message;
      } else if (responseData.message) {
        errorMessage = responseData.message;
      }
    }
    
    if (status === 401) {
      // Unauthorized - clear auth and redirect to login (don't show toast, redirect happens)
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Use replace instead of href to avoid history entry
      window.location.replace('/login');
    } else if (status === 403) {
      // Forbidden - show toast
      toast.error(errorMessage || 'You do not have permission to access this resource.');
    } else if (status === 404) {
      // Not found - show toast
      toast.error(errorMessage || 'The requested resource was not found.');
    } else if (status === 409) {
      // Conflict - show toast
      toast.error(errorMessage || 'This record already exists.');
    } else if (status === 422) {
      // Validation error - show toast
      toast.error(errorMessage || 'Please check your input data and try again.');
    } else if (status >= 500) {
      // Server error - show toast
      toast.error(errorMessage || 'Server error. Please try again later.');
    } else if (status && status >= 400) {
      // Other client errors - show toast
      toast.error(errorMessage || 'An error occurred. Please try again.');
    }
    
    return Promise.reject(error);
  }
);

