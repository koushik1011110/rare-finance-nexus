
import React, { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import PageHeader from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import DataTable, { Column } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useNavigate } from 'react-router-dom';
import EditModal from "@/components/shared/EditModal";
import ComprehensiveStudentForm, { ComprehensiveStudentFormData } from "@/components/forms/ComprehensiveStudentForm";
import { toast } from "@/hooks/use-toast";
import { Plus, Edit, Trash, Search } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogAction,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog';
import DocumentsUploadModal from '@/components/students/DocumentsUploadModal';
import { universitiesAPI, coursesAPI, academicSessionsAPI, University, Course, AcademicSession } from "@/lib/supabase-database";
import { supabase } from "@/integrations/supabase/client";
import { buildStudentInsertPayload } from '@/lib/student-utils';
import { useAuth } from "@/contexts/AuthContext";

interface Student {
  id: number;
  first_name: string;
  last_name: string;
  father_name: string;
  mother_name: string;
  date_of_birth: string;
  phone_number?: string;
  email?: string;
  university_id: number;
  course_id: number;
  academic_session_id: number;
  status: string;
  admission_number?: string;
  city?: string;
  country_id?: number;
  address?: string;
  aadhaar_number?: string;
  passport_number?: string;
  scores?: string;
  twelfth_marks?: number;
  agent_id?: number;
  photo_url?: string;
  passport_copy_url?: string;
  aadhaar_copy_url?: string;
  twelfth_certificate_url?: string;
  neet_score_card_url?: string;
  tenth_marksheet_url?: string;
  affidavit_paper_url?: string;
  admission_letter_url?: string;
  parents_phone_number?: string;
  tenth_passing_year?: string;
  twelfth_passing_year?: string;
  neet_passing_year?: string;
  tenth_marksheet_number?: string;
  pcb_average?: number;
  neet_roll_number?: string;
  qualification_status?: string;
  seat_number?: string;
  created_at?: string;
  updated_at?: string;
}

