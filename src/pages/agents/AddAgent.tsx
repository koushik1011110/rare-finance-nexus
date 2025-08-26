import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import PageHeader from '@/components/shared/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const AddAgent = () => {
  return (
    <MainLayout>
      <PageHeader title="Add Agent" description="Create a new agent" />
      <Card>
        <CardHeader>
          <CardTitle>Add Agent</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Minimal placeholder form - you can replace with existing agent form component */}
          <div className="space-y-4">
            <p className="text-muted-foreground">Agent creation form goes here.</p>
            <div>
              <Button>Save Agent</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </MainLayout>
  );
};

export default AddAgent;
