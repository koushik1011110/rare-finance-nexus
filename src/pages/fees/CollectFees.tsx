
import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import MainLayout from "@/components/layout/MainLayout";
import PageHeader from "@/components/shared/PageHeader";
import StudentSearch from "@/components/fees/StudentSearch";
import InvoiceGenerator from "@/components/fees/InvoiceGenerator";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import DataTable, { Column } from "@/components/ui/DataTable";
import DetailViewModal from "@/components/shared/DetailViewModal";
import { toast } from "@/hooks/use-toast";
import { CreditCard, Phone, DollarSign, RefreshCw, User, Mail, GraduationCap, Calendar } from "lucide-react";
import {
  feePaymentsAPI,
  type FeePayment
} from "@/lib/supabase-database";

interface StudentWithFees {
  id: number;
  first_name: string;
  last_name: string;
  phone_number?: string;
  email?: string;
  universities?: { name: string };
  courses?: { name: string };
  academic_sessions?: { session_name: string };
  fee_payments: (FeePayment & {
    fee_structure_components: {
      fee_types: { name: string };
      fee_structures: { name: string };
      amount: number;
      frequency: string;
    };
  })[];
}

const CollectFees = () => {
  const queryClient = useQueryClient();
  const [selectedStudent, setSelectedStudent] = useState<StudentWithFees | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [paymentAmounts, setPaymentAmounts] = useState<{ [key: number]: string }>({});
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch students with fee structures
  const { data: studentsWithFees = [], refetch, isLoading, error } = useQuery({
    queryKey: ['studentsWithFees'],
    queryFn: feePaymentsAPI.getStudentsWithFeeStructures,
  });

  console.log('Students with fees data:', studentsWithFees);
  console.log('Query error:', error);

  // Filter students based on search term
  const filteredStudents = useMemo(() => {
    if (!searchTerm) return studentsWithFees;
    
    const searchLower = searchTerm.toLowerCase();
    return studentsWithFees.filter((student: StudentWithFees) => {
      const fullName = `${student.first_name} ${student.last_name}`.toLowerCase();
      const phone = student.phone_number?.toLowerCase() || '';
      const university = student.universities?.name?.toLowerCase() || '';
      const course = student.courses?.name?.toLowerCase() || '';
      const email = student.email?.toLowerCase() || '';
      
      return fullName.includes(searchLower) ||
             phone.includes(searchLower) ||
             university.includes(searchLower) ||
             course.includes(searchLower) ||
             email.includes(searchLower);
    });
  }, [studentsWithFees, searchTerm]);

  // Update payment mutation
  const updatePaymentMutation = useMutation({
    mutationFn: async ({ paymentId, amountPaid, totalDue }: { paymentId: number; amountPaid: number; totalDue: number }) => {
      let status: 'pending' | 'partial' | 'paid' = 'pending';
      
      if (amountPaid >= totalDue) {
        status = 'paid';
      } else if (amountPaid > 0) {
        status = 'partial';
      }
      
      return feePaymentsAPI.updatePayment(paymentId, amountPaid, status);
    },
    onSuccess: () => {
      toast({
        title: "Payment Updated",
        description: "Payment status updated successfully.",
      });
      refetch();
      setPaymentAmounts({});
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update payment.",
        variant: "destructive",
      });
      console.error('Payment update error:', error);
    },
  });

  const handleCollectFees = (student: StudentWithFees) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  const handlePaymentUpdate = (paymentId: number, totalDue: number) => {
    const amountPaid = parseFloat(paymentAmounts[paymentId] || "0");
    
    if (amountPaid < 0) {
      toast({
        title: "Error",
        description: "Payment amount cannot be negative.",
        variant: "destructive",
      });
      return;
    }

    updatePaymentMutation.mutate({ paymentId, amountPaid, totalDue });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      "pending": { variant: "destructive" as const, color: "text-red-600" },
      "partial": { variant: "secondary" as const, color: "text-yellow-600" },
      "paid": { variant: "default" as const, color: "text-green-600" }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <Badge variant={config.variant} className={config.color}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const calculateStudentTotals = (student: StudentWithFees) => {
    const totalDue = student.fee_payments.reduce((sum, payment) => sum + payment.amount_due, 0);
    const totalPaid = student.fee_payments.reduce((sum, payment) => sum + (payment.amount_paid || 0), 0);
    const totalPending = totalDue - totalPaid;
    
    return { totalDue, totalPaid, totalPending };
  };

  const generateReceiptNumber = () => {
    return `REC-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  };

  const studentColumns: Column<StudentWithFees>[] = [
    { 
      header: "Student Name", 
      accessorKey: "first_name",
      cell: (student: StudentWithFees) => `${student.first_name} ${student.last_name}`
    },
    { 
      header: "Phone Number", 
      accessorKey: "phone_number",
      cell: (student: StudentWithFees) => (
        <div className="flex items-center">
          <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
          {student.phone_number || "N/A"}
        </div>
      )
    },
    {
      header: "University",
      accessorKey: "universities",
      cell: (student: StudentWithFees) => student.universities?.name || "N/A"
    },
    {
      header: "Course",
      accessorKey: "courses", 
      cell: (student: StudentWithFees) => student.courses?.name || "N/A"
    },
    {
      header: "Academic Session",
      accessorKey: "academic_sessions",
      cell: (student: StudentWithFees) => student.academic_sessions?.session_name || "N/A"
    },
    {
      header: "Total Due",
      accessorKey: "fee_payments",
      cell: (student: StudentWithFees) => {
        const { totalDue } = calculateStudentTotals(student);
        return `₹${totalDue.toLocaleString()}`;
      }
    },
    {
      header: "Total Paid",
      accessorKey: "fee_payments",
      cell: (student: StudentWithFees) => {
        const { totalPaid } = calculateStudentTotals(student);
        return `₹${totalPaid.toLocaleString()}`;
      }
    },
    {
      header: "Pending",
      accessorKey: "fee_payments",
      cell: (student: StudentWithFees) => {
        const { totalPending } = calculateStudentTotals(student);
        return (
          <span className={totalPending > 0 ? "text-red-600 font-medium" : "text-green-600 font-medium"}>
            ₹{totalPending.toLocaleString()}
          </span>
        );
      }
    },
    {
      header: "Actions",
      accessorKey: "actions",
      cell: (student: StudentWithFees) => (
        <Button
          size="sm"
          onClick={() => handleCollectFees(student)}
          disabled={student.fee_payments.length === 0}
        >
          <CreditCard className="mr-2 h-4 w-4" />
          Collect Fees
        </Button>
      ),
    },
  ];

  const paymentColumns: Column<StudentWithFees['fee_payments'][0]>[] = [
    {
      header: "Fee Type",
      accessorKey: "fee_structure_components",
      cell: (payment: StudentWithFees['fee_payments'][0]) => 
        payment.fee_structure_components?.fee_types?.name || "N/A"
    },
    {
      header: "Structure",
      accessorKey: "fee_structure_components",
      cell: (payment: StudentWithFees['fee_payments'][0]) => 
        payment.fee_structure_components?.fee_structures?.name || "N/A"
    },
    {
      header: "Frequency",
      accessorKey: "fee_structure_components",
      cell: (payment: StudentWithFees['fee_payments'][0]) => 
        payment.fee_structure_components?.frequency || "N/A"
    },
    { 
      header: "Amount Due", 
      accessorKey: "amount_due",
      cell: (payment: StudentWithFees['fee_payments'][0]) => `₹${payment.amount_due.toLocaleString()}`
    },
    { 
      header: "Amount Paid", 
      accessorKey: "amount_paid",
      cell: (payment: StudentWithFees['fee_payments'][0]) => `₹${(payment.amount_paid || 0).toLocaleString()}`
    },
    { 
      header: "Due Date", 
      accessorKey: "due_date",
      cell: (payment: StudentWithFees['fee_payments'][0]) => 
        payment.due_date ? new Date(payment.due_date).toLocaleDateString() : "N/A"
    },
    {
      header: "Status",
      accessorKey: "payment_status", 
      cell: (payment: StudentWithFees['fee_payments'][0]) => getStatusBadge(payment.payment_status)
    },
    {
      header: "Payment Actions",
      accessorKey: "actions",
      cell: (payment: StudentWithFees['fee_payments'][0]) => (
        <div className="flex items-center space-x-2 min-w-fit">
          <Input
            type="number"
            placeholder="Amount"
            className="w-20 text-sm"
            value={paymentAmounts[payment.id] || ""}
            onChange={(e) => setPaymentAmounts(prev => ({ ...prev, [payment.id]: e.target.value }))}
          />
          <Button
            size="sm"
            onClick={() => handlePaymentUpdate(payment.id, payment.amount_due)}
            disabled={updatePaymentMutation.isPending}
            className="px-2"
          >
            <DollarSign className="h-3 w-3" />
          </Button>
          {payment.amount_paid && payment.amount_paid > 0 && selectedStudent && (
            <InvoiceGenerator
              invoiceData={{
                student: selectedStudent,
                payment: payment,
                receiptNumber: generateReceiptNumber()
              }}
              onGenerateInvoice={() => {
                toast({
                  title: "Invoice Generated",
                  description: "Invoice has been generated successfully.",
                });
              }}
            />
          )}
        </div>
      ),
    },
  ];

  return (
    <MainLayout>
      <PageHeader
        title="Collect Fees"
        description="Manage fee collection from students with assigned fee structures"
      />
      
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Students Fee Collection</CardTitle>
              <CardDescription>
                View all students with their assigned fee structures and collect payments
              </CardDescription>
            </div>
            <Button 
              variant="outline" 
              onClick={() => refetch()}
              disabled={isLoading}
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <StudentSearch 
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />
          
          {error && (
            <div className="text-center py-8">
              <p className="text-red-600">Error loading students: {error.message}</p>
              <Button onClick={() => refetch()} className="mt-2">
                Try Again
              </Button>
            </div>
          )}
          
          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Loading students...</p>
            </div>
          ) : !error && (
            <DataTable columns={studentColumns} data={filteredStudents} />
          )}
          
          {!isLoading && !error && filteredStudents.length === 0 && studentsWithFees.length > 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No students found matching your search.</p>
            </div>
          )}
          
          {!isLoading && !error && studentsWithFees.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No students with assigned fee structures found.</p>
              <p className="text-sm text-muted-foreground mt-2">
                Make sure you have created fee structures and assigned them to students.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <DetailViewModal
        title={`Fee Collection - ${selectedStudent?.first_name || ""} ${selectedStudent?.last_name || ""}`}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        {selectedStudent && (
          <div className="space-y-4 max-h-[80vh] overflow-y-auto">
            {/* Student Information Section */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border p-4">
              <h3 className="text-lg font-semibold mb-3 text-gray-900 flex items-center">
                <User className="h-5 w-5 mr-2" />
                Student Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-xs font-medium text-gray-600">Student Name</p>
                      <p className="text-sm font-semibold text-gray-900">{selectedStudent.first_name} {selectedStudent.last_name}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-xs font-medium text-gray-600">Phone Number</p>
                      <p className="text-sm text-gray-900">{selectedStudent.phone_number || "N/A"}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-xs font-medium text-gray-600">Email</p>
                      <p className="text-sm text-gray-900">{selectedStudent.email || "N/A"}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <GraduationCap className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-xs font-medium text-gray-600">University</p>
                      <p className="text-sm text-gray-900">{selectedStudent.universities?.name || "N/A"}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <GraduationCap className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-xs font-medium text-gray-600">Course</p>
                      <p className="text-sm text-gray-900">{selectedStudent.courses?.name || "N/A"}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-xs font-medium text-gray-600">Academic Session</p>
                      <p className="text-sm text-gray-900">{selectedStudent.academic_sessions?.session_name || "N/A"}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Fee Payment Details Section */}
            <div>
              <h3 className="text-lg font-semibold mb-3 text-gray-900 flex items-center">
                <CreditCard className="h-5 w-5 mr-2" />
                Fee Payment Details
              </h3>
              <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <DataTable columns={paymentColumns} data={selectedStudent.fee_payments} />
                </div>
              </div>
            </div>
            
            {/* Summary Section */}
            <div className="bg-gray-50 rounded-lg border p-4">
              <h3 className="text-lg font-semibold mb-3 text-gray-900">Payment Summary</h3>
              <div className="grid grid-cols-3 gap-4">
                {(() => {
                  const { totalDue, totalPaid, totalPending } = calculateStudentTotals(selectedStudent);
                  return (
                    <>
                      <div className="text-center p-3 bg-white rounded-lg border">
                        <p className="text-xs font-medium text-gray-600 mb-1">Total Due</p>
                        <p className="text-lg font-bold text-gray-900">₹{totalDue.toLocaleString()}</p>
                      </div>
                      <div className="text-center p-3 bg-white rounded-lg border">
                        <p className="text-xs font-medium text-gray-600 mb-1">Total Paid</p>
                        <p className="text-lg font-bold text-green-600">₹{totalPaid.toLocaleString()}</p>
                      </div>
                      <div className="text-center p-3 bg-white rounded-lg border">
                        <p className="text-xs font-medium text-gray-600 mb-1">Pending</p>
                        <p className="text-lg font-bold text-red-600">₹{totalPending.toLocaleString()}</p>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
          </div>
        )}
      </DetailViewModal>
    </MainLayout>
  );
};

export default CollectFees;
