import api from './api';

export const getEvents = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.category) params.append('category', filters.category);
  if (filters.search) params.append('search', filters.search);
  
  const response = await api.get(`/api/events?${params.toString()}`);
  return response.data;
};

export const getEventById = async (id) => {
  const response = await api.get(`/api/events/${id}`);
  return response.data;
};

export const createEvent = async (eventData) => {
  const response = await api.post('/api/events', eventData);
  return response.data;
};

export const updateEvent = async (id, eventData) => {
  const response = await api.put(`/api/events/${id}`, eventData);
  return response.data;
};

export const deleteEvent = async (id) => {
  const response = await api.delete(`/api/events/${id}`);
  return response.data;
};

export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('image', file);
  const response = await api.post('/api/upload/image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};

