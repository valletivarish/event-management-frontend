import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Only redirect if not already on login/register/profile/bookings page to prevent infinite loops
      const path = window.location.pathname;
      if (!path.includes('/login') && !path.includes('/register') && !path.includes('/profile') && !path.includes('/bookings')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

