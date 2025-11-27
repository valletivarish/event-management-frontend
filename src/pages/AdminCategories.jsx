import { useState, useEffect } from 'react';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../services/categoryService';

function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Failed to load categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, formData);
      } else {
        await createCategory(formData);
      }
      alert('Category saved successfully');
      resetForm();
      loadCategories();
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to save category');
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({ name: category.name, description: category.description || '' });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) {
      return;
    }

    try {
      await deleteCategory(id);
      alert('Category deleted successfully');
      loadCategories();
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to delete category');
    }
  };

  const resetForm = () => {
    setFormData({ name: '', description: '' });
    setEditingCategory(null);
    setShowForm(false);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Manage Categories</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
          {showForm ? 'Cancel' : 'Add Category'}
        </button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: '20px' }}>
          <h2>{editingCategory ? 'Edit Category' : 'Create Category'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
            <button type="submit" className="btn btn-primary">Save Category</button>
          </form>
        </div>
      )}

      {loading ? (
        <div className="loading">Loading categories...</div>
      ) : (
        <div>
          {categories.map((category) => (
            <div key={category.id} className="card" style={{ marginBottom: '20px' }}>
              <h3>{category.name}</h3>
              {category.description && <p>{category.description}</p>}
              <div style={{ marginTop: '15px' }}>
                <button onClick={() => handleEdit(category)} className="btn btn-primary" style={{ marginRight: '10px' }}>
                  Edit
                </button>
                <button onClick={() => handleDelete(category.id)} className="btn btn-danger">
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

export default AdminCategories;

