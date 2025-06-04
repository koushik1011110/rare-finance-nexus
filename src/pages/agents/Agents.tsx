
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/DataTable";
import { agentsAPI, Agent } from "@/lib/supabase-database";
import { toast } from "@/hooks/use-toast";
import AgentForm from "@/components/forms/AgentForm";
import { EditModal } from "@/components/shared/EditModal";
import { DetailViewModal } from "@/components/shared/DetailViewModal";
import { Plus, Search, Eye, Edit, Trash2 } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import PageHeader from "@/components/shared/PageHeader";

const Agents = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    loadAgents();
  }, []);

  const loadAgents = async () => {
    try {
      setLoading(true);
      const data = await agentsAPI.getAll();
      setAgents(data);
    } catch (error) {
      console.error('Error loading agents:', error);
      toast({
        title: "Error",
        description: "Failed to load agents",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAgent = async (agentData: Omit<Agent, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      await agentsAPI.create(agentData);
      toast({
        title: "Success",
        description: "Agent created successfully",
      });
      loadAgents();
      setShowForm(false);
    } catch (error) {
      console.error('Error creating agent:', error);
      toast({
        title: "Error",
        description: "Failed to create agent",
        variant: "destructive",
      });
    }
  };

  const handleUpdateAgent = async (agentData: Partial<Agent>) => {
    if (!selectedAgent) return;
    
    try {
      await agentsAPI.update(selectedAgent.id, agentData);
      toast({
        title: "Success",
        description: "Agent updated successfully",
      });
      loadAgents();
      setShowEditModal(false);
      setSelectedAgent(null);
    } catch (error) {
      console.error('Error updating agent:', error);
      toast({
        title: "Error",
        description: "Failed to update agent",
        variant: "destructive",
      });
    }
  };

  const handleDeleteAgent = async (agent: Agent) => {
    if (!confirm(`Are you sure you want to delete ${agent.name}?`)) return;
    
    try {
      await agentsAPI.delete(agent.id);
      toast({
        title: "Success",
        description: "Agent deleted successfully",
      });
      loadAgents();
    } catch (error) {
      console.error('Error deleting agent:', error);
      toast({
        title: "Error",
        description: "Failed to delete agent",
        variant: "destructive",
      });
    }
  };

  const filteredAgents = agents.filter(agent =>
    agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agent.contact_person.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agent.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    {
      header: "Name",
      accessorKey: "name" as keyof Agent,
    },
    {
      header: "Contact Person",
      accessorKey: "contact_person" as keyof Agent,
    },
    {
      header: "Email",
      accessorKey: "email" as keyof Agent,
    },
    {
      header: "Phone",
      accessorKey: "phone" as keyof Agent,
    },
    {
      header: "Location",
      accessorKey: "location" as keyof Agent,
    },
    {
      header: "Commission",
      accessorKey: "commission_rate" as keyof Agent,
      cell: (row: Agent) => `${row.commission_rate}%`,
    },
    {
      header: "Status",
      accessorKey: "status" as keyof Agent,
      cell: (row: Agent) => (
        <Badge variant={row.status === 'active' ? 'default' : 'secondary'}>
          {row.status}
        </Badge>
      ),
    },
    {
      header: "Actions",
      accessorKey: "actions" as keyof Agent | "actions",
      cell: (row: Agent) => (
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelectedAgent(row);
              setShowDetailModal(true);
            }}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelectedAgent(row);
              setShowEditModal(true);
            }}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDeleteAgent(row)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  if (showForm) {
    return (
      <MainLayout>
        <PageHeader
          title="Add New Agent"
          description="Create a new agent profile"
        />
        <div className="max-w-2xl mx-auto">
          <AgentForm
            onSubmit={handleCreateAgent}
            onCancel={() => setShowForm(false)}
          />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <PageHeader
        title="Agents Management"
        description="Manage your education agents"
      />
      
      <div className="space-y-6">
        {/* Search and Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Search Agents</CardTitle>
            <CardDescription>Find agents by name, contact person, or email</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search agents..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Button onClick={() => setShowForm(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Agent
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Agents Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Agents ({filteredAgents.length})</CardTitle>
            <CardDescription>Manage your education agents</CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable
              data={filteredAgents}
              columns={columns}
              loading={loading}
            />
          </CardContent>
        </Card>
      </div>

      {/* Edit Modal */}
      {showEditModal && selectedAgent && (
        <EditModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setSelectedAgent(null);
          }}
          title="Edit Agent"
          data={selectedAgent}
          onSave={handleUpdateAgent}
          fields={[
            { key: 'name', label: 'Name', type: 'text', required: true },
            { key: 'contact_person', label: 'Contact Person', type: 'text', required: true },
            { key: 'email', label: 'Email', type: 'email', required: true },
            { key: 'phone', label: 'Phone', type: 'text' },
            { key: 'location', label: 'Location', type: 'text' },
            { key: 'commission_rate', label: 'Commission Rate (%)', type: 'number', min: 0, max: 100 },
            { 
              key: 'status', 
              label: 'Status', 
              type: 'select',
              options: [
                { value: 'active', label: 'Active' },
                { value: 'inactive', label: 'Inactive' }
              ]
            }
          ]}
        />
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedAgent && (
        <DetailViewModal
          isOpen={showDetailModal}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedAgent(null);
          }}
          title={`Agent Details: ${selectedAgent.name}`}
          data={selectedAgent}
          fields={[
            { key: 'name', label: 'Name' },
            { key: 'contact_person', label: 'Contact Person' },
            { key: 'email', label: 'Email' },
            { key: 'phone', label: 'Phone' },
            { key: 'location', label: 'Location' },
            { key: 'commission_rate', label: 'Commission Rate', format: (value) => `${value}%` },
            { key: 'status', label: 'Status' },
            { key: 'created_at', label: 'Created At', format: (value) => new Date(value).toLocaleDateString() }
          ]}
        />
      )}
    </MainLayout>
  );
};

export default Agents;
