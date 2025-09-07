import { supabase } from '@/integrations/supabase/client';
import { UserRole } from '@/contexts/AuthContext';

export interface RolePermission {
  menu_item: string;
  is_enabled: boolean;
}

export interface RolePermissions {
  role: UserRole;
  permissions: RolePermission[];
}

// Get all role permissions
export const getRolePermissions = async (role?: string): Promise<RolePermission[]> => {
  try {
    let query = supabase.from('role_permissions').select('menu_item, is_enabled');
    
    if (role) {
      query = query.eq('role', role as any);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching role permissions:', error);
    throw error;
  }
};

// Get permissions for all roles (for admin management)
export const getAllRolePermissions = async (): Promise<Record<string, RolePermission[]>> => {
  try {
    const { data, error } = await supabase
      .from('role_permissions')
      .select('role, menu_item, is_enabled');
    
    if (error) throw error;
    
    // Group permissions by role
    const grouped = (data || []).reduce((acc, permission) => {
      if (!acc[permission.role]) {
        acc[permission.role] = [];
      }
      acc[permission.role].push({
        menu_item: permission.menu_item,
        is_enabled: permission.is_enabled
      });
      return acc;
    }, {} as Record<string, RolePermission[]>);
    
    return grouped;
  } catch (error) {
    console.error('Error fetching all role permissions:', error);
    throw error;
  }
};

// Update role permission
export const updateRolePermission = async (
  role: string,
  menuItem: string,
  isEnabled: boolean
): Promise<void> => {
  try {
    const { error } = await supabase.rpc('update_role_permission', {
      user_role_param: role as any,
      menu_item_param: menuItem,
      is_enabled_param: isEnabled
    });
    
    if (error) throw error;
  } catch (error) {
    console.error('Error updating role permission:', error);
    throw error;
  }
};

// Batch update role permissions
export const updateRolePermissions = async (
  role: string,
  permissions: RolePermission[]
): Promise<void> => {
  try {
    // Use Promise.all for batch updates
    const updates = permissions.map(permission =>
      updateRolePermission(role, permission.menu_item, permission.is_enabled)
    );
    
    await Promise.all(updates);
  } catch (error) {
    console.error('Error batch updating role permissions:', error);
    throw error;
  }
};

// Get enabled menu items for a specific role
export const getEnabledMenuItems = async (role: string): Promise<string[]> => {
  try {
    const permissions = await getRolePermissions(role);
    return permissions
      .filter(p => p.is_enabled)
      .map(p => p.menu_item);
  } catch (error) {
    console.error('Error fetching enabled menu items:', error);
    return [];
  }
};