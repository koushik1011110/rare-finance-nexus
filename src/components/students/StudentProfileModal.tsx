
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Phone, MapPin, GraduationCap, Calendar, CreditCard, Users, Key } from "lucide-react";
import DetailViewModal from "@/components/shared/DetailViewModal";
import StudentDocuments from "@/components/students/StudentDocuments";
import { supabase } from "@/integrations/supabase/client";

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
  const [credentials, setCredentials] = useState<{ username: string; password: string } | null>(null);
  const [feePayments, setFeePayments] = useState<any[]>([]);
  const [loadingFees, setLoadingFees] = useState(false);
  const [feeSummary, setFeeSummary] = useState({ totalDue: 0, totalPaid: 0, balance: 0 });
  const [countryName, setCountryName] = useState<string>('N/A');

  useEffect(() => {
    const fetchCredentials = async () => {
      if (student?.id && isOpen) {
        const { data, error } = await supabase
          .from('student_credentials')
          .select('username, password')
          .eq('student_id', student.id)
          .single();
        
        if (!error && data) {
          setCredentials(data);
        }
      }
    };

    const fetchCountryName = async () => {
      if (student?.country_id && isOpen) {
        const { data, error } = await supabase
          .from('countries')
          .select('name')
          .eq('id', student.country_id)
          .single();
        
        if (!error && data) {
          setCountryName(data.name);
        }
      }
    };

    fetchCredentials();
    fetchCountryName();
  }, [student?.id, student?.country_id, isOpen]);

  useEffect(() => {
    const fetchFees = async () => {
      if (!student?.id || !isOpen) return;
      setLoadingFees(true);
      try {
        const { data, error } = await supabase
          .from('fee_payments')
          .select(`
            *,
            fee_structure_components (
              fee_types (name),
              fee_structures (name),
              amount,
              frequency
            )
          `)
          .eq('student_id', student.id)
          .order('created_at', { ascending: false });
        if (error) throw error;
        const payments = data || [];
        setFeePayments(payments);
        const totalDue = payments.reduce((sum: number, p: any) => sum + (p.amount_due || 0), 0);
        const totalPaid = payments.reduce((sum: number, p: any) => sum + (p.amount_paid || 0), 0);
        setFeeSummary({ totalDue, totalPaid, balance: totalDue - totalPaid });
      } catch (e) {
        // Silently fail in modal, optionally could use a toast
        setFeePayments([]);
        setFeeSummary({ totalDue: 0, totalPaid: 0, balance: 0 });
      } finally {
        setLoadingFees(false);
      }
    };

    fetchFees();
  }, [student?.id, isOpen]);

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
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="mr-2 h-5 w-5" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent>
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
                <label className="text-sm font-medium text-muted-foreground">Date of Birth</label>
                <p className="text-sm flex items-center">
                  <Calendar className="mr-1 h-3 w-3" />
                  {student.date_of_birth ? new Date(student.date_of_birth).toLocaleDateString() : 'N/A'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Status</label>
                <Badge variant={student.status === 'active' ? 'default' : 'secondary'}>
                  {student.status}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Phone className="mr-2 h-5 w-5" />
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Phone Number</label>
                <p className="text-sm flex items-center">
                  <Phone className="mr-1 h-3 w-3" />
                  {student.phone_number || 'N/A'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Email</label>
                <p className="text-sm flex items-center">
                  <Mail className="mr-1 h-3 w-3" />
                  {student.email || 'N/A'}
                </p>
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
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Father's Name</label>
                <p className="text-sm">{student.father_name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Mother's Name</label>
                <p className="text-sm">{student.mother_name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Parents' Phone Number</label>
                <p className="text-sm flex items-center">
                  <Phone className="mr-1 h-3 w-3" />
                  {student.parents_phone_number || 'N/A'}
                </p>
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
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">City</label>
                <p className="text-sm">{student.city || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Country</label>
                <p className="text-sm">{countryName}</p>
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-muted-foreground">Full Address</label>
                <p className="text-sm">{student.address || 'N/A'}</p>
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
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Admission Number</label>
                <p className="text-sm">{student.admission_number || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Seat Number</label>
                <p className="text-sm">{student.seat_number || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">University</label>
                <p className="text-sm">{student.university_name || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Course</label>
                <p className="text-sm">{student.course_name || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Academic Session</label>
                <p className="text-sm">{student.session_name || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">12th Grade Marks (%)</label>
                <p className="text-sm">{student.twelfth_marks ? `${student.twelfth_marks}%` : 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">PCB Average</label>
                <p className="text-sm">{student.pcb_average ? `${student.pcb_average}%` : 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">NEET Roll Number</label>
                <p className="text-sm">{student.neet_roll_number || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Passing Year of Class 12</label>
                <p className="text-sm">{student.twelfth_passing_year || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Passing Year of Class 10</label>
                <p className="text-sm">{student.tenth_passing_year || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Passing Year of NEET</label>
                <p className="text-sm">{student.neet_passing_year || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Class 10 Marksheet Number</label>
                <p className="text-sm">{student.tenth_marksheet_number || 'N/A'}</p>
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
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Aadhaar Number</label>
                <p className="text-sm">{student.aadhaar_number || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Passport Number</label>
                <p className="text-sm">{student.passport_number || 'N/A'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Financial Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CreditCard className="mr-2 h-5 w-5" />
              Financial Summary
            </CardTitle>
            <CardDescription>Overall fee status for this student</CardDescription>
          </CardHeader>
          <CardContent>
            {loadingFees ? (
              <p className="text-sm text-muted-foreground">Loading fee details...</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 rounded-lg bg-gray-50">
                  <p className="text-sm text-muted-foreground">Total Due</p>
                  <p className="text-2xl font-bold">${feeSummary.totalDue.toLocaleString()}</p>
                </div>
                <div className="p-4 rounded-lg bg-gray-50">
                  <p className="text-sm text-muted-foreground">Total Paid</p>
                  <p className="text-2xl font-bold text-green-600">${feeSummary.totalPaid.toLocaleString()}</p>
                </div>
                <div className="p-4 rounded-lg bg-gray-50">
                  <p className="text-sm text-muted-foreground">Pending Balance</p>
                  <p className={`text-2xl font-bold ${feeSummary.balance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    ${feeSummary.balance.toLocaleString()}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Fee Payment Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CreditCard className="mr-2 h-5 w-5" />
              Fee Payment Details
            </CardTitle>
            <CardDescription>Component-wise dues and payment status</CardDescription>
          </CardHeader>
          <CardContent>
            {loadingFees ? (
              <p className="text-sm text-muted-foreground">Loading fee details...</p>
            ) : feePayments.length === 0 ? (
              <p className="text-sm text-muted-foreground">No fee records found for this student.</p>
            ) : (
              <div className="space-y-3">
                {feePayments.map((payment: any) => {
                  const balance = (payment.amount_due || 0) - (payment.amount_paid || 0);
                  const status = payment.payment_status as 'pending' | 'partial' | 'paid';
                  return (
                    <Card key={payment.id} className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 items-center">
                        <div className="col-span-2">
                          <p className="text-sm text-muted-foreground">Fee Type</p>
                          <p className="font-medium">
                            {payment.fee_structure_components?.fee_types?.name || 'N/A'}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {payment.fee_structure_components?.fee_structures?.name || ''}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Total Due</p>
                          <p className="font-medium">${(payment.amount_due || 0).toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Paid</p>
                          <p className="font-medium text-green-600">${(payment.amount_paid || 0).toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Balance</p>
                          <p className={`font-medium ${balance > 0 ? 'text-red-600' : 'text-green-600'}`}>${balance.toLocaleString()}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={status === 'paid' ? 'default' : status === 'partial' ? 'secondary' : 'destructive'}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </Badge>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Login Credentials */}
        {credentials && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Key className="mr-2 h-5 w-5" />
                Login Credentials
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Username</label>
                  <p className="text-sm font-mono bg-muted p-2 rounded">{credentials.username}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Password</label>
                  <p className="text-sm font-mono bg-muted p-2 rounded">{credentials.password}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {showAgentInfo && student.agent_name && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="mr-2 h-5 w-5" />
                Agent Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Agent</label>
                <p className="text-sm">{student.agent_name}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Student Documents */}
        <StudentDocuments student={student} />

        {/* Additional Information */}
        {student.scores && (
          <Card>
            <CardHeader>
              <CardTitle>Additional Scores/Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{student.scores}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </DetailViewModal>
  );
}
