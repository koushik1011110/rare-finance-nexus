
import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import MainLayout from "@/components/layout/MainLayout";
import PageHeader from "@/components/shared/PageHeader";
import DataTable from "@/components/ui/DataTable";
import { Button } from "@/components/ui/button";
import { Plus, Download, Upload, Eye, Edit, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import EditModal from "@/components/shared/EditModal";
import DetailViewModal from "@/components/shared/DetailViewModal";
import AgentForm, { AgentFormData } from "@/components/forms/AgentForm";
import { agentsAPI, Agent } from "@/lib/supabase-database";

const Agents = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentAgent, setCurrentAgent] = useState<Agent | null>(null);
  
  const queryClient = useQueryClient();

  // Fetch agents
  const { data: agents = [], isLoading } = useQuery({
    queryKey: ['agents'],
    queryFn: agentsAPI.getAll,
  });

  // Create agent mutation
  const createMutation = useMutation({
    mutationFn: agentsAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agents'] });
      toast({
        title: "Success",
        description: "Agent created successfully",
      });
      setIsAddModalOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create agent",
        variant: "destructive",
      });
    },
  });

  // Update agent mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Agent> }) =>
      agentsAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agents'] });
      toast({
        title: "Success",
        description: "Agent updated successfully",
      });
      setIsEditModalOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update agent",
        variant: "destructive",
      });
    },
  });

  // Delete agent mutation
  const deleteMutation = useMutation({
    mutationFn: agentsAPI.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agents'] });
      toast({
        title: "Success",
        description: "Agent deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete agent",
        variant: "destructive",
      });
    },
  });

  const filteredData = agents.filter(
    (agent) =>
      agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.contact_person.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (agent.location && agent.location.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleViewAgent = (agent: Agent) => {
    setCurrentAgent(agent);
    setIsViewModalOpen(true);
  };

  const handleEditAgent = (agent: Agent) => {
    setCurrentAgent(agent);
    setIsEditModalOpen(true);
  };

  const handleDeleteAgent = (agent: Agent) => {
    if (confirm(`Are you sure you want to delete ${agent.name}?`)) {
      deleteMutation.mutate(agent.id);
    }
  };

  const handleAddAgent = () => {
    setIsAddModalOpen(true);
  };

  const handleCreateAgent = (agentData: AgentFormData) => {
    createMutation.mutate(agentData);
  };

  const handleUpdateAgent = (agentData: AgentFormData) => {
    if (currentAgent) {
      updateMutation.mutate({
        id: currentAgent.id,
        data: agentData,
      });
    }
  };

  const handleImport = () => {
    toast({
      title: "Feature Coming Soon",
      description: "Import functionality will be available shortly.",
    });
  };

  const handleExport = () => {
    toast({
      title: "Feature Coming Soon",
      description: "Export functionality will be available shortly.",
    });
  };

  const columns = [
    { header: "Name", accessorKey: "name" as keyof Agent },
    { header: "Contact Person", accessorKey: "contact_person" as keyof Agent },
    { header: "Email", accessorKey: "email" as keyof Agent },
    { header: "Phone", accessorKey: "phone" as keyof Agent },
    { header: "Location", accessorKey: "location" as keyof Agent },
    { 
      header: "Commission Rate", 
      accessorKey: "commission_rate" as keyof Agent,
      cell: (row: Agent) => `${row.commission_rate}%`
    },
    {
      header: "Status",
      accessorKey: "status" as keyof Agent,
      cell: (row: Agent) => (
        <span
          className={`rounded-full px-2 py-1 text-xs font-medium ${
            row.status === "active"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {row.status === "active" ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      header: "Actions",
      accessorKey: "actions" as keyof Agent | "actions",
      cell: (row: Agent) => (
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={() => handleViewAgent(row)}>
            <Eye className="mr-2 h-4 w-4" />
            View
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleEditAgent(row)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleDeleteAgent(row)}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      ),
    },
  ];

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div>Loading agents...</div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <PageHeader
        title="Agents"
        description="Manage education agents and their information"
        actions={
          <>
            <Button variant="outline" size="sm" onClick={handleImport}>
              <Upload className="mr-2 h-4 w-4" />
              Import
            </Button>
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button variant="default" size="sm" onClick={handleAddAgent}>
              <Plus className="mr-2 h-4 w-4" />
              Add Agent
            </Button>
          </>
        }
      />

      <div className="mb-6">
        <Input
          placeholder="Search by name, contact person, email or location..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="rounded-lg border bg-card shadow-sm">
        <DataTable columns={columns} data={filteredData} />
      </div>

      {/* Add Agent Modal */}
      <EditModal
        title="Add New Agent"
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      >
        <AgentForm 
          onSubmit={handleCreateAgent}
          isSubmitting={createMutation.isPending}
        />
      </EditModal>

      {/* Edit Agent Modal */}
      {currentAgent && (
        <EditModal
          title={`Edit Agent: ${currentAgent.name}`}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
        >
          <AgentForm 
            defaultValues={{
              name: currentAgent.name,
              contact_person: currentAgent.contact_person,
              email: currentAgent.email,
              phone: currentAgent.phone || "",
              location: currentAgent.location || "",
              commission_rate: currentAgent.commission_rate || 10,
              status: currentAgent.status,
            }}
            onSubmit={handleUpdateAgent}
            isSubmitting={updateMutation.isPending}
          />
        </EditModal>
      )}

      {/* View Agent Modal */}
      {currentAgent && (
        <DetailViewModal
          title={`Agent: ${currentAgent.name}`}
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <h3 className="font-semibold">Agent Name</h3>
              <p>{currentAgent.name}</p>
            </div>
            <div>
              <h3 className="font-semibold">Contact Person</h3>
              <p>{currentAgent.contact_person}</p>
            </div>
            <div>
              <h3 className="font-semibold">Email</h3>
              <p>{currentAgent.email}</p>
            </div>
            <div>
              <h3 className="font-semibold">Phone</h3>
              <p>{currentAgent.phone || "N/A"}</p>
            </div>
            <div>
              <h3 className="font-semibold">Location</h3>
              <p>{currentAgent.location || "N/A"}</p>
            </div>
            <div>
              <h3 className="font-semibold">Commission Rate</h3>
              <p>{currentAgent.commission_rate}%</p>
            </div>
            <div>
              <h3 className="font-semibold">Status</h3>
              <p className={`capitalize ${currentAgent.status === 'active' ? 'text-green-600' : 'text-red-600'}`}>
                {currentAgent.status}
              </p>
            </div>
            <div>
              <h3 className="font-semibold">Created</h3>
              <p>{currentAgent.created_at ? new Date(currentAgent.created_at).toLocaleDateString() : "N/A"}</p>
            </div>
          </div>
        </DetailViewModal>
      )}
    </MainLayout>
  );
};

export default Agents;
