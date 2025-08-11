import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import PageHeader from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const AddLead = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        <PageHeader 
          title="Add Lead" 
          description="Add new lead to the system"
        />
        
        <Card>
          <CardHeader>
            <CardTitle>Add New Lead</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Add lead functionality will be implemented here.</p>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default AddLead;