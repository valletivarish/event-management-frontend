import api from './api';

export const getLogs = async (limit = 50, offset = 0) => {
  const response = await api.get(`/api/logs?limit=${limit}&offset=${offset}`);
  return response.data;
};

