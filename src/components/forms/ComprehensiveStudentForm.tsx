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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { User, GraduationCap, Phone, Mail, Users, MapPin, CreditCard, FileText, Link } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { universitiesAPI, coursesAPI, academicSessionsAPI, University, Course, AcademicSession } from "@/lib/supabase-database";

export interface ComprehensiveStudentFormData {
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
  qualification_status?: "qualified" | "not_qualified";
  neet_score_card_url?: string;
  tenth_marksheet_url?: string;
  affidavit_paper_url?: string;
  admission_letter_url?: string;
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
  const [universities, setUniversities] = useState<University[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [academicSessions, setAcademicSessions] = useState<AcademicSession[]>([]);
  const [loading, setLoading] = useState(true);

  // Set default values with proper defaults for course and session
  const [formData, setFormData] = useState<ComprehensiveStudentFormData>(() => {
    if (initialData) {
      return initialData;
    }
    
    // Default values for new student
    return {
      first_name: "",
      last_name: "",
      father_name: "",
      mother_name: "",
      date_of_birth: "",
      phone_number: "",
      email: "",
      university_id: 0,
      course_id: 0, // Will be set to MBBS ID after loading
      academic_session_id: 0, // Will be set to 2025-26 ID after loading
      admission_number: "",
      city: "",
      country: "",
      address: "",
      aadhaar_number: "",
      passport_number: "",
      scores: "",
      twelfth_marks: 0,
      agent_id: 0,
      parents_phone_number: "",
      tenth_passing_year: "",
      twelfth_passing_year: "",
      neet_passing_year: "",
      tenth_marksheet_number: "",
      pcb_average: 0,
      neet_roll_number: "",
      qualification_status: "qualified",
    };
  });

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

      // Set defaults only for new students (not editing)
      if (!initialData) {
        const mbbsCourse = coursesData.find(course => course.name.toLowerCase() === 'mbbs');
        const session2025 = sessionsData.find(session => session.session_name === '2025-26');
        
        if (mbbsCourse || session2025) {
          setFormData(prev => ({
            ...prev,
            ...(mbbsCourse && { course_id: mbbsCourse.id }),
            ...(session2025 && { academic_session_id: session2025.id })
          }));
        }
      }
    } catch (error) {
      console.error('Error loading dropdown data:', error);
      toast({
        title: "Error",
        description: "Failed to load form data.",
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
      [name]: name === 'twelfth_marks' || name === 'agent_id' || name === 'pcb_average' ? 
        (value === '' ? undefined : parseFloat(value)) : value 
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ 
      ...prev, 
      [name]: name.includes('_id') ? parseInt(value) : value 
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (loading) {
    return <div>Loading form data...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Academic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <GraduationCap className="mr-2 h-5 w-5" />
            Academic Information
          </CardTitle>
          <CardDescription>Select university and course details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="university_id">University *</Label>
              <Select
                value={formData.university_id ? formData.university_id.toString() : ""}
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
                value={formData.course_id ? formData.course_id.toString() : ""}
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
                value={formData.academic_session_id ? formData.academic_session_id.toString() : ""}
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
              <Label htmlFor="admission_number">Admission Number</Label>
              <Input
                id="admission_number"
                name="admission_number"
                value={formData.admission_number || ""}
                onChange={handleChange}
                placeholder="Auto-generated or enter manually"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="mr-2 h-5 w-5" />
            Personal Information
          </CardTitle>
          <CardDescription>Enter student's personal details</CardDescription>
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
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="phone_number"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email address"
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Family Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="mr-2 h-5 w-5" />
            Family Information
          </CardTitle>
          <CardDescription>Enter parent details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
              <Label htmlFor="parents_phone_number">Parents' Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="parents_phone_number"
                  name="parents_phone_number"
                  value={formData.parents_phone_number || ""}
                  onChange={handleChange}
                  placeholder="Enter parents' phone number"
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Address Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MapPin className="mr-2 h-5 w-5" />
            Address Information
          </CardTitle>
          <CardDescription>Enter address and location details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                name="city"
                value={formData.city || ""}
                onChange={handleChange}
                placeholder="Enter city"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                name="country"
                value={formData.country || ""}
                onChange={handleChange}
                placeholder="Enter country"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address">Full Address</Label>
              <Textarea
                id="address"
                name="address"
                value={formData.address || ""}
                onChange={handleChange}
                placeholder="Enter complete address"
                rows={3}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Academic Records */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <GraduationCap className="mr-2 h-5 w-5" />
            Academic Records
          </CardTitle>
          <CardDescription>Enter academic performance and exam details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="tenth_passing_year">Passing Year of Class 10</Label>
              <Input
                id="tenth_passing_year"
                name="tenth_passing_year"
                value={formData.tenth_passing_year || ""}
                onChange={handleChange}
                placeholder="Enter passing year"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="twelfth_passing_year">Passing Year of Class 12</Label>
              <Input
                id="twelfth_passing_year"
                name="twelfth_passing_year"
                value={formData.twelfth_passing_year || ""}
                onChange={handleChange}
                placeholder="Enter passing year"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="neet_passing_year">Passing Year of NEET</Label>
              <Input
                id="neet_passing_year"
                name="neet_passing_year"
                value={formData.neet_passing_year || ""}
                onChange={handleChange}
                placeholder="Enter NEET passing year"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tenth_marksheet_number">Class 10 Marksheet Number</Label>
              <Input
                id="tenth_marksheet_number"
                name="tenth_marksheet_number"
                value={formData.tenth_marksheet_number || ""}
                onChange={handleChange}
                placeholder="Enter marksheet number"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pcb_average">PCB Average</Label>
              <Input
                id="pcb_average"
                name="pcb_average"
                type="number"
                value={formData.pcb_average || ""}
                onChange={handleChange}
                placeholder="Enter PCB average"
                min="0"
                max="100"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="neet_roll_number">NEET Roll Number</Label>
              <Input
                id="neet_roll_number"
                name="neet_roll_number"
                value={formData.neet_roll_number || ""}
                onChange={handleChange}
                placeholder="Enter NEET roll number"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="twelfth_marks">12th Grade Marks (%)</Label>
              <Input
                id="twelfth_marks"
                name="twelfth_marks"
                type="number"
                value={formData.twelfth_marks || ""}
                onChange={handleChange}
                placeholder="Enter percentage"
                min="0"
                max="100"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="agent_id">Agent ID</Label>
              <Input
                id="agent_id"
                name="agent_id"
                type="number"
                value={formData.agent_id || ""}
                onChange={handleChange}
                placeholder="Enter agent ID (if applicable)"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="scores">Test Scores/Additional Qualifications</Label>
              <Textarea
                id="scores"
                name="scores"
                value={formData.scores || ""}
                onChange={handleChange}
                placeholder="Enter any test scores (NEET, SAT, etc.) or additional qualifications"
                rows={3}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Qualification Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <GraduationCap className="mr-2 h-5 w-5" />
            Qualification Status
          </CardTitle>
          <CardDescription>Select qualification status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="qualification_status">Qualification Status</Label>
              <Select
                value={formData.qualification_status || "qualified"}
                onValueChange={(value) => handleSelectChange("qualification_status", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select qualification status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="qualified">Qualified</SelectItem>
                  <SelectItem value="not_qualified">Not Qualified</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Identity Documents */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CreditCard className="mr-2 h-5 w-5" />
            Identity Documents
          </CardTitle>
          <CardDescription>Enter identification numbers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="aadhaar_number">Aadhaar Number</Label>
              <Input
                id="aadhaar_number"
                name="aadhaar_number"
                value={formData.aadhaar_number || ""}
                onChange={handleChange}
                placeholder="Enter Aadhaar number"
                maxLength={12}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="passport_number">Passport Number</Label>
              <Input
                id="passport_number"
                name="passport_number"
                value={formData.passport_number || ""}
                onChange={handleChange}
                placeholder="Enter passport number"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Document Links Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Link className="mr-2 h-5 w-5" />
            Document Links
          </CardTitle>
          <CardDescription>Enter direct links to student documents</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="photo_url">Student Photo URL</Label>
              <Input
                id="photo_url"
                name="photo_url"
                value={formData.photo_url || ""}
                onChange={handleChange}
                placeholder="https://example.com/photo.jpg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="passport_copy_url">Passport Copy URL</Label>
              <Input
                id="passport_copy_url"
                name="passport_copy_url"
                value={formData.passport_copy_url || ""}
                onChange={handleChange}
                placeholder="https://example.com/passport.pdf"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="aadhaar_copy_url">Aadhaar Copy URL</Label>
              <Input
                id="aadhaar_copy_url"
                name="aadhaar_copy_url"
                value={formData.aadhaar_copy_url || ""}
                onChange={handleChange}
                placeholder="https://example.com/aadhaar.pdf"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="twelfth_certificate_url">12th Grade Certificate URL</Label>
              <Input
                id="twelfth_certificate_url"
                name="twelfth_certificate_url"
                value={formData.twelfth_certificate_url || ""}
                onChange={handleChange}
                placeholder="https://example.com/12th-certificate.pdf"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tenth_marksheet_url">10th Marksheet URL</Label>
              <Input
                id="tenth_marksheet_url"
                name="tenth_marksheet_url"
                value={formData.tenth_marksheet_url || ""}
                onChange={handleChange}
                placeholder="https://example.com/10th-marksheet.pdf"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="neet_score_card_url">NEET Score Card URL</Label>
              <Input
                id="neet_score_card_url"
                name="neet_score_card_url"
                value={formData.neet_score_card_url || ""}
                onChange={handleChange}
                placeholder="https://example.com/neet-scorecard.pdf"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="admission_letter_url">Admission Letter URL</Label>
              <Input
                id="admission_letter_url"
                name="admission_letter_url"
                value={formData.admission_letter_url || ""}
                onChange={handleChange}
                placeholder="https://example.com/admission-letter.pdf"
              />
            </div>

            {formData.qualification_status === "not_qualified" && (
              <div className="space-y-2">
                <Label htmlFor="affidavit_paper_url">Affidavit Paper URL</Label>
                <Input
                  id="affidavit_paper_url"
                  name="affidavit_paper_url"
                  value={formData.affidavit_paper_url || ""}
                  onChange={handleChange}
                  placeholder="https://example.com/affidavit.pdf"
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : "Save Student"}
      </Button>
    </form>
  );
};

export default ComprehensiveStudentForm;
