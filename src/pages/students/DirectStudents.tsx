
import React, { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import PageHeader from "@/components/shared/PageHeader";
import DataTable from "@/components/ui/DataTable";
import { Button } from "@/components/ui/button";
import { Plus, Download, Upload, Eye, Edit, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import DetailViewModal from "@/components/shared/DetailViewModal";
import EditModal from "@/components/shared/EditModal";
import SupabaseDirectStudentForm, { SupabaseDirectStudentFormData } from "@/components/forms/SupabaseDirectStudentForm";
import { studentsAPI, universitiesAPI, coursesAPI, academicSessionsAPI, Student } from "@/lib/supabase-database";

interface DirectStudentDisplay {
  id: number;
  name: string;
  course: string;
  phoneNumber: string;
  email: string;
  university: string;
  status: string;
  fatherName: string;
  motherName: string;
  dateOfBirth: string;
  academicSession: string;
  university_id: number;
  course_id: number;
  academic_session_id: number;
}

const DirectStudents = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [students, setStudents] = useState<DirectStudentDisplay[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentStudent, setCurrentStudent] = useState<DirectStudentDisplay | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      setLoading(true);
      const [studentsData, universities, courses, sessions] = await Promise.all([
        studentsAPI.getAll(),
        universitiesAPI.getAll(),
        coursesAPI.getAll(),
        academicSessionsAPI.getAll(),
      ]);

      const displayStudents: DirectStudentDisplay[] = studentsData.map((student: Student) => {
        const university = universities.find(u => u.id === student.university_id);
        const course = courses.find(c => c.id === student.course_id);
        const session = sessions.find(s => s.id === student.academic_session_id);

        return {
          id: student.id,
          name: `${student.first_name} ${student.last_name}`,
          course: course?.name || 'Unknown Course',
          phoneNumber: student.phone_number || '',
          email: student.email || '',
          university: university?.name || 'Unknown University',
          status: student.status,
          fatherName: student.father_name,
          motherName: student.mother_name,
          dateOfBirth: student.date_of_birth,
          academicSession: session?.session_name || 'Unknown Session',
          university_id: student.university_id,
          course_id: student.course_id,
          academic_session_id: student.academic_session_id,
        };
      });

      setStudents(displayStudents);
      toast({
        title: "Success",
        description: `Loaded ${displayStudents.length} students from database.`,
      });
    } catch (error) {
      console.error('Error loading students:', error);
      toast({
        title: "Error",
        description: "Failed to load students from database.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredData = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.university.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.phoneNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewStudent = (student: DirectStudentDisplay) => {
    setCurrentStudent(student);
    setIsViewModalOpen(true);
  };

  const handleEditStudent = (student: DirectStudentDisplay) => {
    setCurrentStudent(student);
    setIsEditModalOpen(true);
  };

  const handleDeleteStudent = async (student: DirectStudentDisplay) => {
    if (window.confirm(`Are you sure you want to delete ${student.name}?`)) {
      try {
        await studentsAPI.delete(student.id);
        toast({
          title: "Student Deleted",
          description: `${student.name} has been deleted successfully.`,
        });
        await loadStudents();
      } catch (error) {
        console.error('Error deleting student:', error);
        toast({
          title: "Error",
          description: "Failed to delete student.",
          variant: "destructive",
        });
      }
    }
  };

  const handleAddStudent = () => {
    setIsAddModalOpen(true);
  };

  const handleSaveStudent = async (formData: SupabaseDirectStudentFormData) => {
    setIsSubmitting(true);
    
    try {
      if (formData.id) {
        // Update existing student
        await studentsAPI.update(formData.id, formData);
        toast({
          title: "Student Updated",
          description: `${formData.first_name} ${formData.last_name} has been updated successfully.`,
        });
      } else {
        // Add new student
        const { id, ...studentData } = formData;
        await studentsAPI.create(studentData);
        toast({
          title: "Student Added",
          description: `${formData.first_name} ${formData.last_name} has been added successfully.`,
        });
      }

      await loadStudents();
      setIsAddModalOpen(false);
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Error saving student:', error);
      toast({
        title: "Error",
        description: "Failed to save student. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
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
    { header: "Course", accessorKey: "course" },
    { header: "Phone Number", accessorKey: "phoneNumber" },
    { header: "Email", accessorKey: "email" },
    { header: "University", accessorKey: "university" },
    {
      header: "Status",
      accessorKey: "status",
      cell: (row: any) => (
        <span
          className={`rounded-full px-2 py-1 text-xs font-medium ${
            row.status === "active"
              ? "bg-blue-100 text-blue-800"
              : row.status === "completed"
              ? "bg-green-100 text-green-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
        </span>
      ),
    },
    {
      header: "Actions",
      accessorKey: "actions",
      cell: (row: DirectStudentDisplay) => (
        <div className="flex space-x-1">
          <Button variant="outline" size="sm" onClick={() => handleViewStudent(row)}>
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleEditStudent(row)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleDeleteStudent(row)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <MainLayout>
        <PageHeader
          title="Direct Students"
          description="Loading students from Supabase..."
        />
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading students from database...</div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <PageHeader
        title="Direct Students"
        description={`Manage all direct student records (${students.length} students)`}
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
          placeholder="Search by name, course, university, email or phone..."
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
        onSave={() => {}}
      >
        <SupabaseDirectStudentForm 
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
              <h3 className="font-semibold">Course</h3>
              <p>{currentStudent.course}</p>
            </div>
            <div>
              <h3 className="font-semibold">University</h3>
              <p>{currentStudent.university}</p>
            </div>
            <div>
              <h3 className="font-semibold">Phone Number</h3>
              <p>{currentStudent.phoneNumber || "Not provided"}</p>
            </div>
            <div>
              <h3 className="font-semibold">Email</h3>
              <p>{currentStudent.email || "Not provided"}</p>
            </div>
            <div>
              <h3 className="font-semibold">Father's Name</h3>
              <p>{currentStudent.fatherName}</p>
            </div>
            <div>
              <h3 className="font-semibold">Mother's Name</h3>
              <p>{currentStudent.motherName}</p>
            </div>
            <div>
              <h3 className="font-semibold">Date of Birth</h3>
              <p>{currentStudent.dateOfBirth}</p>
            </div>
            <div>
              <h3 className="font-semibold">Academic Session</h3>
              <p>{currentStudent.academicSession}</p>
            </div>
            <div>
              <h3 className="font-semibold">Status</h3>
              <p className="capitalize">{currentStudent.status}</p>
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
          onSave={() => {}}
        >
          <SupabaseDirectStudentForm 
            initialData={{
              id: currentStudent.id,
              first_name: currentStudent.name.split(' ')[0],
              last_name: currentStudent.name.split(' ').slice(1).join(' '),
              father_name: currentStudent.fatherName,
              mother_name: currentStudent.motherName,
              date_of_birth: currentStudent.dateOfBirth,
              phone_number: currentStudent.phoneNumber,
              email: currentStudent.email,
              university_id: currentStudent.university_id,
              course_id: currentStudent.course_id,
              academic_session_id: currentStudent.academic_session_id,
              status: currentStudent.status as "active" | "inactive" | "completed",
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
