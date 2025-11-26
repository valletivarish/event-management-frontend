import { Navigate } from 'react-router-dom';

export function ProtectedRoute({ children }) {
  const token = document.cookie.includes('token=');
  
  if (!token) {
    return <Navigate to="/login" />;
  }

  return children;
}

