import { useState, useEffect } from 'react';
import { getEvents, createEvent, updateEvent, deleteEvent, uploadImage } from '../services/eventService';
import { getCategories } from '../services/categoryService';

function AdminEvents() {
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category_id: '',
    date: '',
    location: '',
    capacity: '',
    ticketTypes: [{ type_name: 'standard', price: '0', quantity: '' }],
    image: null
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEvents();
    loadCategories();
  }, []);

  const loadEvents = async () => {
    setLoading(true);
    try {
      const data = await getEvents();
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let imageUrl = formData.image_url || '';
      if (formData.image) {
        const uploadResult = await uploadImage(formData.image);
        imageUrl = uploadResult.imageUrl;
      }

      const eventData = {
        ...formData,
        category_id: formData.category_id ? parseInt(formData.category_id) : null,
        capacity: parseInt(formData.capacity),
        ticketTypes: formData.ticketTypes.map(tt => ({
          type_name: tt.type_name,
          price: parseFloat(tt.price),
          quantity: parseInt(tt.quantity)
        })),
        image_url: imageUrl
      };
      delete eventData.image;

      if (editingEvent) {
        await updateEvent(editingEvent.id, eventData);
      } else {
        await createEvent(eventData);
      }

      alert('Event saved successfully');
      resetForm();
      loadEvents();
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to save event');
    }
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description || '',
      category_id: event.category_id || '',
      date: event.date ? event.date.slice(0, 16) : '',
      location: event.location,
      capacity: event.capacity,
      ticketTypes: event.ticketTypes || [{ type_name: 'standard', price: '0', quantity: '' }],
      image_url: event.image_url || ''
    });
    setImagePreview(event.image_url ? `http://localhost:5000${event.image_url}` : null);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event?')) {
      return;
    }

    try {
      await deleteEvent(id);
      alert('Event deleted successfully');
      loadEvents();
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to delete event');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category_id: '',
      date: '',
      location: '',
      capacity: '',
      ticketTypes: [{ type_name: 'standard', price: '0', quantity: '' }],
      image: null
    });
    setImagePreview(null);
    setEditingEvent(null);
    setShowForm(false);
  };

  const addTicketType = () => {
    setFormData({
      ...formData,
      ticketTypes: [...formData.ticketTypes, { type_name: 'standard', price: '0', quantity: '' }]
    });
  };

  const removeTicketType = (index) => {
    setFormData({
      ...formData,
      ticketTypes: formData.ticketTypes.filter((_, i) => i !== index)
    });
  };

  const updateTicketType = (index, field, value) => {
    const updated = [...formData.ticketTypes];
    updated[index][field] = value;
    setFormData({ ...formData, ticketTypes: updated });
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Manage Events</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
          {showForm ? 'Cancel' : 'Add Event'}
        </button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: '20px' }}>
          <h2>{editingEvent ? 'Edit Event' : 'Create Event'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Category</label>
              <select
                value={formData.category_id}
                onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Date & Time</label>
              <input
                type="datetime-local"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Capacity</label>
              <input
                type="number"
                min="1"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Event Image</label>
              <input type="file" accept="image/*" onChange={handleImageChange} />
              {imagePreview && (
                <img src={imagePreview} alt="Preview" style={{ maxWidth: '200px', marginTop: '10px' }} />
              )}
            </div>
            <div className="form-group">
              <label>Ticket Types</label>
              {formData.ticketTypes.map((tt, index) => (
                <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                  <input
                    type="text"
                    placeholder="Type name"
                    value={tt.type_name}
                    onChange={(e) => updateTicketType(index, 'type_name', e.target.value)}
                    required
                  />
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Price"
                    value={tt.price}
                    onChange={(e) => updateTicketType(index, 'price', e.target.value)}
                    required
                  />
                  <input
                    type="number"
                    placeholder="Quantity"
                    value={tt.quantity}
                    onChange={(e) => updateTicketType(index, 'quantity', e.target.value)}
                    required
                  />
                  {formData.ticketTypes.length > 1 && (
                    <button type="button" onClick={() => removeTicketType(index)} className="btn btn-danger">
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button type="button" onClick={addTicketType} className="btn btn-secondary" style={{ marginTop: '10px' }}>
                Add Ticket Type
              </button>
            </div>
            <button type="submit" className="btn btn-primary">Save Event</button>
          </form>
        </div>
      )}

      {loading ? (
        <div>Loading events...</div>
      ) : (
        <div>
          {events.map((event) => (
            <div key={event.id} className="card" style={{ marginBottom: '20px' }}>
              <h3>{event.title}</h3>
              <p>{event.description}</p>
              <p><strong>Date:</strong> {new Date(event.date).toLocaleString()}</p>
              <p><strong>Location:</strong> {event.location}</p>
              <p><strong>Capacity:</strong> {event.available_seats} / {event.capacity}</p>
              <div style={{ marginTop: '15px' }}>
                <button onClick={() => handleEdit(event)} className="btn btn-primary" style={{ marginRight: '10px' }}>
                  Edit
                </button>
                <button onClick={() => handleDelete(event.id)} className="btn btn-danger">
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

export default AdminEvents;

