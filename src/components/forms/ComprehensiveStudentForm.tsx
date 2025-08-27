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
import { fetchCountries, Country } from "@/lib/countries-api";
import { uploadStudentDocument } from "@/lib/fileUpload";

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
  semester?: string;
  country_id?: number;
  admission_number?: string;
  city?: string;
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
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

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
      const [universitiesData, coursesData, sessionsData, countriesData] = await Promise.all([
        universitiesAPI.getAll(),
        coursesAPI.getAll(),
        academicSessionsAPI.getAll(),
        fetchCountries(),
      ]);

      setUniversities(universitiesData);
      setCourses(coursesData);
      setAcademicSessions(sessionsData);
      setCountries(countriesData);

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
    // Basic client-side validation to prevent invalid inserts
    const validationError = validateForm();
    if (validationError) {
      toast({
        title: 'Validation Error',
        description: validationError,
        variant: 'destructive',
      });
      return;
    }

    onSubmit(formData);
  };

  const validateForm = () => {
    if (!formData.first_name || !formData.last_name) return 'First name and last name are required.';
    if (!formData.father_name || !formData.mother_name) return 'Parents\' names are required.';
    if (!formData.date_of_birth) return 'Date of birth is required.';
    // Ensure university, course and academic session are selected (non-zero)
    if (!formData.university_id || Number(formData.university_id) <= 0) return 'Please select a university.';
    if (!formData.course_id || Number(formData.course_id) <= 0) return 'Please select a course.';
    if (!formData.academic_session_id || Number(formData.academic_session_id) <= 0) return 'Please select an academic session.';
    return null;
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
              <Label htmlFor="semester">Semester</Label>
              <Select
                value={formData.semester || ""}
                onValueChange={(value) => handleSelectChange("semester", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select semester" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1st Semester</SelectItem>
                  <SelectItem value="2">2nd Semester</SelectItem>
                  <SelectItem value="3">3rd Semester</SelectItem>
                  <SelectItem value="4">4th Semester</SelectItem>
                  <SelectItem value="5">5th Semester</SelectItem>
                  <SelectItem value="6">6th Semester</SelectItem>
                  <SelectItem value="7">7th Semester</SelectItem>
                  <SelectItem value="8">8th Semester</SelectItem>
                  <SelectItem value="9">9th Semester</SelectItem>
                  <SelectItem value="10">10th Semester</SelectItem>
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
              <Label htmlFor="country_id">Country</Label>
              <Select
                value={formData.country_id ? formData.country_id.toString() : ""}
                onValueChange={(value) => handleSelectChange("country_id", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem key={country.id} value={country.id.toString()}>
                      {country.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
                <Label htmlFor="photo_url">Student Photo</Label>

                {/* File upload control - uploads immediately and sets formData.photo_url to public URL returned by Supabase */}
                <div className="flex items-center space-x-3">
                  <input
                    id="photo_file"
                    name="photo_file"
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      try {
                        setUploadingPhoto(true);
                        const { url, error } = await uploadStudentDocument(file, 'photo');
                        if (error || !url) {
                          toast({ title: 'Upload failed', description: error || 'Unknown error', variant: 'destructive' });
                          return;
                        }
                        setFormData(prev => ({ ...prev, photo_url: url }));
                        toast({ title: 'Uploaded', description: 'Photo uploaded successfully.' });
                      } catch (err) {
                        console.error('Photo upload error', err);
                        toast({ title: 'Upload failed', description: 'Failed to upload photo', variant: 'destructive' });
                      } finally {
                        setUploadingPhoto(false);
                        // clear the file input value so same file can be selected again if needed
                        (e.target as HTMLInputElement).value = '';
                      }
                    }}
                  />

                  <div className="flex-1">
                    <Input
                      id="photo_url"
                      name="photo_url"
                      value={formData.photo_url || ''}
                      onChange={handleChange}
                      placeholder="https://example.com/photo.jpg or use file upload"
                    />
                  </div>

                  <div>
                    <Button type="button" disabled={uploadingPhoto} onClick={() => {
                      // remove current photo URL
                      setFormData(prev => ({ ...prev, photo_url: undefined }));
                    }}>
                      Remove
                    </Button>
                  </div>
                </div>

                {/* Preview */}
                {formData.photo_url && (
                  <div className="mt-2">
                    <img src={formData.photo_url} alt="Student photo" className="h-24 w-24 object-cover rounded" />
                  </div>
                )}
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
