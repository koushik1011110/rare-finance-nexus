
import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import PageHeader from "@/components/shared/PageHeader";
import DataTable from "@/components/ui/DataTable";
import { Button } from "@/components/ui/button";
import { Plus, Download, Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

// Sample data for salary management
const salaryData = [
  {
    id: "1",
    name: "John Smith",
    role: "Regional Manager",
    baseSalary: "$4,500",
    bonus: "$500",
    deductions: "$200",
    netSalary: "$4,800",
    paymentStatus: "Paid",
    paymentMode: "Bank Transfer",
    paymentDate: "2025-04-01",
  },
  {
    id: "2",
    name: "Emma Johnson",
    role: "Senior Counselor",
    baseSalary: "$3,800",
    bonus: "$300",
    deductions: "$150",
    netSalary: "$3,950",
    paymentStatus: "Paid",
    paymentMode: "Bank Transfer",
    paymentDate: "2025-04-01",
  },
  {
    id: "3",
    name: "Michael Brown",
    role: "Counselor",
    baseSalary: "$3,200",
    bonus: "$0",
    deductions: "$120",
    netSalary: "$3,080",
    paymentStatus: "Pending",
    paymentMode: "N/A",
    paymentDate: "N/A",
  },
  {
    id: "4",
    name: "Sophie Williams",
    role: "Admin Assistant",
    baseSalary: "$2,800",
    bonus: "$200",
    deductions: "$100",
    netSalary: "$2,900",
    paymentStatus: "Paid",
    paymentMode: "Bank Transfer",
    paymentDate: "2025-04-01",
  },
];

const columns = [
  { header: "Staff Name", accessorKey: "name" },
  { header: "Role", accessorKey: "role" },
  { header: "Base Salary", accessorKey: "baseSalary" },
  { header: "Bonus", accessorKey: "bonus" },
  { header: "Deductions", accessorKey: "deductions" },
  { header: "Net Salary", accessorKey: "netSalary" },
  {
    header: "Payment Status",
    accessorKey: "paymentStatus",
    cell: (row: any) => (
      <span
        className={`rounded-full px-2 py-1 text-xs font-medium ${
          row.paymentStatus === "Paid"
            ? "bg-green-100 text-green-800"
            : "bg-yellow-100 text-yellow-800"
        }`}
      >
        {row.paymentStatus}
      </span>
    ),
  },
  { header: "Payment Mode", accessorKey: "paymentMode" },
  { header: "Payment Date", accessorKey: "paymentDate" },
  {
    header: "Actions",
    accessorKey: "actions",
    cell: (row: any) => (
      <div className="flex space-x-2">
        <Button variant="outline" size="sm">
          View
        </Button>
        <Button variant="outline" size="sm">
          {row.paymentStatus === "Pending" ? "Pay Now" : "Edit"}
        </Button>
      </div>
    ),
  },
];

const SalaryManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = salaryData.filter(
    (staff) =>
      staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddStaff = () => {
    toast({
      title: "Feature Coming Soon",
      description: "Add staff functionality will be available shortly.",
    });
  };

  const handleExport = () => {
    toast({
      title: "Feature Coming Soon",
      description: "Export functionality will be available shortly.",
    });
  };

  return (
    <MainLayout>
      <PageHeader
        title="Salary Management"
        description="Manage staff salaries, bonuses, deductions, and payment history"
        actions={
          <>
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button variant="default" size="sm" onClick={handleAddStaff}>
              <Plus className="mr-2 h-4 w-4" />
              Add Staff
            </Button>
          </>
        }
      />

      <div className="mb-6">
        <Input
          placeholder="Search by name or role..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="rounded-lg border bg-card shadow-sm">
        <DataTable columns={columns} data={filteredData} />
      </div>
    </MainLayout>
  );
};

export default SalaryManagement;
