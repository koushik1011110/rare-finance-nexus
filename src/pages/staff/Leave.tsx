import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import PageHeader from '@/components/shared/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Leave = () => {
  return (
    <MainLayout>
      <PageHeader title="Leave" description="Staff leave requests and approvals" />
      <Card>
        <CardHeader>
          <CardTitle>Leave</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Leave management UI goes here.</p>
        </CardContent>
      </Card>
    </MainLayout>
  );
};

export default Leave;
