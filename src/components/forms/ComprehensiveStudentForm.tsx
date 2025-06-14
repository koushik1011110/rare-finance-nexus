import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { universitiesAPI, coursesAPI, academicSessionsAPI } from "@/lib/supabase-database";

export interface ComprehensiveStudentFormData {
  id?: number;
  first_name: string;
  last_name: string;
  father_name: string;
  mother_name: string;
  date_of_birth: string;
  phone_number?: string;
  email?: string;
  university_id: number | null;
  course_id: number | null;
  academic_session_id: number | null;
  status: "active" | "inactive" | "completed";
  city?: string;
  country?: string;
  address?: string;
  aadhaar_number?: string;
  passport_number?: string;
  seat_number?: string;
  scores?: string;
  twelfth_marks?: number;
  photo_url?: string;
  passport_copy_url?: string;
  aadhaar_copy_url?: string;
  twelfth_certificate_url?: string;
  agent_id?: number;
}

interface ComprehensiveStudentFormProps {
  initialData?: ComprehensiveStudentFormData;
  onSubmit: (data: ComprehensiveStudentFormData) => void;
  isSubmitting?: boolean;
}

const ComprehensiveStudentForm: React.FC<ComprehensiveStudentFormProps> = ({
  initialData,
  onSubmit,
  isSubmitting = false,
}) => {
  const [formData, setFormData] = useState<ComprehensiveStudentFormData>(
    initialData || {
      first_name: "",
      last_name: "",
      father_name: "",
      mother_name: "",
      date_of_birth: "",
      phone_number: "",
      email: "",
      university_id: null,
      course_id: null,
      academic_session_id: null,
      status: "active",
      city: "",
      country: "",
      address: "",
      aadhaar_number: "",
      passport_number: "",
      seat_number: "",
      scores: "",
      twelfth_marks: 0,
      photo_url: "",
      passport_copy_url: "",
      aadhaar_copy_url: "",
      twelfth_certificate_url: "",
    }
  );

  const [universities, setUniversities] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [academicSessions, setAcademicSessions] = useState<any[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [universitiesData, coursesData, sessionsData] = await Promise.all([
          universitiesAPI.getAll(),
          coursesAPI.getAll(),
          academicSessionsAPI.getAll()
        ]);
        setUniversities(universitiesData);
        setCourses(coursesData);
        setAcademicSessions(sessionsData);
      } catch (error) {
        console.error("Error loading form data:", error);
      }
    };

    loadData();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ 
      ...prev, 
      [name]: name === 'twelfth_marks' ? (value ? parseFloat(value) : 0) : value 
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ 
      ...prev, 
      [name]: name.includes('_id') ? (value ? parseInt(value) : null) : value 
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Personal Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Personal Information</h3>
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
      </div>

      {/* Address Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Address Information</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="Enter city"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Input
              id="country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              placeholder="Enter country"
            />
          </div>

          <div className="col-span-2 space-y-2">
            <Label htmlFor="address">Full Address</Label>
            <Textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter full address"
              rows={3}
            />
          </div>
        </div>
      </div>

      {/* Academic Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Academic Information</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="university_id">University</Label>
            <Select
              value={formData.university_id?.toString() || ""}
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
            <Label htmlFor="course_id">Course</Label>
            <Select
              value={formData.course_id?.toString() || ""}
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
            <Label htmlFor="academic_session_id">Academic Session</Label>
            <Select
              value={formData.academic_session_id?.toString() || ""}
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
            <Label htmlFor="seat_number">Seat Number</Label>
            <Input
              id="seat_number"
              name="seat_number"
              value={formData.seat_number}
              onChange={handleChange}
              placeholder="Enter seat number"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="twelfth_marks">12th Marks (%)</Label>
            <Input
              id="twelfth_marks"
              name="twelfth_marks"
              type="number"
              step="0.01"
              min="0"
              max="100"
              value={formData.twelfth_marks}
              onChange={handleChange}
              placeholder="Enter 12th marks"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="scores">Scores</Label>
            <Input
              id="scores"
              name="scores"
              value={formData.scores}
              onChange={handleChange}
              placeholder="Enter test scores (e.g., IELTS, TOEFL)"
            />
          </div>
        </div>
      </div>

      {/* Document Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Document Information</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="aadhaar_number">Aadhaar Number</Label>
            <Input
              id="aadhaar_number"
              name="aadhaar_number"
              value={formData.aadhaar_number}
              onChange={handleChange}
              placeholder="Enter Aadhaar number"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="passport_number">Passport Number</Label>
            <Input
              id="passport_number"
              name="passport_number"
              value={formData.passport_number}
              onChange={handleChange}
              placeholder="Enter passport number"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="photo_url">Photo URL</Label>
            <Input
              id="photo_url"
              name="photo_url"
              value={formData.photo_url}
              onChange={handleChange}
              placeholder="Enter photo URL"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="passport_copy_url">Passport Copy URL</Label>
            <Input
              id="passport_copy_url"
              name="passport_copy_url"
              value={formData.passport_copy_url}
              onChange={handleChange}
              placeholder="Enter passport copy URL"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="aadhaar_copy_url">Aadhaar Copy URL</Label>
            <Input
              id="aadhaar_copy_url"
              name="aadhaar_copy_url"
              value={formData.aadhaar_copy_url}
              onChange={handleChange}
              placeholder="Enter Aadhaar copy URL"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="twelfth_certificate_url">12th Certificate URL</Label>
            <Input
              id="twelfth_certificate_url"
              name="twelfth_certificate_url"
              value={formData.twelfth_certificate_url}
              onChange={handleChange}
              placeholder="Enter 12th certificate URL"
            />
          </div>
        </div>
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? (initialData ? "Updating Student..." : "Adding Student...") : (initialData ? "Update Student" : "Add Student")}
      </Button>
    </form>
  );
};

export default ComprehensiveStudentForm;