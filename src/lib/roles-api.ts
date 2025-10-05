import { supabase } from '@/integrations/supabase/client';

export interface RoleRecord {
  id: string;
  name: string;
  label?: string | null;
}

export interface PermissionRecord {
  id: string;
  role_id: string;
  menu: string;
  feature?: string | null;
  allowed: boolean;
}

export const fetchRoles = async (): Promise<RoleRecord[]> => {
  const { data, error } = await (supabase as any).from('roles').select('*').order('name');
  if (error) throw error;
  return data as RoleRecord[];
};

export const fetchPermissionsForRole = async (roleId: string): Promise<PermissionRecord[]> => {
  // New model: store permissions JSON on roles table
  const { data, error } = await (supabase as any)
    .from('roles')
    .select('id, permissions')
    .eq('id', roleId)
    .single();
  if (error) throw error;
  const perms = (data?.permissions ?? []) as { menu: string; feature?: string | null; allowed: boolean }[];
  // Map to PermissionRecord-like objects (without ids)
  return perms.map(p => ({ id: '', role_id: roleId, menu: p.menu, feature: p.feature ?? null, allowed: p.allowed }));
};

export const savePermissionsForRole = async (
  roleId: string,
  permissions: { menu: string; feature?: string | null; allowed: boolean }[]
): Promise<boolean> => {
  // Primary path: update roles.permissions (jsonb)
  const payload = permissions.map(p => ({ menu: p.menu, feature: p.feature ?? null, allowed: p.allowed }));
  const { error: updErr } = await (supabase as any)
    .from('roles')
    .update({ permissions: payload })
    .eq('id', roleId);
  if (!updErr) return true;

  // Legacy fallback: use secure RPC if available
  try {
    const { error: rpcErr } = await (supabase as any).rpc('save_role_permissions', {
      p_role_id: roleId,
      p_permissions: payload,
    });
    if (!rpcErr) return true;
  } catch (_) {
    // ignore and try direct table writes as last resort
  }

  // Last resort: direct table writes to role_permissions (for legacy DBs)
  const { error: delError } = await (supabase as any)
    .from('role_permissions')
    .delete()
    .eq('role_id', roleId);
  if (delError) throw delError;

  const rows = permissions.map(p => ({
    role_id: roleId,
    menu: p.menu,
    feature: p.feature ?? null,
    allowed: p.allowed,
  }));

  if (rows.length === 0) return true;

  const { error: insertError } = await (supabase as any).from('role_permissions').insert(rows);
  if (insertError) throw insertError;
  return true;
};

// Create or update a role by name. This helps fix cases where saving a role fails.
// Uses unique constraint on roles.name defined in migration.
export const saveRole = async (name: string, label?: string | null): Promise<RoleRecord> => {
  const payload = { name, label: label ?? null } as const;
  const { data, error } = await supabase
    .from('roles' as any)
    .upsert(payload, { onConflict: 'name' })
    .select('*')
    .single();
  if (error) throw error;
  return data as RoleRecord;
};
