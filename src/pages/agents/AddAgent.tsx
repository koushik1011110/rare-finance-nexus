import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import PageHeader from '@/components/shared/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AgentForm, { AgentFormData } from '@/components/forms/AgentForm';
import { agentsAPI } from '@/lib/agents-api';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const AddAgent: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSaveAgent = async (formData: AgentFormData) => {
    setIsSubmitting(true);
    try {
      await agentsAPI.create({
        name: formData.name,
        email: formData.email,
        contactPerson: formData.contactPerson,
        phone: formData.phone,
        location: formData.location,
        status: formData.status,
      });

      toast({ title: 'Agent Added', description: `${formData.name} has been added successfully.` });
      navigate('/agents');
    } catch (error) {
      console.error('Error adding agent:', error);
      toast({ title: 'Error', description: 'Failed to add agent.', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <PageHeader title="Add Agent" description="Create a new agent" />
      <Card>
        <CardHeader>
          <CardTitle>Add Agent</CardTitle>
        </CardHeader>
        <CardContent>
          <AgentForm onSubmit={handleSaveAgent} isSubmitting={isSubmitting} />
        </CardContent>
      </Card>
    </MainLayout>
  );
};

export default AddAgent;
