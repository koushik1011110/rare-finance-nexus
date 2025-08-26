import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import PageHeader from '@/components/shared/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Attendance = () => {
  return (
    <MainLayout>
      <PageHeader title="Attendance" description="Staff attendance management" />
      <Card>
        <CardHeader>
          <CardTitle>Attendance</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Attendance calendar and records go here.</p>
        </CardContent>
      </Card>
    </MainLayout>
  );
};

export default Attendance;
