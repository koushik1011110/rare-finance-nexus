import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Shield, Users, Settings, Save } from 'lucide-react';
import PageHeader from '@/components/shared/PageHeader';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { UserRole } from '@/contexts/AuthContext';
import { getAllRolePermissions, updateRolePermissions, RolePermission } from '@/lib/rbac-api';
import { allNavItems } from '@/config/navigation';

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
const MENU_ITEMS = allNavItems.map((item) => ({
  key: slugify(item.title),
  label: item.title,
  description: `${item.title} main menu access`,
}));

const ROLES: { key: UserRole; label: string; description: string; color: string }[] = [
  { key: 'admin', label: 'Administrator', description: 'Full system access', color: 'bg-red-500' },
  { key: 'agent', label: 'Agent', description: 'Student recruitment and management', color: 'bg-blue-500' },
  { key: 'staff', label: 'Staff', description: 'General staff operations', color: 'bg-green-500' },
  { key: 'finance', label: 'Finance', description: 'Financial operations', color: 'bg-yellow-500' },
  { key: 'hostel_team', label: 'Hostel Team', description: 'Hostel and accommodation', color: 'bg-purple-500' },
];

export default function RoleBasedAccessControl() {
  const [permissions, setPermissions] = useState<Record<string, RolePermission[]>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string>('admin');

  useEffect(() => {
    loadPermissions();
  }, []);

  const loadPermissions = async () => {
    try {
      setLoading(true);
      const data = await getAllRolePermissions();
      setPermissions(data);
    } catch (error) {
      console.error('Failed to load permissions:', error);
      toast.error('Failed to load permissions');
    } finally {
      setLoading(false);
    }
  };

  const handlePermissionChange = (role: string, menuItem: string, enabled: boolean) => {
    setPermissions(prev => {
      const current = prev[role] || [];
      const idx = current.findIndex(p => p.menu_item === menuItem);
      if (idx >= 0) {
        const updated = [...current];
        updated[idx] = { ...updated[idx], is_enabled: enabled };
        return { ...prev, [role]: updated };
      }
      return { ...prev, [role]: [...current, { menu_item: menuItem, is_enabled: enabled }] };
    });
  };

  const savePermissions = async (role: string) => {
    try {
      setSaving(true);
      await updateRolePermissions(role, permissions[role] || []);
      toast.success(`Permissions updated for ${role} role`);
    } catch (error) {
      console.error('Failed to save permissions:', error);
      toast.error('Failed to save permissions');
    } finally {
      setSaving(false);
    }
  };

  const getPermissionForRole = (role: string, menuItem: string): boolean => {
    const rolePermissions = permissions[role] || [];
    const permission = rolePermissions.find(p => p.menu_item === menuItem);
    return permission?.is_enabled ?? false;
  };

  const getEnabledCount = (role: string): number => {
    const rolePermissions = permissions[role] || [];
    return rolePermissions.filter(p => p.is_enabled).length;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Shield className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading permissions...</p>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="space-y-6 p-6">
        <PageHeader
          title="Role-Based Access Control"
          description="Manage menu and feature access for different user roles"
        />

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          {ROLES.map((role) => (
            <Card key={role.key} onClick={() => setSelectedRole(role.key)} className={`cursor-pointer hover:shadow-md transition-shadow ${selectedRole === role.key ? 'ring-2 ring-primary' : ''}`}>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${role.color}`} />
                  <div>
                    <h3 className="font-medium">{role.label}</h3>
                    <p className="text-sm text-muted-foreground">{role.description}</p>
                    <Badge variant="secondary" className="mt-1">
                      {getEnabledCount(role.key)}/{MENU_ITEMS.length} enabled
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs value={selectedRole} onValueChange={(value) => setSelectedRole(value)}>
          <TabsList className="grid grid-cols-5 w-full">
            {ROLES.map((role) => (
              <TabsTrigger key={role.key} value={role.key}>
                <Users className="w-4 h-4 mr-2" />
                {role.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {ROLES.map((role) => (
            <TabsContent key={role.key} value={role.key} className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${role.color}`} />
                    {role.label} Permissions
                  </h3>
                  <p className="text-muted-foreground">{role.description}</p>
                </div>
                <Button 
                  onClick={() => savePermissions(role.key)}
                  disabled={saving || selectedRole !== role.key}
                  className="flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {saving && selectedRole === role.key ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {MENU_ITEMS.map((item) => (
                  <Card key={item.key}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <Settings className="w-4 h-4" />
                            <Label htmlFor={`${role.key}-${item.key}`} className="font-medium">
                              {item.label}
                            </Label>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {item.description}
                          </p>
                        </div>
                        <Switch
                          id={`${role.key}-${item.key}`}
                          checked={getPermissionForRole(role.key, item.key)}
                          onCheckedChange={(enabled) => 
                            handlePermissionChange(role.key, item.key, enabled)
                          }
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </ProtectedRoute>
  );
}