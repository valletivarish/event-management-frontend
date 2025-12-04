import { useState, useEffect } from 'react';
import { updateProfile, changePassword } from '../services/userService';
import { getCurrentUser } from '../services/authService';

function Profile({ user, setUser }) {
  const [profileData, setProfileData] = useState({ name: '', email: '' });
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    // Use user from props if available
    if (user && user.name && user.email) {
      setProfileData({ name: user.name, email: user.email });
      setUserDetails(user);
      setLoading(false);
      return;
    }
    
    // Otherwise fetch user data
    const loadProfile = async () => {
      try {
        const currentUser = await getCurrentUser();
        if (currentUser) {
          setProfileData({ name: currentUser.name || '', email: currentUser.email || '' });
          setUserDetails(currentUser);
          if (setUser) {
            setUser(currentUser);
          }
        }
      } catch (error) {
        console.error('Failed to load profile:', error);
        // Don't redirect, just show empty form
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      await updateProfile(profileData);
      setMessage('Profile updated successfully');
      const updatedUser = { ...user, ...profileData };
      setUser(updatedUser);
      setUserDetails(updatedUser);
    } catch (err) {
      setError(err.response?.data?.error || 'Update failed');
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    try {
      await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      setMessage('Password changed successfully');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setError(err.response?.data?.error || 'Password change failed');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return <div className="loading">Loading profile...</div>;
  }

  return (
    <div>
      <h1>Profile</h1>
      
      {/* User Details Card */}
      <div className="card" style={{ marginBottom: '20px' }}>
        <h2>Account Details</h2>
        {userDetails && (
          <div style={{ marginBottom: '15px' }}>
            <div style={{ marginBottom: '10px' }}>
              <strong>User ID:</strong> {userDetails.id}
            </div>
            <div style={{ marginBottom: '10px' }}>
              <strong>Role:</strong>{' '}
              <span style={{
                display: 'inline-block',
                padding: '4px 12px',
                borderRadius: '4px',
                backgroundColor: userDetails.role === 'admin' ? '#e3f2fd' : '#f5f5f5',
                color: userDetails.role === 'admin' ? '#1976d2' : '#333',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                fontSize: '0.85em'
              }}>
                {userDetails.role || 'user'}
              </span>
            </div>
            <div style={{ marginBottom: '10px' }}>
              <strong>Account Created:</strong> {formatDate(userDetails.created_at)}
            </div>
            {userDetails.role === 'admin' && (
              <div style={{
                marginTop: '15px',
                padding: '12px',
                backgroundColor: '#fff3cd',
                border: '1px solid #ffc107',
                borderRadius: '4px',
                color: '#856404'
              }}>
                <strong>Admin Access:</strong> You have administrative privileges to manage events, categories, bookings, reviews, and view activity logs.
              </div>
            )}
          </div>
        )}
      </div>

      <div className="card" style={{ marginBottom: '20px' }}>
        <h2>Update Profile</h2>
        {message && <div className="success-message">{message}</div>}
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleProfileUpdate}>
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              value={profileData.name}
              onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={profileData.email}
              onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">Update Profile</button>
        </form>
      </div>

      <div className="card">
        <h2>Change Password</h2>
        {message && <div className="success-message">{message}</div>}
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handlePasswordChange}>
          <div className="form-group">
            <label>Current Password</label>
            <input
              type="password"
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>New Password</label>
            <input
              type="password"
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              required
              minLength={6}
            />
          </div>
          <div className="form-group">
            <label>Confirm New Password</label>
            <input
              type="password"
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
              required
              minLength={6}
            />
          </div>
          <button type="submit" className="btn btn-primary">Change Password</button>
        </form>
      </div>
    </div>
  );
}

export default Profile;

