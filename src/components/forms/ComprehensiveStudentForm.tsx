
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { universitiesAPI, coursesAPI, academicSessionsAPI } from "@/lib/supabase-database";
import { supabase } from "@/integrations/supabase/client";

export interface ComprehensiveStudentFormData {
  id?: number;
  first_name: string;
  last_name: string;
  father_name: string;
  mother_name: string;
  date_of_birth: string;
  phone_number: string;
  email: string;
  university_id?: number;
  course_id?: number;
  academic_session_id?: number;
  status: "active" | "inactive" | "completed";
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
  qualification_status?: "qualified" | "not_qualified";
  seat_number?: string;
}

interface ComprehensiveStudentFormProps {
  initialData?: ComprehensiveStudentFormData;
  onSubmit: (data: ComprehensiveStudentFormData) => void;
  isSubmitting?: boolean;
}

export default function ComprehensiveStudentForm({ 
  initialData, 
  onSubmit, 
  isSubmitting = false 
}: ComprehensiveStudentFormProps) {
  const [universities, setUniversities] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [academicSessions, setAcademicSessions] = useState<any[]>([]);
  const [agents, setAgents] = useState<any[]>([]);
  
  // Get default values
  const getDefaultCourseId = () => courses.find(c => c.name === 'MBBS')?.id;
  const getDefaultSessionId = () => academicSessions.find(s => s.session_name === '2025-26')?.id;

  const [formData, setFormData] = useState<ComprehensiveStudentFormData>({
    first_name: "",
    last_name: "",
    father_name: "",
    mother_name: "",
    date_of_birth: "",
    phone_number: "",
    email: "",
    status: "active",
    city: "",
    country: "",
    address: "",
    aadhaar_number: "",
    passport_number: "",
    scores: "",
    twelfth_marks: undefined,
    photo_url: "",
    passport_copy_url: "",
    aadhaar_copy_url: "",
    twelfth_certificate_url: "",
    neet_score_card_url: "",
    tenth_marksheet_url: "",
    affidavit_paper_url: "",
    admission_letter_url: "",
    parents_phone_number: "",
    tenth_passing_year: "",
    twelfth_passing_year: "",
    neet_passing_year: "",
    tenth_marksheet_number: "",
    pcb_average: undefined,
    neet_roll_number: "",
    qualification_status: "qualified",
    seat_number: "",
    ...initialData
  });

  useEffect(() => {
    loadData();
  }, []);

  // Set defaults when courses and sessions are loaded
  useEffect(() => {
    if (!initialData && courses.length > 0 && academicSessions.length > 0) {
      const defaultCourseId = getDefaultCourseId();
      const defaultSessionId = getDefaultSessionId();
      
      setFormData(prev => ({
        ...prev,
        course_id: defaultCourseId,
        academic_session_id: defaultSessionId
      }));
    }
  }, [courses, academicSessions, initialData]);

  const loadData = async () => {
    try {
      const [universitiesData, coursesData, sessionsData, agentsData] = await Promise.all([
        universitiesAPI.getAll(),
        coursesAPI.getAll(),
        academicSessionsAPI.getAll(),
        supabase.from('agents').select('*')
      ]);

      setUniversities(universitiesData);
      setCourses(coursesData);
      setAcademicSessions(sessionsData);
      setAgents(agentsData.data || []);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (field: keyof ComprehensiveStudentFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto">
      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="first_name">First Name *</Label>
              <Input
                id="first_name"
                value={formData.first_name}
                onChange={(e) => handleChange('first_name', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="last_name">Last Name *</Label>
              <Input
                id="last_name"
                value={formData.last_name}
                onChange={(e) => handleChange('last_name', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="father_name">Father's Name *</Label>
              <Input
                id="father_name"
                value={formData.father_name}
                onChange={(e) => handleChange('father_name', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="mother_name">Mother's Name *</Label>
              <Input
                id="mother_name"
                value={formData.mother_name}
                onChange={(e) => handleChange('mother_name', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="date_of_birth">Date of Birth *</Label>
              <Input
                id="date_of_birth"
                type="date"
                value={formData.date_of_birth}
                onChange={(e) => handleChange('date_of_birth', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleChange('status', value)}>
                <SelectTrigger>
                  <SelectValue />
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

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone_number">Phone Number</Label>
              <Input
                id="phone_number"
                value={formData.phone_number}
                onChange={(e) => handleChange('phone_number', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="parents_phone_number">Parents' Phone Number</Label>
              <Input
                id="parents_phone_number"
                value={formData.parents_phone_number || ""}
                onChange={(e) => handleChange('parents_phone_number', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Address Information */}
      <Card>
        <CardHeader>
          <CardTitle>Address Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={formData.city || ""}
                onChange={(e) => handleChange('city', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                value={formData.country || ""}
                onChange={(e) => handleChange('country', e.target.value)}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="address">Full Address</Label>
            <Textarea
              id="address"
              value={formData.address || ""}
              onChange={(e) => handleChange('address', e.target.value)}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Academic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Academic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="university_id">University</Label>
              <Select value={formData.university_id?.toString()} onValueChange={(value) => handleChange('university_id', parseInt(value))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select University" />
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
            <div>
              <Label htmlFor="course_id">Course</Label>
              <Select value={formData.course_id?.toString()} onValueChange={(value) => handleChange('course_id', parseInt(value))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Course" />
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
            <div>
              <Label htmlFor="academic_session_id">Academic Session</Label>
              <Select value={formData.academic_session_id?.toString()} onValueChange={(value) => handleChange('academic_session_id', parseInt(value))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Session" />
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
            <div>
              <Label htmlFor="twelfth_marks">12th Marks (%)</Label>
              <Input
                id="twelfth_marks"
                type="number"
                min="0"
                max="100"
                value={formData.twelfth_marks || ""}
                onChange={(e) => handleChange('twelfth_marks', e.target.value ? parseFloat(e.target.value) : undefined)}
              />
            </div>
            <div>
              <Label htmlFor="pcb_average">PCB Average (%)</Label>
              <Input
                id="pcb_average"
                type="number"
                min="0"
                max="100"
                value={formData.pcb_average || ""}
                onChange={(e) => handleChange('pcb_average', e.target.value ? parseFloat(e.target.value) : undefined)}
              />
            </div>
            <div>
              <Label htmlFor="seat_number">Seat Number</Label>
              <Input
                id="seat_number"
                value={formData.seat_number || ""}
                onChange={(e) => handleChange('seat_number', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="twelfth_passing_year">Passing Year of Class 12</Label>
              <Input
                id="twelfth_passing_year"
                value={formData.twelfth_passing_year || ""}
                onChange={(e) => handleChange('twelfth_passing_year', e.target.value)}
                placeholder="e.g., 2023"
              />
            </div>
            <div>
              <Label htmlFor="tenth_marksheet_number">Class 10 Marksheet Number</Label>
              <Input
                id="tenth_marksheet_number"
                value={formData.tenth_marksheet_number || ""}
                onChange={(e) => handleChange('tenth_marksheet_number', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* NEET Information */}
      <Card>
        <CardHeader>
          <CardTitle>NEET Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="neet_roll_number">NEET Roll Number</Label>
              <Input
                id="neet_roll_number"
                value={formData.neet_roll_number || ""}
                onChange={(e) => handleChange('neet_roll_number', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="neet_passing_year">Passing Year of NEET</Label>
              <Input
                id="neet_passing_year"
                value={formData.neet_passing_year || ""}
                onChange={(e) => handleChange('neet_passing_year', e.target.value)}
                placeholder="e.g., 2023"
              />
            </div>
            <div>
              <Label htmlFor="qualification_status">Qualification Status</Label>
              <Select value={formData.qualification_status} onValueChange={(value) => handleChange('qualification_status', value)}>
                <SelectTrigger>
                  <SelectValue />
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
          <CardTitle>Identity Documents</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="aadhaar_number">Aadhaar Number</Label>
              <Input
                id="aadhaar_number"
                value={formData.aadhaar_number || ""}
                onChange={(e) => handleChange('aadhaar_number', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="passport_number">Passport Number</Label>
              <Input
                id="passport_number"
                value={formData.passport_number || ""}
                onChange={(e) => handleChange('passport_number', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Document Links */}
      <Card>
        <CardHeader>
          <CardTitle>Document Links</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="photo_url">Student Photo URL</Label>
              <Input
                id="photo_url"
                type="url"
                value={formData.photo_url || ""}
                onChange={(e) => handleChange('photo_url', e.target.value)}
                placeholder="https://..."
              />
            </div>
            <div>
              <Label htmlFor="passport_copy_url">Passport Copy URL</Label>
              <Input
                id="passport_copy_url"
                type="url"
                value={formData.passport_copy_url || ""}
                onChange={(e) => handleChange('passport_copy_url', e.target.value)}
                placeholder="https://..."
              />
            </div>
            <div>
              <Label htmlFor="aadhaar_copy_url">Aadhaar Copy URL</Label>
              <Input
                id="aadhaar_copy_url"
                type="url"
                value={formData.aadhaar_copy_url || ""}
                onChange={(e) => handleChange('aadhaar_copy_url', e.target.value)}
                placeholder="https://..."
              />
            </div>
            <div>
              <Label htmlFor="twelfth_certificate_url">12th Certificate URL</Label>
              <Input
                id="twelfth_certificate_url"
                type="url"
                value={formData.twelfth_certificate_url || ""}
                onChange={(e) => handleChange('twelfth_certificate_url', e.target.value)}
                placeholder="https://..."
              />
            </div>
            <div>
              <Label htmlFor="tenth_marksheet_url">10th Marksheet URL</Label>
              <Input
                id="tenth_marksheet_url"
                type="url"
                value={formData.tenth_marksheet_url || ""}
                onChange={(e) => handleChange('tenth_marksheet_url', e.target.value)}
                placeholder="https://..."
              />
            </div>
            <div>
              <Label htmlFor="neet_score_card_url">NEET Score Card URL</Label>
              <Input
                id="neet_score_card_url"
                type="url"
                value={formData.neet_score_card_url || ""}
                onChange={(e) => handleChange('neet_score_card_url', e.target.value)}
                placeholder="https://..."
              />
            </div>
            <div>
              <Label htmlFor="affidavit_paper_url">Affidavit Paper URL</Label>
              <Input
                id="affidavit_paper_url"
                type="url"
                value={formData.affidavit_paper_url || ""}
                onChange={(e) => handleChange('affidavit_paper_url', e.target.value)}
                placeholder="https://..."
              />
            </div>
            <div>
              <Label htmlFor="admission_letter_url">Admission Letter URL</Label>
              <Input
                id="admission_letter_url"
                type="url"
                value={formData.admission_letter_url || ""}
                onChange={(e) => handleChange('admission_letter_url', e.target.value)}
                placeholder="https://..."
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Agent Information */}
      <Card>
        <CardHeader>
          <CardTitle>Agent Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="agent_id">Agent (Optional)</Label>
            <Select value={formData.agent_id?.toString() || "none"} onValueChange={(value) => handleChange('agent_id', value === "none" ? undefined : parseInt(value))}>
              <SelectTrigger>
                <SelectValue placeholder="Select Agent (Optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No Agent</SelectItem>
                {agents.map((agent) => (
                  <SelectItem key={agent.id} value={agent.id.toString()}>
                    {agent.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Additional Information */}
      <Card>
        <CardHeader>
          <CardTitle>Additional Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="scores">Scores/Notes</Label>
            <Textarea
              id="scores"
              value={formData.scores || ""}
              onChange={(e) => handleChange('scores', e.target.value)}
              rows={3}
              placeholder="Any additional scores or notes..."
            />
          </div>
        </CardContent>
      </Card>

      <Separator />

      <div className="flex justify-end space-x-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Student"}
        </Button>
      </div>
    </form>
  );
}
