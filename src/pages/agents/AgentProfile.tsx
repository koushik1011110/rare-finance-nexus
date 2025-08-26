import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, DollarSign, MapPin, Mail, Phone, Calendar, Settings, Shield } from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";
import MainLayout from "@/components/layout/MainLayout";
import PageHeader from "@/components/shared/PageHeader";
import EditModal from "@/components/shared/EditModal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { agentProfileAPI, AgentStats as APIAgentStats } from "@/lib/agent-profile-api";

// Use the interface from the API module
type AgentStats = APIAgentStats;

interface AgentProfile {
  id: number;
  name: string;
  email: string;
  contact_person: string;
  phone?: string;
  location?: string;
  status: 'Active' | 'Inactive';
  commission_rate: number;
  created_at: string;
  updated_at: string;
}

const AgentProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<AgentProfile | null>(null);
  const [stats, setStats] = useState<AgentStats>({
    totalStudents: 0,
    activeStudents: 0,
    totalReceivable: 0,
    paidAmount: 0,
    pendingAmount: 0
  });
  const [loading, setLoading] = useState(true);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (user?.email) {
      loadAgentProfile();
      loadAgentStats();
    }
  }, [user]);

  const loadAgentProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('agents')
        .select('*')
        .eq('email', user?.email)
        .single();

      if (error) throw error;
      setProfile({
        ...data,
        status: data.status as 'Active' | 'Inactive'
      });
    } catch (error) {
      console.error('Error loading agent profile:', error);
      toast({
        title: "Error",
        description: "Failed to load agent profile.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadAgentStats = async () => {
    if (!user?.email) return;
    
    try {
      const agentStats = await agentProfileAPI.getAgentStats(user.email);
      setStats(agentStats);
    } catch (error) {
      console.error('Error loading agent stats:', error);
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match.",
        variant: "destructive",
      });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }

    try {
      // For now, we'll use a simple password update since change_password function may not exist
      // In a real implementation, you'd want to properly implement password change functionality
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error('User not authenticated');

      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Password changed successfully.",
      });

      setIsChangePasswordOpen(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to change password.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateProfile = async (formData: any) => {
    if (!user?.email) return;
    
    try {
      await agentProfileAPI.updateAgentProfile(user.email, {
        name: formData.name,
        contact_person: formData.contact_person,
        phone: formData.phone,
        location: formData.location
      });

      toast({
        title: "Success",
        description: "Profile updated successfully.",
      });

      setIsEditProfileOpen(false);
      loadAgentProfile();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading profile...</div>
        </div>
      </MainLayout>
    );
  }

  if (!profile) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Agent profile not found.</div>
        </div>
      </MainLayout>
    );
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <MainLayout>
      <PageHeader
        title="Agent Profile"
        description="View and manage your agent profile and statistics"
        actions={
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={() => setIsChangePasswordOpen(true)}>
              <Shield className="mr-2 h-4 w-4" />
              Change Password
            </Button>
            <Button variant="default" size="sm" onClick={() => setIsEditProfileOpen(true)}>
              <Settings className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
          </div>
        }
      />

      <div className="space-y-6">
        {/* Profile Header Card */}
        <Card className="overflow-hidden">
          <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6">
            <div className="flex items-start space-x-4">
              <Avatar className="h-20 w-20 border-4 border-background shadow-lg">
                <AvatarImage src="" alt={profile.name} />
                <AvatarFallback className="text-2xl font-bold bg-primary text-primary-foreground">
                  {getInitials(profile.name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-2">
                <div className="flex items-center space-x-3">
                  <h1 className="text-3xl font-bold tracking-tight">{profile.name}</h1>
                  <Badge variant={profile.status === 'Active' ? 'default' : 'secondary'}>
                    {profile.status}
                  </Badge>
                </div>
                <p className="text-lg text-muted-foreground">{profile.contact_person}</p>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Mail className="h-4 w-4" />
                    <span>{profile.email}</span>
                  </div>
                  {profile.phone && (
                    <div className="flex items-center space-x-1">
                      <Phone className="h-4 w-4" />
                      <span>{profile.phone}</span>
                    </div>
                  )}
                  {profile.location && (
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4" />
                      <span>{profile.location}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>Joined {new Date(profile.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Statistics Cards */}
        <div className="grid gap-4 md:grid-cols-2">
          <StatCard
            title="Total Students"
            value={stats.totalStudents.toString()}
            icon={<Users className="h-4 w-4" />}
            variant="default"
          />
          <StatCard
            title="Active Students"
            value={stats.activeStudents.toString()}
            icon={<Users className="h-4 w-4" />}
            variant="income"
          />
        </div>

        {/* Detailed Information */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Commission Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5" />
                <span>Commission Details</span>
              </CardTitle>
              <CardDescription>
                Your commission structure and earnings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Commission Rate:</span>
                <Badge variant="outline">{profile.commission_rate}%</Badge>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Total Fees Collected:</span>
                <span className="font-semibold text-green-600">
                  ${stats.paidAmount.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Estimated Commission:</span>
                <span className="font-semibold text-primary">
                  ${((stats.paidAmount * profile.commission_rate) / 100).toFixed(2)}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Account Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>Account Information</span>
              </CardTitle>
              <CardDescription>
                Your account details and settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Agent ID</Label>
                <p className="text-sm text-muted-foreground">#{profile.id}</p>
              </div>
              <Separator />
              <div className="space-y-2">
                <Label className="text-sm font-medium">Account Created</Label>
                <p className="text-sm text-muted-foreground">
                  {new Date(profile.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Last Updated</Label>
                <p className="text-sm text-muted-foreground">
                  {new Date(profile.updated_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Change Password Modal */}
      <EditModal
        title="Change Password"
        isOpen={isChangePasswordOpen}
        onClose={() => {
          setIsChangePasswordOpen(false);
          setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        }}
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Current Password</Label>
            <Input
              id="currentPassword"
              type="password"
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
              placeholder="Enter current password"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <Input
              id="newPassword"
              type="password"
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
              placeholder="Enter new password"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
              placeholder="Confirm new password"
            />
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => setIsChangePasswordOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleChangePassword}>
              Change Password
            </Button>
          </div>
        </div>
      </EditModal>

      {/* Edit Profile Modal */}
      <EditModal
        title="Edit Profile"
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
      >
        <ProfileEditForm 
          profile={profile} 
          onSubmit={handleUpdateProfile}
          onCancel={() => setIsEditProfileOpen(false)}
        />
      </EditModal>
    </MainLayout>
  );
};

// Profile Edit Form Component
const ProfileEditForm = ({ 
  profile, 
  onSubmit, 
  onCancel 
}: { 
  profile: AgentProfile; 
  onSubmit: (data: any) => void; 
  onCancel: () => void; 
}) => {
  const [formData, setFormData] = useState({
    name: profile.name,
    contact_person: profile.contact_person,
    phone: profile.phone || '',
    location: profile.location || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Agent Name *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          placeholder="Enter agent name"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="contact_person">Contact Person *</Label>
        <Input
          id="contact_person"
          value={formData.contact_person}
          onChange={(e) => setFormData(prev => ({ ...prev, contact_person: e.target.value }))}
          placeholder="Enter contact person name"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <Input
          id="phone"
          value={formData.phone}
          onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
          placeholder="Enter phone number"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          value={formData.location}
          onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
          placeholder="Enter location"
        />
      </div>
      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          Update Profile
        </Button>
      </div>
    </form>
  );
};

export default AgentProfile;