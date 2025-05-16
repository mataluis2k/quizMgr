import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { authApi } from '../services/auth';

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const location = useLocation();

  if (!authApi.isAuthenticated()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <>
      {children}
      <main className="container mx-auto py-6 px-4">
        <Outlet />
      </main>
    </>
  );
};

export default AuthGuard;