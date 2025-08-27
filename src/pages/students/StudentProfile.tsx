import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import PageHeader from "@/components/shared/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Phone, MapPin, GraduationCap, Calendar, CreditCard, Users, Key } from "lucide-react";
import StudentDocuments from "@/components/students/StudentDocuments";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

export default function StudentProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState<any | null>(null);
  const [credentials, setCredentials] = useState<{ username: string; password: string } | null>(null);
  const [visaInfo, setVisaInfo] = useState<any | null>(null);

  // Helper: determine if visa steps are all completed
  const isVisaCompleted = (visa: any | null) => {
    if (!visa) return false;
    // Consider these fields required for visa completion
    return !!(visa.application_submitted && visa.visa_interview && visa.visa_approved && visa.residency_registration);
  };

  // Helper: required document keys for admission/visa flows
  const requiredDocumentKeys = [
    'photo_url',
    'passport_copy_url',
    'aadhaar_copy_url',
    'twelfth_certificate_url',
    'admission_letter_url'
  ];

  const areRequiredDocsPresent = (s: any | null) => {
    if (!s) return false;
    return requiredDocumentKeys.every((k) => !!s[k]);
  };
  const [feePayments, setFeePayments] = useState<any[]>([]);
  const [loadingFees, setLoadingFees] = useState(false);
  const [feeSummary, setFeeSummary] = useState({ totalDue: 0, totalPaid: 0, balance: 0 });

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      // Fetch student record first
      const { data, error } = await supabase.from('students').select('*').eq('id', Number(id)).single();
      if (!error && data) {
        // If students table now uses country_id as FK, fetch the country name explicitly
        try {
          if (data.country_id) {
            const { data: countryData, error: countryError } = await supabase
              .from('countries')
              .select('name')
              .eq('id', data.country_id)
              .single();
            if (!countryError && countryData) data.country = countryData.name;
            else data.country = data.country ?? null;
          } else {
            data.country = data.country ?? null;
          }
        } catch (e) {
          data.country = data.country ?? null;
        }

        setStudent(data);
      }
    };
    load();
  }, [id]);

  useEffect(() => {
    const loadVisa = async () => {
      if (!student?.id) return;
      try {
        const { data, error } = await supabase
          .from('student_visa')
          .select('*')
          .eq('student_id', student.id)
          .single();
        if (!error) setVisaInfo(data || null);
      } catch (e) {
        setVisaInfo(null);
      }
    };
    loadVisa();
  }, [student?.id]);

  useEffect(() => {
    const fetchCredentials = async () => {
      if (student?.id) {
        const { data, error } = await supabase
          .from('student_credentials')
          .select('username, password')
          .eq('student_id', student.id)
          .single();
        if (!error && data) setCredentials(data);
      }
    };
    fetchCredentials();
  }, [student?.id]);

  useEffect(() => {
    const fetchFees = async () => {
      if (!student?.id) return;
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
        setFeePayments([]);
        setFeeSummary({ totalDue: 0, totalPaid: 0, balance: 0 });
      } finally {
        setLoadingFees(false);
      }
    };
    fetchFees();
  }, [student?.id]);

  if (!student) {
    return (
      <MainLayout>
        <PageHeader title="Student Profile" description="Loading student..." />
        <div>Loading...</div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <PageHeader title={`Student Profile: ${student.first_name} ${student.last_name}`} description="Full page student profile" />
      <div className="space-y-6">
        {/* Top summary: photo + key info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-1">
            <Card>
              <CardContent>
                <div className="flex flex-col items-center text-center">
                  <img
                    src={student.photo_url || '/placeholder.svg'}
                    alt={`${student.first_name} ${student.last_name}`}
                    className="w-36 h-48 object-cover rounded border mb-4"
                    onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/placeholder.svg'; }}
                  />
                  <h3 className="text-lg font-semibold">{student.first_name} {student.last_name}</h3>
                  <p className="text-sm text-muted-foreground">{student.admission_number || 'No admission number'}</p>
                  <div className="mt-3 flex gap-2">
                    <Badge variant={student.status === 'active' ? 'default' : 'secondary'}>{student.status || 'unknown'}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">Quick Info</CardTitle>
                <CardDescription>Essential student details at a glance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">University</label>
                    <p className="text-sm">{student.university_name || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Course</label>
                    <p className="text-sm">{student.course_name || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Session</label>
                    <p className="text-sm">{student.session_name || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Seat Number</label>
                    <p className="text-sm">{student.seat_number || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Phone</label>
                    <p className="text-sm">{student.phone_number || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Email</label>
                    <p className="text-sm">{student.email || 'N/A'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex justify-between">
          <div />
          <div>
            <Button variant="outline" onClick={() => navigate(-1)}>Back</Button>
          </div>
        </div>

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
                <p className="text-sm">{student.country || 'N/A'}</p>
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

        <StudentDocuments student={student} />

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

        {/* Visa + Documents Status - moved to the bottom */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">Status</CardTitle>
            <CardDescription>Visa and document completion status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Visa Status</p>
                <div className="mt-2">
                  <Badge variant={isVisaCompleted(visaInfo) ? 'default' : 'secondary'}>
                    {isVisaCompleted(visaInfo) ? 'Completed' : 'Pending'}
                  </Badge>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Documents Pending Status</p>
                <div className="mt-2">
                  <Badge variant={areRequiredDocsPresent(student) ? 'default' : 'destructive'}>
                    {areRequiredDocsPresent(student) ? 'Completed' : 'Pending'}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
