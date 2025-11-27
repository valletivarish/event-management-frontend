import { useState, useEffect } from 'react';
import { getPendingReviews, updateReviewStatus, deleteReview } from '../services/reviewService';

function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    setLoading(true);
    try {
      const data = await getPendingReviews();
      setReviews(data);
    } catch (error) {
      console.error('Failed to load reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await updateReviewStatus(id, status);
      alert('Review status updated');
      loadReviews();
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to update review status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this review?')) {
      return;
    }

    try {
      await deleteReview(id);
      alert('Review deleted successfully');
      loadReviews();
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to delete review');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return <div className="loading">Loading reviews...</div>;
  }

  return (
    <div>
      <h1>Moderate Reviews</h1>
      {reviews.length === 0 ? (
        <div className="empty-state">No pending reviews</div>
      ) : (
        <div>
          {reviews.map((review) => (
            <div key={review.id} className="card" style={{ marginBottom: '20px' }}>
              <h3>{review.event_title}</h3>
              <p><strong>User:</strong> {review.user_name}</p>
              <p><strong>Rating:</strong> {review.rating} / 5</p>
              {review.comment && <p><strong>Comment:</strong> {review.comment}</p>}
              <p><strong>Submitted:</strong> {formatDate(review.created_at)}</p>
              <p><strong>Status:</strong> {review.status}</p>
              <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => handleStatusUpdate(review.id, 'approved')}
                  className="btn btn-primary"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleStatusUpdate(review.id, 'rejected')}
                  className="btn btn-secondary"
                >
                  Reject
                </button>
                <button
                  onClick={() => handleDelete(review.id)}
                  className="btn btn-danger"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminReviews;

