import { Navigate } from 'react-router-dom';

export default function AdminPrivateRoute({ children }) {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  
  // Check if token exists AND user is admin
  const isValid = token && role === 'admin';
  
  return isValid ? children : <Navigate to="/admin/login" replace />;
}