
import React from "react";
import { useQuery } from "@tanstack/react-query";
import MainLayout from "@/components/layout/MainLayout";
import PageHeader from "@/components/shared/PageHeader";
import { hostelsAPI } from "@/lib/hostels-api";
import MessBudgetCard from "@/components/hostels/MessBudgetCard";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon, DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const MessBudgetManagement = () => {
  const { data: hostels = [], isLoading, refetch } = useQuery({
    queryKey: ['hostels'],
    queryFn: hostelsAPI.getAll,
  });

  const handleUpdate = () => {
    console.log('Refreshing hostel data after budget update');
    refetch();
  };

  // Calculate overall statistics
  const totalBudgetAllocated = hostels.reduce((sum, hostel) => sum + (hostel.mess_budget || 0), 0);
  const totalBudgetRemaining = hostels.reduce((sum, hostel) => sum + (hostel.mess_budget_remaining || 0), 0);
  const totalExpenses = totalBudgetAllocated - totalBudgetRemaining;
  const activeHostelsCount = hostels.filter(hostel => hostel.mess_budget && hostel.mess_budget > 0).length;

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading hostels...</div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <PageHeader
        title="Mess Budget Management"
        description="Set and manage annual mess budgets for each hostel. Expenses will be automatically deducted from the allocated budget in real-time."
      />

      <div className="space-y-6">
        <Alert>
          <InfoIcon className="h-4 w-4" />
          <AlertDescription>
            Set an annual mess budget for each hostel. When mess expenses are recorded, 
            the amounts will be automatically deducted from the remaining budget. 
            Budget allocations are valid for one calendar year and update in real-time.
          </AlertDescription>
        </Alert>

        {/* Overall Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Budget Allocated</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">₹{totalBudgetAllocated.toLocaleString()}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Budget Remaining</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">₹{totalBudgetRemaining.toLocaleString()}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">₹{totalExpenses.toLocaleString()}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Budgets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{activeHostelsCount} of {hostels.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Hostel Budget Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hostels.map((hostel) => (
            <MessBudgetCard
              key={hostel.id}
              hostel={hostel}
              onUpdate={handleUpdate}
            />
          ))}
        </div>

        {hostels.length === 0 && (
          <div className="text-center py-12">
            <DollarSign className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="text-muted-foreground mt-4">
              No hostels found. Please add hostels first to manage their mess budgets.
            </p>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default MessBudgetManagement;
