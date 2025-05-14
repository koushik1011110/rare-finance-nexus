
import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import PageHeader from "@/components/shared/PageHeader";
import DataTable from "@/components/ui/DataTable";
import { Button } from "@/components/ui/button";
import { FileText, Download, Plus, Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

// Sample data for direct students
const directStudentsData = [
  {
    id: "1",
    name: "John Smith",
    university: "London University",
    course: "Computer Science",
    totalFee: "$12,000",
    paidAmount: "$8,000",
    dueAmount: "$4,000",
    status: "Active",
  },
  {
    id: "2",
    name: "Emma Johnson",
    university: "Oxford University",
    course: "Business Administration",
    totalFee: "$15,000",
    paidAmount: "$7,500",
    dueAmount: "$7,500",
    status: "Active",
  },
  {
    id: "3",
    name: "Michael Brown",
    university: "Cambridge University",
    course: "Engineering",
    totalFee: "$14,000",
    paidAmount: "$14,000",
    dueAmount: "$0",
    status: "Completed",
  },
  {
    id: "4",
    name: "Sophia Williams",
    university: "Harvard University",
    course: "Medicine",
    totalFee: "$20,000",
    paidAmount: "$10,000",
    dueAmount: "$10,000",
    status: "Active",
  },
];

const columns = [
  { header: "Student Name", accessorKey: "name" },
  { header: "University", accessorKey: "university" },
  { header: "Course", accessorKey: "course" },
  { header: "Total Fee", accessorKey: "totalFee" },
  { header: "Paid Amount", accessorKey: "paidAmount" },
  { header: "Due Amount", accessorKey: "dueAmount" },
  {
    header: "Status",
    accessorKey: "status",
    cell: (row: any) => (
      <span
        className={`rounded-full px-2 py-1 text-xs font-medium ${
          row.status === "Active"
            ? "bg-blue-100 text-blue-800"
            : "bg-green-100 text-green-800"
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

const DirectStudents = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = directStudentsData.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.university.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.course.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddStudent = () => {
    toast({
      title: "Feature Coming Soon",
      description: "Add student functionality will be available shortly.",
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
        title="Direct Students"
        description="Manage all direct student records and financial information"
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
            <Button variant="default" size="sm" onClick={handleAddStudent}>
              <Plus className="mr-2 h-4 w-4" />
              Add Student
            </Button>
          </>
        }
      />

      <div className="mb-6">
        <Input
          placeholder="Search by name, university or course..."
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

export default DirectStudents;
