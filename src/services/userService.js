import api from './api';

export const updateProfile = async (profileData) => {
  const response = await api.put('/api/users/profile', profileData);
  return response.data;
};

export const changePassword = async (passwordData) => {
  const response = await api.put('/api/users/password', passwordData);
  return response.data;
};

