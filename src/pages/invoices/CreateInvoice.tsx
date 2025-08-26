import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import PageHeader from '@/components/shared/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const CreateInvoice = () => {
  return (
    <MainLayout>
      <PageHeader
        title="Create Invoice"
        description="Create a new invoice"
      />
      
      <Card>
        <CardHeader>
          <CardTitle>Invoice Creation</CardTitle>
          <CardDescription>
            Invoice creation functionality will be implemented here
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Invoice creation features coming soon...</p>
        </CardContent>
      </Card>
    </MainLayout>
  );
};

export default CreateInvoice;