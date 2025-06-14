import React, { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import PageHeader from "@/components/shared/PageHeader";
import DataTable from "@/components/ui/DataTable";
import { Button } from "@/components/ui/button";
import { Plus, Download, Upload, Eye, Edit } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import DetailViewModal from "@/components/shared/DetailViewModal";
import EditModal from "@/components/shared/EditModal";
import AgentStudentForm, { AgentStudentFormData } from "@/components/forms/AgentStudentForm";
import { useAuth } from "@/contexts/AuthContext";

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
    remarks: "Visa approved",
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
    remarks: "",
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
    remarks: "Graduated with distinction",
  },
];

interface AgentStudent {
  id: string;
  studentName: string;
  agentName: string;
  university: string;
  course: string;
  totalFee: string;
  paidAmount: string;
  dueAmount: string;
  commission: string;
  commissionDue: string;
  status: string;
  remarks?: string;
}

const AgentStudents = () => {
  const { user, isAdmin } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [students, setStudents] = useState<AgentStudent[]>([]);
  
  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentStudent, setCurrentStudent] = useState<AgentStudent | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load agent students data
  useEffect(() => {
    loadStudents();
  }, [user]);

  const loadStudents = () => {
    if (!user) return;
    
    let filteredData = agentStudentsData;
    
    // Filter based on user role
    if (user.role === 'agent' && user.email) {
      // If user is an agent, only show students added by them
      filteredData = agentStudentsData.filter(student => 
        student.agentName === getAgentNameByEmail(user.email)
      );
    }
    // If user is admin, show all students (no filtering needed)
    
    setStudents(filteredData);
  };

  const getAgentNameByEmail = (email: string): string => {
    // Map emails to agent names - in a real app this would come from the agents table
    const emailToAgentMap: { [key: string]: string } = {
      'admin@rareeducation.com': 'Global Education', // For demo purposes
    };
    
    return emailToAgentMap[email] || 'Unknown Agent';
  };

  const filteredData = students.filter(
    (student) =>
      student.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.agentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.university.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.course.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewStudent = (student: AgentStudent) => {
    setCurrentStudent(student);
    setIsViewModalOpen(true);
  };

  const handleEditStudent = (student: AgentStudent) => {
    setCurrentStudent(student);
    setIsEditModalOpen(true);
  };

  const handleAddStudent = () => {
    setIsAddModalOpen(true);
  };

  const handleSaveStudent = (formData: AgentStudentFormData) => {
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
                  studentName: formData.studentName,
                  agentName: formData.agentName,
                  university: formData.university,
                  course: formData.course,
                  totalFee: formData.totalFee,
                  paidAmount: formData.paidAmount,
                  dueAmount: formData.dueAmount,
                  commission: formData.commission,
                  commissionDue: formData.commissionDue,
                  status: formData.status,
                  remarks: formData.remarks,
                }
              : student
          )
        );
        
        toast({
          title: "Student Updated",
          description: `${formData.studentName} has been updated successfully.`,
        });
      } else {
        // Add new student
        const newStudent: AgentStudent = {
          id: Date.now().toString(),
          studentName: formData.studentName,
          agentName: formData.agentName,
          university: formData.university,
          course: formData.course,
          totalFee: formData.totalFee,
          paidAmount: formData.paidAmount,
          dueAmount: formData.dueAmount,
          commission: formData.commission,
          commissionDue: formData.commissionDue,
          status: formData.status,
          remarks: formData.remarks,
        };
        
        setStudents([newStudent, ...students]);
        
        toast({
          title: "Student Added",
          description: `${formData.studentName} has been added successfully.`,
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
      cell: (row: AgentStudent) => (
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={() => handleViewStudent(row)}>
            <Eye className="mr-2 h-4 w-4" />
            View
          </Button>
          {(isAdmin || (user?.role === 'agent' && row.agentName === getAgentNameByEmail(user.email || ''))) && (
            <Button variant="outline" size="sm" onClick={() => handleEditStudent(row)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <MainLayout>
      <PageHeader
        title={user?.role === 'agent' ? "My Students" : "Agent Students"}
        description={
          user?.role === 'agent' 
            ? "Manage your referred student records and commissions" 
            : "Manage all agent-referred student records and commissions"
        }
        actions={
          <>
            {isAdmin && (
              <>
                <Button variant="outline" size="sm" onClick={handleImport}>
                  <Upload className="mr-2 h-4 w-4" />
                  Import
                </Button>
                <Button variant="outline" size="sm" onClick={handleExport}>
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </>
            )}
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
      
      {/* Add Student Modal */}
      <EditModal
        title="Add New Agent Student"
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      >
        <AgentStudentForm 
          agentName="General Agent"
          onSubmit={handleSaveStudent}
          isSubmitting={isSubmitting}
        />
      </EditModal>
      
      {/* View Student Modal */}
      {currentStudent && (
        <DetailViewModal
          title={`Student: ${currentStudent.studentName}`}
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <h3 className="font-semibold">Student Name</h3>
              <p>{currentStudent.studentName}</p>
            </div>
            <div>
              <h3 className="font-semibold">Agent Name</h3>
              <p>{currentStudent.agentName}</p>
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
              <h3 className="font-semibold">Commission</h3>
              <p>{currentStudent.commission}</p>
            </div>
            <div>
              <h3 className="font-semibold">Commission Due</h3>
              <p>{currentStudent.commissionDue}</p>
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
          title={`Edit Student: ${currentStudent.studentName}`}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
        >
          <AgentStudentForm 
            agentName={currentStudent.agentName}
            initialData={{
              id: currentStudent.id,
              studentName: currentStudent.studentName,
              agentName: currentStudent.agentName,
              university: currentStudent.university,
              course: currentStudent.course,
              totalFee: currentStudent.totalFee,
              paidAmount: currentStudent.paidAmount,
              dueAmount: currentStudent.dueAmount,
              commission: currentStudent.commission,
              commissionDue: currentStudent.commissionDue,
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

export default AgentStudents;
