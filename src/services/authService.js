import api from './api';

export const register = async (userData) => {
  const response = await api.post('/api/auth/register', userData);
  return response.data;
};

export const login = async (credentials) => {
  const response = await api.post('/api/auth/login', credentials);
  return response.data;
};

export const logout = async () => {
  await api.post('/api/auth/logout');
};

export const getCurrentUser = async () => {
  try {
    const response = await api.get('/api/users/profile');
    return response.data;
  } catch (error) {
    // Don't throw error for 401 - just return null to indicate no user
    if (error.response?.status === 401) {
      return null;
    }
    throw error;
  }
};

