import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import PageHeader from '@/components/shared/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { UserRole } from '@/contexts/AuthContext';
import { fetchCountries, Country } from '@/lib/countries-api';

const AddStaff: React.FC = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [showCreatePwd, setShowCreatePwd] = useState(false);
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
  const navigate = useNavigate();

  useEffect(() => {
    const loadCountries = async () => {
      try {
        const data = await fetchCountries();
        setCountries(data);
      } catch (err) {
        console.error('Error loading countries:', err);
      }
    };
    loadCountries();
  }, []);

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 12; i++) password += chars.charAt(Math.floor(Math.random() * chars.length));
    setCreateForm(p => ({ ...p, password }));
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
      navigate('/staff');
    } catch (err) {
      console.error('Error creating staff member:', err);
      toast({ title: 'Error', description: 'Failed to create staff member', variant: 'destructive' });
    }
  };

  return (
    <MainLayout>
      <PageHeader title="Add Staff" description="Create a new staff member" />
      <Card>
        <CardHeader>
          <CardTitle>Add Staff</CardTitle>
        </CardHeader>
        <CardContent>
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
                  {showCreatePwd ? 'Hide' : 'Show'}
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
              <Button type="button" variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
              <Button type="submit">Create Staff Member</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </MainLayout>
  );
};

export default AddStaff;
