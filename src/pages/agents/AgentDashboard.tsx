import React, { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import StatCard from "@/components/dashboard/StatCard";
import AlertCard from "@/components/dashboard/AlertCard";
import PageHeader from "@/components/shared/PageHeader";
import DataTable from "@/components/ui/DataTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Users, FileText, TrendingUp, AlertCircle, Eye, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

interface AgentStats {
  totalApplications: number;
  pendingApplications: number;
  approvedApplications: number;
  totalStudents: number;
  totalCommission: number;
  pendingCommission: number;
}

interface RecentApplication {
  id: number;
  student_name: string;
  university_name: string;
  status: string;
  created_at: string;
  updated_at: string;
  actions?: string;
}

const AgentDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<AgentStats>({
    totalApplications: 0,
    pendingApplications: 0,
    approvedApplications: 0,
    totalStudents: 0,
    totalCommission: 0,
    pendingCommission: 0,
  });
  const [recentApplications, setRecentApplications] = useState<RecentApplication[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role === 'agent') {
      loadAgentData();
    }
  }, [user]);

  const loadAgentData = async () => {
    if (!user?.email) return;
    
    try {
      setLoading(true);
      
      // Get agent ID first
      const { data: agentData, error: agentError } = await supabase
        .from('agents')
        .select('id, commission_rate, commission_due, total_received')
        .eq('email', user.email)
        .single();

      if (agentError || !agentData) {
        toast({
          title: "Error",
          description: "Agent profile not found. Please contact administrator.",
          variant: "destructive",
        });
        return;
      }

      // Load applications - very simple query
      const { data: apps } = await supabase
        .from('apply_students')
        .select('id, first_name, last_name, status, created_at')
        .eq('agent_id', agentData.id)
        .limit(10);

      // Load students
      const { data: students } = await supabase
        .from('students')
        .select('id, status')
        .eq('agent_id', agentData.id);

      // Calculate stats
      const totalApplications = apps?.length || 0;
      const pendingApplications = apps?.filter(app => app.status === 'pending')?.length || 0;
      const approvedApplications = apps?.filter(app => app.status === 'approved')?.length || 0;
      const totalStudents = students?.length || 0;

      setStats({
        totalApplications,
        pendingApplications,
        approvedApplications,
        totalStudents,
        totalCommission: agentData.total_received || 0,
        pendingCommission: agentData.commission_due || 0,
      });

      // Set recent applications for table
      const recentApps: RecentApplication[] = apps?.slice(0, 5).map(app => ({
        id: app.id,
        student_name: `${app.first_name} ${app.last_name}`,
        university_name: 'University',
        status: app.status,
        created_at: app.created_at,
        updated_at: app.created_at,
      })) || [];

      setRecentApplications(recentApps);

      // Generate alerts
      const alertsList: any[] = [];
      
      if (pendingApplications > 0) {
        alertsList.push({
          id: 'pending-apps',
          title: 'Pending Applications',
          description: `You have ${pendingApplications} application(s) awaiting review`,
          type: 'reminder',
          date: new Date().toLocaleDateString(),
        });
      }

      if (agentData.commission_due > 0) {
        alertsList.push({
          id: 'commission-due',
          title: 'Commission Payment Due',
          description: `$${agentData.commission_due.toLocaleString()} in commission payments pending`,
          type: 'due',
          date: new Date().toLocaleDateString(),
        });
      }

      // Simplified missing docs check
      const studentsWithMissingDocs = apps?.filter(app => 
        app.status === 'pending'
      ) || [];

      if (studentsWithMissingDocs.length > 0) {
        alertsList.push({
          id: 'missing-docs',
          title: 'Missing Documents',
          description: `${studentsWithMissingDocs.length} application(s) have missing documents`,
          type: 'warning',
          date: new Date().toLocaleDateString(),
        });
      }

      setAlerts(alertsList);

    } catch (error) {
      console.error('Error loading agent data:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "destructive" | "secondary" | "outline"> = {
      pending: "secondary",
      under_review: "outline", 
      approved: "default",
      rejected: "destructive",
    };
    return (
      <Badge variant={variants[status] || "secondary"}>
        {status.replace('_', ' ').toUpperCase()}
      </Badge>
    );
  };

  const applicationColumns = [
    {
      header: "Student Name",
      accessorKey: "student_name" as keyof RecentApplication,
    },
    {
      header: "University", 
      accessorKey: "university_name" as keyof RecentApplication,
    },
    {
      header: "Status",
      accessorKey: "status" as keyof RecentApplication,
      cell: (row: RecentApplication) => getStatusBadge(row.status),
    },
    {
      header: "Applied Date",
      accessorKey: "created_at" as keyof RecentApplication,
      cell: (row: RecentApplication) => new Date(row.created_at).toLocaleDateString(),
    },
    {
      header: "Actions", 
      accessorKey: "actions" as keyof RecentApplication,
      cell: (row: RecentApplication) => (
        <Button
          size="sm"
          variant="outline"
          onClick={() => navigate('/students/application')}
        >
          <Eye className="h-4 w-4 mr-1" />
          View
        </Button>
      ),
    },
  ];

  if (loading) {
    return (
      <MainLayout>
        <PageHeader
          title="Agent Dashboard"
          description="Overview of your student applications and performance"
        />
        <div className="flex items-center justify-center py-8">
          <div className="text-sm text-muted-foreground">Loading dashboard...</div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <PageHeader
        title="Agent Dashboard"
        description="Welcome back! Here's an overview of your student applications and performance"
        actions={
          <Button onClick={() => navigate('/students/admission')}>
            <Plus className="h-4 w-4 mr-2" />
            New Application
          </Button>
        }
      />

      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <StatCard
            title="Total Applications"
            value={stats.totalApplications.toString()}
            icon={<FileText className="h-4 w-4" />}
            variant="default"
          />
          <StatCard
            title="Pending Reviews"
            value={stats.pendingApplications.toString()}
            icon={<AlertCircle className="h-4 w-4" />}
            variant="receivable"
          />
          <StatCard
            title="Approved"
            value={stats.approvedApplications.toString()}
            icon={<TrendingUp className="h-4 w-4" />}
            variant="income"
          />
          <StatCard
            title="Active Students"
            value={stats.totalStudents.toString()}
            icon={<Users className="h-4 w-4" />}
            variant="default"
          />
          <StatCard
            title="Total Commission"
            value={`$${stats.totalCommission.toLocaleString()}`}
            icon={<DollarSign className="h-4 w-4" />}
            variant="income"
          />
          <StatCard
            title="Pending Commission"
            value={`$${stats.pendingCommission.toLocaleString()}`}
            icon={<DollarSign className="h-4 w-4" />}
            variant="due"
          />
        </div>

        {/* Alerts Section */}
        {alerts.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Important Alerts</CardTitle>
              <CardDescription>
                Items that require your attention
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AlertCard title="Important Alerts" alerts={alerts} />
            </CardContent>
          </Card>
        )}

        {/* Recent Applications */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Applications</CardTitle>
                <CardDescription>
                  Your latest student application submissions
                </CardDescription>
              </div>
              <Button 
                variant="outline" 
                onClick={() => navigate('/students/application')}
              >
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {recentApplications.length > 0 ? (
              <DataTable columns={applicationColumns} data={recentApplications} />
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No applications submitted yet. Start by submitting your first application!
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks you can perform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Button 
                variant="outline" 
                className="h-20 flex-col gap-2"
                onClick={() => navigate('/students/admission')}
              >
                <Plus className="h-6 w-6" />
                New Application
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex-col gap-2"
                onClick={() => navigate('/students/application')}
              >
                <FileText className="h-6 w-6" />
                Track Applications
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex-col gap-2"
                onClick={() => navigate('/students/agent')}
              >
                <Users className="h-6 w-6" />
                My Students
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex-col gap-2"
                onClick={() => navigate('/agents')}
              >
                <DollarSign className="h-6 w-6" />
                Commission
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default AgentDashboard;