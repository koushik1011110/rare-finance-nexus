import React, { useEffect, useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import PageHeader from '@/components/shared/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import DataTable, { Column } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface Agent {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  contact_person?: string;
  status?: string;
  created_at?: string;
}

const Agents = () => {
  const navigate = useNavigate();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAgents();
  }, []);

  const loadAgents = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('agents').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setAgents(data || []);
    } catch (err) {
      console.error(err);
      toast({ title: 'Error', description: 'Failed to load agents.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const columns: Column<Agent>[] = [
    { header: 'ID', accessorKey: 'id', cell: (a) => <span className="font-mono text-sm">#{a.id}</span> },
    { header: 'Name', accessorKey: 'name', cell: (a) => (
      <button className="text-primary underline text-sm" onClick={() => navigate(`/agents/${a.id}`)}>
        {a.name}
      </button>
    ) },
    { header: 'Contact', accessorKey: 'contact_person' },
    { header: 'Phone', accessorKey: 'phone' },
    { header: 'Email', accessorKey: 'email' },
  ];

  return (
    <MainLayout>
      <PageHeader title="All Agents" description="Manage agents" />
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Agents</CardTitle>
            </div>
            <div>
              <Button onClick={() => navigate('/agents/add')}>Add Agent</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? <div>Loading...</div> : <DataTable columns={columns} data={agents} />}
        </CardContent>
      </Card>
    </MainLayout>
  );
};

export default Agents;
