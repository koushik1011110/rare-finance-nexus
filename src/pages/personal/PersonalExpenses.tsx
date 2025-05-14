
import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import PageHeader from "@/components/shared/PageHeader";
import DataTable from "@/components/ui/DataTable";
import { Button } from "@/components/ui/button";
import { Plus, Download, Upload, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Sample data for personal expenses
const personalExpensesData = [
  {
    id: "1",
    date: "2025-04-15",
    category: "Travel",
    amount: "$350",
    description: "Flight to London for university meeting",
    paymentMode: "Credit Card",
    hasReceipt: true,
  },
  {
    id: "2",
    date: "2025-04-12",
    category: "Shopping",
    amount: "$120",
    description: "Office supplies for personal use",
    paymentMode: "Debit Card",
    hasReceipt: true,
  },
  {
    id: "3",
    date: "2025-04-10",
    category: "Bills",
    amount: "$200",
    description: "Monthly internet and phone bill",
    paymentMode: "Bank Transfer",
    hasReceipt: true,
  },
  {
    id: "4",
    date: "2025-04-05",
    category: "Investment",
    amount: "$1,000",
    description: "Monthly investment in mutual funds",
    paymentMode: "Bank Transfer",
    hasReceipt: false,
  },
  {
    id: "5",
    date: "2025-04-02",
    category: "Travel",
    amount: "$75",
    description: "Taxi fares for client meetings",
    paymentMode: "Cash",
    hasReceipt: true,
  },
];

const columns = [
  { header: "Date", accessorKey: "date" },
  { header: "Category", accessorKey: "category" },
  { header: "Amount", accessorKey: "amount" },
  { header: "Description", accessorKey: "description" },
  { header: "Payment Mode", accessorKey: "paymentMode" },
  {
    header: "Receipt",
    accessorKey: "hasReceipt",
    cell: (row: any) => (
      <span
        className={`rounded-full px-2 py-1 text-xs font-medium ${
          row.hasReceipt
            ? "bg-green-100 text-green-800"
            : "bg-gray-100 text-gray-800"
        }`}
      >
        {row.hasReceipt ? "Available" : "Not Available"}
      </span>
    ),
  },
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

const PersonalExpenses = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const filteredData =
    selectedCategory === "all"
      ? personalExpensesData
      : personalExpensesData.filter(
          (expense) => expense.category === selectedCategory
        );

  const handleAddExpense = () => {
    toast({
      title: "Feature Coming Soon",
      description: "Add personal expense functionality will be available shortly.",
    });
  };

  const handleExport = () => {
    toast({
      title: "Feature Coming Soon",
      description: "Export functionality will be available shortly.",
    });
  };

  const categories = [...new Set(personalExpensesData.map((item) => item.category))];

  return (
    <MainLayout>
      <PageHeader
        title="Personal Expense Tracker"
        description="Track and manage your personal expenses by category"
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
            value={selectedCategory}
            onValueChange={setSelectedCategory}
          >
            <SelectTrigger className="w-[250px]">
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
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

export default PersonalExpenses;
