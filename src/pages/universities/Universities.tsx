
import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import PageHeader from "@/components/shared/PageHeader";
import DataTable from "@/components/ui/DataTable";
import { Button } from "@/components/ui/button";
import { Plus, Download, Upload, Eye, Edit } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import DetailViewModal from "@/components/shared/DetailViewModal";
import EditModal from "@/components/shared/EditModal";
import UniversityForm, { UniversityFormData } from "@/components/forms/UniversityForm";

// Sample data for universities
const universitiesData = [
  {
    id: "1",
    name: "London University",
    studentCount: 25,
    totalFeesExpected: "$300,000",
    amountPaid: "$220,000",
    amountPending: "$80,000",
    lastPayment: "2025-04-15",
    status: "Active",
    location: "London, UK",
    contactPerson: "Dr. Robert Johnson",
    email: "admin@londonuniversity.edu",
    phone: "+44 20 7123 4567",
  },
  {
    id: "2",
    name: "Oxford University",
    studentCount: 18,
    totalFeesExpected: "$270,000",
    amountPaid: "$180,000",
    amountPending: "$90,000",
    lastPayment: "2025-04-10",
    status: "Active",
    location: "Oxford, UK",
    contactPerson: "Prof. Sarah Williams",
    email: "admin@oxford.edu",
    phone: "+44 18 6527 8901",
  },
  {
    id: "3",
    name: "Cambridge University",
    studentCount: 15,
    totalFeesExpected: "$225,000",
    amountPaid: "$225,000",
    amountPending: "$0",
    lastPayment: "2025-04-05",
    status: "Paid",
    location: "Cambridge, UK",
    contactPerson: "Dr. Michael Brown",
    email: "admin@cambridge.edu",
    phone: "+44 12 2333 4455",
  },
  {
    id: "4",
    name: "Harvard University",
    studentCount: 10,
    totalFeesExpected: "$200,000",
    amountPaid: "$120,000",
    amountPending: "$80,000",
    lastPayment: "2025-03-28",
    status: "Active",
    location: "Cambridge, MA, USA",
    contactPerson: "Prof. Lisa Johnson",
    email: "admin@harvard.edu",
    phone: "+1 617 495 1000",
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
  const [searchTerm, setSearchTerm] = useState("");
  const [universities, setUniversities] = useState<University[]>(universitiesData);
  
  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentUniversity, setCurrentUniversity] = useState<University | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredData = universities.filter(
    (university) =>
      university.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewUniversity = (university: University) => {
    setCurrentUniversity(university);
    setIsViewModalOpen(true);
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
          id: Date.now().toString(),
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
    { header: "University Name", accessorKey: "name" },
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
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={() => handleViewUniversity(row)}>
            <Eye className="mr-2 h-4 w-4" />
            View
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleEditUniversity(row)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
        </div>
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
        onSave={() => {}} // Form has its own submit handler
      >
        <UniversityForm 
          onSubmit={handleSaveUniversity}
          isSubmitting={isSubmitting}
        />
      </EditModal>
      
      {/* View University Modal */}
      {currentUniversity && (
        <DetailViewModal
          title={`University: ${currentUniversity.name}`}
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <h3 className="font-semibold">University Name</h3>
              <p>{currentUniversity.name}</p>
            </div>
            <div>
              <h3 className="font-semibold">Location</h3>
              <p>{currentUniversity.location}</p>
            </div>
            <div>
              <h3 className="font-semibold">Contact Person</h3>
              <p>{currentUniversity.contactPerson}</p>
            </div>
            <div>
              <h3 className="font-semibold">Email</h3>
              <p>{currentUniversity.email}</p>
            </div>
            <div>
              <h3 className="font-semibold">Phone</h3>
              <p>{currentUniversity.phone}</p>
            </div>
            <div>
              <h3 className="font-semibold">Student Count</h3>
              <p>{currentUniversity.studentCount}</p>
            </div>
            <div>
              <h3 className="font-semibold">Total Fees Expected</h3>
              <p>{currentUniversity.totalFeesExpected}</p>
            </div>
            <div>
              <h3 className="font-semibold">Amount Paid</h3>
              <p>{currentUniversity.amountPaid}</p>
            </div>
            <div>
              <h3 className="font-semibold">Amount Pending</h3>
              <p>{currentUniversity.amountPending}</p>
            </div>
            <div>
              <h3 className="font-semibold">Last Payment</h3>
              <p>{currentUniversity.lastPayment}</p>
            </div>
            <div>
              <h3 className="font-semibold">Status</h3>
              <p>{currentUniversity.status}</p>
            </div>
          </div>
        </DetailViewModal>
      )}
      
      {/* Edit University Modal */}
      {currentUniversity && (
        <EditModal
          title={`Edit University: ${currentUniversity.name}`}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSave={() => {}} // Form has its own submit handler
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
