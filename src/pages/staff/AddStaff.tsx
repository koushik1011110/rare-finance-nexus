import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import PageHeader from '@/components/shared/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const AddStaff = () => {
  return (
    <MainLayout>
      <PageHeader title="Add Staff" description="Create a new staff member" />
      <Card>
        <CardHeader>
          <CardTitle>Add Staff</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Staff creation form goes here.</p>
          <div className="mt-4">
            <Button>Save</Button>
          </div>
        </CardContent>
      </Card>
    </MainLayout>
  );
};

export default AddStaff;
