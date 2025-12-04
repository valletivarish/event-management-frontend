import { useState, useEffect } from 'react';
import { cancelBooking } from '../services/bookingService';
import { getBookings } from '../services/bookingService';

function Bookings({ user: _user }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    setLoading(true);
    try {
      const data = await getBookings();
      setBookings(data || []);
    } catch (error) {
      console.error('Failed to load bookings:', error);
      // Don't redirect, just show empty state
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      await cancelBooking(id);
      alert('Booking cancelled successfully');
      loadBookings();
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to cancel booking');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return <div className="loading">Loading bookings...</div>;
  }

  return (
    <div>
      <h1>My Bookings</h1>
      {bookings.length === 0 ? (
        <div className="empty-state">No bookings found</div>
      ) : (
        <div>
          {bookings.map((booking) => (
            <div key={booking.id} className="card">
              <h3>{booking.event_title}</h3>
              <p><strong>Date:</strong> {formatDate(booking.event_date)}</p>
              <p><strong>Location:</strong> {booking.event_location}</p>
              <p><strong>Quantity:</strong> {booking.quantity}</p>
              {booking.ticket_type_name && <p><strong>Ticket Type:</strong> {booking.ticket_type_name}</p>}
              <p><strong>Total Price:</strong> ${booking.total_price}</p>
              <p><strong>Status:</strong> {booking.status}</p>
              <p><strong>Booked On:</strong> {formatDate(booking.created_at)}</p>
              {booking.status === 'confirmed' && (
                <button
                  onClick={() => handleCancel(booking.id)}
                  className="btn btn-danger"
                  style={{ marginTop: '10px' }}
                >
                  Cancel Booking
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Bookings;