const DirectStudents = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [students, setStudents] = useState<Student[]>([]);
  const [universities, setUniversities] = useState<University[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [academicSessions, setAcademicSessions] = useState<AcademicSession[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  const [docStudentId, setDocStudentId] = useState<number | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [studentToDeleteId, setStudentToDeleteId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (user && ['admin', 'finance', 'staff', 'hostel_team'].includes(user.role)) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Build query to fetch all students (both direct and agent students)
      let studentsQuery = supabase
        .from('students')
        .select('*');
      
      // For non-admin users, the RLS policies will automatically filter by country
      // No additional filtering needed here as it's handled at the database level
      
      const [studentsData, universitiesData, coursesData, sessionsData] = await Promise.all([
        studentsQuery,
        universitiesAPI.getAll(),
        coursesAPI.getAll(),
        academicSessionsAPI.getAll(),
      ]);

      if (studentsData.error) throw studentsData.error;

      setStudents(studentsData.data || []);
      setUniversities(universitiesData);
      setCourses(coursesData);
      setAcademicSessions(sessionsData);
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: "Error",
        description: "Failed to load students data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const normalized = (v?: string) => (v || "").toLowerCase();
  const filteredStudents = students.filter((s) => {
    const name = `${normalized(s.first_name)} ${normalized(s.last_name)}`;
    const phone = normalized(s.phone_number);
    const email = normalized(s.email);
    const admission = normalized(s.admission_number);
    const q = normalized(searchTerm);
    return (
      name.includes(q) ||
      phone.includes(q) ||
      email.includes(q) ||
      admission.includes(q)
    );
  });

  const handleAddStudent = async (studentData: ComprehensiveStudentFormData) => {
    try {
      setIsSubmitting(true);
      
      // Get default course and session IDs
      const defaultCourse = courses.find(c => c.name === 'MBBS');
      const defaultSession = academicSessions.find(s => s.session_name === '2025-26');
  // Build safe payload for insertion
  const dataToInsert = buildStudentInsertPayload(studentData, { defaultCourseId: defaultCourse?.id, defaultSessionId: defaultSession?.id, forceStatus: 'active' });

      const { data: newStudent, error } = await supabase
        .from('students')
        .insert([dataToInsert as any])
        .select()
        .single();

      if (error) throw error;

      setStudents(prev => [newStudent, ...prev]);
      toast({
        title: "Student Added",
        description: `${newStudent.first_name} ${newStudent.last_name} has been added successfully.`,
      });
      setIsEditModalOpen(false);
      
      // Reload data to ensure we have the latest information
      await loadData();
    } catch (error: any) {
      console.error('Error adding student:', error);
      const message = error?.message || error?.msg || 'Failed to add student.';
      const details = error?.details ? ` - ${error.details}` : '';

      toast({
        title: "Error",
        description: `${message}${details}`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditStudent = async (studentData: ComprehensiveStudentFormData) => {
    if (!selectedStudent) return;
    
    try {
      setIsSubmitting(true);
      
      // Ensure agent_id is properly handled for updates too
      const dataToUpdate = {
        ...studentData,
        agent_id: studentData.agent_id && studentData.agent_id !== 0 ? studentData.agent_id : null
      };
      
      const { data: updatedStudent, error } = await supabase
        .from('students')
        .update(dataToUpdate)
        .eq('id', selectedStudent.id)
        .select()
        .single();

      if (error) throw error;

      setStudents(prev => prev.map(student => 
        student.id === selectedStudent.id ? updatedStudent : student
      ));
      toast({
        title: "Student Updated",
        description: `${updatedStudent.first_name} ${updatedStudent.last_name} has been updated successfully.`,
      });
      setIsEditModalOpen(false);
      setSelectedStudent(null);
      
      // Reload data to ensure we have the latest information
      await loadData();
    } catch (error) {
      console.error('Error updating student:', error);
      toast({
        title: "Error",
        description: "Failed to update student.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteStudent = async (id: number) => {
    try {
      const { error } = await supabase
        .from('students')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setStudents(prev => prev.filter(student => student.id !== id));
      toast({
        title: "Student Deleted",
        description: "Student has been deleted successfully.",
      });
    } catch (error) {
      console.error('Error deleting student:', error);
      toast({
        title: "Error",
        description: "Failed to delete student.",
        variant: "destructive",
      });
    }
  };

  const handleViewDetails = (student: Student) => {
  // Navigate to full page student profile instead of opening modal
  navigate(`/students/${student.id}`);
  };

  const handleEditClick = (student: Student) => {
    setSelectedStudent(student);
    setIsEditModalOpen(true);
  };

  const getUniversityName = (id: number) => {
    return universities.find(u => u.id === id)?.name || 'Unknown';
  };

  const getCourseName = (id: number) => {
    return courses.find(c => c.id === id)?.name || 'Unknown';
  };

  const getSessionName = (id: number) => {
    return academicSessions.find(s => s.id === id)?.session_name || 'Unknown';
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { variant: "default" as const, color: "text-green-600" },
      inactive: { variant: "secondary" as const, color: "text-gray-600" },
      completed: { variant: "outline" as const, color: "text-blue-600" }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.active;
    return (
      <Badge variant={config.variant} className={config.color}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const columns: Column<Student>[] = [
    { 
      header: "Student ID", 
      accessorKey: "id",
      cell: (student: Student) => (
        <span className="font-mono text-sm">#{student.id}</span>
      )
    },
    { 
      header: "Name", 
      accessorKey: "first_name",
      cell: (student: Student) => (
        <button
          className="text-primary underline text-sm"
          onClick={() => navigate(`/students/${student.id}`)}
        >
          {`${student.first_name} ${student.last_name}`}
        </button>
      )
    },
    { 
      header: "Father's Name", 
      accessorKey: "father_name" 
    },
    { 
      header: "University", 
      accessorKey: "university_id",
      cell: (student: Student) => getUniversityName(student.university_id)
    },
    { 
      header: "Course", 
      accessorKey: "course_id",
      cell: (student: Student) => getCourseName(student.course_id)
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (student: Student) => getStatusBadge(student.status)
    },
    {
      header: "Actions",
      accessorKey: "actions",
      cell: (student: Student) => (
        <div className="flex items-center space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="px-2 py-1 rounded hover:bg-muted"
                title="More actions"
              >
                ⋮
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => { navigate(`/students/admission-letters?studentId=${student.id}`); }}
              >
                Upload Admission Letter
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => { setDocStudentId(student.id); setIsDocModalOpen(true); }}
              >
                Upload Other Documents
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            size="sm"
            variant="outline"
            onClick={() => handleEditClick(student)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => { setStudentToDeleteId(student.id); setDeleteDialogOpen(true); }}
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  if (!user || !['admin', 'finance', 'staff', 'hostel_team'].includes(user.role)) {
    return (
      <MainLayout>
        <PageHeader
          title="Access Denied"
          description="You don't have permission to access this page."
        />
      </MainLayout>
    );
  }

  if (loading) {
    return (
      <MainLayout>
        <PageHeader
          title="All Students"
          description="Manage enrolled students"
        />
        <div>Loading...</div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <PageHeader
        title="All Students"
        description="All enrolled students in the system"
      />
      
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center gap-3">
            <div>
              <CardTitle>All Students</CardTitle>
              <CardDescription>
                All enrolled students in the system
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, phone, email or admission no."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 w-64"
                />
              </div>
              {(isAdmin || user?.role === 'finance') && (
                <Button onClick={() => {
                  setSelectedStudent(null);
                  setIsEditModalOpen(true);
                }}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add New Student
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={filteredStudents} />
        </CardContent>
      </Card>

  {/* Student profile now opens as a full page route */}

      <EditModal
        title={selectedStudent ? "Edit Student" : "Add New Student"}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedStudent(null);
        }}
        fullScreen={true}
      >
        <ComprehensiveStudentForm
          initialData={selectedStudent ? {
            id: selectedStudent.id,
            first_name: selectedStudent.first_name,
            last_name: selectedStudent.last_name,
            father_name: selectedStudent.father_name,
            mother_name: selectedStudent.mother_name,
            date_of_birth: selectedStudent.date_of_birth,
            phone_number: selectedStudent.phone_number || "",
            email: selectedStudent.email || "",
            university_id: selectedStudent.university_id,
            course_id: selectedStudent.course_id,
            academic_session_id: selectedStudent.academic_session_id,
            city: selectedStudent.city,
            country_id: selectedStudent.country_id,
            address: selectedStudent.address,
            aadhaar_number: selectedStudent.aadhaar_number,
            passport_number: selectedStudent.passport_number,
            scores: selectedStudent.scores,
            twelfth_marks: selectedStudent.twelfth_marks,
            agent_id: selectedStudent.agent_id,
            photo_url: selectedStudent.photo_url,
            passport_copy_url: selectedStudent.passport_copy_url,
            aadhaar_copy_url: selectedStudent.aadhaar_copy_url,
            twelfth_certificate_url: selectedStudent.twelfth_certificate_url,
            neet_score_card_url: selectedStudent.neet_score_card_url,
            tenth_marksheet_url: selectedStudent.tenth_marksheet_url,
            affidavit_paper_url: selectedStudent.affidavit_paper_url,
            admission_letter_url: selectedStudent.admission_letter_url,
            parents_phone_number: selectedStudent.parents_phone_number,
            tenth_passing_year: selectedStudent.tenth_passing_year,
            twelfth_passing_year: selectedStudent.twelfth_passing_year,
            neet_passing_year: selectedStudent.neet_passing_year,
            tenth_marksheet_number: selectedStudent.tenth_marksheet_number,
            pcb_average: selectedStudent.pcb_average,
            neet_roll_number: selectedStudent.neet_roll_number,
            qualification_status: selectedStudent.qualification_status as "qualified" | "not_qualified",
          } : undefined}
          onSubmit={selectedStudent ? handleEditStudent : handleAddStudent}
          isSubmitting={isSubmitting}
        />

        {/* ...existing code... */}
      </EditModal>

      {/* Delete confirmation dialog (always mounted) */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={(open) => { if (!open) { setStudentToDeleteId(null); } setDeleteDialogOpen(open); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Student</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this student? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => { setDeleteDialogOpen(false); setStudentToDeleteId(null); }}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={async () => {
              if (studentToDeleteId) {
                await handleDeleteStudent(studentToDeleteId);
              }
              setDeleteDialogOpen(false);
              setStudentToDeleteId(null);
            }}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Documents upload modal (always mounted) */}
      <DocumentsUploadModal
        studentId={docStudentId}
        isOpen={isDocModalOpen}
        onClose={() => { setIsDocModalOpen(false); setDocStudentId(null); }}
        onUploaded={async () => {
          // Refresh list after upload
          await loadData();
        }}
      />
    </MainLayout>
  );
};

export default DirectStudents;
