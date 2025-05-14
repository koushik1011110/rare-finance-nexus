
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

// Correctly typed columns
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
    cell: () => (
      <div className="flex space-x-2">
        <Button variant="outline" size="sm">
          View
        </Button>
        <Button variant="outline" size="sm">
          Edit
        </Button>
      </div>
    ),
  },
];

const HostelExpenses = () => {
  const [selectedUniversity, setSelectedUniversity] = useState<string>("all");
  
  const filteredData = selectedUniversity === "all" 
    ? hostelExpensesData
    : hostelExpensesData.filter(expense => 
        expense.university === selectedUniversity
      );

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
    </MainLayout>
  );
};

export default HostelExpenses;
