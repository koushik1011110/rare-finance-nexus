import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import PageHeader from "@/components/shared/PageHeader";
import DataTable from "@/components/ui/DataTable";
import { Button } from "@/components/ui/button";
import { Plus, Download, Upload, Eye, Edit } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import DetailViewModal from "@/components/shared/DetailViewModal";
import EditModal from "@/components/shared/EditModal";
import AgentForm, { AgentFormData } from "@/components/forms/AgentForm";

// Sample data for agents
const agentsData = [
  {
    id: "1",
    name: "Global Education",
    contactPerson: "James Wilson",
    email: "james@globaledu.com",
    phone: "+44 20 1234 5678",
    location: "London, UK",
    studentsCount: 15,
    commission: "10%",
    totalReceived: "$24,500",
    commissionDue: "$3,200",
    status: "Active",
  },
  {
    id: "2",
    name: "Academic Horizon",
    contactPerson: "Sarah Chen",
    email: "sarah@academichorizon.com",
    phone: "+1 212 987 6543",
    location: "New York, USA",
    studentsCount: 8,
    commission: "12%",
    totalReceived: "$18,000",
    commissionDue: "$2,400",
    status: "Active",
  },
  {
    id: "3",
    name: "Future Scholars",
    contactPerson: "Rahul Sharma",
    email: "rahul@futurescholars.com",
    phone: "+91 98765 43210",
    location: "Mumbai, India",
    studentsCount: 12,
    commission: "8%",
    totalReceived: "$15,500",
    commissionDue: "$1,800",
    status: "Active",
  },
  {
    id: "4",
    name: "Education First",
    contactPerson: "Maria Garcia",
    email: "maria@edufirst.com",
    phone: "+34 91 234 5678",
    location: "Madrid, Spain",
    studentsCount: 5,
    commission: "10%",
    totalReceived: "$9,200",
    commissionDue: "$1,100",
    status: "Inactive",
  },
];

interface Agent {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  location: string;
  studentsCount: number;
  commission: string;
  totalReceived: string;
  commissionDue: string;
  status: string;
}

const AgentManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [agents, setAgents] = useState<Agent[]>(agentsData);
  
  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentAgent, setCurrentAgent] = useState<Agent | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredData = agents.filter(
    (agent) =>
      agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewAgent = (agent: Agent) => {
    setCurrentAgent(agent);
    setIsViewModalOpen(true);
  };

  const handleEditAgent = (agent: Agent) => {
    setCurrentAgent(agent);
    setIsEditModalOpen(true);
  };

  const handleAddAgent = () => {
    setIsAddModalOpen(true);
  };

  const handleSaveAgent = (formData: AgentFormData) => {
    setIsSubmitting(true);
    
    // Simulating API call
    setTimeout(() => {
      if (formData.id) {
        // Update existing agent
        setAgents(
          agents.map((agent) =>
            agent.id === formData.id
              ? {
                  ...agent,
                  name: formData.name,
                  contactPerson: formData.contactPerson,
                  email: formData.email,
                  phone: formData.phone,
                  location: formData.location,
                  commission: formData.commission,
                  status: formData.status,
                }
              : agent
          )
        );
        
        toast({
          title: "Agent Updated",
          description: `${formData.name} has been updated successfully.`,
        });
      } else {
        // Add new agent
        const newAgent: Agent = {
          id: Date.now().toString(),
          name: formData.name,
          contactPerson: formData.contactPerson,
          email: formData.email,
          phone: formData.phone,
          location: formData.location,
          studentsCount: 0,
          commission: formData.commission,
          totalReceived: "$0",
          commissionDue: "$0",
          status: formData.status,
        };
        
        setAgents([newAgent, ...agents]);
        
        toast({
          title: "Agent Added",
          description: `${formData.name} has been added successfully.`,
        });
      }
      
      setIsSubmitting(false);
      setIsAddModalOpen(false);
      setIsEditModalOpen(false);
    }, 1000);
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
    { header: "Agent Name", accessorKey: "name" },
    { header: "Contact Person", accessorKey: "contactPerson" },
    { header: "Email", accessorKey: "email" },
    { header: "Location", accessorKey: "location" },
    { header: "Students Count", accessorKey: "studentsCount" },
    { header: "Commission Rate", accessorKey: "commission" },
    { header: "Total Received", accessorKey: "totalReceived" },
    { header: "Commission Due", accessorKey: "commissionDue" },
    {
      header: "Status",
      accessorKey: "status",
      cell: (row: any) => (
        <span
          className={`rounded-full px-2 py-1 text-xs font-medium ${
            row.status === "Active"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {row.status}
        </span>
      ),
    },
    {
      header: "Actions",
      accessorKey: "actions",
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
        </div>
      ),
    },
  ];

  return (
    <MainLayout>
      <PageHeader
        title="Agent Management"
        description="Manage all education agents, their students, and commission structures"
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
          onSubmit={handleSaveAgent}
          isSubmitting={isSubmitting}
        />
      </EditModal>
      
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
              <p>{currentAgent.contactPerson}</p>
            </div>
            <div>
              <h3 className="font-semibold">Email</h3>
              <p>{currentAgent.email}</p>
            </div>
            <div>
              <h3 className="font-semibold">Phone</h3>
              <p>{currentAgent.phone}</p>
            </div>
            <div>
              <h3 className="font-semibold">Location</h3>
              <p>{currentAgent.location}</p>
            </div>
            <div>
              <h3 className="font-semibold">Students Count</h3>
              <p>{currentAgent.studentsCount}</p>
            </div>
            <div>
              <h3 className="font-semibold">Commission Rate</h3>
              <p>{currentAgent.commission}</p>
            </div>
            <div>
              <h3 className="font-semibold">Total Received</h3>
              <p>{currentAgent.totalReceived}</p>
            </div>
            <div>
              <h3 className="font-semibold">Commission Due</h3>
              <p>{currentAgent.commissionDue}</p>
            </div>
            <div>
              <h3 className="font-semibold">Status</h3>
              <p>{currentAgent.status}</p>
            </div>
          </div>
        </DetailViewModal>
      )}
      
      {/* Edit Agent Modal */}
      {currentAgent && (
        <EditModal
          title={`Edit Agent: ${currentAgent.name}`}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
        >
          <AgentForm 
            initialData={{
              id: currentAgent.id,
              name: currentAgent.name,
              contactPerson: currentAgent.contactPerson,
              email: currentAgent.email,
              phone: currentAgent.phone,
              location: currentAgent.location,
              commission: currentAgent.commission,
              status: currentAgent.status as "Active" | "Inactive",
            }}
            onSubmit={handleSaveAgent}
            isSubmitting={isSubmitting}
          />
        </EditModal>
      )}
    </MainLayout>
  );
};

export default AgentManagement;
