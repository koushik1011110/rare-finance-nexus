import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import PageHeader from "@/components/shared/PageHeader";
import DataTable from "@/components/ui/DataTable";
import { Button } from "@/components/ui/button";
import { Plus, Download, Upload, Edit } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import EditModal from "@/components/shared/EditModal";
import UniversityForm, { UniversityFormData } from "@/components/forms/UniversityForm";
import UniversityPieChart from "@/components/dashboard/UniversityPieChart";

// Sample data for universities
const universitiesData = [
  {
    id: "tashkent",
    name: "Tashkent State Medical University",
    studentCount: 42,
    totalFeesExpected: "$630,000",
    amountPaid: "$420,000",
    amountPending: "$210,000",
    lastPayment: "2025-05-01",
    status: "Active",
    location: "Tashkent, Uzbekistan",
    contactPerson: "Dr. Alisher Navoiy",
    email: "admin@tsmu.edu.uz",
    phone: "+998 71 123 4567",
  },
  {
    id: "samarkand",
    name: "Samarkand State Medical University",
    studentCount: 35,
    totalFeesExpected: "$525,000",
    amountPaid: "$350,000",
    amountPending: "$175,000",
    lastPayment: "2025-04-28",
    status: "Active",
    location: "Samarkand, Uzbekistan",
    contactPerson: "Prof. Bobur Mirzayev",
    email: "admin@sammi.uz",
    phone: "+998 66 234 5678",
  },
  {
    id: "bukhara",
    name: "Bukhara State Medical Institute",
    studentCount: 28,
    totalFeesExpected: "$420,000",
    amountPaid: "$420,000",
    amountPending: "$0",
    lastPayment: "2025-04-15",
    status: "Paid",
    location: "Bukhara, Uzbekistan",
    contactPerson: "Dr. Nodira Azizova",
    email: "admin@bsmi.uz",
    phone: "+998 65 223 4455",
  },
  {
    id: "qarshi",
    name: "Qarshi State University",
    studentCount: 22,
    totalFeesExpected: "$330,000",
    amountPaid: "$220,000",
    amountPending: "$110,000",
    lastPayment: "2025-04-10",
    status: "Active",
    location: "Qarshi, Uzbekistan",
    contactPerson: "Prof. Aziza Karimova",
    email: "admin@qsu.uz",
    phone: "+998 75 221 3344",
  },
];

interface University {
  id: string;
  name: string;
  studentCount: number;
  totalFeesExpected: string;
  amountPaid: string;
  amountPending: string;
  lastPayment: string;
  status: string;
  location: string;
  contactPerson: string;
  email: string;
  phone: string;
}

