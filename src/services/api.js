import axios from 'axios';

const API = axios.create({
  baseURL: 'https://vehicle-rental-management-system-backend-2udn.onrender.com/api/auth',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor to attach JWT token to every request automatically
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('drivepulse_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor for global error handling
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If token expired or invalid, clear local session if not already on login page
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/signup')) {
        localStorage.removeItem('drivepulse_token');
        localStorage.removeItem('drivepulse_user');
      }
    }
    return Promise.reject(error);
  }
);

export default API;
