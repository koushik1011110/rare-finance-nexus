
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Phone, MapPin, GraduationCap, Calendar, CreditCard, Users, BookOpen, FileText } from "lucide-react";
import DetailViewModal from "@/components/shared/DetailViewModal";
import StudentDocuments from "@/components/students/StudentDocuments";

interface StudentProfileModalProps {
  student: any;
  isOpen: boolean;
  onClose: () => void;
  showAgentInfo?: boolean;
}

export default function StudentProfileModal({
  student,
  isOpen,
  onClose,
  showAgentInfo = false,
}: StudentProfileModalProps) {
  if (!student) return null;

  return (
    <DetailViewModal
      title={`Student Profile: ${student.first_name} ${student.last_name}`}
      isOpen={isOpen}
      onClose={onClose}
      fullScreen={true}
    >
      <div className="space-y-6">
        {/* Personal Information */}
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-lg">
              <User className="mr-2 h-5 w-5 text-blue-600" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-muted-foreground">First Name</label>
                <p className="text-sm font-medium">{student.first_name}</p>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-muted-foreground">Last Name</label>
                <p className="text-sm font-medium">{student.last_name}</p>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-muted-foreground">Date of Birth</label>
                <p className="text-sm flex items-center">
                  <Calendar className="mr-1 h-3 w-3 text-muted-foreground" />
                  {student.date_of_birth ? new Date(student.date_of_birth).toLocaleDateString() : 'N/A'}
                </p>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-muted-foreground">Status</label>
                <Badge variant={student.status === 'active' ? 'default' : 'secondary'} className="w-fit">
                  {student.status}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-lg">
              <Phone className="mr-2 h-5 w-5 text-green-600" />
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-muted-foreground">Phone Number</label>
                <p className="text-sm flex items-center">
                  <Phone className="mr-1 h-3 w-3 text-muted-foreground" />
                  {student.phone_number || 'N/A'}
                </p>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-muted-foreground">Email</label>
                <p className="text-sm flex items-center">
                  <Mail className="mr-1 h-3 w-3 text-muted-foreground" />
                  {student.email || 'N/A'}
                </p>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-muted-foreground">Parents' Phone Number</label>
                <p className="text-sm flex items-center">
                  <Phone className="mr-1 h-3 w-3 text-muted-foreground" />
                  {student.parents_phone_number || 'N/A'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Family Information */}
        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-lg">
              <Users className="mr-2 h-5 w-5 text-purple-600" />
              Family Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-muted-foreground">Father's Name</label>
                <p className="text-sm font-medium">{student.father_name}</p>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-muted-foreground">Mother's Name</label>
                <p className="text-sm font-medium">{student.mother_name}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Address Information */}
        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-lg">
              <MapPin className="mr-2 h-5 w-5 text-orange-600" />
              Address Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-muted-foreground">City</label>
                <p className="text-sm font-medium">{student.city || 'N/A'}</p>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-muted-foreground">Country</label>
                <p className="text-sm font-medium">{student.country || 'N/A'}</p>
              </div>
              <div className="md:col-span-2 space-y-1">
                <label className="text-sm font-medium text-muted-foreground">Full Address</label>
                <p className="text-sm font-medium">{student.address || 'N/A'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Academic Information */}
        <Card className="border-l-4 border-l-indigo-500">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-lg">
              <GraduationCap className="mr-2 h-5 w-5 text-indigo-600" />
              Academic Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-muted-foreground">Admission Number</label>
                <p className="text-sm font-medium">{student.admission_number || 'N/A'}</p>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-muted-foreground">Seat Number</label>
                <p className="text-sm font-medium">{student.seat_number || 'N/A'}</p>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-muted-foreground">University</label>
                <p className="text-sm font-medium">{student.university_name || 'N/A'}</p>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-muted-foreground">Course</label>
                <p className="text-sm font-medium">{student.course_name || 'N/A'}</p>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-muted-foreground">Academic Session</label>
                <p className="text-sm font-medium">{student.session_name || 'N/A'}</p>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-muted-foreground">12th Marks</label>
                <p className="text-sm font-medium">{student.twelfth_marks ? `${student.twelfth_marks}%` : 'N/A'}</p>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-muted-foreground">PCB Average</label>
                <p className="text-sm font-medium">{student.pcb_average ? `${student.pcb_average}%` : 'N/A'}</p>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-muted-foreground">Passing Year of Class 12</label>
                <p className="text-sm font-medium">{student.twelfth_passing_year || 'N/A'}</p>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-muted-foreground">Class 10 Marksheet Number</label>
                <p className="text-sm font-medium">{student.tenth_marksheet_number || 'N/A'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* NEET Information */}
        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-lg">
              <BookOpen className="mr-2 h-5 w-5 text-red-600" />
              NEET Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-muted-foreground">NEET Roll Number</label>
                <p className="text-sm font-medium">{student.neet_roll_number || 'N/A'}</p>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-muted-foreground">Passing Year of NEET</label>
                <p className="text-sm font-medium">{student.neet_passing_year || 'N/A'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Identity Documents */}
        <Card className="border-l-4 border-l-yellow-500">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-lg">
              <CreditCard className="mr-2 h-5 w-5 text-yellow-600" />
              Identity Documents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-muted-foreground">Aadhaar Number</label>
                <p className="text-sm font-medium">{student.aadhaar_number || 'N/A'}</p>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-muted-foreground">Passport Number</label>
                <p className="text-sm font-medium">{student.passport_number || 'N/A'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {showAgentInfo && student.agent_name && (
          <Card className="border-l-4 border-l-teal-500">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-lg">
                <User className="mr-2 h-5 w-5 text-teal-600" />
                Agent Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <label className="text-sm font-medium text-muted-foreground">Agent</label>
                <p className="text-sm font-medium">{student.agent_name}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Student Documents */}
        <StudentDocuments student={student} />

        {/* Additional Information */}
        {student.scores && (
          <Card className="border-l-4 border-l-slate-500">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-lg">
                <FileText className="mr-2 h-5 w-5 text-slate-600" />
                Additional Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <label className="text-sm font-medium text-muted-foreground">Scores/Notes</label>
                <p className="text-sm font-medium">{student.scores}</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DetailViewModal>
  );
}
