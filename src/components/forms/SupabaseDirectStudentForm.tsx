
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { universitiesAPI, coursesAPI, academicSessionsAPI, University, Course, AcademicSession } from "@/lib/supabase-database";

export interface SupabaseDirectStudentFormData {
  id?: number;
  first_name: string;
  last_name: string;
  father_name: string;
  mother_name: string;
  date_of_birth: string;
  phone_number: string;
  email: string;
  university_id: number;
  course_id: number;
  academic_session_id: number;
  status: "active" | "inactive" | "completed";
}

interface SupabaseDirectStudentFormProps {
  initialData?: SupabaseDirectStudentFormData;
  onSubmit: (data: SupabaseDirectStudentFormData) => void;
  isSubmitting?: boolean;
}

const SupabaseDirectStudentForm: React.FC<SupabaseDirectStudentFormProps> = ({
  initialData = {
    first_name: "",
    last_name: "",
    father_name: "",
    mother_name: "",
    date_of_birth: "",
    phone_number: "",
    email: "",
    university_id: 0,
    course_id: 0,
    academic_session_id: 0,
    status: "active",
  },
  onSubmit,
  isSubmitting = false,
}) => {
  const [formData, setFormData] = useState<SupabaseDirectStudentFormData>(initialData);
  const [universities, setUniversities] = useState<University[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [academicSessions, setAcademicSessions] = useState<AcademicSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDropdownData();
  }, []);

  const loadDropdownData = async () => {
    try {
      setLoading(true);
      const [universitiesData, coursesData, sessionsData] = await Promise.all([
        universitiesAPI.getAll(),
        coursesAPI.getAll(),
        academicSessionsAPI.getAll(),
      ]);

      setUniversities(universitiesData);
      setCourses(coursesData);
      setAcademicSessions(sessionsData);
    } catch (error) {
      console.error('Error loading dropdown data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ 
      ...prev, 
      [name]: name.includes('_id') ? parseInt(value) : value 
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (loading) {
    return <div>Loading form data...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="first_name">First Name *</Label>
          <Input
            id="first_name"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            placeholder="Enter first name"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="last_name">Last Name *</Label>
          <Input
            id="last_name"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            placeholder="Enter last name"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="father_name">Father's Name *</Label>
          <Input
            id="father_name"
            name="father_name"
            value={formData.father_name}
            onChange={handleChange}
            placeholder="Enter father's name"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="mother_name">Mother's Name *</Label>
          <Input
            id="mother_name"
            name="mother_name"
            value={formData.mother_name}
            onChange={handleChange}
            placeholder="Enter mother's name"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="date_of_birth">Date of Birth *</Label>
          <Input
            id="date_of_birth"
            name="date_of_birth"
            type="date"
            value={formData.date_of_birth}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone_number">Phone Number</Label>
          <Input
            id="phone_number"
            name="phone_number"
            value={formData.phone_number}
            onChange={handleChange}
            placeholder="Enter phone number"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter email address"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="university_id">University *</Label>
          <Select
            value={formData.university_id.toString()}
            onValueChange={(value) => handleSelectChange("university_id", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select university" />
            </SelectTrigger>
            <SelectContent>
              {universities.map((university) => (
                <SelectItem key={university.id} value={university.id.toString()}>
                  {university.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="course_id">Course *</Label>
          <Select
            value={formData.course_id.toString()}
            onValueChange={(value) => handleSelectChange("course_id", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select course" />
            </SelectTrigger>
            <SelectContent>
              {courses.map((course) => (
                <SelectItem key={course.id} value={course.id.toString()}>
                  {course.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="academic_session_id">Academic Session *</Label>
          <Select
            value={formData.academic_session_id.toString()}
            onValueChange={(value) => handleSelectChange("academic_session_id", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select academic session" />
            </SelectTrigger>
            <SelectContent>
              {academicSessions.map((session) => (
                <SelectItem key={session.id} value={session.id.toString()}>
                  {session.session_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select
            value={formData.status}
            onValueChange={(value) => handleSelectChange("status", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : "Save Student"}
      </Button>
    </form>
  );
};

export default SupabaseDirectStudentForm;
