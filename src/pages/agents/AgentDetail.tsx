import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import PageHeader from '@/components/shared/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';
import { Eye, EyeOff } from 'lucide-react';

interface Agent {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  contact_person?: string;
  status?: string;
  created_at?: string;
}

interface Student {
  id: number;
  first_name: string;
  last_name: string;
  admission_number?: string;
}

const AgentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [agent, setAgent] = useState<Agent | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, isAdmin } = useAuth();

  const [pwdDialog, setPwdDialog] = useState<{ open: boolean; newPassword: string; agentName: string }>({ open: false, newPassword: '', agentName: '' });
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (id) loadData();
  }, [id]);

  const loadData = async () => {
    try {
      setLoading(true);
  const agentId = Number(id);
  const { data: agentData, error: aErr } = await supabase.from('agents').select('*').eq('id', agentId).single();
      if (aErr) throw aErr;
      setAgent(agentData);

  const { data: studentData, error: sErr } = await supabase.from('students').select('id, first_name, last_name, admission_number').eq('agent_id', agentId).order('created_at', { ascending: false });
      if (sErr) throw sErr;
      setStudents(studentData || []);
    } catch (err) {
      console.error(err);
      toast({ title: 'Error', description: 'Failed to load agent details.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleRegeneratePassword = async () => {
    if (!agent || !agent.email) return;
    try {
      // Lookup user by agent email
      const { data: userRow, error: userErr } = await supabase
        .from('users')
        .select('id, first_name, last_name')
        .eq('email', agent.email)
        .single();

      if (userErr || !userRow) {
        throw userErr || new Error('User not found for this agent email');
      }

      const { data: newPassword, error } = await supabase.rpc('reset_staff_password', {
        staff_id_param: userRow.id,
      });

      if (error) throw error;

      setShowPassword(true);
      setPwdDialog({ open: true, newPassword: newPassword as string, agentName: agent.name });
      toast({ title: 'Password Regenerated', description: `A new password has been generated for ${agent.name}.` });
    } catch (err) {
      console.error('Error regenerating password:', err);
      toast({ title: 'Error', description: 'Failed to regenerate password.', variant: 'destructive' });
    }
  };

  if (loading) return (
    <MainLayout>
      <div className="text-center py-8">Loading...</div>
    </MainLayout>
  );

  if (!agent) return (
    <MainLayout>
      <PageHeader title="Agent Not Found" description="Agent does not exist." />
    </MainLayout>
  );

  return (
    <MainLayout>
      <PageHeader title={`${agent.name}`} description={`Agent Profile`} />

      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Agent Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <div className="text-sm text-muted-foreground">Name</div>
                  <div className="text-base font-semibold">{agent.name}</div>
                </div>

                {agent.contact_person && (
                  <div>
                    <div className="text-sm text-muted-foreground">Contact Person</div>
                    <div className="text-base">{agent.contact_person}</div>
                  </div>
                )}

                {agent.phone && (
                  <div>
                    <div className="text-sm text-muted-foreground">Phone</div>
                    <div className="text-base">{agent.phone}</div>
                  </div>
                )}

                {agent.email && (
                  <div>
                    <div className="text-sm text-muted-foreground">Email</div>
                    <div className="text-base">{agent.email}</div>
                  </div>
                )}

                {agent.status && (
                  <div>
                    <div className="text-sm text-muted-foreground">Status</div>
                    <div className="text-base">{agent.status}</div>
                  </div>
                )}

                {agent.created_at && (
                  <div>
                    <div className="text-sm text-muted-foreground">Joined</div>
                    <div className="text-base">{new Date(agent.created_at).toLocaleDateString()}</div>
                  </div>
                )}

                <div className="flex items-center space-x-2 pt-4">
                  <Button variant="outline" onClick={() => navigate('/agents')}>Back to Agents</Button>
                  {isAdmin && (
                    <Button variant="destructive" onClick={handleRegeneratePassword}>
                      Regenerate Password
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Students Assigned</CardTitle>
              </CardHeader>
              <CardContent>
                {students.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">No students assigned to this agent.</div>
                ) : (
                  <div className="space-y-3">
                    {students.map(s => (
                      <div key={s.id} className="flex items-center justify-between p-4 border rounded hover:bg-muted">
                        <div>
                          <button className="text-primary underline text-sm font-medium" onClick={() => navigate(`/students/${s.id}`)}>
                            {s.first_name} {s.last_name}
                          </button>
                          {s.admission_number && <p className="text-sm text-muted-foreground">Admission No: {s.admission_number}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Password Dialog */}
        <AlertDialog open={pwdDialog.open} onOpenChange={(open) => setPwdDialog(prev => ({ ...prev, open }))}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Password Regenerated</AlertDialogTitle>
              <AlertDialogDescription>
                A new password has been generated for {pwdDialog.agentName}. Use the Show/Hide button to view it.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="my-4 p-4 bg-muted rounded-lg">
              <p className="text-sm font-medium mb-2">New Password:</p>
              <div className="flex items-center gap-2">
                <code className="text-lg font-mono bg-background px-3 py-2 rounded border">
                  {showPassword ? pwdDialog.newPassword : '•'.repeat(pwdDialog.newPassword.length || 8)}
                </code>
                <Button variant="outline" size="icon" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <AlertDialogFooter>
              <AlertDialogAction onClick={() => setPwdDialog({ open: false, newPassword: '', agentName: '' })}>Done</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </MainLayout>
  );
};

export default AgentDetail;
