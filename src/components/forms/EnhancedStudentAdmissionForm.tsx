
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { universitiesAPI, coursesAPI, academicSessionsAPI, agentsAPI, studentsAPI, University, Course, AcademicSession, Agent } from "@/lib/supabase-database";
import { toast } from "@/hooks/use-toast";
import { Upload, User, GraduationCap, FileText, IdCard, Building } from "lucide-react";

export interface EnhancedStudentFormData {
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
  city: string;
  address: string;
  marks_12th: number;
  seat_number: string;
  scores: string;
  passport_number: string;
  aadhaar_number: string;
  submitted_by: "admin" | "agent";
  agent_id?: number;
  status: "active" | "inactive" | "completed";
}

interface EnhancedStudentAdmissionFormProps {
  onSubmit: (data: EnhancedStudentFormData, files: FileData) => void;
  isSubmitting?: boolean;
}

interface FileData {
  photo?: File;
  passport?: File;
  aadhaar?: File;
  certificate_12th?: File;
}

const EnhancedStudentAdmissionForm: React.FC<EnhancedStudentAdmissionFormProps> = ({
  onSubmit,
  isSubmitting = false,
}) => {
  const [formData, setFormData] = useState<EnhancedStudentFormData>({
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
    city: "",
    address: "",
    marks_12th: 0,
    seat_number: "",
    scores: "",
    passport_number: "",
    aadhaar_number: "",
    submitted_by: "admin",
    status: "active",
  });

  const [files, setFiles] = useState<FileData>({});
  const [universities, setUniversities] = useState<University[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [academicSessions, setAcademicSessions] = useState<AcademicSession[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDropdownData();
  }, []);

  const loadDropdownData = async () => {
    try {
      setLoading(true);
      const [universitiesData, coursesData, sessionsData, agentsData] = await Promise.all([
        universitiesAPI.getAll(),
        coursesAPI.getAll(),
        academicSessionsAPI.getAll(),
        agentsAPI.getActive(),
      ]);

      setUniversities(universitiesData);
      setCourses(coursesData);
      setAcademicSessions(sessionsData);
      setAgents(agentsData);
    } catch (error) {
      console.error('Error loading dropdown data:', error);
      toast({
        title: "Error",
        description: "Failed to load form data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ 
      ...prev, 
      [name]: name === 'marks_12th' ? parseFloat(value) || 0 : value 
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ 
      ...prev, 
      [name]: name.includes('_id') ? parseInt(value) : value 
    }));
  };

  const handleFileChange = (field: keyof FileData, file: File | null) => {
    setFiles((prev) => ({ ...prev, [field]: file || undefined }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.first_name || !formData.last_name || !formData.father_name || 
        !formData.mother_name || !formData.date_of_birth || !formData.university_id || 
        !formData.course_id || !formData.academic_session_id) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (formData.submitted_by === 'agent' && !formData.agent_id) {
      toast({
        title: "Error",
        description: "Please select an agent when submitted by agent.",
        variant: "destructive",
      });
      return;
    }

    onSubmit(formData, files);
  };

  if (loading) {
    return <div className="flex justify-center items-center p-8">Loading form data...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="mr-2 h-5 w-5" />
            Personal Information
          </CardTitle>
          <CardDescription>Basic student details</CardDescription>
        </CardHeader>
        <CardContent>
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
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Enter city"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address">Address</Label>
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
        </CardContent>
      </Card>

      {/* Academic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <GraduationCap className="mr-2 h-5 w-5" />
            Academic Information
          </CardTitle>
          <CardDescription>Educational details and admission information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
              <Label htmlFor="marks_12th">12th Marks (%)</Label>
              <Input
                id="marks_12th"
                name="marks_12th"
                type="number"
                step="0.01"
                min="0"
                max="100"
                value={formData.marks_12th}
                onChange={handleChange}
                placeholder="Enter 12th marks"
              />
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
              <Label htmlFor="scores">Test Scores</Label>
              <Input
                id="scores"
                name="scores"
                value={formData.scores}
                onChange={handleChange}
                placeholder="Enter test scores (e.g., NEET: 600)"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ID and Passport Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <IdCard className="mr-2 h-5 w-5" />
            ID & Passport Details
          </CardTitle>
          <CardDescription>Identity and passport information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
              <Label htmlFor="aadhaar_number">Aadhaar Number</Label>
              <Input
                id="aadhaar_number"
                name="aadhaar_number"
                value={formData.aadhaar_number}
                onChange={handleChange}
                placeholder="Enter Aadhaar number"
                maxLength={12}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Document Uploads */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="mr-2 h-5 w-5" />
            Document Uploads
          </CardTitle>
          <CardDescription>Upload student documents</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="photo">Student Photo</Label>
              <Input
                id="photo"
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange('photo', e.target.files?.[0] || null)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="passport">Passport Copy</Label>
              <Input
                id="passport"
                type="file"
                accept="image/*,application/pdf"
                onChange={(e) => handleFileChange('passport', e.target.files?.[0] || null)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="aadhaar">Aadhaar Copy</Label>
              <Input
                id="aadhaar"
                type="file"
                accept="image/*,application/pdf"
                onChange={(e) => handleFileChange('aadhaar', e.target.files?.[0] || null)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="certificate_12th">12th Certificate</Label>
              <Input
                id="certificate_12th"
                type="file"
                accept="image/*,application/pdf"
                onChange={(e) => handleFileChange('certificate_12th', e.target.files?.[0] || null)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Submission Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Building className="mr-2 h-5 w-5" />
            Submission Details
          </CardTitle>
          <CardDescription>Who is submitting this admission</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="submitted_by">Submitted By *</Label>
              <Select
                value={formData.submitted_by}
                onValueChange={(value) => handleSelectChange("submitted_by", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select who is submitting" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="agent">Agent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.submitted_by === 'agent' && (
              <div className="space-y-2">
                <Label htmlFor="agent_id">Agent *</Label>
                <Select
                  value={formData.agent_id?.toString() || ""}
                  onValueChange={(value) => handleSelectChange("agent_id", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select agent" />
                  </SelectTrigger>
                  <SelectContent>
                    {agents.map((agent) => (
                      <SelectItem key={agent.id} value={agent.id.toString()}>
                        {agent.name} - {agent.contact_person}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

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
        </CardContent>
      </Card>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Submitting..." : "Submit Student Admission"}
      </Button>
    </form>
  );
};

export default EnhancedStudentAdmissionForm;
