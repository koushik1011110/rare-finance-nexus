import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import PageHeader from '@/components/shared/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Payroll = () => {
  return (
    <MainLayout>
      <PageHeader title="Payroll" description="Payroll processing and records" />
      <Card>
        <CardHeader>
          <CardTitle>Payroll</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Payroll reports and actions go here.</p>
        </CardContent>
      </Card>
    </MainLayout>
  );
};

export default Payroll;
