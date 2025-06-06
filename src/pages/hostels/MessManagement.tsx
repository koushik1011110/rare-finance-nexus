
import React, { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import PageHeader from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Plus, Search, Edit, Eye } from "lucide-react";
import { Input } from "@/components/ui/input";
import DataTable from "@/components/ui/DataTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import DetailViewModal from "@/components/shared/DetailViewModal";
import EditModal from "@/components/shared/EditModal";
import MessForm, { MessFormData } from "@/components/forms/MessForm";
import { messAPI, Mess } from "@/lib/mess-api";

const MessManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [messes, setMesses] = useState<Mess[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentMess, setCurrentMess] = useState<Mess | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadMesses();
  }, []);

  const loadMesses = async () => {
    try {
      setLoading(true);
      const data = await messAPI.getAll();
      setMesses(data);
    } catch (error) {
      console.error('Error loading messes:', error);
      toast({
        title: "Error",
        description: "Failed to load mess data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const filteredData = messes.filter(
    (mess) => mess.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewMess = (mess: Mess) => {
    setCurrentMess(mess);
    setIsViewModalOpen(true);
  };

  const handleEditMess = (mess: Mess) => {
    setCurrentMess(mess);
    setIsEditModalOpen(true);
  };

  const handleAddMess = () => {
    setIsAddModalOpen(true);
  };

  const handleSaveMess = async (formData: MessFormData) => {
    setIsSubmitting(true);
    
    try {
      if (formData.id) {
        await messAPI.update(formData.id, formData);
        toast({
          title: "Mess Updated",
          description: `${formData.name} has been updated successfully.`,
        });
      } else {
        await messAPI.create(formData);
        toast({
          title: "Mess Added",
          description: `${formData.name} has been added successfully.`,
        });
      }
      
      await loadMesses();
      setIsAddModalOpen(false);
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Error saving mess:', error);
      toast({
        title: "Error",
        description: "Failed to save mess data.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const columns = [
    { header: "Mess Name", accessorKey: "name" as keyof Mess },
    { header: "Location", accessorKey: "location" as keyof Mess },
    { header: "Capacity", accessorKey: "capacity" as keyof Mess },
    { 
      header: "Monthly Rate", 
      accessorKey: "monthly_rate" as keyof Mess,
      cell: (row: Mess) => `$${row.monthly_rate}`
    },
    { header: "Meal Types", accessorKey: "meal_types" as keyof Mess },
    { header: "Contact Person", accessorKey: "contact_person" as keyof Mess },
    {
      header: "Status",
      accessorKey: "status" as keyof Mess,
      cell: (row: Mess) => (
        <span
          className={`rounded-full px-2 py-1 text-xs font-medium ${
            row.status === "Active"
              ? "bg-green-100 text-green-800"
              : row.status === "Maintenance"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {row.status}
        </span>
      ),
    },
    {
      header: "Actions",
      accessorKey: "actions" as "actions",
      cell: (row: Mess) => (
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={() => handleViewMess(row)}>
            <Eye className="mr-2 h-4 w-4" />
            View
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleEditMess(row)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading messes...</div>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <PageHeader
        title="Mess Management"
        description="Manage mess facilities and dining services"
        actions={
          <Button variant="default" size="sm" onClick={handleAddMess}>
            <Plus className="mr-2 h-4 w-4" />
            Add Mess
          </Button>
        }
      />
      
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Messes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{messes.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Capacity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {messes.reduce((sum, mess) => sum + mess.capacity, 0)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Average Monthly Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${messes.length > 0 ? Math.round(messes.reduce((sum, mess) => sum + mess.monthly_rate, 0) / messes.length) : 0}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="mb-6">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search messes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
      
      <div className="rounded-lg border bg-card shadow-sm">
        <DataTable columns={columns} data={filteredData} />
      </div>

      {/* Add Mess Modal */}
      <EditModal
        title="Add New Mess"
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      >
        <MessForm 
          onSubmit={handleSaveMess}
          isSubmitting={isSubmitting}
        />
      </EditModal>

      {/* View Mess Modal */}
      {currentMess && (
        <DetailViewModal
          title={`Mess: ${currentMess.name}`}
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <h3 className="font-semibold">Mess Name</h3>
              <p>{currentMess.name}</p>
            </div>
            <div>
              <h3 className="font-semibold">Location</h3>
              <p>{currentMess.location}</p>
            </div>
            <div>
              <h3 className="font-semibold">Capacity</h3>
              <p>{currentMess.capacity}</p>
            </div>
            <div>
              <h3 className="font-semibold">Monthly Rate</h3>
              <p>${currentMess.monthly_rate}</p>
            </div>
            <div>
              <h3 className="font-semibold">Meal Types</h3>
              <p>{currentMess.meal_types}</p>
            </div>
            <div>
              <h3 className="font-semibold">Operating Hours</h3>
              <p>{currentMess.operating_hours || 'N/A'}</p>
            </div>
            <div>
              <h3 className="font-semibold">Contact Person</h3>
              <p>{currentMess.contact_person || 'N/A'}</p>
            </div>
            <div>
              <h3 className="font-semibold">Phone</h3>
              <p>{currentMess.phone || 'N/A'}</p>
            </div>
            <div>
              <h3 className="font-semibold">Email</h3>
              <p>{currentMess.email || 'N/A'}</p>
            </div>
            <div>
              <h3 className="font-semibold">Status</h3>
              <p>{currentMess.status}</p>
            </div>
            <div className="md:col-span-2">
              <h3 className="font-semibold">Facilities</h3>
              <p>{currentMess.facilities || 'N/A'}</p>
            </div>
          </div>
        </DetailViewModal>
      )}

      {/* Edit Mess Modal */}
      {currentMess && (
        <EditModal
          title={`Edit Mess: ${currentMess.name}`}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
        >
          <MessForm 
            defaultValues={{
              id: currentMess.id,
              name: currentMess.name,
              hostel_id: currentMess.hostel_id?.toString() || '',
              location: currentMess.location,
              capacity: currentMess.capacity.toString(),
              monthly_rate: currentMess.monthly_rate.toString(),
              meal_types: currentMess.meal_types,
              operating_hours: currentMess.operating_hours || '',
              contact_person: currentMess.contact_person || '',
              phone: currentMess.phone || '',
              email: currentMess.email || '',
              facilities: currentMess.facilities || '',
              status: currentMess.status,
            }}
            onSubmit={handleSaveMess}
            isSubmitting={isSubmitting}
          />
        </EditModal>
      )}
    </MainLayout>
  );
};

export default MessManagement;
