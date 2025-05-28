
import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import PageHeader from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import DataTable, { Column } from "@/components/ui/DataTable";
import { toast } from "@/hooks/use-toast";
import { Plus, Edit, Trash, Search, Users } from "lucide-react";

interface FeeMaster {
  id: string;
  feeType: string;
  amount: number;
  assignedStudents: string[];
  createdAt: string;
}

interface Student {
  id: string;
  name: string;
  phone: string;
  course: string;
  batch: string;
  assignedFees: { feeType: string; amount: number }[];
}

const FeesMaster = () => {
  const [feesMaster, setFeesMaster] = useState<FeeMaster[]>([
    { id: "1", feeType: "Tuition Fee", amount: 15000, assignedStudents: ["1", "2"], createdAt: "2025-01-01" },
    { id: "2", feeType: "Hostel Fee", amount: 8000, assignedStudents: ["1"], createdAt: "2025-01-02" },
    { id: "3", feeType: "Transport Fee", amount: 2000, assignedStudents: ["2", "3"], createdAt: "2025-01-03" },
  ]);

  const [students, setStudents] = useState<Student[]>([
    { 
      id: "1", 
      name: "John Doe", 
      phone: "+1234567890", 
      course: "MBBS", 
      batch: "2024",
      assignedFees: [
        { feeType: "Tuition Fee", amount: 15000 },
        { feeType: "Hostel Fee", amount: 8000 }
      ]
    },
    { 
      id: "2", 
      name: "Jane Smith", 
      phone: "+1234567891", 
      course: "MBBS", 
      batch: "2024",
      assignedFees: [
        { feeType: "Tuition Fee", amount: 15000 },
        { feeType: "Transport Fee", amount: 2000 }
      ]
    },
    { 
      id: "3", 
      name: "Bob Wilson", 
      phone: "+1234567892", 
      course: "BDS", 
      batch: "2023",
      assignedFees: [
        { feeType: "Transport Fee", amount: 2000 }
      ]
    },
    { 
      id: "4", 
      name: "Alice Johnson", 
      phone: "+1234567893", 
      course: "MBBS", 
      batch: "2023",
      assignedFees: []
    },
    { 
      id: "5", 
      name: "Mike Brown", 
      phone: "+1234567894", 
      course: "BDS", 
      batch: "2024",
      assignedFees: []
    },
  ]);

  const [formData, setFormData] = useState({
    feeType: "",
    amount: "",
  });

  const [searchFilters, setSearchFilters] = useState({
    course: "all",
    batch: "all",
    name: "",
  });

  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [showStudentTable, setShowStudentTable] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const feeTypes = [
    "Tuition Fee",
    "Hostel Fee", 
    "Transport Fee",
    "Lab Fee",
  ];

  const courses = ["MBBS", "BDS", "BAMS", "BHMS"];
  const batches = ["2021", "2022", "2023", "2024", "2025"];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSearchFilterChange = (field: string, value: string) => {
    setSearchFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleSearchStudents = () => {
    if (!formData.feeType || !formData.amount) {
      toast({
        title: "Error",
        description: "Please select fee type and enter amount first.",
        variant: "destructive",
      });
      return;
    }

    const filtered = students.filter(student => {
      const matchesCourse = searchFilters.course === "all" || student.course === searchFilters.course;
      const matchesBatch = searchFilters.batch === "all" || student.batch === searchFilters.batch;
      const matchesName = !searchFilters.name || student.name.toLowerCase().includes(searchFilters.name.toLowerCase());
      
      return matchesCourse && matchesBatch && matchesName;
    });

    setFilteredStudents(filtered);
    setShowStudentTable(true);
    setSelectedStudents([]);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedStudents(filteredStudents.map(student => student.id));
    } else {
      setSelectedStudents([]);
    }
  };

  const handleStudentSelect = (studentId: string, checked: boolean) => {
    if (checked) {
      setSelectedStudents(prev => [...prev, studentId]);
    } else {
      setSelectedStudents(prev => prev.filter(id => id !== studentId));
    }
  };

  const handleAssignFees = () => {
    if (selectedStudents.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one student.",
        variant: "destructive",
      });
      return;
    }

    // Update students with assigned fees
    setStudents(prev => prev.map(student => {
      if (selectedStudents.includes(student.id)) {
        const existingFeeIndex = student.assignedFees.findIndex(fee => fee.feeType === formData.feeType);
        const updatedFees = [...student.assignedFees];
        
        if (existingFeeIndex >= 0) {
          updatedFees[existingFeeIndex] = { feeType: formData.feeType, amount: parseFloat(formData.amount) };
        } else {
          updatedFees.push({ feeType: formData.feeType, amount: parseFloat(formData.amount) });
        }
        
        return { ...student, assignedFees: updatedFees };
      }
      return student;
    }));

    // Update or create fee master record
    const existingFeeIndex = feesMaster.findIndex(fee => fee.feeType === formData.feeType);
    if (existingFeeIndex >= 0) {
      setFeesMaster(prev => prev.map(fee => 
        fee.feeType === formData.feeType 
          ? { 
              ...fee, 
              amount: parseFloat(formData.amount),
              assignedStudents: [...new Set([...fee.assignedStudents, ...selectedStudents])]
            }
          : fee
      ));
    } else {
      const newFeeMaster: FeeMaster = {
        id: Date.now().toString(),
        feeType: formData.feeType,
        amount: parseFloat(formData.amount),
        assignedStudents: selectedStudents,
        createdAt: new Date().toISOString().split('T')[0],
      };
      setFeesMaster(prev => [...prev, newFeeMaster]);
    }

    toast({
      title: "Fees Assigned Successfully",
      description: `${formData.feeType} (₹${formData.amount}) has been assigned to ${selectedStudents.length} students.`,
    });

    // Reset form and hide table
    setFormData({ feeType: "", amount: "" });
    setSearchFilters({ course: "all", batch: "all", name: "" });
    setSelectedStudents([]);
    setShowStudentTable(false);
    setFilteredStudents([]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!formData.feeType || !formData.amount) {
      toast({
        title: "Error",
        description: "Fee type and amount are required.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    setTimeout(() => {
      if (editingId) {
        setFeesMaster(prev => prev.map(fee => 
          fee.id === editingId 
            ? { 
                ...fee, 
                feeType: formData.feeType, 
                amount: parseFloat(formData.amount)
              }
            : fee
        ));
        toast({
          title: "Fee Master Updated",
          description: `${formData.feeType} has been updated successfully.`,
        });
        setEditingId(null);
      }

      setFormData({ feeType: "", amount: "" });
      setIsSubmitting(false);
    }, 500);
  };

  const handleEdit = (feeMaster: FeeMaster) => {
    setFormData({
      feeType: feeMaster.feeType,
      amount: feeMaster.amount.toString(),
    });
    setEditingId(feeMaster.id);
    setShowStudentTable(false);
  };

  const handleDelete = (id: string) => {
    setFeesMaster(prev => prev.filter(fee => fee.id !== id));
    toast({
      title: "Fee Master Deleted",
      description: "Fee master has been deleted successfully.",
    });
  };

  const studentColumns: Column<Student>[] = [
    {
      header: "Select",
      accessorKey: "actions",
      cell: (student: Student) => (
        <Checkbox
          checked={selectedStudents.includes(student.id)}
          onCheckedChange={(checked) => handleStudentSelect(student.id, checked as boolean)}
        />
      ),
    },
    { header: "Student Name", accessorKey: "name" },
    { header: "Phone Number", accessorKey: "phone" },
    { header: "Course", accessorKey: "course" },
    { header: "Batch", accessorKey: "batch" },
    {
      header: "Assigned Fees",
      accessorKey: "assignedFees",
      cell: (student: Student) => (
        <span className="text-sm text-muted-foreground">
          {student.assignedFees.length} fees assigned
        </span>
      ),
    },
  ];

  const columns: Column<FeeMaster>[] = [
    { header: "Fee Type", accessorKey: "feeType" },
    { 
      header: "Amount", 
      accessorKey: "amount",
      cell: (feeMaster: FeeMaster) => `₹${feeMaster.amount.toLocaleString()}`
    },
    { 
      header: "Assigned Students", 
      accessorKey: "assignedStudents",
      cell: (feeMaster: FeeMaster) => `${feeMaster.assignedStudents.length} students`
    },
    { header: "Created Date", accessorKey: "createdAt" },
    {
      header: "Actions",
      accessorKey: "actions",
      cell: (feeMaster: FeeMaster) => (
        <div className="flex space-x-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleEdit(feeMaster)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => handleDelete(feeMaster.id)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <MainLayout>
      <PageHeader
        title="Fees Master"
        description="Manage fee amounts and assign them to students"
      />
      
      <div className="space-y-6">
        {/* Fee Setup Form */}
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? "Edit Fee Master" : "Create New Fee Assignment"}</CardTitle>
            <CardDescription>
              {editingId ? "Update fee details" : "Set fee amount and search for students to assign"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="feeType">Fee Type *</Label>
                  <Select value={formData.feeType} onValueChange={(value) => handleInputChange("feeType", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select fee type" />
                    </SelectTrigger>
                    <SelectContent>
                      {feeTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount">Amount (₹) *</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={formData.amount}
                    onChange={(e) => handleInputChange("amount", e.target.value)}
                    placeholder="Enter amount"
                  />
                </div>
              </div>

              {editingId && (
                <div className="flex space-x-2">
                  <Button type="submit" disabled={isSubmitting} className="flex-1">
                    <Plus className="mr-2 h-4 w-4" />
                    {isSubmitting ? "Updating..." : "Update Fee Master"}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => {
                      setEditingId(null);
                      setFormData({ feeType: "", amount: "" });
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </form>
          </CardContent>
        </Card>

        {/* Student Search Section */}
        {!editingId && (
          <Card>
            <CardHeader>
              <CardTitle>Search Students</CardTitle>
              <CardDescription>Find students to assign the fee based on course, batch, or name</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="course">Course</Label>
                    <Select value={searchFilters.course} onValueChange={(value) => handleSearchFilterChange("course", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="All courses" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All courses</SelectItem>
                        {courses.map((course) => (
                          <SelectItem key={course} value={course}>
                            {course}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="batch">Batch</Label>
                    <Select value={searchFilters.batch} onValueChange={(value) => handleSearchFilterChange("batch", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="All batches" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All batches</SelectItem>
                        {batches.map((batch) => (
                          <SelectItem key={batch} value={batch}>
                            {batch}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name">Student Name</Label>
                    <Input
                      id="name"
                      value={searchFilters.name}
                      onChange={(e) => handleSearchFilterChange("name", e.target.value)}
                      placeholder="Search by name"
                    />
                  </div>
                </div>

                <Button onClick={handleSearchStudents} className="w-full md:w-auto">
                  <Search className="mr-2 h-4 w-4" />
                  Search Students
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Student Selection Table */}
        {showStudentTable && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Select Students ({filteredStudents.length} found)</span>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={selectedStudents.length === filteredStudents.length && filteredStudents.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                    <Label className="text-sm">Select All</Label>
                  </div>
                  <Button onClick={handleAssignFees} disabled={selectedStudents.length === 0}>
                    <Users className="mr-2 h-4 w-4" />
                    Assign to {selectedStudents.length} Students
                  </Button>
                </div>
              </CardTitle>
              <CardDescription>
                Assigning {formData.feeType} (₹{formData.amount}) to selected students
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable columns={studentColumns} data={filteredStudents} />
            </CardContent>
          </Card>
        )}

        {/* Existing Fee Masters */}
        <Card>
          <CardHeader>
            <CardTitle>Existing Fee Masters</CardTitle>
            <CardDescription>List of all fee assignments</CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable columns={columns} data={feesMaster} />
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default FeesMaster;
