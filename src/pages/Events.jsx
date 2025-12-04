import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getEvents } from '../services/eventService';
import { getCategories } from '../services/categoryService';

function Events() {
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory, search]);

  const loadEvents = async () => {
    setLoading(true);
    try {
      const filters = {};
      if (selectedCategory) filters.category = selectedCategory;
      if (search) filters.search = search;
      const data = await getEvents(filters);
      setEvents(data);
    } catch (error) {
      console.error('Failed to load events:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div>
      <h1>Events</h1>
      <div style={{ marginBottom: '20px', display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
        <div style={{ flex: '1', minWidth: '200px' }}>
          <input
            type="text"
            placeholder="Search events..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <div style={{ minWidth: '200px' }}>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{ width: '100%', padding: '8px' }}
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading events...</div>
      ) : events.length === 0 ? (
        <div className="empty-state">No events found</div>
      ) : (
        <div className="grid">
          {events.map((event) => (
            <div key={event.id} className="card">
              {event.image_url && (
                <img
                  src={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${event.image_url}`}
                  alt={event.title}
                  style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '4px', marginBottom: '15px' }}
                />
              )}
              <h3>{event.title}</h3>
              <p style={{ color: '#666', marginBottom: '10px' }}>{event.category_name || 'Uncategorized'}</p>
              <p style={{ marginBottom: '10px' }}>{event.description?.substring(0, 100)}...</p>
              <p><strong>Date:</strong> {formatDate(event.date)}</p>
              <p><strong>Location:</strong> {event.location}</p>
              <p><strong>Available Seats:</strong> {event.available_seats} / {event.capacity}</p>
              <Link to={`/events/${event.id}`} className="btn btn-primary" style={{ marginTop: '10px', display: 'inline-block' }}>
                View Details
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Events;

