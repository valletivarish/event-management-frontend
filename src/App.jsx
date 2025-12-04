import { Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Events from './pages/Events';
import EventDetail from './pages/EventDetail';
import Bookings from './pages/Bookings';
import Profile from './pages/Profile';
import AdminEvents from './pages/AdminEvents';
import AdminCategories from './pages/AdminCategories';
import AdminBookings from './pages/AdminBookings';
import AdminReviews from './pages/AdminReviews';
import AdminLogs from './pages/AdminLogs';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AdminRoute } from './components/AdminRoute';
import { getCurrentUser } from './services/authService';

function App() {
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
  }, []); // Empty dependency array - only run once on mount

  useEffect(() => {
    // Prevent mouse wheel from changing number input values
    const handleWheel = (e) => {
      if (e.target.type === 'number' && document.activeElement === e.target) {
        e.preventDefault();
      }
    };

    // Prevent arrow keys from changing number input values
    const handleKeyDown = (e) => {
      if (e.target.type === 'number' && (e.key === 'ArrowUp' || e.key === 'ArrowDown')) {
        e.preventDefault();
      }
    };

    // Add event listeners
    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', handleKeyDown);

    // Cleanup
    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  if (loading) {
    return <div className="container loading">Loading...</div>;
  }

  return (
    <div>
      <Navbar user={user} setUser={setUser} />
      <div className="container">
        <Routes>
          <Route path="/login" element={user ? <Navigate to="/events" /> : <Login setUser={setUser} />} />
          <Route path="/register" element={user ? <Navigate to="/events" /> : <Register setUser={setUser} />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:id" element={<EventDetail user={user} />} />
          <Route
            path="/bookings"
            element={
              <ProtectedRoute>
                <Bookings user={user} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile user={user} setUser={setUser} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/events"
            element={
              <AdminRoute>
                <AdminEvents />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/categories"
            element={
              <AdminRoute>
                <AdminCategories />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/bookings"
            element={
              <AdminRoute>
                <AdminBookings />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/reviews"
            element={
              <AdminRoute>
                <AdminReviews />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/logs"
            element={
              <AdminRoute>
                <AdminLogs />
              </AdminRoute>
            }
          />
          <Route path="/" element={<Navigate to="/events" />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;

