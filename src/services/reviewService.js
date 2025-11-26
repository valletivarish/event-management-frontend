import api from './api';

export const createReview = async (reviewData) => {
  const response = await api.post('/api/reviews', reviewData);
  return response.data;
};

export const getReviews = async (eventId) => {
  const response = await api.get(`/api/reviews/event/${eventId}`);
  return response.data;
};

export const updateReviewStatus = async (id, status) => {
  const response = await api.put(`/api/reviews/${id}/status`, { status });
  return response.data;
};

export const deleteReview = async (id) => {
  const response = await api.delete(`/api/reviews/${id}`);
  return response.data;
};

export const getPendingReviews = async () => {
  const response = await api.get('/api/admin/reviews/pending');
  return response.data;
};

