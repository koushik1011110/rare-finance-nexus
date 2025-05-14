
import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import PageHeader from "@/components/shared/PageHeader";
import DataTable from "@/components/ui/DataTable";
import { Button } from "@/components/ui/button";
import { Plus, Download, Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Sample data for office expenses
const officeExpensesData = [
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

const columns = [
  { header: "Office Location", accessorKey: "location" },
  { header: "Month", accessorKey: "month" },
  { header: "Rent", accessorKey: "rent" },
  { header: "Utilities", accessorKey: "utilities" },
  { header: "Internet", accessorKey: "internet" },
  { header: "Marketing", accessorKey: "marketing" },
  { header: "Travel", accessorKey: "travel" },
  { header: "Miscellaneous", accessorKey: "miscellaneous" },
  { header: "Monthly Total", accessorKey: "monthlyTotal" },
  {
    header: "Actions",
    accessorKey: "actions",
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

const OfficeExpenses = () => {
  const [selectedLocation, setSelectedLocation] = useState<string>("all");

  const filteredData =
    selectedLocation === "all"
      ? officeExpensesData
      : officeExpensesData.filter(
          (expense) => expense.location === selectedLocation
        );

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
    </MainLayout>
  );
};

export default OfficeExpenses;
