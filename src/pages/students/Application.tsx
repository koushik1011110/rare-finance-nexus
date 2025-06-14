import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Eye, Download } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import PageHeader from "@/components/shared/PageHeader";
import DataTable from "@/components/ui/DataTable";

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

const statusOptions = [
  { value: "pending", label: "Pending", variant: "secondary" as const },
  { value: "under_review", label: "Under Review", variant: "outline" as const },
  { value: "approved", label: "Approved", variant: "default" as const },
  { value: "rejected", label: "Rejected", variant: "destructive" as const },
];

export default function Application() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: applications = [], isLoading } = useQuery({
    queryKey: ["apply-students"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("apply_students")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      return data as ApplyStudent[];
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const { error } = await supabase
        .from("apply_students")
        .update({ status, updated_at: new Date().toISOString() })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["apply-students"] });
      toast({
        title: "Status Updated",
        description: "Application status has been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update application status.",
        variant: "destructive",
      });
      console.error("Error updating status:", error);
    },
  });

  const handleStatusChange = (id: number, newStatus: string) => {
    updateStatusMutation.mutate({ id, status: newStatus });
  };

  const columns = [
    {
      header: "Application ID",
      accessorKey: "id" as keyof ApplyStudent,
    },
    {
      header: "Name",
      accessorKey: "first_name" as keyof ApplyStudent,
      cell: (row: ApplyStudent) => (
        <div>
          <div className="font-medium">{`${row.first_name} ${row.last_name}`}</div>
          <div className="text-sm text-muted-foreground">{row.email}</div>
        </div>
      ),
    },
    {
      header: "Father's Name",
      accessorKey: "father_name" as keyof ApplyStudent,
    },
    {
      header: "Phone",
      accessorKey: "phone_number" as keyof ApplyStudent,
    },
    {
      header: "City/Country",
      accessorKey: "city" as keyof ApplyStudent,
      cell: (row: ApplyStudent) => (
        <div>
          <div>{row.city}</div>
          <div className="text-sm text-muted-foreground">{row.country}</div>
        </div>
      ),
    },
    {
      header: "Status",
      accessorKey: "status" as keyof ApplyStudent,
      cell: (row: ApplyStudent) => {
        const status = row.status;
        const statusOption = statusOptions.find(opt => opt.value === status);
        
        return (
          <Select
            value={status}
            onValueChange={(newStatus) => handleStatusChange(row.id, newStatus)}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue>
                <Badge variant={statusOption?.variant || "secondary"}>
                  {statusOption?.label || status}
                </Badge>
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  <Badge variant={option.variant}>{option.label}</Badge>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      },
    },
    {
      header: "Applied Date",
      accessorKey: "created_at" as keyof ApplyStudent,
      cell: (row: ApplyStudent) => {
        return new Date(row.created_at).toLocaleDateString();
      },
    },
    {
      header: "Actions",
      accessorKey: "actions" as keyof ApplyStudent,
      cell: (row: ApplyStudent) => (
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Eye className="h-4 w-4 mr-1" />
            View
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-1" />
            Export
          </Button>
        </div>
      ),
    },
  ];

  return (
    <MainLayout>
      <div className="space-y-6">
        <PageHeader
          title="Student Applications"
          description="Manage and review student applications"
        />

        <Card>
          <CardHeader>
            <CardTitle>Applications</CardTitle>
            <CardDescription>
              Review and manage student applications. Update status as needed.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-sm text-muted-foreground">Loading applications...</div>
              </div>
            ) : (
              <DataTable
                columns={columns}
                data={applications}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}