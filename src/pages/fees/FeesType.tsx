
import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import PageHeader from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import DataTable, { Column } from "@/components/ui/DataTable";
import { toast } from "@/hooks/use-toast";
import { Plus, Edit, Trash } from "lucide-react";

interface FeeType {
  id: string;
  name: string;
  description: string;
  createdAt: string;
}

const FeesType = () => {
  const [feesTypes, setFeesTypes] = useState<FeeType[]>([
    { id: "1", name: "Tuition Fee", description: "Annual tuition fee for the course", createdAt: "2025-01-01" },
    { id: "2", name: "Hostel Fee", description: "Accommodation charges for hostel", createdAt: "2025-01-02" },
    { id: "3", name: "Transport Fee", description: "Bus transportation fee", createdAt: "2025-01-03" },
    { id: "4", name: "Lab Fee", description: "Laboratory usage fee", createdAt: "2025-01-04" },
  ]);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Fee type name is required.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    setTimeout(() => {
      if (editingId) {
        setFeesTypes(prev => prev.map(fee => 
          fee.id === editingId 
            ? { ...fee, name: formData.name, description: formData.description }
            : fee
        ));
        toast({
          title: "Fee Type Updated",
          description: `${formData.name} has been updated successfully.`,
        });
        setEditingId(null);
      } else {
        const newFeeType: FeeType = {
          id: Date.now().toString(),
          name: formData.name,
          description: formData.description,
          createdAt: new Date().toISOString().split('T')[0],
        };
        setFeesTypes(prev => [...prev, newFeeType]);
        toast({
          title: "Fee Type Added",
          description: `${formData.name} has been added successfully.`,
        });
      }

      setFormData({ name: "", description: "" });
      setIsSubmitting(false);
    }, 500);
  };

  const handleEdit = (feeType: FeeType) => {
    setFormData({
      name: feeType.name,
      description: feeType.description,
    });
    setEditingId(feeType.id);
  };

  const handleDelete = (id: string) => {
    setFeesTypes(prev => prev.filter(fee => fee.id !== id));
    toast({
      title: "Fee Type Deleted",
      description: "Fee type has been deleted successfully.",
    });
  };

  const columns: Column<FeeType>[] = [
    { header: "Name", accessorKey: "name" },
    { header: "Description", accessorKey: "description" },
    { header: "Created Date", accessorKey: "createdAt" },
    {
      header: "Actions",
      accessorKey: "actions",
      cell: (feeType: FeeType) => (
        <div className="flex space-x-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleEdit(feeType)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => handleDelete(feeType.id)}
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
        title="Fees Type Management"
        description="Manage different types of fees"
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>{editingId ? "Edit Fee Type" : "Add New Fee Type"}</CardTitle>
            <CardDescription>
              {editingId ? "Update the fee type details" : "Create a new fee type category"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Fee Type Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="e.g., Tuition Fee"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Brief description of the fee type"
                  rows={3}
                />
              </div>

              <div className="flex space-x-2">
                <Button type="submit" disabled={isSubmitting} className="flex-1">
                  <Plus className="mr-2 h-4 w-4" />
                  {isSubmitting ? "Saving..." : editingId ? "Update" : "Add Fee Type"}
                </Button>
                {editingId && (
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => {
                      setEditingId(null);
                      setFormData({ name: "", description: "" });
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
            <CardTitle>Existing Fee Types</CardTitle>
            <CardDescription>List of all fee types in the system</CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable columns={columns} data={feesTypes} />
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default FeesType;
