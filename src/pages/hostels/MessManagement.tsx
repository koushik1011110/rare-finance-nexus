
import React, { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import PageHeader from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Plus, Search, Edit, Eye, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import DataTable from "@/components/ui/DataTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import DetailViewModal from "@/components/shared/DetailViewModal";
import EditModal from "@/components/shared/EditModal";
import MessForm from "@/components/forms/MessForm";
import { messAPI, Mess, MessFormData } from "@/lib/mess-api";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";

const MessManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [messes, setMesses] = useState<Mess[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
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
      console.error('Error loading mess data:', error);
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
    (mess) => 
      mess.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mess.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mess.meal_types.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewMess = (mess: Mess) => {
    setCurrentMess(mess);
    setIsViewModalOpen(true);
  };

  const handleEditMess = (mess: Mess) => {
    setCurrentMess(mess);
    setIsEditModalOpen(true);
  };

  const handleDeleteMess = (mess: Mess) => {
    setCurrentMess(mess);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!currentMess) return;
    
    try {
      await messAPI.delete(currentMess.id);
      toast({
        title: "Mess Deleted",
        description: "Mess has been deleted successfully.",
      });
      loadMesses();
    } catch (error) {
      console.error('Error deleting mess:', error);
      toast({
        title: "Error",
        description: "Failed to delete mess.",
        variant: "destructive",
      });
    } finally {
      setIsDeleteDialogOpen(false);
    }
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
          description: "Mess has been updated successfully.",
        });
      } else {
        await messAPI.create(formData);
        toast({
          title: "Mess Added",
          description: "Mess has been added successfully.",
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
    { header: "Name", accessorKey: "name" as keyof Mess },
    { header: "Location", accessorKey: "location" as keyof Mess },
    { header: "Capacity", accessorKey: "capacity" as keyof Mess },
    { header: "Monthly Rate", accessorKey: "monthly_rate" as keyof Mess,
      cell: (row: Mess) => `$${row.monthly_rate}` },
    { header: "Meal Types", accessorKey: "meal_types" as keyof Mess },
    {
      header: "Status",
      accessorKey: "status" as keyof Mess,
      cell: (row: Mess) => (
        <span
          className={`rounded-full px-2 py-1 text-xs font-medium ${
            row.status === "Active"
              ? "bg-green-100 text-green-800"
              : row.status === "Inactive"
              ? "bg-gray-100 text-gray-800"
              : "bg-yellow-100 text-yellow-800"
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
          <Button variant="outline" size="sm" onClick={() => handleDeleteMess(row)}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      ),
    },
  ];

  // Calculate summary statistics
  const totalMesses = filteredData.length;
  const activeMesses = filteredData.filter(mess => mess.status === 'Active').length;
  const inactiveMesses = filteredData.filter(mess => mess.status === 'Inactive').length;
  const totalCapacity = filteredData.reduce((sum, mess) => sum + mess.capacity, 0);

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading mess data...</div>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <PageHeader
        title="Mess Management"
        description="Manage mess facilities and services for hostels"
        actions={
          <Button variant="default" size="sm" onClick={handleAddMess}>
            <Plus className="mr-2 h-4 w-4" />
            Add Mess
          </Button>
        }
      />
      
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Mess</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMesses}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Mess</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activeMesses}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Inactive Mess</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-500">{inactiveMesses}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Capacity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCapacity}</div>
          </CardContent>
        </Card>
      </div>
      
      <div className="mb-6">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search mess..."
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
          title={`Mess Details: ${currentMess.name}`}
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <h3 className="font-semibold">Name</h3>
              <p>{currentMess.name}</p>
            </div>
            {currentMess.hostel_id && (
              <div>
                <h3 className="font-semibold">Associated Hostel</h3>
                <p>{currentMess.hostels?.name || 'N/A'}</p>
              </div>
            )}
            <div>
              <h3 className="font-semibold">Location</h3>
              <p>{currentMess.location}</p>
            </div>
            <div>
              <h3 className="font-semibold">Capacity</h3>
              <p>{currentMess.capacity} students</p>
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
              <p>{currentMess.operating_hours}</p>
            </div>
            <div>
              <h3 className="font-semibold">Status</h3>
              <p>{currentMess.status}</p>
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
            <div className="md:col-span-2">
              <h3 className="font-semibold">Facilities</h3>
              <p>{currentMess.facilities || 'No facilities listed'}</p>
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
              operating_hours: currentMess.operating_hours,
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

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the mess "{currentMess?.name}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MainLayout>
  );
};

export default MessManagement;
