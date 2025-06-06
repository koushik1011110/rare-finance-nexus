
import React, { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import PageHeader from "@/components/shared/PageHeader";
import DataTable from "@/components/ui/DataTable";
import { Button } from "@/components/ui/button";
import { Plus, Download, Eye, Edit, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue, 
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import DetailViewModal from "@/components/shared/DetailViewModal";
import EditModal from "@/components/shared/EditModal";
import { hostelsAPI, Hostel } from "@/lib/hostels-api";

// Mock data for mess management
interface MessItem {
  id: number;
  hostel_id: number;
  hostel_name: string;
  meal_type: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snacks';
  menu_items: string;
  serving_time: string;
  date: string;
  capacity: number;
  cost_per_person: number;
  total_cost: number;
  status: 'Active' | 'Inactive' | 'Planned';
}

const mockMessData: MessItem[] = [
  {
    id: 1,
    hostel_id: 1,
    hostel_name: "Sunrise Hostel",
    meal_type: "Breakfast",
    menu_items: "Toast, Eggs, Tea, Fruits",
    serving_time: "07:00 - 09:00",
    date: "2024-01-15",
    capacity: 50,
    cost_per_person: 150,
    total_cost: 7500,
    status: "Active"
  },
  {
    id: 2,
    hostel_id: 1,
    hostel_name: "Sunrise Hostel", 
    meal_type: "Lunch",
    menu_items: "Rice, Dal, Vegetables, Chapati",
    serving_time: "12:00 - 14:00",
    date: "2024-01-15",
    capacity: 60,
    cost_per_person: 250,
    total_cost: 15000,
    status: "Active"
  },
  {
    id: 3,
    hostel_id: 2,
    hostel_name: "Mountain View Hostel",
    meal_type: "Dinner",
    menu_items: "Chicken Curry, Rice, Salad",
    serving_time: "19:00 - 21:00",
    date: "2024-01-15",
    capacity: 40,
    cost_per_person: 300,
    total_cost: 12000,
    status: "Planned"
  }
];

const MessManagement = () => {
  const [selectedHostel, setSelectedHostel] = useState<string>("all");
  const [messData, setMessData] = useState<MessItem[]>(mockMessData);
  const [hostels, setHostels] = useState<Hostel[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [selectedMess, setSelectedMess] = useState<MessItem | null>(null);

  useEffect(() => {
    loadHostels();
    // Simulate loading
    setTimeout(() => setLoading(false), 1000);
  }, []);

  const loadHostels = async () => {
    try {
      const data = await hostelsAPI.getAll();
      setHostels(data);
    } catch (error) {
      console.error('Error loading hostels:', error);
      toast({
        title: "Error",
        description: "Failed to load hostels data.",
        variant: "destructive",
      });
    }
  };

  const filteredData = selectedHostel === "all" 
    ? messData
    : messData.filter(mess => mess.hostel_id.toString() === selectedHostel);

  const handleViewMess = (mess: MessItem) => {
    setSelectedMess(mess);
    setViewModalOpen(true);
  };

  const handleEditMess = (mess: MessItem) => {
    setSelectedMess(mess);
    setEditModalOpen(true);
  };

  const handleAddMess = () => {
    setAddModalOpen(true);
  };

  const handleDeleteMess = (id: number) => {
    setMessData(prev => prev.filter(mess => mess.id !== id));
    toast({
      title: "Mess Item Deleted",
      description: "The mess item has been deleted successfully.",
    });
  };

  const handleExport = () => {
    toast({
      title: "Feature Coming Soon",
      description: "Export functionality will be available shortly.",
    });
  };

  const columns = [
    { 
      header: "Hostel", 
      accessorKey: "hostel_name" as keyof MessItem
    },
    { header: "Meal Type", accessorKey: "meal_type" as keyof MessItem },
    { header: "Menu Items", accessorKey: "menu_items" as keyof MessItem },
    { header: "Serving Time", accessorKey: "serving_time" as keyof MessItem },
    { header: "Date", accessorKey: "date" as keyof MessItem },
    { 
      header: "Capacity", 
      accessorKey: "capacity" as keyof MessItem,
      cell: (row: MessItem) => `${row.capacity} persons`
    },
    { 
      header: "Cost/Person", 
      accessorKey: "cost_per_person" as keyof MessItem,
      cell: (row: MessItem) => `₹${row.cost_per_person}`
    },
    { 
      header: "Total Cost", 
      accessorKey: "total_cost" as keyof MessItem,
      cell: (row: MessItem) => `₹${row.total_cost.toLocaleString()}`
    },
    {
      header: "Status",
      accessorKey: "status" as keyof MessItem,
      cell: (row: MessItem) => (
        <Badge
          variant={
            row.status === "Active"
              ? "default"
              : row.status === "Planned"
              ? "secondary"
              : "outline"
          }
        >
          {row.status}
        </Badge>
      ),
    },
    {
      header: "Actions",
      accessorKey: "actions" as "actions",
      cell: (row: MessItem) => (
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleViewMess(row)}
          >
            <Eye className="mr-2 h-4 w-4" />
            View
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleEditMess(row)}
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleDeleteMess(row.id)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      ),
    },
  ];

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
        description="Manage hostel mess schedules, menus, and costs"
        actions={
          <>
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button variant="default" size="sm" onClick={handleAddMess}>
              <Plus className="mr-2 h-4 w-4" />
              Add Mess Item
            </Button>
          </>
        }
      />

      <div className="mb-6">
        <div className="flex gap-4">
          <Select 
            value={selectedHostel} 
            onValueChange={setSelectedHostel}
          >
            <SelectTrigger className="w-[250px]">
              <SelectValue placeholder="Select Hostel" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Hostels</SelectItem>
              {hostels.map(hostel => (
                <SelectItem key={hostel.id} value={hostel.id.toString()}>
                  {hostel.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-lg border bg-card shadow-sm">
        <DataTable columns={columns} data={filteredData} />
      </div>

      {/* View Modal */}
      {selectedMess && (
        <DetailViewModal
          title={`Mess Details - ${selectedMess.hostel_name}`}
          isOpen={viewModalOpen}
          onClose={() => setViewModalOpen(false)}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Hostel</p>
              <p className="text-lg">{selectedMess.hostel_name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Meal Type</p>
              <p className="text-lg">{selectedMess.meal_type}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Serving Time</p>
              <p className="text-lg">{selectedMess.serving_time}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Date</p>
              <p className="text-lg">{selectedMess.date}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Capacity</p>
              <p className="text-lg">{selectedMess.capacity} persons</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Cost per Person</p>
              <p className="text-lg">₹{selectedMess.cost_per_person}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Cost</p>
              <p className="text-lg">₹{selectedMess.total_cost.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Status</p>
              <Badge
                variant={
                  selectedMess.status === "Active"
                    ? "default"
                    : selectedMess.status === "Planned"
                    ? "secondary"
                    : "outline"
                }
              >
                {selectedMess.status}
              </Badge>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm font-medium text-muted-foreground">Menu Items</p>
              <p className="text-lg">{selectedMess.menu_items}</p>
            </div>
          </div>
        </DetailViewModal>
      )}

      {/* Add/Edit Modal Placeholder */}
      <EditModal
        title={selectedMess ? "Edit Mess Item" : "Add Mess Item"}
        isOpen={addModalOpen || editModalOpen}
        onClose={() => {
          setAddModalOpen(false);
          setEditModalOpen(false);
          setSelectedMess(null);
        }}
      >
        <div className="p-4 text-center">
          <p>Mess form will be implemented here.</p>
          <Button 
            onClick={() => {
              setAddModalOpen(false);
              setEditModalOpen(false);
              setSelectedMess(null);
            }}
            className="mt-4"
          >
            Close
          </Button>
        </div>
      </EditModal>
    </MainLayout>
  );
};

export default MessManagement;
