
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

// Define the type for hostel expenses data
interface HostelExpense {
  id: string;
  university: string;
  month: string;
  buildingRent: string;
  food: string;
  staffSalary: string;
  maintenance: string;
  furniture: string;
  otherCosts: string;
  monthlyTotal: string;
}

// Sample data for hostel expenses
const hostelExpensesData: HostelExpense[] = [
  {
    id: "1",
    university: "London University",
    month: "April 2025",
    buildingRent: "$5,000",
    food: "$3,500",
    staffSalary: "$2,800",
    maintenance: "$1,200",
    furniture: "$800",
    otherCosts: "$600",
    monthlyTotal: "$13,900",
  },
  {
    id: "2",
    university: "Oxford University",
    month: "April 2025",
    buildingRent: "$4,800",
    food: "$3,200",
    staffSalary: "$2,500",
    maintenance: "$900",
    furniture: "$0",
    otherCosts: "$500",
    monthlyTotal: "$11,900",
  },
  {
    id: "3",
    university: "Cambridge University",
    month: "April 2025",
    buildingRent: "$4,500",
    food: "$3,000",
    staffSalary: "$2,400",
    maintenance: "$1,000",
    furniture: "$1,200",
    otherCosts: "$400",
    monthlyTotal: "$12,500",
  },
  {
    id: "4",
    university: "London University",
    month: "March 2025",
    buildingRent: "$5,000",
    food: "$3,300",
    staffSalary: "$2,800",
    maintenance: "$800",
    furniture: "$0",
    otherCosts: "$500",
    monthlyTotal: "$12,400",
  },
];

const HostelExpenses = () => {
  const [selectedUniversity, setSelectedUniversity] = useState<string>("all");
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<HostelExpense | null>(null);
  const [editedExpense, setEditedExpense] = useState<HostelExpense | null>(null);
  
  const filteredData = selectedUniversity === "all" 
    ? hostelExpensesData
    : hostelExpensesData.filter(expense => 
        expense.university === selectedUniversity
      );

  const handleViewExpense = (expense: HostelExpense) => {
    setSelectedExpense(expense);
    setViewModalOpen(true);
  };

  const handleEditExpense = (expense: HostelExpense) => {
    setSelectedExpense(expense);
    setEditedExpense({...expense});
    setEditModalOpen(true);
  };

  const handleSaveEdit = () => {
    if (editedExpense) {
      // In a real application, you would update the data in your database here
      toast({
        title: "Changes Saved",
        description: `Hostel expense for ${editedExpense.university} has been updated.`,
      });
      setEditModalOpen(false);
    }
  };

  const handleAddExpense = () => {
    toast({
      title: "Feature Coming Soon",
      description: "Add hostel expense functionality will be available shortly.",
    });
  };

  const handleExport = () => {
    toast({
      title: "Feature Coming Soon",
      description: "Export functionality will be available shortly.",
    });
  };

  const universities = [...new Set(hostelExpensesData.map(item => item.university))];

  // Correctly typed columns with the actions column
  const columns = [
    { header: "University", accessorKey: "university" as const },
    { header: "Month", accessorKey: "month" as const },
    { header: "Building Rent", accessorKey: "buildingRent" as const },
    { header: "Food", accessorKey: "food" as const },
    { header: "Staff Salary", accessorKey: "staffSalary" as const },
    { header: "Maintenance", accessorKey: "maintenance" as const },
    { header: "Furniture", accessorKey: "furniture" as const },
    { header: "Other Costs", accessorKey: "otherCosts" as const },
    { header: "Monthly Total", accessorKey: "monthlyTotal" as const },
    {
      header: "Actions",
      accessorKey: "actions" as const,
      cell: (row: HostelExpense) => (
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
        title="Hostel Expenses"
        description="Track and manage all hostel-related expenses by university"
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
            value={selectedUniversity} 
            onValueChange={setSelectedUniversity}
          >
            <SelectTrigger className="w-[250px]">
              <SelectValue placeholder="Select University" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Universities</SelectItem>
              {universities.map(university => (
                <SelectItem key={university} value={university}>
                  {university}
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
          title={`Hostel Expense Details - ${selectedExpense.university}`}
          isOpen={viewModalOpen}
          onClose={() => setViewModalOpen(false)}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">University</p>
              <p className="text-lg">{selectedExpense.university}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Month</p>
              <p className="text-lg">{selectedExpense.month}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Building Rent</p>
              <p className="text-lg">{selectedExpense.buildingRent}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Food</p>
              <p className="text-lg">{selectedExpense.food}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Staff Salary</p>
              <p className="text-lg">{selectedExpense.staffSalary}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Maintenance</p>
              <p className="text-lg">{selectedExpense.maintenance}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Furniture</p>
              <p className="text-lg">{selectedExpense.furniture}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Other Costs</p>
              <p className="text-lg">{selectedExpense.otherCosts}</p>
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
          title={`Edit Hostel Expense - ${editedExpense.university}`}
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          onSave={handleSaveEdit}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="university">University</Label>
              <Input 
                id="university" 
                value={editedExpense.university} 
                onChange={(e) => setEditedExpense({...editedExpense, university: e.target.value})}
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
              <Label htmlFor="buildingRent">Building Rent</Label>
              <Input 
                id="buildingRent" 
                value={editedExpense.buildingRent} 
                onChange={(e) => setEditedExpense({...editedExpense, buildingRent: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="food">Food</Label>
              <Input 
                id="food" 
                value={editedExpense.food} 
                onChange={(e) => setEditedExpense({...editedExpense, food: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="staffSalary">Staff Salary</Label>
              <Input 
                id="staffSalary" 
                value={editedExpense.staffSalary} 
                onChange={(e) => setEditedExpense({...editedExpense, staffSalary: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maintenance">Maintenance</Label>
              <Input 
                id="maintenance" 
                value={editedExpense.maintenance} 
                onChange={(e) => setEditedExpense({...editedExpense, maintenance: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="furniture">Furniture</Label>
              <Input 
                id="furniture" 
                value={editedExpense.furniture} 
                onChange={(e) => setEditedExpense({...editedExpense, furniture: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="otherCosts">Other Costs</Label>
              <Input 
                id="otherCosts" 
                value={editedExpense.otherCosts} 
                onChange={(e) => setEditedExpense({...editedExpense, otherCosts: e.target.value})}
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
        </EditModal>
      )}
    </MainLayout>
  );
};

export default HostelExpenses;
