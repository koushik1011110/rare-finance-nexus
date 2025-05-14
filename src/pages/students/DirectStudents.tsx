
import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import PageHeader from "@/components/shared/PageHeader";
import DataTable from "@/components/ui/DataTable";
import { Button } from "@/components/ui/button";
import { Plus, Download, Upload, Eye, Edit } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import DetailViewModal from "@/components/shared/DetailViewModal";
import EditModal from "@/components/shared/EditModal";
import DirectStudentForm, { DirectStudentFormData } from "@/components/forms/DirectStudentForm";

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
    remarks: "Scholarship pending approval",
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
    remarks: "",
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
    remarks: "Graduated with honors",
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
    remarks: "Second year student",
  },
];

interface DirectStudent {
  id: string;
  name: string;
  university: string;
  course: string;
  totalFee: string;
  paidAmount: string;
  dueAmount: string;
  status: string;
  remarks?: string;
}

const DirectStudents = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [students, setStudents] = useState<DirectStudent[]>(directStudentsData);
  
  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentStudent, setCurrentStudent] = useState<DirectStudent | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredData = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.university.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.course.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewStudent = (student: DirectStudent) => {
    setCurrentStudent(student);
    setIsViewModalOpen(true);
  };

  const handleEditStudent = (student: DirectStudent) => {
    setCurrentStudent(student);
    setIsEditModalOpen(true);
  };

  const handleAddStudent = () => {
    setIsAddModalOpen(true);
  };

  const handleSaveStudent = (formData: DirectStudentFormData) => {
    setIsSubmitting(true);
    
    // Simulating API call
    setTimeout(() => {
      if (formData.id) {
        // Update existing student
        setStudents(
          students.map((student) =>
            student.id === formData.id
              ? {
                  ...student,
                  name: formData.name,
                  university: formData.university,
                  course: formData.course,
                  totalFee: formData.totalFee,
                  paidAmount: formData.paidAmount,
                  dueAmount: formData.dueAmount,
                  status: formData.status,
                  remarks: formData.remarks,
                }
              : student
          )
        );
        
        toast({
          title: "Student Updated",
          description: `${formData.name} has been updated successfully.`,
        });
      } else {
        // Add new student
        const newStudent: DirectStudent = {
          id: Date.now().toString(),
          name: formData.name,
          university: formData.university,
          course: formData.course,
          totalFee: formData.totalFee,
          paidAmount: formData.paidAmount,
          dueAmount: formData.dueAmount,
          status: formData.status,
          remarks: formData.remarks,
        };
        
        setStudents([newStudent, ...students]);
        
        toast({
          title: "Student Added",
          description: `${formData.name} has been added successfully.`,
        });
      }
      
      setIsSubmitting(false);
      setIsAddModalOpen(false);
      setIsEditModalOpen(false);
    }, 1000);
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
      cell: (row: DirectStudent) => (
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={() => handleViewStudent(row)}>
            <Eye className="mr-2 h-4 w-4" />
            View
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleEditStudent(row)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
        </div>
      ),
    },
  ];

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
      
      {/* Add Student Modal */}
      <EditModal
        title="Add New Student"
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={() => {}} // Form has its own submit handler
      >
        <DirectStudentForm 
          onSubmit={handleSaveStudent}
          isSubmitting={isSubmitting}
        />
      </EditModal>
      
      {/* View Student Modal */}
      {currentStudent && (
        <DetailViewModal
          title={`Student: ${currentStudent.name}`}
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <h3 className="font-semibold">Student Name</h3>
              <p>{currentStudent.name}</p>
            </div>
            <div>
              <h3 className="font-semibold">University</h3>
              <p>{currentStudent.university}</p>
            </div>
            <div>
              <h3 className="font-semibold">Course</h3>
              <p>{currentStudent.course}</p>
            </div>
            <div>
              <h3 className="font-semibold">Total Fee</h3>
              <p>{currentStudent.totalFee}</p>
            </div>
            <div>
              <h3 className="font-semibold">Paid Amount</h3>
              <p>{currentStudent.paidAmount}</p>
            </div>
            <div>
              <h3 className="font-semibold">Due Amount</h3>
              <p>{currentStudent.dueAmount}</p>
            </div>
            <div>
              <h3 className="font-semibold">Status</h3>
              <p>{currentStudent.status}</p>
            </div>
            <div className="col-span-2">
              <h3 className="font-semibold">Remarks</h3>
              <p>{currentStudent.remarks || "No remarks"}</p>
            </div>
          </div>
        </DetailViewModal>
      )}
      
      {/* Edit Student Modal */}
      {currentStudent && (
        <EditModal
          title={`Edit Student: ${currentStudent.name}`}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSave={() => {}} // Form has its own submit handler
        >
          <DirectStudentForm 
            initialData={{
              id: currentStudent.id,
              name: currentStudent.name,
              university: currentStudent.university,
              course: currentStudent.course,
              totalFee: currentStudent.totalFee,
              paidAmount: currentStudent.paidAmount,
              dueAmount: currentStudent.dueAmount,
              status: currentStudent.status as "Active" | "Completed" | "Inactive",
              remarks: currentStudent.remarks,
            }}
            onSubmit={handleSaveStudent}
            isSubmitting={isSubmitting}
          />
        </EditModal>
      )}
    </MainLayout>
  );
};

export default DirectStudents;
