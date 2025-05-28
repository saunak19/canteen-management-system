import { Navigate } from 'react-router-dom';
import { getUserFromStorage } from '../features/getUserFromStorage';

const ProtectedRoute = ({ user, allowedRoles, children }) => {
  // Fallback to localStorage if user prop is null (for page reloads)
  const currentUser = user || getUserFromStorage();

  if (!currentUser) {
    // User not logged in
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(currentUser.role)) {
    // User doesn't have required role
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;