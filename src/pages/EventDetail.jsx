import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getEventById } from '../services/eventService';
import { createBooking } from '../services/bookingService';
import { createReview, getReviews } from '../services/reviewService';

function EventDetail({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [bookingData, setBookingData] = useState({ ticket_type_id: '', quantity: 1 });
  const [reviewData, setReviewData] = useState({ rating: 5, comment: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadEvent();
    loadReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadEvent = async () => {
    try {
      const data = await getEventById(id);
      setEvent(data);
      if (data.ticketTypes && data.ticketTypes.length > 0) {
        setBookingData({ ...bookingData, ticket_type_id: data.ticketTypes[0].id });
      }
    } catch (error) {
      console.error('Failed to load event:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadReviews = async () => {
    try {
      const data = await getReviews(id);
      setReviews(data);
    } catch (error) {
      console.error('Failed to load reviews:', error);
    }
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }

    setError('');
    try {
      await createBooking({
        event_id: parseInt(id),
        ticket_type_id: bookingData.ticket_type_id ? parseInt(bookingData.ticket_type_id) : null,
        quantity: parseInt(bookingData.quantity)
      });
      alert('Booking created successfully!');
      loadEvent();
      setBookingData({ ticket_type_id: '', quantity: 1 });
    } catch (err) {
      setError(err.response?.data?.error || 'Booking failed');
    }
  };

  const handleReview = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }

    setError('');
    try {
      await createReview({
        event_id: parseInt(id),
        rating: parseInt(reviewData.rating),
        comment: reviewData.comment
      });
      alert('Review submitted successfully! It will be visible after admin approval.');
      setReviewData({ rating: 5, comment: '' });
      loadReviews();
    } catch (err) {
      setError(err.response?.data?.error || 'Review submission failed');
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!event) {
    return <div className="empty-state">Event not found</div>;
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  return (
    <div>
      <div className="card" style={{ marginBottom: '20px' }}>
        {event.image_url && (
          <img
            src={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${event.image_url}`}
            alt={event.title}
            style={{ width: '100%', maxHeight: '400px', objectFit: 'cover', borderRadius: '4px', marginBottom: '20px' }}
          />
        )}
        <h1>{event.title}</h1>
        <p style={{ color: '#666', marginBottom: '15px' }}>{event.category_name || 'Uncategorized'}</p>
        <p style={{ marginBottom: '15px' }}>{event.description}</p>
        <p><strong>Date:</strong> {formatDate(event.date)}</p>
        <p><strong>Location:</strong> {event.location}</p>
        <p><strong>Available Seats:</strong> {event.available_seats} / {event.capacity}</p>
        {avgRating > 0 && <p><strong>Average Rating:</strong> {avgRating} / 5 ({reviews.length} reviews)</p>}
      </div>

      {user && event.available_seats > 0 && (
        <div className="card" style={{ marginBottom: '20px' }}>
          <h2>Book Event</h2>
          {error && <div className="error-message">{error}</div>}
          <form onSubmit={handleBooking}>
            {event.ticketTypes && event.ticketTypes.length > 0 ? (
              <div className="form-group">
                <label>Ticket Type</label>
                <select
                  value={bookingData.ticket_type_id}
                  onChange={(e) => setBookingData({ ...bookingData, ticket_type_id: e.target.value })}
                  required
                >
                  <option value="">Select ticket type</option>
                  {event.ticketTypes.map((tt) => (
                    <option key={tt.id} value={tt.id} disabled={tt.available_quantity === 0}>
                      {tt.type_name} - ${tt.price} ({tt.available_quantity} available)
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <p>Standard tickets - Free</p>
            )}
            <div className="form-group">
              <label>Quantity</label>
              <input
                type="number"
                min="1"
                max={event.available_seats}
                value={bookingData.quantity}
                onChange={(e) => setBookingData({ ...bookingData, quantity: e.target.value })}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">Book Now</button>
          </form>
        </div>
      )}

      <div className="card" style={{ marginBottom: '20px' }}>
        <h2>Reviews</h2>
        {reviews.length === 0 ? (
          <p>No reviews yet</p>
        ) : (
          <div>
            {reviews.map((review) => (
              <div key={review.id} style={{ borderBottom: '1px solid #eee', padding: '15px 0' }}>
                <p><strong>{review.user_name}</strong> - {review.rating} / 5</p>
                {review.comment && <p>{review.comment}</p>}
                <p style={{ color: '#666', fontSize: '14px' }}>{new Date(review.created_at).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {user && (
        <div className="card">
          <h2>Add Review</h2>
          <form onSubmit={handleReview}>
            <div className="form-group">
              <label>Rating</label>
              <select
                value={reviewData.rating}
                onChange={(e) => setReviewData({ ...reviewData, rating: e.target.value })}
                required
              >
                <option value="5">5 - Excellent</option>
                <option value="4">4 - Very Good</option>
                <option value="3">3 - Good</option>
                <option value="2">2 - Fair</option>
                <option value="1">1 - Poor</option>
              </select>
            </div>
            <div className="form-group">
              <label>Comment</label>
              <textarea
                value={reviewData.comment}
                onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
              />
            </div>
            <button type="submit" className="btn btn-primary">Submit Review</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default EventDetail;

