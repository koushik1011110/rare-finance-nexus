import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import MainLayout from './MainLayout';

interface OfficeOnlyLayoutProps {
  children: React.ReactNode;
}

const OfficeOnlyLayout: React.FC<OfficeOnlyLayoutProps> = ({ children }) => {
  const { isOfficeUser, isOffice, isAdmin } = useAuth();

  // Redirect non-office users to main dashboard
  if (!isOfficeUser && !isOffice && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <MainLayout>{children}</MainLayout>;
};

export default OfficeOnlyLayout;