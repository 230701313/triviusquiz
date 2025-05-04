
import { useAuth } from '@/context/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';

export const RequireAuth: React.FC<{ allowedRoles: string[] }> = ({ allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (!allowedRoles.includes(user.role)) {
    if (user.role === 'student') {
      return <Navigate to="/student-dashboard" />;
    } else if (user.role === 'teacher') {
      return <Navigate to="/teacher-dashboard" />;
    }
  }

  return <Outlet />;
};

export default RequireAuth;
