import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import PageHeader from "@/components/shared/PageHeader";
import DataTable from "@/components/ui/DataTable";
import { Button } from "@/components/ui/button";
import { Plus, Download } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DetailViewModal from "@/components/shared/DetailViewModal";
import EditModal from "@/components/shared/EditModal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Define the type for office expenses data
interface OfficeExpense {
  id: string;
  location: string;
  month: string;
  rent: string;
  utilities: string;
  internet: string;
  marketing: string;
  travel: string;
  miscellaneous: string;
  monthlyTotal: string;
}

// Sample data for office expenses
const officeExpensesData: OfficeExpense[] = [
  {
    id: "1",
    location: "London Office",
    month: "April 2025",
    rent: "$3,500",
    utilities: "$800",
    internet: "$250",
    marketing: "$1,800",
    travel: "$600",
    miscellaneous: "$400",
    monthlyTotal: "$7,350",
  },
  {
    id: "2",
    location: "Manchester Office",
    month: "April 2025",
    rent: "$2,800",
    utilities: "$650",
    internet: "$200",
    marketing: "$1,200",
    travel: "$500",
    miscellaneous: "$350",
    monthlyTotal: "$5,700",
  },
  {
    id: "3",
    location: "Birmingham Office",
    month: "April 2025",
    rent: "$2,200",
    utilities: "$550",
    internet: "$180",
    marketing: "$1,000",
    travel: "$400",
    miscellaneous: "$300",
    monthlyTotal: "$4,630",
  },
  {
    id: "4",
    location: "London Office",
    month: "March 2025",
    rent: "$3,500",
    utilities: "$750",
    internet: "$250",
    marketing: "$2,000",
    travel: "$700",
    miscellaneous: "$350",
    monthlyTotal: "$7,550",
  },
];

const OfficeExpenses = () => {
  const [selectedLocation, setSelectedLocation] = useState<string>("all");
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<OfficeExpense | null>(null);
  const [editedExpense, setEditedExpense] = useState<OfficeExpense | null>(null);

  const filteredData =
    selectedLocation === "all"
      ? officeExpensesData
      : officeExpensesData.filter(
          (expense) => expense.location === selectedLocation
        );

  const handleViewExpense = (expense: OfficeExpense) => {
    setSelectedExpense(expense);
    setViewModalOpen(true);
  };

  const handleEditExpense = (expense: OfficeExpense) => {
    setSelectedExpense(expense);
    setEditedExpense({...expense});
    setEditModalOpen(true);
  };

  const handleSaveEdit = () => {
    if (editedExpense) {
      // In a real application, you would update the data in your database here
      toast({
        title: "Changes Saved",
        description: `Office expense for ${editedExpense.location} has been updated.`,
      });
      setEditModalOpen(false);
    }
  };

  const handleAddExpense = () => {
    toast({
      title: "Feature Coming Soon",
      description: "Add office expense functionality will be available shortly.",
    });
  };

  const handleExport = () => {
    toast({
      title: "Feature Coming Soon",
      description: "Export functionality will be available shortly.",
    });
  };

  const locations = [...new Set(officeExpensesData.map((item) => item.location))];

  // Correctly typed columns with the actions column
  const columns = [
    { header: "Office Location", accessorKey: "location" as const },
    { header: "Month", accessorKey: "month" as const },
    { header: "Rent", accessorKey: "rent" as const },
    { header: "Utilities", accessorKey: "utilities" as const },
    { header: "Internet", accessorKey: "internet" as const },
    { header: "Marketing", accessorKey: "marketing" as const },
    { header: "Travel", accessorKey: "travel" as const },
    { header: "Miscellaneous", accessorKey: "miscellaneous" as const },
    { header: "Monthly Total", accessorKey: "monthlyTotal" as const },
    {
      header: "Actions",
      accessorKey: "actions" as const,
      cell: (row: OfficeExpense) => (
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleViewExpense(row)}
          >
            View
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleEditExpense(row)}
          >
            Edit
          </Button>
        </div>
      ),
    },
  ];

  return (
    <MainLayout>
      <PageHeader
        title="Office Expenses"
        description="Track and manage all office-related expenses by location"
        actions={
          <>
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button variant="default" size="sm" onClick={handleAddExpense}>
              <Plus className="mr-2 h-4 w-4" />
              Add Expense
            </Button>
          </>
        }
      />

      <div className="mb-6">
        <div className="flex gap-4">
          <Select
            value={selectedLocation}
            onValueChange={setSelectedLocation}
          >
            <SelectTrigger className="w-[250px]">
              <SelectValue placeholder="Select Office Location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              {locations.map((location) => (
                <SelectItem key={location} value={location}>
                  {location}
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
      {selectedExpense && (
        <DetailViewModal
          title={`Office Expense Details - ${selectedExpense.location}`}
          isOpen={viewModalOpen}
          onClose={() => setViewModalOpen(false)}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Office Location</p>
              <p className="text-lg">{selectedExpense.location}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Month</p>
              <p className="text-lg">{selectedExpense.month}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Rent</p>
              <p className="text-lg">{selectedExpense.rent}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Utilities</p>
              <p className="text-lg">{selectedExpense.utilities}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Internet</p>
              <p className="text-lg">{selectedExpense.internet}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Marketing</p>
              <p className="text-lg">{selectedExpense.marketing}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Travel</p>
              <p className="text-lg">{selectedExpense.travel}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Miscellaneous</p>
              <p className="text-lg">{selectedExpense.miscellaneous}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Monthly Total</p>
              <p className="text-lg font-bold">{selectedExpense.monthlyTotal}</p>
            </div>
          </div>
        </DetailViewModal>
      )}

      {/* Edit Modal */}
      {editedExpense && (
        <EditModal
          title={`Edit Office Expense - ${editedExpense.location}`}
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Office Location</Label>
              <Input 
                id="location" 
                value={editedExpense.location} 
                onChange={(e) => setEditedExpense({...editedExpense, location: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="month">Month</Label>
              <Input 
                id="month" 
                value={editedExpense.month} 
                onChange={(e) => setEditedExpense({...editedExpense, month: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rent">Rent</Label>
              <Input 
                id="rent" 
                value={editedExpense.rent} 
                onChange={(e) => setEditedExpense({...editedExpense, rent: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="utilities">Utilities</Label>
              <Input 
                id="utilities" 
                value={editedExpense.utilities} 
                onChange={(e) => setEditedExpense({...editedExpense, utilities: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="internet">Internet</Label>
              <Input 
                id="internet" 
                value={editedExpense.internet} 
                onChange={(e) => setEditedExpense({...editedExpense, internet: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="marketing">Marketing</Label>
              <Input 
                id="marketing" 
                value={editedExpense.marketing} 
                onChange={(e) => setEditedExpense({...editedExpense, marketing: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="travel">Travel</Label>
              <Input 
                id="travel" 
                value={editedExpense.travel} 
                onChange={(e) => setEditedExpense({...editedExpense, travel: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="miscellaneous">Miscellaneous</Label>
              <Input 
                id="miscellaneous" 
                value={editedExpense.miscellaneous} 
                onChange={(e) => setEditedExpense({...editedExpense, miscellaneous: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="monthlyTotal">Monthly Total</Label>
              <Input 
                id="monthlyTotal" 
                value={editedExpense.monthlyTotal} 
                onChange={(e) => setEditedExpense({...editedExpense, monthlyTotal: e.target.value})}
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => setEditModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit}>
              Save Changes
            </Button>
          </div>
        </EditModal>
      )}
    </MainLayout>
  );
};

export default OfficeExpenses;
