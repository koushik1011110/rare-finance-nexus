
import React, { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import PageHeader from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import DataTable, { Column } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/badge";
import StudentProfileModal from "@/components/students/StudentProfileModal";
import EditModal from "@/components/shared/EditModal";
import ComprehensiveStudentForm, { ComprehensiveStudentFormData } from "@/components/forms/ComprehensiveStudentForm";
import { toast } from "@/hooks/use-toast";
import { Plus, Edit, Trash, Eye } from "lucide-react";
import { universitiesAPI, coursesAPI, academicSessionsAPI, University, Course, AcademicSession } from "@/lib/supabase-database";
import { supabase } from "@/integrations/supabase/client";

interface ApplyStudent {
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
  country?: string;
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
  parents_phone_number?: string;
  tenth_passing_year?: string;
  twelfth_passing_year?: string;
  neet_passing_year?: string;
  tenth_marksheet_number?: string;
  pcb_average?: number;
  neet_roll_number?: string;
  qualification_status?: string;
  neet_score_card_url?: string;
  tenth_marksheet_url?: string;
  affidavit_paper_url?: string;
  created_at?: string;
  updated_at?: string;
}

const DirectStudents = () => {
  const [students, setStudents] = useState<ApplyStudent[]>([]);
  const [universities, setUniversities] = useState<University[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [academicSessions, setAcademicSessions] = useState<AcademicSession[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<ApplyStudent | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [studentsData, universitiesData, coursesData, sessionsData] = await Promise.all([
        supabase.from('apply_students').select('*'),
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

  const handleAddStudent = async (studentData: ComprehensiveStudentFormData) => {
    try {
      setIsSubmitting(true);
      
      // Get default course and session IDs
      const defaultCourse = courses.find(c => c.name === 'MBBS');
      const defaultSession = academicSessions.find(s => s.session_name === '2025-26');
      
      const dataToInsert = {
        ...studentData,
        university_id: studentData.university_id || undefined,
        course_id: studentData.course_id || defaultCourse?.id || undefined,
        academic_session_id: studentData.academic_session_id || defaultSession?.id || undefined,
        status: 'pending'
      };

      const { data: newStudent, error } = await supabase
        .from('apply_students')
        .insert(dataToInsert)
        .select()
        .single();

      if (error) throw error;

      setStudents(prev => [newStudent, ...prev]);
      toast({
        title: "Applicant Added",
        description: `${newStudent.first_name} ${newStudent.last_name} has been added successfully.`,
      });
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Error adding student:', error);
      toast({
        title: "Error",
        description: "Failed to add applicant.",
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
      
      const { data: updatedStudent, error } = await supabase
        .from('apply_students')
        .update(studentData)
        .eq('id', selectedStudent.id)
        .select()
        .single();

      if (error) throw error;

      setStudents(prev => prev.map(student => 
        student.id === selectedStudent.id ? updatedStudent : student
      ));
      toast({
        title: "Applicant Updated",
        description: `${updatedStudent.first_name} ${updatedStudent.last_name} has been updated successfully.`,
      });
      setIsEditModalOpen(false);
      setSelectedStudent(null);
    } catch (error) {
      console.error('Error updating student:', error);
      toast({
        title: "Error",
        description: "Failed to update applicant.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteStudent = async (id: number) => {
    try {
      const { error } = await supabase
        .from('apply_students')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setStudents(prev => prev.filter(student => student.id !== id));
      toast({
        title: "Applicant Deleted",
        description: "Applicant has been deleted successfully.",
      });
    } catch (error) {
      console.error('Error deleting student:', error);
      toast({
        title: "Error",
        description: "Failed to delete applicant.",
        variant: "destructive",
      });
    }
  };

  const handleViewDetails = (student: ApplyStudent) => {
    setSelectedStudent(student);
    setIsDetailModalOpen(true);
  };

  const handleEditClick = (student: ApplyStudent) => {
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
      pending: { variant: "secondary" as const, color: "text-yellow-600" },
      approved: { variant: "default" as const, color: "text-green-600" },
      rejected: { variant: "destructive" as const, color: "text-red-600" }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return (
      <Badge variant={config.variant} className={config.color}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const columns: Column<ApplyStudent>[] = [
    { 
      header: "Application ID", 
      accessorKey: "id",
      cell: (student: ApplyStudent) => (
        <span className="font-mono text-sm">#{student.id}</span>
      )
    },
    { 
      header: "Name", 
      accessorKey: "first_name",
      cell: (student: ApplyStudent) => `${student.first_name} ${student.last_name}`
    },
    { 
      header: "Father's Name", 
      accessorKey: "father_name" 
    },
    { 
      header: "University", 
      accessorKey: "university_id",
      cell: (student: ApplyStudent) => getUniversityName(student.university_id)
    },
    { 
      header: "Course", 
      accessorKey: "course_id",
      cell: (student: ApplyStudent) => getCourseName(student.course_id)
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (student: ApplyStudent) => getStatusBadge(student.status)
    },
    {
      header: "Actions",
      accessorKey: "actions",
      cell: (student: ApplyStudent) => (
        <div className="flex space-x-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleViewDetails(student)}
          >
            <Eye className="h-4 w-4" />
          </Button>
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
            onClick={() => handleDeleteStudent(student.id)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <MainLayout>
        <PageHeader
          title="All Applicants"
          description="Manage student applications and admissions"
        />
        <div>Loading...</div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <PageHeader
        title="All Applicants"
        description="Manage student applications and admissions"
      />
      
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Applicant List</CardTitle>
              <CardDescription>
                All student applications and admissions
              </CardDescription>
            </div>
            <Button onClick={() => {
              setSelectedStudent(null);
              setIsEditModalOpen(true);
            }}>
              <Plus className="mr-2 h-4 w-4" />
              Add New Applicant
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={students} />
        </CardContent>
      </Card>

      <StudentProfileModal
        student={selectedStudent ? {
          ...selectedStudent,
          university_name: getUniversityName(selectedStudent.university_id),
          course_name: getCourseName(selectedStudent.course_id),
          session_name: getSessionName(selectedStudent.academic_session_id)
        } : null}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
      />

      <EditModal
        title={selectedStudent ? "Edit Applicant" : "Add New Applicant"}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedStudent(null);
        }}
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
            status: selectedStudent.status as "active" | "inactive" | "completed",
            city: selectedStudent.city,
            country: selectedStudent.country,
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
            parents_phone_number: selectedStudent.parents_phone_number,
            tenth_passing_year: selectedStudent.tenth_passing_year,
            twelfth_passing_year: selectedStudent.twelfth_passing_year,
            neet_passing_year: selectedStudent.neet_passing_year,
            tenth_marksheet_number: selectedStudent.tenth_marksheet_number,
            pcb_average: selectedStudent.pcb_average,
            neet_roll_number: selectedStudent.neet_roll_number,
            qualification_status: selectedStudent.qualification_status as "qualified" | "not_qualified",
            neet_score_card_url: selectedStudent.neet_score_card_url,
            tenth_marksheet_url: selectedStudent.tenth_marksheet_url,
            affidavit_paper_url: selectedStudent.affidavit_paper_url,
          } : undefined}
          onSubmit={selectedStudent ? handleEditStudent : handleAddStudent}
          isSubmitting={isSubmitting}
        />
      </EditModal>
    </MainLayout>
  );
};

export default DirectStudents;
