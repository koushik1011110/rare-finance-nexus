
import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import PageHeader from "@/components/shared/PageHeader";
import DataTable from "@/components/ui/DataTable";
import { Button } from "@/components/ui/button";
import { FileText, Download, Plus, Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

// Sample data for agent students
const agentStudentsData = [
  {
    id: "1",
    studentName: "David Lee",
    agentName: "Global Education",
    university: "London University",
    course: "Data Science",
    totalFee: "$13,500",
    paidAmount: "$9,000",
    dueAmount: "$4,500",
    commission: "$1,350",
    commissionDue: "$450",
    status: "Active",
  },
  {
    id: "2",
    studentName: "Aisha Khan",
    agentName: "Academic Horizon",
    university: "Oxford University",
    course: "International Business",
    totalFee: "$15,000",
    paidAmount: "$7,500",
    dueAmount: "$7,500",
    commission: "$1,500",
    commissionDue: "$750",
    status: "Active",
  },
  {
    id: "3",
    studentName: "Carlos Rodriguez",
    agentName: "Global Education",
    university: "Cambridge University",
    course: "Civil Engineering",
    totalFee: "$14,000",
    paidAmount: "$14,000",
    dueAmount: "$0",
    commission: "$1,400",
    commissionDue: "$0",
    status: "Completed",
  },
];

const columns = [
  { header: "Student Name", accessorKey: "studentName" },
  { header: "Agent Name", accessorKey: "agentName" },
  { header: "University", accessorKey: "university" },
  { header: "Course", accessorKey: "course" },
  { header: "Total Fee", accessorKey: "totalFee" },
  { header: "Paid Amount", accessorKey: "paidAmount" },
  { header: "Due Amount", accessorKey: "dueAmount" },
  { header: "Commission", accessorKey: "commission" },
  { header: "Commission Due", accessorKey: "commissionDue" },
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

const AgentStudents = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = agentStudentsData.filter(
    (student) =>
      student.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.agentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
        title="Agent Students"
        description="Manage all agent-referred student records and commissions"
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
          placeholder="Search by student name, agent, university or course..."
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

export default AgentStudents;
