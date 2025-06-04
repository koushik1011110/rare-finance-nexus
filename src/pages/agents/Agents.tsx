
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import MainLayout from "@/components/layout/MainLayout";
import PageHeader from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import DataTable, { Column } from "@/components/ui/DataTable";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import EditModal from "@/components/shared/EditModal";
import DetailViewModal from "@/components/shared/DetailViewModal";
import AgentForm from "@/components/forms/AgentForm";
import { toast } from "@/hooks/use-toast";
import { Plus, Search, Eye, Edit, Trash, RefreshCw } from "lucide-react";
import { agentsAPI, type Agent } from "@/lib/supabase-database";

interface AgentFormData {
  name: string;
  contact_person: string;
  email: string;
  phone?: string;
  location?: string;
  commission_rate?: number;
  status: 'active' | 'inactive';
}

const Agents = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Fetch agents
  const { data: agents = [], refetch, isLoading } = useQuery({
    queryKey: ['agents'],
    queryFn: agentsAPI.getAll,
  });

  // Create agent mutation
  const createAgentMutation = useMutation({
    mutationFn: agentsAPI.create,
    onSuccess: () => {
      toast({
        title: "Agent Created",
        description: "Agent has been created successfully.",
      });
      setIsCreateModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ['agents'] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create agent.",
        variant: "destructive",
      });
      console.error('Create agent error:', error);
    },
  });

  // Update agent mutation
  const updateAgentMutation = useMutation({
    mutationFn: ({ id, ...data }: { id: number } & Partial<Agent>) =>
      agentsAPI.update(id, data),
    onSuccess: () => {
      toast({
        title: "Agent Updated",
        description: "Agent has been updated successfully.",
      });
      setIsEditModalOpen(false);
      setSelectedAgent(null);
      queryClient.invalidateQueries({ queryKey: ['agents'] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update agent.",
        variant: "destructive",
      });
      console.error('Update agent error:', error);
    },
  });

  // Delete agent mutation
  const deleteAgentMutation = useMutation({
    mutationFn: agentsAPI.delete,
    onSuccess: () => {
      toast({
        title: "Agent Deleted",
        description: "Agent has been deleted successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['agents'] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete agent.",
        variant: "destructive",
      });
      console.error('Delete agent error:', error);
    },
  });

  // Filter agents based on search term
  const filteredAgents = agents.filter((agent) => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      agent.name.toLowerCase().includes(searchLower) ||
      agent.contact_person.toLowerCase().includes(searchLower) ||
      agent.email.toLowerCase().includes(searchLower) ||
      (agent.location && agent.location.toLowerCase().includes(searchLower))
    );
  });

  const handleCreateAgent = (agentData: AgentFormData) => {
    createAgentMutation.mutate(agentData);
  };

  const handleEditAgent = (agentData: AgentFormData) => {
    if (selectedAgent) {
      updateAgentMutation.mutate({
        id: selectedAgent.id,
        ...agentData,
      });
    }
  };

  const handleDeleteAgent = (id: number) => {
    if (window.confirm('Are you sure you want to delete this agent?')) {
      deleteAgentMutation.mutate(id);
    }
  };

  const handleViewAgent = (agent: Agent) => {
    setSelectedAgent(agent);
    setIsDetailModalOpen(true);
  };

  const handleEditClick = (agent: Agent) => {
    setSelectedAgent(agent);
    setIsEditModalOpen(true);
  };

  const getStatusBadge = (status: string) => {
    return (
      <Badge variant={status === 'active' ? 'default' : 'secondary'}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const columns: Column<Agent>[] = [
    { header: "Name", accessorKey: "name" },
    { header: "Contact Person", accessorKey: "contact_person" },
    { header: "Email", accessorKey: "email" },
    {
      header: "Phone",
      accessorKey: "phone",
      cell: (agent: Agent) => agent.phone || "N/A"
    },
    {
      header: "Location",
      accessorKey: "location",
      cell: (agent: Agent) => agent.location || "N/A"
    },
    {
      header: "Commission Rate",
      accessorKey: "commission_rate",
      cell: (agent: Agent) => `${agent.commission_rate || 0}%`
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (agent: Agent) => getStatusBadge(agent.status)
    },
    {
      header: "Actions",
      accessorKey: "actions",
      cell: (agent: Agent) => (
        <div className="flex space-x-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleViewAgent(agent)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleEditClick(agent)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => handleDeleteAgent(agent.id)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <MainLayout>
      <PageHeader
        title="Agent Management"
        description="Manage educational agents and their information"
      />
      
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Agents</CardTitle>
              <CardDescription>
                Manage all educational agents in your system
              </CardDescription>
            </div>
            <div className="flex space-x-2">
              <Button onClick={() => setIsCreateModalOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Agent
              </Button>
              <Button variant="outline" onClick={() => refetch()} disabled={isLoading}>
                <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search */}
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search agents by name, contact person, email, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Loading agents...</p>
            </div>
          ) : filteredAgents.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                {searchTerm ? 'No agents found matching your search.' : 'No agents found. Create your first agent to get started.'}
              </p>
            </div>
          ) : (
            <DataTable columns={columns} data={filteredAgents} />
          )}
        </CardContent>
      </Card>

      {/* Create Agent Modal */}
      <EditModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Agent"
        onSubmit={handleCreateAgent}
        isSubmitting={createAgentMutation.isPending}
      >
        <AgentForm />
      </EditModal>

      {/* Edit Agent Modal */}
      <EditModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedAgent(null);
        }}
        title="Edit Agent"
        onSubmit={handleEditAgent}
        isSubmitting={updateAgentMutation.isPending}
      >
        <AgentForm defaultValues={selectedAgent || undefined} />
      </EditModal>

      {/* Agent Detail Modal */}
      <DetailViewModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedAgent(null);
        }}
        title="Agent Details"
        data={selectedAgent}
      />
    </MainLayout>
  );
};

export default Agents;
