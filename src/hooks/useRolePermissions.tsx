import { useState, useEffect } from 'react';
import { UserRole } from '@/contexts/AuthContext';
import { getRolePermissions, RolePermission } from '@/lib/rbac-api';

export const useRolePermissions = (role?: string) => {
  const [permissions, setPermissions] = useState<RolePermission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!role) {
      setLoading(false);
      return;
    }

    const loadPermissions = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getRolePermissions(role);
        setPermissions(data);
      } catch (err) {
        console.error('Failed to load role permissions:', err);
        setError('Failed to load permissions');
        setPermissions([]);
      } finally {
        setLoading(false);
      }
    };

    loadPermissions();
  }, [role]);

  const hasPermission = (menuItem: string): boolean => {
    if (!role) return false;
    
    // Admin has all permissions
    if (role === 'admin') return true;
    
    const permission = permissions.find(p => p.menu_item === menuItem);
    return permission?.is_enabled ?? false;
  };

  const getEnabledMenuItems = (): string[] => {
    return permissions
      .filter(p => p.is_enabled)
      .map(p => p.menu_item);
  };

  return {
    permissions,
    loading,
    error,
    hasPermission,
    getEnabledMenuItems,
  };
};