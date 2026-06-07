import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function PrivateRoute({ children }) {
  const [isValid, setIsValid] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setIsValid(false);
        return;
      }
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/dashboard`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setIsValid(res.ok);
      } catch (err) {
        setIsValid(false);
      }
    };
    validateToken();
  }, [token]);

  if (isValid === null) {
    // Still loading
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>;
  }

  return isValid ? children : <Navigate to="/login" replace />;
}