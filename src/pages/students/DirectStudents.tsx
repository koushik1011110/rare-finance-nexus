
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
import DirectStudentForm, { DirectStudentFormData } from "@/components/forms/DirectStudentForm";
import { studentAPI, universityAPI, courseAPI, academicSessionAPI, Student } from "@/lib/database";

interface DirectStudentDisplay {
  id: string;
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
      console.log('Loading students from database...');
      const studentsData = await studentAPI.getAll();
      const universities = await universityAPI.getAll();
      const courses = await courseAPI.getAll();
      const sessions = await academicSessionAPI.getAll();

      // Transform data for display
      const displayStudents: DirectStudentDisplay[] = studentsData.map((student: Student) => {
        const university = universities.find(u => u.id === student.university_id);
        const course = courses.find(c => c.id === student.course_id);
        const session = sessions.find(s => s.id === student.academic_session_id);

        return {
          id: student.id.toString(),
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
        };
      });

      setStudents(displayStudents);
      console.log('Students loaded successfully:', displayStudents.length);
    } catch (error) {
      console.error('Error loading students:', error);
      toast({
        title: "Error",
        description: "Failed to load students. Using fallback data.",
        variant: "destructive",
      });
      
      // Fallback data for development
      setStudents([
        {
          id: "1",
          name: "John Smith",
          course: "MBBS",
          phoneNumber: "+1234567890",
          email: "john.smith@email.com",
          university: "Tashkent State Medical University",
          status: "active",
          fatherName: "Robert Smith",
          motherName: "Mary Smith",
          dateOfBirth: "2000-01-15",
          academicSession: "2025-26",
        },
        {
          id: "2",
          name: "Emma Johnson",
          course: "BDS",
          phoneNumber: "+1234567891",
          email: "emma.johnson@email.com",
          university: "Samarkand State Medical University",
          status: "active",
          fatherName: "David Johnson",
          motherName: "Sarah Johnson",
          dateOfBirth: "1999-08-22",
          academicSession: "2025-26",
        },
      ]);
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

  const handleAddStudent = () => {
    setIsAddModalOpen(true);
  };

  const handleSaveStudent = async (formData: DirectStudentFormData) => {
    setIsSubmitting(true);
    
    try {
      console.log('Saving student:', formData);
      
      const studentData = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        father_name: formData.fatherName,
        mother_name: formData.motherName,
        date_of_birth: formData.dateOfBirth,
        phone_number: formData.phoneNumber,
        email: formData.email,
        university_id: parseInt(formData.universityId),
        course_id: parseInt(formData.courseId),
        academic_session_id: parseInt(formData.academicSessionId),
        status: formData.status,
      };

      if (formData.id) {
        // Update existing student
        await studentAPI.update(parseInt(formData.id), studentData);
        
        toast({
          title: "Student Updated",
          description: `${formData.firstName} ${formData.lastName} has been updated successfully.`,
        });
      } else {
        // Add new student
        await studentAPI.create(studentData);
        
        toast({
          title: "Student Added",
          description: `${formData.firstName} ${formData.lastName} has been added successfully.`,
        });
      }

      // Reload students list
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

  if (loading) {
    return (
      <MainLayout>
        <PageHeader
          title="Direct Students"
          description="Loading students..."
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
        description="Manage all direct student records"
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
          onSave={() => {}} // Form has its own submit handler
        >
          <DirectStudentForm 
            initialData={{
              id: currentStudent.id,
              firstName: currentStudent.name.split(' ')[0],
              lastName: currentStudent.name.split(' ').slice(1).join(' '),
              fatherName: currentStudent.fatherName,
              motherName: currentStudent.motherName,
              dateOfBirth: currentStudent.dateOfBirth,
              phoneNumber: currentStudent.phoneNumber,
              email: currentStudent.email,
              universityId: "1", // This should be mapped from the database
              courseId: "1", // This should be mapped from the database
              academicSessionId: "1", // This should be mapped from the database
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
