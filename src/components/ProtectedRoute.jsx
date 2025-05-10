import { Navigate } from 'react-router-dom';
import { auth } from '../services/firebase';

const ProtectedRoute = ({ children }) => {
  const user = auth.currentUser || localStorage.getItem('userId');
  if (!user) {
    // Belum login, redirect ke login
    return <Navigate to="/login" replace />;
  }
  // Sudah login, tampilkan halaman
  return children;
};

export default ProtectedRoute; 