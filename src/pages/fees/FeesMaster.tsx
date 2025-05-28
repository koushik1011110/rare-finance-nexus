
import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import PageHeader from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import DataTable, { Column } from "@/components/ui/DataTable";
import { toast } from "@/hooks/use-toast";
import { Plus, Edit, Trash } from "lucide-react";

interface FeeMaster {
  id: string;
  feeType: string;
  amount: number;
  assignedStudents: string[];
  createdAt: string;
}

const FeesMaster = () => {
  const [feesMaster, setFeesMaster] = useState<FeeMaster[]>([
    { id: "1", feeType: "Tuition Fee", amount: 15000, assignedStudents: ["John Doe", "Jane Smith"], createdAt: "2025-01-01" },
    { id: "2", feeType: "Hostel Fee", amount: 8000, assignedStudents: ["John Doe"], createdAt: "2025-01-02" },
    { id: "3", feeType: "Transport Fee", amount: 2000, assignedStudents: ["Jane Smith", "Bob Wilson"], createdAt: "2025-01-03" },
  ]);

  const [formData, setFormData] = useState({
    feeType: "",
    amount: "",
    selectedStudents: [] as string[],
  });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const feeTypes = [
    "Tuition Fee",
    "Hostel Fee", 
    "Transport Fee",
    "Lab Fee",
  ];

  const students = [
    "John Doe",
    "Jane Smith",
    "Bob Wilson",
    "Alice Johnson",
    "Mike Brown",
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleStudentToggle = (student: string) => {
    setFormData(prev => ({
      ...prev,
      selectedStudents: prev.selectedStudents.includes(student)
        ? prev.selectedStudents.filter(s => s !== student)
        : [...prev.selectedStudents, student]
    }));
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
                amount: parseFloat(formData.amount),
                assignedStudents: formData.selectedStudents
              }
            : fee
        ));
        toast({
          title: "Fee Master Updated",
          description: `${formData.feeType} has been updated successfully.`,
        });
        setEditingId(null);
      } else {
        const newFeeMaster: FeeMaster = {
          id: Date.now().toString(),
          feeType: formData.feeType,
          amount: parseFloat(formData.amount),
          assignedStudents: formData.selectedStudents,
          createdAt: new Date().toISOString().split('T')[0],
        };
        setFeesMaster(prev => [...prev, newFeeMaster]);
        toast({
          title: "Fee Master Added",
          description: `${formData.feeType} has been added and assigned to ${formData.selectedStudents.length} students.`,
        });
      }

      setFormData({ feeType: "", amount: "", selectedStudents: [] });
      setIsSubmitting(false);
    }, 500);
  };

  const handleEdit = (feeMaster: FeeMaster) => {
    setFormData({
      feeType: feeMaster.feeType,
      amount: feeMaster.amount.toString(),
      selectedStudents: feeMaster.assignedStudents,
    });
    setEditingId(feeMaster.id);
  };

  const handleDelete = (id: string) => {
    setFeesMaster(prev => prev.filter(fee => fee.id !== id));
    toast({
      title: "Fee Master Deleted",
      description: "Fee master has been deleted successfully.",
    });
  };

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
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>{editingId ? "Edit Fee Master" : "Add New Fee Master"}</CardTitle>
            <CardDescription>
              {editingId ? "Update fee details and assignments" : "Set fee amount and assign to students"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
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

              <div className="space-y-2">
                <Label>Assign to Students</Label>
                <div className="max-h-32 overflow-y-auto border rounded-md p-2 space-y-2">
                  {students.map((student) => (
                    <div key={student} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={student}
                        checked={formData.selectedStudents.includes(student)}
                        onChange={() => handleStudentToggle(student)}
                        className="rounded"
                      />
                      <label htmlFor={student} className="text-sm cursor-pointer">
                        {student}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex space-x-2">
                <Button type="submit" disabled={isSubmitting} className="flex-1">
                  <Plus className="mr-2 h-4 w-4" />
                  {isSubmitting ? "Saving..." : editingId ? "Update" : "Add Fee Master"}
                </Button>
                {editingId && (
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => {
                      setEditingId(null);
                      setFormData({ feeType: "", amount: "", selectedStudents: [] });
                    }}
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Fee Masters</CardTitle>
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