const Universities = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [universities, setUniversities] = useState<University[]>(universitiesData);
  
  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentUniversity, setCurrentUniversity] = useState<University | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Create data for pie chart
  const paymentStatusData = [
    { 
      name: "Paid", 
      value: 420000, // From Bukhara State Medical Institute
      color: "#4CAF50" 
    },
    { 
      name: "Pending", 
      value: 495000, // Sum of pending amounts from other universities
      color: "#FF9800" 
    },
  ];

  const universityPaymentData = [
    { 
      name: "Tashkent", 
      value: 420000, 
      color: "#1E88E5" 
    },
    { 
      name: "Samarkand", 
      value: 350000, 
      color: "#7E57C2" 
    },
    { 
      name: "Bukhara", 
      value: 420000, 
      color: "#43A047" 
    },
    { 
      name: "Qarshi", 
      value: 220000, 
      color: "#F9A825" 
    },
  ];

  const filteredData = universities.filter(
    (university) =>
      university.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewUniversity = (university: University) => {
    navigate(`/universities/${university.id}`);
  };

  const handleEditUniversity = (university: University) => {
    setCurrentUniversity(university);
    setIsEditModalOpen(true);
  };

  const handleAddUniversity = () => {
    setIsAddModalOpen(true);
  };

  const handleSaveUniversity = (formData: UniversityFormData) => {
    setIsSubmitting(true);
    
    // Simulating API call
    setTimeout(() => {
      if (formData.id) {
        // Update existing university
        setUniversities(
          universities.map((university) =>
            university.id === formData.id
              ? {
                  ...university,
                  name: formData.name,
                  location: formData.location,
                  contactPerson: formData.contactPerson,
                  email: formData.email,
                  phone: formData.phone,
                  status: formData.status,
                }
              : university
          )
        );
        
        toast({
          title: "University Updated",
          description: `${formData.name} has been updated successfully.`,
        });
      } else {
        // Add new university
        const newUniversity: University = {
          id: formData.name.toLowerCase().replace(/\s+/g, '-'),
          name: formData.name,
          location: formData.location,
          contactPerson: formData.contactPerson,
          email: formData.email,
          phone: formData.phone,
          studentCount: 0,
          totalFeesExpected: "$0",
          amountPaid: "$0",
          amountPending: "$0",
          lastPayment: "-",
          status: formData.status,
        };
        
        setUniversities([newUniversity, ...universities]);
        
        toast({
          title: "University Added",
          description: `${formData.name} has been added successfully.`,
        });
      }
      
      setIsSubmitting(false);
      setIsAddModalOpen(false);
      setIsEditModalOpen(false);
    }, 1000);
  };

  const handleImport = () => {
    toast({
      title: "Feature Coming Soon",
      description: "Import functionality will be available shortly.",
    });
  };

  const handleExport = () => {
    toast({
      title: "Feature Coming Soon",
      description: "Export functionality will be available shortly.",
    });
  };

  const columns = [
    { 
      header: "University Name", 
      accessorKey: "name",
      cell: (row: any) => (
        <span 
          className="text-primary hover:underline cursor-pointer"
          onClick={() => handleViewUniversity(row)}
        >
          {row.name}
        </span>
      )
    },
    { header: "Student Count", accessorKey: "studentCount" },
    { header: "Total Fees Expected", accessorKey: "totalFeesExpected" },
    { header: "Amount Paid", accessorKey: "amountPaid" },
    { header: "Amount Pending", accessorKey: "amountPending" },
    { header: "Last Payment", accessorKey: "lastPayment" },
    {
      header: "Status",
      accessorKey: "status",
      cell: (row: any) => (
        <span
          className={`rounded-full px-2 py-1 text-xs font-medium ${
            row.status === "Paid"
              ? "bg-green-100 text-green-800"
              : "bg-blue-100 text-blue-800"
          }`}
        >
          {row.status}
        </span>
      ),
    },
    {
      header: "Actions",
      accessorKey: "actions",
      cell: (row: University) => (
        <Button variant="outline" size="sm" onClick={() => handleEditUniversity(row)}>
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </Button>
      ),
    },
  ];

  return (
    <MainLayout>
      <PageHeader
        title="University Management"
        description="Track university fees, payments, and student records"
        actions={
          <>
            <Button variant="outline" size="sm" onClick={handleImport}>
              <Upload className="mr-2 h-4 w-4" />
              Import
            </Button>
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button variant="default" size="sm" onClick={handleAddUniversity}>
              <Plus className="mr-2 h-4 w-4" />
              Add University
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-6 mb-6 lg:grid-cols-2">
        <UniversityPieChart 
          title="Payment Status"
          description="Paid vs Pending Amounts"
          data={paymentStatusData}
        />
        <UniversityPieChart 
          title="University Payments"
          description="Amount Paid to Each University"
          data={universityPaymentData}
        />
      </div>

      <div className="mb-6">
        <Input
          placeholder="Search by university name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="rounded-lg border bg-card shadow-sm">
        <DataTable columns={columns} data={filteredData} />
      </div>
      
      {/* Add University Modal */}
      <EditModal
        title="Add New University"
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      >
        <UniversityForm 
          onSubmit={handleSaveUniversity}
          isSubmitting={isSubmitting}
        />
      </EditModal>
      
      {/* Edit University Modal */}
      {currentUniversity && (
        <EditModal
          title={`Edit University: ${currentUniversity.name}`}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
        >
          <UniversityForm 
            initialData={{
              id: currentUniversity.id,
              name: currentUniversity.name,
              location: currentUniversity.location,
              contactPerson: currentUniversity.contactPerson,
              email: currentUniversity.email,
              phone: currentUniversity.phone,
              status: currentUniversity.status as "Active" | "Paid" | "Inactive",
            }}
            onSubmit={handleSaveUniversity}
            isSubmitting={isSubmitting}
          />
        </EditModal>
      )}
    </MainLayout>
  );
};

export default Universities;
