import { Link, useNavigate, useLocation } from 'react-router-dom';
import { logout } from '../services/authService';

function Navbar({ user, setUser }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    setUser(null);
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <nav className="navbar">
      <div className="container nav-container">
        <div className="nav-brand-container">
          <Link to="/events" className="nav-brand">
            Event Management
          </Link>
        </div>
        <div className="nav-links">
          <Link 
            to="/events" 
            className={`nav-link ${isActive('/events') && !location.pathname.startsWith('/admin') ? 'active' : ''}`}
          >
            Events
          </Link>
          {user ? (
            <>
              {user.role === 'admin' && (
                <div className="nav-admin-section">
                  <Link 
                    to="/admin/events" 
                    className={`nav-link ${isActive('/admin/events') ? 'active' : ''}`}
                  >
                    Manage Events
                  </Link>
                  <Link 
                    to="/admin/categories" 
                    className={`nav-link ${isActive('/admin/categories') ? 'active' : ''}`}
                  >
                    Categories
                  </Link>
                  <Link 
                    to="/admin/bookings" 
                    className={`nav-link ${isActive('/admin/bookings') ? 'active' : ''}`}
                  >
                    All Bookings
                  </Link>
                  <Link 
                    to="/admin/reviews" 
                    className={`nav-link ${isActive('/admin/reviews') ? 'active' : ''}`}
                  >
                    Reviews
                  </Link>
                  <Link 
                    to="/admin/logs" 
                    className={`nav-link ${isActive('/admin/logs') ? 'active' : ''}`}
                  >
                    Logs
                  </Link>
                </div>
              )}
              <Link 
                to="/bookings" 
                className={`nav-link ${isActive('/bookings') ? 'active' : ''}`}
              >
                My Bookings
              </Link>
              <Link 
                to="/profile" 
                className={`nav-link ${isActive('/profile') ? 'active' : ''}`}
              >
                Profile
              </Link>
              <button onClick={handleLogout} className="nav-logout-btn">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link 
                to="/login" 
                className={`nav-link ${isActive('/login') ? 'active' : ''}`}
              >
                Login
              </Link>
              <Link 
                to="/register" 
                className={`nav-link nav-link-primary ${isActive('/register') ? 'active' : ''}`}
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

