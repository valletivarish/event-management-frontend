import api from './api';

export const createBooking = async (bookingData) => {
  const response = await api.post('/api/bookings', bookingData);
  return response.data;
};

export const getBookings = async (all = false) => {
  const response = await api.get(`/api/bookings?all=${all}`);
  return response.data;
};

export const getBookingById = async (id) => {
  const response = await api.get(`/api/bookings/${id}`);
  return response.data;
};

export const cancelBooking = async (id) => {
  const response = await api.put(`/api/bookings/${id}/cancel`);
  return response.data;
};

