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
  country_id?: number;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  loading: boolean;
  isAuthenticated: boolean;
  hasRole: (role: UserRole) => boolean;
  permissions: { menu: string; feature?: string | null; allowed: boolean }[];
  hasPermission: (menu: string, feature?: string | null) => boolean;
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
  const [permissions, setPermissions] = useState<{ menu: string; feature?: string | null; allowed: boolean }[]>([]);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('session_token');
      if (!token) {
        return;
      }

      const { data, error } = await supabase.rpc('validate_session', {
        token_param: token
      });

      if (error || !data || data.length === 0) {
        localStorage.removeItem('session_token');
        setUser(null);
        setPermissions([]);
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
          country_id: (userData as any).country_id,
        });
        // fetch role-based permissions if any
        try {
          // Try roles.permissions (jsonb) first
          const { data: roleRow, error: roleErr } = await (supabase as any)
            .from('roles')
            .select('id, permissions')
            .eq('name', userData.role)
            .single();
          if (!roleErr && roleRow) {
            const permsJson = (roleRow.permissions ?? []) as { menu: string; feature?: string | null; allowed: boolean }[];
            if (Array.isArray(permsJson) && permsJson.length > 0) {
              setPermissions(permsJson.map(p => ({ menu: p.menu, feature: p.feature ?? null, allowed: !!p.allowed })));
            } else if (roleRow.id) {
              // Fallback to legacy role_permissions table
              const { data: rp, error: rpErr } = await (supabase as any)
                .from('role_permissions')
                .select('*')
                .eq('role_id', roleRow.id);
              if (!rpErr && rp) {
                setPermissions(rp.map((p: any) => ({ menu: p.menu, feature: p.feature, allowed: p.allowed })));
              }
            }
          }
        } catch (e) {
          // ignore permission fetch errors
          void e;
        }
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
        country_id: (userData as any).country_id,
      };
      setUser(newUser);

      // fetch permissions for this role (prefer roles.permissions JSON, fallback to role_permissions)
      let effectivePerms: { menu: string; feature?: string | null; allowed: boolean }[] = [];
      try {
        const { data: roleRow, error: roleErr } = await (supabase as any)
          .from('roles')
          .select('id, permissions')
          .eq('name', newUser.role)
          .single();
        if (!roleErr && roleRow) {
          const permsJson = (roleRow.permissions ?? []) as { menu: string; feature?: string | null; allowed: boolean }[];
          if (Array.isArray(permsJson) && permsJson.length > 0) {
            effectivePerms = permsJson.map(p => ({ menu: p.menu, feature: p.feature ?? null, allowed: !!p.allowed }));
            setPermissions(effectivePerms);
          } else if (roleRow.id) {
            const { data: rp, error: rpErr } = await (supabase as any)
              .from('role_permissions')
              .select('*')
              .eq('role_id', roleRow.id);
            if (!rpErr && rp) {
              effectivePerms = (rp as any[]).map(p => ({ menu: p.menu as string, feature: (p.feature ?? null) as (string|null), allowed: !!p.allowed }));
              setPermissions(effectivePerms);
            }
          }
        }
      } catch (e) {
        void e;
      }

      // Compute redirect based on effective permissions for office role
      if (newUser.role === 'office') {
        const allow = (menu: string, feature?: string | null) => {
          // office is not admin; rely on effectivePerms
          if (!effectivePerms || effectivePerms.length === 0) return true;
          const specific = effectivePerms.find(p => p.menu === menu && (p.feature ?? null) === (feature ?? null));
          if (specific) return !!specific.allowed;
          const menuPerm = effectivePerms.find(p => p.menu === menu && (p.feature == null));
          if (menuPerm) return !!menuPerm.allowed;
          return false;
        };
        if (allow('Office Expenses', null) || allow('Office Expenses', 'Expenses') || allow('Office Expenses', 'Office Management')) {
          window.location.href = '/office-expenses';
        } else if (allow('Dashboard', null)) {
          window.location.href = '/';
        }
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

  const hasPermission = (menu: string, feature?: string | null) => {
    // Admin bypass
    if (user?.role === 'admin') return true;
    if (!permissions || permissions.length === 0) return true; // no permissions configured -> default allow
    // find specific feature mapping first
    const specific = permissions.find(p => p.menu === menu && (p.feature ?? null) === (feature ?? null));
    if (specific) return specific.allowed;
    // fall back to any permission for the menu
    const menuPerm = permissions.find(p => p.menu === menu && (p.feature == null));
    if (menuPerm) return menuPerm.allowed;
    // default deny if permissions exist but no matching entry
    return false;
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
    permissions,
    hasPermission,
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