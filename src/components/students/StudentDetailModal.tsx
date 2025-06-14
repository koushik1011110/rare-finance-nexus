import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface ApplyStudent {
  id: number;
  first_name: string;
  last_name: string;
  father_name: string;
  mother_name: string;
  date_of_birth: string;
  phone_number?: string;
  email?: string;
  university_id?: number;
  course_id?: number;
  academic_session_id?: number;
  status: string;
  application_status: string;
  city?: string;
  country?: string;
  address?: string;
  aadhaar_number?: string;
  passport_number?: string;
  twelfth_marks?: number;
  seat_number?: string;
  scores?: string;
  photo_url?: string;
  passport_copy_url?: string;
  aadhaar_copy_url?: string;
  twelfth_certificate_url?: string;
  created_at: string;
  updated_at: string;
}

interface StudentDetailModalProps {
  student: ApplyStudent | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function StudentDetailModal({ student, isOpen, onClose }: StudentDetailModalProps) {
  if (!student) return null;

  const statusOptions = [
    { value: "pending", label: "Pending", variant: "secondary" as const },
    { value: "under_review", label: "Under Review", variant: "outline" as const },
    { value: "approved", label: "Approved", variant: "default" as const },
    { value: "rejected", label: "Rejected", variant: "destructive" as const },
  ];

  const statusOption = statusOptions.find(opt => opt.value === student.status);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Student Application Details</DialogTitle>
          <DialogDescription>
            Complete details for application ID: {student.id}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Personal Information */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">First Name</label>
                <p className="text-sm">{student.first_name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Last Name</label>
                <p className="text-sm">{student.last_name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Father's Name</label>
                <p className="text-sm">{student.father_name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Mother's Name</label>
                <p className="text-sm">{student.mother_name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Date of Birth</label>
                <p className="text-sm">{new Date(student.date_of_birth).toLocaleDateString()}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Status</label>
                <div className="mt-1">
                  <Badge variant={statusOption?.variant || "secondary"}>
                    {statusOption?.label || student.status}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Phone Number</label>
                <p className="text-sm">{student.phone_number || "N/A"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Email</label>
                <p className="text-sm">{student.email || "N/A"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">City</label>
                <p className="text-sm">{student.city || "N/A"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Country</label>
                <p className="text-sm">{student.country || "N/A"}</p>
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-muted-foreground">Address</label>
                <p className="text-sm">{student.address || "N/A"}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Documents */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Documents & Academic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Aadhaar Number</label>
                <p className="text-sm">{student.aadhaar_number || "N/A"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Passport Number</label>
                <p className="text-sm">{student.passport_number || "N/A"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">12th Marks</label>
                <p className="text-sm">{student.twelfth_marks ? `${student.twelfth_marks}%` : "N/A"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Seat Number</label>
                <p className="text-sm">{student.seat_number || "N/A"}</p>
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-muted-foreground">Test Scores</label>
                <p className="text-sm">{student.scores || "N/A"}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Application Information */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Application Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">University ID</label>
                <p className="text-sm">{student.university_id || "N/A"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Course ID</label>
                <p className="text-sm">{student.course_id || "N/A"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Academic Session ID</label>
                <p className="text-sm">{student.academic_session_id || "N/A"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Application Status</label>
                <p className="text-sm">{student.application_status}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Applied Date</label>
                <p className="text-sm">{new Date(student.created_at).toLocaleDateString()}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Last Updated</label>
                <p className="text-sm">{new Date(student.updated_at).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}