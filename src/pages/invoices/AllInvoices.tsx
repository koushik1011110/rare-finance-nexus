import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import PageHeader from '@/components/shared/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const AllInvoices = () => {
  return (
    <MainLayout>
      <PageHeader
        title="All Invoices"
        description="View and manage all invoices"
      />
      
      <Card>
        <CardHeader>
          <CardTitle>Invoice Management</CardTitle>
          <CardDescription>
            Invoice functionality will be implemented here
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Invoice features coming soon...</p>
        </CardContent>
      </Card>
    </MainLayout>
  );
};

export default AllInvoices;