
import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import PageHeader from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import DataTable, { Column } from "@/components/ui/DataTable";
import DetailViewModal from "@/components/shared/DetailViewModal";
import { toast } from "@/hooks/use-toast";
import { CreditCard, Phone } from "lucide-react";

interface StudentFee {
  id: string;
  feeType: string;
  amount: number;
  status: "Pending" | "Paid" | "Offline Paid";
  dueDate: string;
}

interface Student {
  id: string;
  name: string;
  phoneNumber: string;
  fees: StudentFee[];
}

const CollectFees = () => {
  const [students] = useState<Student[]>([
    {
      id: "1",
      name: "John Doe",
      phoneNumber: "+91 9876543210",
      fees: [
        { id: "1", feeType: "Tuition Fee", amount: 15000, status: "Pending", dueDate: "2025-02-01" },
        { id: "2", feeType: "Hostel Fee", amount: 8000, status: "Paid", dueDate: "2025-01-15" },
        { id: "3", feeType: "Lab Fee", amount: 2000, status: "Pending", dueDate: "2025-01-30" },
      ]
    },
    {
      id: "2", 
      name: "Jane Smith",
      phoneNumber: "+91 9876543211",
      fees: [
        { id: "4", feeType: "Tuition Fee", amount: 15000, status: "Offline Paid", dueDate: "2025-01-20" },
        { id: "5", feeType: "Transport Fee", amount: 2000, status: "Pending", dueDate: "2025-02-05" },
      ]
    },
    {
      id: "3",
      name: "Bob Wilson", 
      phoneNumber: "+91 9876543212",
      fees: [
        { id: "6", feeType: "Transport Fee", amount: 2000, status: "Paid", dueDate: "2025-01-10" },
        { id: "7", feeType: "Lab Fee", amount: 2000, status: "Pending", dueDate: "2025-02-10" },
      ]
    },
    {
      id: "4",
      name: "Alice Johnson",
      phoneNumber: "+91 9876543213", 
      fees: [
        { id: "8", feeType: "Tuition Fee", amount: 15000, status: "Pending", dueDate: "2025-01-25" },
      ]
    },
  ]);

  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [studentFees, setStudentFees] = useState<StudentFee[]>([]);

  const handleCollectFees = (student: Student) => {
    setSelectedStudent(student);
    setStudentFees(student.fees);
    setIsModalOpen(true);
  };

  const handleStatusChange = (feeId: string, newStatus: "Pending" | "Paid" | "Offline Paid") => {
    setStudentFees(prev => prev.map(fee => 
      fee.id === feeId ? { ...fee, status: newStatus } : fee
    ));
    
    toast({
      title: "Fee Status Updated",
      description: `Fee status has been changed to ${newStatus}.`,
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      "Pending": { variant: "destructive" as const, color: "text-red-600" },
      "Paid": { variant: "default" as const, color: "text-green-600" },
      "Offline Paid": { variant: "secondary" as const, color: "text-blue-600" }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <Badge variant={config.variant} className={config.color}>
        {status}
      </Badge>
    );
  };

  const studentColumns: Column<Student>[] = [
    { header: "Student Name", accessorKey: "name" },
    { 
      header: "Phone Number", 
      accessorKey: "phoneNumber",
      cell: (student: Student) => (
        <div className="flex items-center">
          <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
          {student.phoneNumber}
        </div>
      )
    },
    {
      header: "Total Fees",
      accessorKey: "fees",
      cell: (student: Student) => {
        const totalAmount = student.fees.reduce((sum, fee) => sum + fee.amount, 0);
        return `₹${totalAmount.toLocaleString()}`;
      }
    },
    {
      header: "Pending Fees",
      accessorKey: "fees",
      cell: (student: Student) => {
        const pendingAmount = student.fees
          .filter(fee => fee.status === "Pending")
          .reduce((sum, fee) => sum + fee.amount, 0);
        return `₹${pendingAmount.toLocaleString()}`;
      }
    },
    {
      header: "Actions",
      accessorKey: "actions",
      cell: (student: Student) => (
        <Button
          size="sm"
          onClick={() => handleCollectFees(student)}
        >
          <CreditCard className="mr-2 h-4 w-4" />
          Collect Fees
        </Button>
      ),
    },
  ];

  const feeColumns: Column<StudentFee>[] = [
    { header: "Fee Type", accessorKey: "feeType" },
    { 
      header: "Amount", 
      accessorKey: "amount",
      cell: (fee: StudentFee) => `₹${fee.amount.toLocaleString()}`
    },
    { header: "Due Date", accessorKey: "dueDate" },
    {
      header: "Status",
      accessorKey: "status", 
      cell: (fee: StudentFee) => getStatusBadge(fee.status)
    },
    {
      header: "Actions",
      accessorKey: "actions",
      cell: (fee: StudentFee) => (
        <div className="flex space-x-2">
          {fee.status === "Pending" && (
            <>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleStatusChange(fee.id, "Paid")}
              >
                Mark Paid
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => handleStatusChange(fee.id, "Offline Paid")}
              >
                Offline Paid
              </Button>
            </>
          )}
          {fee.status !== "Pending" && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleStatusChange(fee.id, "Pending")}
            >
              Mark Pending
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <MainLayout>
      <PageHeader
        title="Collect Fees"
        description="Manage fee collection from students"
      />
      
      <Card>
        <CardHeader>
          <CardTitle>Students Fee Collection</CardTitle>
          <CardDescription>
            View all students and manage their fee payments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable columns={studentColumns} data={students} />
        </CardContent>
      </Card>

      <DetailViewModal
        title={`Fee Details - ${selectedStudent?.name || ""}`}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        {selectedStudent && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm text-muted-foreground">Student Name</p>
                <p className="font-medium">{selectedStudent.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Phone Number</p>
                <p className="font-medium">{selectedStudent.phoneNumber}</p>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-3">Fee Details</h3>
              <DataTable columns={feeColumns} data={studentFees} />
            </div>
            
            <div className="grid grid-cols-3 gap-4 mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Total Fees</p>
                <p className="text-lg font-bold">
                  ₹{studentFees.reduce((sum, fee) => sum + fee.amount, 0).toLocaleString()}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Paid</p>
                <p className="text-lg font-bold text-green-600">
                  ₹{studentFees
                    .filter(fee => fee.status === "Paid" || fee.status === "Offline Paid")
                    .reduce((sum, fee) => sum + fee.amount, 0)
                    .toLocaleString()}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-lg font-bold text-red-600">
                  ₹{studentFees
                    .filter(fee => fee.status === "Pending")
                    .reduce((sum, fee) => sum + fee.amount, 0)
                    .toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        )}
      </DetailViewModal>
    </MainLayout>
  );
};

export default CollectFees;
