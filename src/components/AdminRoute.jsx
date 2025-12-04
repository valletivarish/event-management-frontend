import { Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getCurrentUser } from '../services/authService';

export function AdminRoute({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (_error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!user || user.role !== 'admin') {
    return <Navigate to="/events" />;
  }

  return children;
}

