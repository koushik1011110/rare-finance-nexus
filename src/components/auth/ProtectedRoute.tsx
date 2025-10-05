import React from 'react';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

import LoginForm from './LoginForm';
import { Loader2, Shield } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
  allowedRoles?: UserRole[];
}
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
  allowedRoles,
}) => {
  const { user, loading, isAuthenticated, permissions, hasPermission } = useAuth();
  const navigate = useNavigate();

  // Heuristic: map current path to a menu and feature used in DB permissions
  const inferMenuAndFeature = (pathname: string): { menu: string | null; feature: string | null } => {
    const p = pathname.toLowerCase();
    // Menu inference by prefix
    let menu: string | null = null;
    if (p === '/' || p.startsWith('/dashboard')) menu = 'Dashboard';
    else if (p.startsWith('/lead')) menu = 'Leads';
    else if (p.startsWith('/students')) menu = 'Students';
    else if (p.startsWith('/agents')) menu = 'Agents';
    else if (p.startsWith('/invoices') || p.startsWith('/fees')) menu = 'Invoice';
    else if (p.startsWith('/office-expenses')) menu = 'Office Expenses';
    else if (p.startsWith('/hostels') || p.startsWith('/mess')) menu = 'Hostel & Mess';
    else if (p.startsWith('/settings')) menu = 'Settings';
    else if (p.startsWith('/salary')) menu = 'Salary Management';
    else if (p.startsWith('/personal-expenses')) menu = 'Personal Expenses';
    else if (p.startsWith('/reports')) menu = 'Reports';
    else if (p.startsWith('/universities')) menu = 'Universities';
    else if (p.startsWith('/profile')) menu = 'Profile';

    // Feature inference by segments
    let feature: string | null = null;
    if (p.includes('/add') || p.includes('/create')) feature = 'create';
    else if (p.includes('/management') || p.includes('/master') || p.includes('/requests') || p.includes('/payroll')) feature = 'manage';
    else if (p.includes('/edit') || p.includes('/update')) feature = 'edit';
    else if (p.includes('/collect') || p.includes('/payout')) feature = 'create';
    else feature = 'view';

    return { menu, feature };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  // Check role-based access
  if (requiredRole && user?.role !== requiredRole && user?.role !== 'admin') {
    return (
      <AlertDialog open onOpenChange={(open) => { if (!open) navigate('/'); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Access Denied
            </AlertDialogTitle>
            <AlertDialogDescription>
              You don't have permission to access this page. Required role: {requiredRole}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => navigate('/')}>Return to Home Page</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  if (allowedRoles && !allowedRoles.includes(user?.role!) && user?.role !== 'admin') {
    // Allow office users to access office expenses
    if (user?.role?.startsWith('office_') && allowedRoles.includes('office_user' as UserRole)) {
      return <>{children}</>;
    }
    
    return (
      <AlertDialog open onOpenChange={(open) => { if (!open) navigate('/'); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Access Denied
            </AlertDialogTitle>
            <AlertDialogDescription>
              You don't have permission to access this page.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => navigate('/')}>Return to Home Page</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  // Dynamic permission gating: if permissions are configured, enforce menu/feature access
  if (permissions && permissions.length > 0 && user?.role !== 'admin') {
    const { menu, feature } = inferMenuAndFeature(window.location.pathname);
    if (menu && !hasPermission(menu, feature)) {
      return (
        <AlertDialog open onOpenChange={(open) => { if (!open) navigate('/'); }}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Access Denied
              </AlertDialogTitle>
              <AlertDialogDescription>
                You don't have permission to access this page.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction onClick={() => navigate('/')}>Return to Home Page</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      );
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;