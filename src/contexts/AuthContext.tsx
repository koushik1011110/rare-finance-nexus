import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type UserRole = 'admin' | 'agent' | 'hostel_team' | 'finance' | 'staff' | 'office_user' | 'office' | 'office_guwahati' | 'office_delhi' | 'office_mumbai' | 'office_bangalore' | 'office_kolkata';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isActive: boolean;
  officeLocation?: string;
  office_location?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  loading: boolean;
  isAuthenticated: boolean;
  hasRole: (role: UserRole) => boolean;
  isAdmin: boolean;
  isOfficeUser: boolean;
  isOffice: boolean;
  getUserOfficeLocation: () => string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('session_token');
      if (!token) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase.rpc('validate_session', {
        token_param: token
      });

      if (error || !data || data.length === 0) {
        localStorage.removeItem('session_token');
        setUser(null);
      } else {
        const userData = data[0];
        setUser({
          id: userData.user_id.toString(),
          email: userData.email,
          firstName: userData.first_name,
          lastName: userData.last_name,
          role: userData.role as UserRole,
          isActive: userData.is_active,
          officeLocation: userData.office_location,
          office_location: userData.office_location,
        });
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('session_token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      // Authenticate user
      const { data: authData, error: authError } = await supabase.rpc('authenticate_user', {
        email_param: email,
        password_param: password
      });

      if (authError || !authData || authData.length === 0) {
        return { success: false, error: 'Invalid email or password' };
      }

      const userData = authData[0];

      // Create session
      const { data: sessionToken, error: sessionError } = await supabase.rpc('create_user_session', {
        user_id_param: userData.user_id
      });

      if (sessionError || !sessionToken) {
        return { success: false, error: 'Failed to create session' };
      }

      // Store session token
      localStorage.setItem('session_token', sessionToken);

      // Set user data
      const newUser = {
        id: userData.user_id.toString(),
        email: userData.email,
        firstName: userData.first_name,
        lastName: userData.last_name,
        role: userData.role as UserRole,
        isActive: userData.is_active,
        officeLocation: userData.office_location,
        office_location: userData.office_location,
      };
      setUser(newUser);

      // Redirect office users to /office-expenses after login
      if (newUser.role === 'office') {
        window.location.href = '/office-expenses';
      }

      return { success: true };
    } catch (error) {
      console.error('Login failed:', error);
      return { success: false, error: 'Login failed. Please try again.' };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem('session_token');
      if (token) {
        await supabase.rpc('logout_user', { token_param: token });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('session_token');
      setUser(null);
    }
  };

  const hasRole = (role: UserRole) => {
    return user?.role === role;
  };

  // Define role checks
  const isAdmin = user?.role === 'admin';
  const isOfficeUser = user?.role === 'office_user';
  const isOffice = user?.role === 'office';

  const getUserOfficeLocation = useCallback(() => {
    return user?.office_location || null;
  }, [user]);

  const value: AuthContextType = {
    user,
    login,
    logout,
    loading,
    isAuthenticated: !!user,
    hasRole,
    isAdmin,
    isOfficeUser,
    isOffice,
    getUserOfficeLocation,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};