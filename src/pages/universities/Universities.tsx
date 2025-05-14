
import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import PageHeader from "@/components/shared/PageHeader";
import DataTable from "@/components/ui/DataTable";
import { Button } from "@/components/ui/button";
import { Plus, Download, Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

// Sample data for universities
const universitiesData = [
  {
    id: "1",
    name: "London University",
    studentCount: 25,
    totalFeesExpected: "$300,000",
    amountPaid: "$220,000",
    amountPending: "$80,000",
    lastPayment: "2025-04-15",
    status: "Active",
  },
  {
    id: "2",
    name: "Oxford University",
    studentCount: 18,
    totalFeesExpected: "$270,000",
    amountPaid: "$180,000",
    amountPending: "$90,000",
    lastPayment: "2025-04-10",
    status: "Active",
  },
  {
    id: "3",
    name: "Cambridge University",
    studentCount: 15,
    totalFeesExpected: "$225,000",
    amountPaid: "$225,000",
    amountPending: "$0",
    lastPayment: "2025-04-05",
    status: "Paid",
  },
  {
    id: "4",
    name: "Harvard University",
    studentCount: 10,
    totalFeesExpected: "$200,000",
    amountPaid: "$120,000",
    amountPending: "$80,000",
    lastPayment: "2025-03-28",
    status: "Active",
  },
];

const columns = [
  { header: "University Name", accessorKey: "name" },
  { header: "Student Count", accessorKey: "studentCount" },
  { header: "Total Fees Expected", accessorKey: "totalFeesExpected" },
  { header: "Amount Paid", accessorKey: "amountPaid" },
  { header: "Amount Pending", accessorKey: "amountPending" },
  { header: "Last Payment", accessorKey: "lastPayment" },
  {
    header: "Status",
    accessorKey: "status",
    cell: (row: any) => (
      <span
        className={`rounded-full px-2 py-1 text-xs font-medium ${
          row.status === "Paid"
            ? "bg-green-100 text-green-800"
            : "bg-blue-100 text-blue-800"
        }`}
      >
        {row.status}
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

const Universities = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = universitiesData.filter(
    (university) =>
      university.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddUniversity = () => {
    toast({
      title: "Feature Coming Soon",
      description: "Add university functionality will be available shortly.",
    });
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

  return (
    <MainLayout>
      <PageHeader
        title="University Management"
        description="Track university fees, payments, and student records"
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
            <Button variant="default" size="sm" onClick={handleAddUniversity}>
              <Plus className="mr-2 h-4 w-4" />
              Add University
            </Button>
          </>
        }
      />

      <div className="mb-6">
        <Input
          placeholder="Search by university name..."
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

export default Universities;
