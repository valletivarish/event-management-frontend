import { useState, useEffect } from 'react';
import { getBookings } from '../services/bookingService';

function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    setLoading(true);
    try {
      const data = await getBookings(true);
      setBookings(data);
    } catch (error) {
      console.error('Failed to load bookings:', error);
    } finally {
      setLoading(false);
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
      <h1>All Bookings</h1>
      {bookings.length === 0 ? (
        <div className="empty-state">No bookings found</div>
      ) : (
        <div>
          {bookings.map((booking) => (
            <div key={booking.id} className="card">
              <h3>{booking.event_title}</h3>
              <p><strong>User:</strong> {booking.user_name} ({booking.user_email})</p>
              <p><strong>Date:</strong> {formatDate(booking.event_date)}</p>
              <p><strong>Location:</strong> {booking.event_location}</p>
              <p><strong>Quantity:</strong> {booking.quantity}</p>
              {booking.ticket_type_name && <p><strong>Ticket Type:</strong> {booking.ticket_type_name}</p>}
              <p><strong>Total Price:</strong> ${booking.total_price}</p>
              <p><strong>Status:</strong> {booking.status}</p>
              <p><strong>Booked On:</strong> {formatDate(booking.created_at)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminBookings;

