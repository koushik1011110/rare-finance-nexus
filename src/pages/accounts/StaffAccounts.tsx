import React, { useEffect, useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import PageHeader from '@/components/shared/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import DataTable from '@/components/ui/DataTable';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { RotateCcw, Eye, EyeOff, Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { UserRole } from '@/contexts/AuthContext';
import { fetchCountries, Country } from '@/lib/countries-api';

interface Staff {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
}

const StaffAccounts: React.FC = () => {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [resetPasswordDialog, setResetPasswordDialog] = useState({ open: false, newPassword: '', staffName: '' });
  const [showPassword, setShowPassword] = useState(true);
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  // Add Staff dialog state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [createForm, setCreateForm] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    role: '' as UserRole,
    agentName: '',
    agentPhone: '',
    agentLocation: '',
    countryId: '',
  });
  const [showCreatePwd, setShowCreatePwd] = useState(false);
  const [countryAssignDialog, setCountryAssignDialog] = useState({ open: false, staffId: '', staffName: '', selectedCountryId: '' });

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        const mapped: Staff[] = (data || []).map((user: any) => ({
          id: user.id.toString(),
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          role: user.role as UserRole,
          isActive: user.is_active,
          createdAt: user.created_at,
        }));

        // Exclude agents
        setStaff(mapped.filter((u) => u.role !== 'agent'));
      } catch (err) {
        console.error('Error fetching staff accounts:', err);
        toast({
          title: 'Error',
          description: 'Failed to fetch staff accounts',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    const loadCountries = async () => {
      try {
        const countriesData = await fetchCountries();
        setCountries(countriesData);
      } catch (error) {
        console.error('Error loading countries:', error);
      }
    };

    fetchStaff();
    loadCountries();
  }, []);

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 12; i++) password += chars.charAt(Math.floor(Math.random() * chars.length));
    setCreateForm(prev => ({ ...prev, password }));
  };

  const handleCreateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createForm.email || !createForm.password || !createForm.firstName || !createForm.lastName || !createForm.role) {
      toast({ title: 'Error', description: 'Please fill in all required fields', variant: 'destructive' });
      return;
    }
    try {
      const { error } = await supabase.rpc('create_staff_member', {
        email_param: createForm.email,
        password_param: createForm.password,
        first_name_param: createForm.firstName,
        last_name_param: createForm.lastName,
        role_param: createForm.role as any,
        agent_name_param: createForm.role === 'agent' ? createForm.agentName : null,
        agent_phone_param: createForm.role === 'agent' ? createForm.agentPhone : null,
        agent_location_param: createForm.role === 'agent' ? createForm.agentLocation : null,
        country_id_param: createForm.countryId && createForm.countryId !== 'none' ? parseInt(createForm.countryId) : null,
      });
      if (error) throw error;
      toast({ title: 'Success', description: 'Staff member created successfully.' });
      setIsDialogOpen(false);
      setCreateForm({ email: '', password: '', firstName: '', lastName: '', role: '' as UserRole, agentName: '', agentPhone: '', agentLocation: '', countryId: '' });
      // reload list (will exclude agent if created as agent)
      const { data } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });
      const mapped: Staff[] = (data || []).map((user: any) => ({
        id: user.id.toString(),
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role as UserRole,
        isActive: user.is_active,
        createdAt: user.created_at,
      }));
      setStaff(mapped.filter((u) => u.role !== 'agent'));
    } catch (err) {
      console.error('Error creating staff member:', err);
      toast({ title: 'Error', description: 'Failed to create staff member', variant: 'destructive' });
    }
  };

  const handleResetPassword = async (staffMember: Staff) => {
    try {
      const { data: newPassword, error } = await supabase.rpc('reset_staff_password', {
        staff_id_param: parseInt(staffMember.id)
      });

      if (error) throw error;

      setShowPassword(true);
      setResetPasswordDialog({
        open: true,
        newPassword: newPassword as string,
        staffName: `${staffMember.firstName} ${staffMember.lastName}`,
      });

      toast({
        title: 'Password Reset',
        description: `Password has been reset for ${staffMember.firstName} ${staffMember.lastName}`,
      });
    } catch (error) {
      console.error('Error resetting password:', error);
      toast({ title: 'Error', description: 'Failed to reset password', variant: 'destructive' });
    }
  };

  const handleCountryAssign = async () => {
    try {
      const { error } = await supabase.rpc('assign_country_to_staff', {
        staff_id_param: parseInt(countryAssignDialog.staffId),
        country_id_param: countryAssignDialog.selectedCountryId && countryAssignDialog.selectedCountryId !== 'none' ? parseInt(countryAssignDialog.selectedCountryId) : null
      });

      if (error) throw error;

      toast({
        title: 'Success',
        description: `Country assignment updated for ${countryAssignDialog.staffName}`,
      });

      setCountryAssignDialog({ open: false, staffId: '', staffName: '', selectedCountryId: '' });
    } catch (error) {
      console.error('Error assigning country:', error);
      toast({ title: 'Error', description: 'Failed to assign country', variant: 'destructive' });
    }
  };

  const getRoleBadgeVariant = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return 'default';
      case 'hostel_team':
        return 'outline';
      case 'finance':
        return 'destructive';
      case 'staff':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const columns = [
    {
      accessorKey: 'firstName' as keyof Staff,
      header: 'Name',
      cell: (row: Staff) => (
        <div>
          <div className="font-medium">{row.firstName} {row.lastName}</div>
          <div className="text-sm text-muted-foreground">{row.email}</div>
        </div>
      ),
    },
    {
      accessorKey: 'role' as keyof Staff,
      header: 'Role',
      cell: (row: Staff) => (
        <Badge variant={getRoleBadgeVariant(row.role)}>
          {row.role.replace('_', ' ').toUpperCase()}
        </Badge>
      ),
    },
    {
      accessorKey: 'isActive' as keyof Staff,
      header: 'Status',
      cell: (row: Staff) => (
        <Badge variant={row.isActive ? 'default' : 'secondary'}>
          {row.isActive ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      accessorKey: 'createdAt' as keyof Staff,
      header: 'Created',
      cell: (row: Staff) => (
        <span className="text-sm">{new Date(row.createdAt).toLocaleDateString()}</span>
      ),
    },
    {
      accessorKey: 'actions' as 'actions',
      header: 'Actions',
      cell: (row: Staff) => (
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => handleResetPassword(row)}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset Password
          </Button>
          {isAdmin && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setCountryAssignDialog({ 
                open: true, 
                staffId: row.id, 
                staffName: `${row.firstName} ${row.lastName}`,
                selectedCountryId: '' 
              })}
            >
              Assign Country
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <MainLayout>
      <PageHeader
        title="Staff Accounts"
        description="All staff accounts excluding agents"
      />

      <div className="flex justify-between items-center mb-4">
        <div>
          {/* placeholder for summary */}
        </div>
        {isAdmin && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Staff
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Staff Member</DialogTitle>
                <DialogDescription>
                  Create a new staff member account. Selecting "Agent" will also add an agent entry.
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleCreateStaff} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" value={createForm.firstName} onChange={(e) => setCreateForm(p => ({ ...p, firstName: e.target.value }))} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" value={createForm.lastName} onChange={(e) => setCreateForm(p => ({ ...p, lastName: e.target.value }))} required />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={createForm.email} onChange={(e) => setCreateForm(p => ({ ...p, email: e.target.value }))} required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="flex gap-2">
                    <Input id="password" type={showCreatePwd ? 'text' : 'password'} value={createForm.password} onChange={(e) => setCreateForm(p => ({ ...p, password: e.target.value }))} required />
                    <Button type="button" variant="outline" size="icon" onClick={() => setShowCreatePwd(!showCreatePwd)}>
                      {showCreatePwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                    <Button type="button" variant="outline" onClick={generatePassword}>Generate</Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select value={createForm.role} onValueChange={(value: UserRole) => setCreateForm(p => ({ ...p, role: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="agent">Agent</SelectItem>
                      <SelectItem value="hostel_team">Hostel Team</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="staff">Staff</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="countryId">Assigned Country (Optional)</Label>
                  <Select value={createForm.countryId} onValueChange={(value) => setCreateForm(p => ({ ...p, countryId: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No Country Assignment</SelectItem>
                      {countries.map((country) => (
                        <SelectItem key={country.id} value={country.id.toString()}>
                          {country.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {createForm.role === 'agent' && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="agentName">Agent Name (Optional)</Label>
                      <Input id="agentName" value={createForm.agentName} onChange={(e) => setCreateForm(p => ({ ...p, agentName: e.target.value }))} placeholder="Leave empty to use full name" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="agentPhone">Phone</Label>
                        <Input id="agentPhone" value={createForm.agentPhone} onChange={(e) => setCreateForm(p => ({ ...p, agentPhone: e.target.value }))} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="agentLocation">Location</Label>
                        <Input id="agentLocation" value={createForm.agentLocation} onChange={(e) => setCreateForm(p => ({ ...p, agentLocation: e.target.value }))} />
                      </div>
                    </div>
                  </>
                )}

                <div className="flex justify-end gap-2 pt-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                  <Button type="submit">Create Staff Member</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Staff Accounts</CardTitle>
          <CardDescription>
            {loading ? 'Loading staff accounts...' : `${staff.length} records`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : (
            <DataTable columns={columns as any} data={staff} />
          )}
        </CardContent>
      </Card>

      {/* Password Reset Dialog */}
      <AlertDialog 
        open={resetPasswordDialog.open} 
        onOpenChange={(open) => setResetPasswordDialog(prev => ({ ...prev, open }))}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Password Reset Successful</AlertDialogTitle>
            <AlertDialogDescription>
              A new password has been generated for {resetPasswordDialog.staffName}. 
              Use the Show/Hide button to view it.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="my-4 p-4 bg-muted rounded-lg">
            <p className="text-sm font-medium mb-2">New Password:</p>
            <div className="flex items-center gap-2">
              <code className="text-lg font-mono bg-background px-3 py-2 rounded border">
                {showPassword ? resetPasswordDialog.newPassword : '•'.repeat(resetPasswordDialog.newPassword.length || 8)}
              </code>
              <Button variant="outline" size="icon" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setResetPasswordDialog({ open: false, newPassword: '', staffName: '' })}>
              Done
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Country Assignment Dialog */}
      <Dialog open={countryAssignDialog.open} onOpenChange={(open) => setCountryAssignDialog(prev => ({ ...prev, open }))}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Country</DialogTitle>
            <DialogDescription>
              Assign a country to {countryAssignDialog.staffName}. Staff will only be able to view students from their assigned country.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="countrySelect">Select Country</Label>
              <Select 
                value={countryAssignDialog.selectedCountryId} 
                onValueChange={(value) => setCountryAssignDialog(prev => ({ ...prev, selectedCountryId: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Remove Country Assignment</SelectItem>
                  {countries.map((country) => (
                    <SelectItem key={country.id} value={country.id.toString()}>
                      {country.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setCountryAssignDialog({ open: false, staffId: '', staffName: '', selectedCountryId: '' })}>
              Cancel
            </Button>
            <Button onClick={handleCountryAssign}>
              Assign Country
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default StaffAccounts;
