import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../services/authService';

function Navbar({ user, setUser }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    setUser(null);
    navigate('/login');
  };

  return (
    <nav style={{ background: '#333', color: 'white', padding: '15px 0', marginBottom: '20px' }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Link to="/events" style={{ color: 'white', textDecoration: 'none', fontSize: '20px', fontWeight: 'bold' }}>
            Event Management
          </Link>
        </div>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <Link to="/events" style={{ color: 'white', textDecoration: 'none' }}>Events</Link>
          {user ? (
            <>
              {user.role === 'admin' && (
                <>
                  <Link to="/admin/events" style={{ color: 'white', textDecoration: 'none' }}>Manage Events</Link>
                  <Link to="/admin/categories" style={{ color: 'white', textDecoration: 'none' }}>Categories</Link>
                  <Link to="/admin/bookings" style={{ color: 'white', textDecoration: 'none' }}>All Bookings</Link>
                  <Link to="/admin/reviews" style={{ color: 'white', textDecoration: 'none' }}>Reviews</Link>
                  <Link to="/admin/logs" style={{ color: 'white', textDecoration: 'none' }}>Logs</Link>
                </>
              )}
              <Link to="/bookings" style={{ color: 'white', textDecoration: 'none' }}>My Bookings</Link>
              <Link to="/profile" style={{ color: 'white', textDecoration: 'none' }}>Profile</Link>
              <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '5px 15px' }}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={{ color: 'white', textDecoration: 'none' }}>Login</Link>
              <Link to="/register" style={{ color: 'white', textDecoration: 'none' }}>Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

