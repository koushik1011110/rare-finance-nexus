import React, { useEffect, useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { fetchRoles, fetchPermissionsForRole, savePermissionsForRole } from '@/lib/roles-api';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Card } from '@/components/ui/card';

// Small mapping of menus and their features to display
const menus = [
  { title: 'Dashboard', key: 'Dashboard', features: ['view'] },
  { title: 'Leads', key: 'Leads', features: ['view','create'] },
  { title: 'Students', key: 'Students', features: ['view','create','edit'] },
  { title: 'Agents', key: 'Agents', features: ['view','create'] },
  { title: 'Invoice', key: 'Invoice', features: ['view','create'] },
  { title: 'Office Expenses', key: 'Office Expenses', features: ['view','create'] },
  { title: 'Hostel & Mess', key: 'Hostel & Mess', features: ['view','manage'] },
  { title: 'Settings', key: 'Settings', features: ['view'] },
  { title: 'Reports', key: 'Reports', features: ['view'] },
];

export default function RolesPage() {
  const [roles, setRoles] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<any | null>(null);
  const [permissions, setPermissions] = useState<{ menu: string; feature?: string | null; allowed: boolean }[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const rs = await fetchRoles();
        setRoles(rs || []);
        if (!rs || rs.length === 0) {
          setError('No roles found. Make sure the roles table exists in the database and migrations have been applied.');
        }
      } catch (e: any) {
        console.error('Failed to fetch roles', e);
        setError('Failed to fetch roles from the database. Confirm the migration was applied and the Supabase connection is correct.');
        setRoles([]);
      }
    })();
  }, []);

  const loadRole = async (role: any) => {
    setSelectedRole(role);
    setLoading(true);
    try {
      const perms = await fetchPermissionsForRole(role.id);
      setPermissions(perms.map((p: any) => ({ menu: p.menu, feature: p.feature, allowed: p.allowed })));
    } catch (e) {
      // if none, clear
      setPermissions([]);
    } finally {
      setLoading(false);
    }
  };

  const toggle = (menuKey: string, feature?: string | null) => {
    setPermissions(prev => {
      const found = prev.find(p => p.menu === menuKey && (p.feature ?? null) === (feature ?? null));
      if (found) {
        return prev.map(p => p === found ? { ...p, allowed: !p.allowed } : p);
      }
      return [...prev, { menu: menuKey, feature: feature || null, allowed: true }];
    });
  };

  const save = async () => {
    if (!selectedRole) return;
    setLoading(true);
    try {
      await savePermissionsForRole(selectedRole.id, permissions);
      alert('Permissions saved');
    } catch (e) {
      console.error(e);
      const msg = (e as any)?.message || (e as any)?.error_description || (e as any)?.hint || JSON.stringify(e);
      alert(`Failed to save permissions: ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  const isAllowed = (menuKey: string, feature?: string | null) => {
    const find = permissions.find(p => p.menu === menuKey && (p.feature ?? null) === (feature ?? null));
    if (find) return find.allowed;
    // If menu-level exists
    const menuLevel = permissions.find(p => p.menu === menuKey && p.feature == null);
    if (menuLevel) return menuLevel.allowed;
    return false;
  };

  return (
    <MainLayout>
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">Roles & Permissions</h1>
        {error && (
          <div className="p-3 bg-yellow-50 border rounded text-sm">
            {error}
            <div className="mt-2 text-xs text-muted-foreground">
              To apply migrations run them in your Supabase project (or execute the SQL file <code>supabase/migrations/20251001_create_roles_permissions.sql</code>). After applying, reload this page.
            </div>
          </div>
        )}
        <div className="grid grid-cols-3 gap-4">
          <Card className="p-4">
            <h2 className="text-lg font-medium mb-2">Roles</h2>
            <ul className="space-y-2">
              {roles.map(r => (
                <li key={r.id}>
                  <Button variant={selectedRole?.id === r.id ? 'default' : 'ghost'} onClick={() => loadRole(r)} className="w-full text-left">
                    {r.label || r.name}
                  </Button>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="p-4 col-span-2">
            <h2 className="text-lg font-medium mb-2">Assign Permissions {selectedRole ? `for ${selectedRole.label || selectedRole.name}` : ''}</h2>
            {!selectedRole && <p className="text-sm text-muted-foreground">Select a role to assign permissions.</p>}
            {selectedRole && (
              <div className="space-y-4">
                {menus.map(m => (
                  <div key={m.key} className="border p-3 rounded">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Checkbox checked={isAllowed(m.key, null)} onCheckedChange={() => toggle(m.key, null)} />
                        <span className="font-medium">{m.title}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {m.features.map(f => (
                          <label key={f} className="flex items-center gap-2">
                            <Checkbox checked={isAllowed(m.key, f)} onCheckedChange={() => toggle(m.key, f)} />
                            <span className="text-sm">{f}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}

                <div className="pt-2">
                  <Button onClick={save} disabled={loading}>Save Permissions</Button>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
