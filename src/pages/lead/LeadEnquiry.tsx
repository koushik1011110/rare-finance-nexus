import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import PageHeader from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const LeadEnquiry = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        <PageHeader 
          title="Lead Enquiry" 
          description="View and manage lead enquiries"
        />
        
        <Card>
          <CardHeader>
            <CardTitle>Lead Enquiry Management</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Lead enquiry functionality will be implemented here.</p>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default LeadEnquiry;