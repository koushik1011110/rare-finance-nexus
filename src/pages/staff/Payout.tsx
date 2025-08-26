import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import PageHeader from '@/components/shared/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Payout = () => {
  return (
    <MainLayout>
      <PageHeader title="Payout" description="Staff payout processing" />
      <Card>
        <CardHeader>
          <CardTitle>Payout</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Payout processing UI goes here.</p>
        </CardContent>
      </Card>
    </MainLayout>
  );
};

export default Payout;
