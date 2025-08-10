import React, { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import PageHeader from "@/components/shared/PageHeader";
import DataTable from "@/components/ui/DataTable";
import { Button } from "@/components/ui/button";
import { Plus, Download, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DetailViewModal from "@/components/shared/DetailViewModal";
import { officeExpensesAPI, type OfficeExpense } from "@/lib/supabase-database";
import OfficeExpenseForm from "@/components/forms/OfficeExpenseForm";
import DailyOfficeExpenseForm from "@/components/forms/DailyOfficeExpenseForm";
import OfficeExpenseReports from "@/components/office/OfficeExpenseReports";
import { useAuth } from "@/contexts/AuthContext";

const OfficeExpenses = () => {
  const { isOfficeUser, isOffice, getUserOfficeLocation } = useAuth();
  const [expenses, setExpenses] = useState<OfficeExpense[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState<string>("all");
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [dailyExpenseModalOpen, setDailyExpenseModalOpen] = useState(false);
  const [reportsModalOpen, setReportsModalOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<OfficeExpense | null>(null);

  useEffect(() => {
    loadExpenses();
    // Set default location for office users
    const userOfficeLocation = getUserOfficeLocation();
    if ((isOffice || isOfficeUser) && userOfficeLocation) {
      setSelectedLocation(userOfficeLocation);
    }
  }, [isOffice, isOfficeUser, getUserOfficeLocation]);

  const loadExpenses = async () => {
    try {
      setLoading(true);
      const data = await officeExpensesAPI.getAll();
      setExpenses(data);
    } catch (error) {
      console.error('Error loading expenses:', error);
      toast({
        title: "Error",
        description: "Failed to load office expenses.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredData = (() => {
    const userOfficeLocation = getUserOfficeLocation();
    let data = expenses;
    
    // Filter by user's office location if they're an office user
    if ((isOfficeUser || isOffice) && userOfficeLocation) {
      data = expenses.filter((expense) => expense.location === userOfficeLocation);
    } else if (selectedLocation !== "all") {
      data = expenses.filter((expense) => expense.location === selectedLocation);
    }
    
    return data;
  })();

  const handleViewExpense = (expense: OfficeExpense) => {
    setSelectedExpense(expense);
    setViewModalOpen(true);
  };


  const handleAddExpense = () => {
    setAddModalOpen(true);
  };

  const handleAddDailyExpense = () => {
    setDailyExpenseModalOpen(true);
  };

  const handleShowReports = () => {
    setReportsModalOpen(true);
  };

  const handleExport = () => {
    const csvContent = [
      ["Location", "Month", "Rent", "Utilities", "Internet", "Marketing", "Travel", "Miscellaneous", "Monthly Total"],
      ...filteredData.map(expense => [
        expense.location,
        new Date(expense.month).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
        `$${expense.rent.toFixed(2)}`,
        `$${expense.utilities.toFixed(2)}`,
        `$${expense.internet.toFixed(2)}`,
        `$${expense.marketing.toFixed(2)}`,
        `$${expense.travel.toFixed(2)}`,
        `$${expense.miscellaneous.toFixed(2)}`,
        `$${expense.monthly_total.toFixed(2)}`
      ])
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "office_expenses.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const locations = [...new Set(expenses.map((item) => item.location))];

  const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`;
  const formatMonth = (monthString: string) => {
    const date = new Date(monthString);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  // Correctly typed columns with the actions column
  const columns = [
    { header: "Office Location", accessorKey: "location" as const },
    { 
      header: "Date", 
      accessorKey: "expense_date" as const,
      cell: (row: OfficeExpense) => new Date(row.expense_date).toLocaleDateString()
    },
    { 
      header: "Category", 
      accessorKey: "expense_category" as const
    },
    { 
      header: "Amount", 
      accessorKey: "amount" as const,
      cell: (row: OfficeExpense) => formatCurrency(row.amount)
    },
    { 
      header: "Notes", 
      accessorKey: "notes" as const,
      cell: (row: OfficeExpense) => row.notes ? (row.notes.length > 50 ? row.notes.substring(0, 50) + '...' : row.notes) : '-'
    },
    {
      header: "Actions",
      accessorKey: "actions" as const,
      cell: (row: OfficeExpense) => (
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleViewExpense(row)}
          >
            View
          </Button>
        </div>
      ),
    },
  ];

  return (
    <MainLayout>
      <PageHeader
        title="Office Expenses"
        description="Track and manage all office-related expenses by location"
        actions={
          <>
            <Button variant="outline" size="sm" onClick={handleShowReports}>
              <Download className="mr-2 h-4 w-4" />
              Reports
            </Button>
            <Button variant="outline" size="sm" onClick={handleAddExpense}>
              <Plus className="mr-2 h-4 w-4" />
              Add Monthly
            </Button>
            <Button variant="default" size="sm" onClick={handleAddDailyExpense}>
              <Plus className="mr-2 h-4 w-4" />
              Add Daily Expense
            </Button>
          </>
        }
      />

      <div className="mb-6">
        <div className="flex gap-4">
          {!isOfficeUser && !isOffice && (
            <Select
              value={selectedLocation}
              onValueChange={setSelectedLocation}
            >
              <SelectTrigger className="w-[250px]">
                <SelectValue placeholder="Select Office Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                {locations.map((location) => (
                  <SelectItem key={location} value={location}>
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          {(isOfficeUser || isOffice) && (
            <div className="flex items-center bg-primary/10 px-4 py-2 rounded-lg">
              <span className="text-sm font-medium">Office: {getUserOfficeLocation()}</span>
            </div>
          )}
        </div>
      </div>

      <div className="rounded-lg border bg-card shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading expenses...</span>
          </div>
        ) : (
          <DataTable columns={columns} data={filteredData} />
        )}
      </div>

      {/* View Modal */}
      {selectedExpense && (
        <DetailViewModal
          title={`Office Expense Details`}
          isOpen={viewModalOpen}
          onClose={() => setViewModalOpen(false)}
        >
          <div className="space-y-6">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-4 rounded-lg border">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-foreground">{selectedExpense.location}</h3>
                  <p className="text-muted-foreground">{formatMonth(selectedExpense.month)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Total Expenses</p>
                  <p className="text-2xl font-bold text-primary">{formatCurrency(selectedExpense.monthly_total)}</p>
                </div>
              </div>
            </div>

            {/* Expense Categories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-card border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Rent</p>
                    <p className="text-xl font-semibold text-foreground">{formatCurrency(selectedExpense.rent)}</p>
                  </div>
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                    <div className="w-5 h-5 bg-blue-500 rounded"></div>
                  </div>
                </div>
              </div>

              <div className="bg-card border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Utilities</p>
                    <p className="text-xl font-semibold text-foreground">{formatCurrency(selectedExpense.utilities)}</p>
                  </div>
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                    <div className="w-5 h-5 bg-green-500 rounded"></div>
                  </div>
                </div>
              </div>

              <div className="bg-card border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Internet</p>
                    <p className="text-xl font-semibold text-foreground">{formatCurrency(selectedExpense.internet)}</p>
                  </div>
                  <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center">
                    <div className="w-5 h-5 bg-purple-500 rounded"></div>
                  </div>
                </div>
              </div>

              <div className="bg-card border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Marketing</p>
                    <p className="text-xl font-semibold text-foreground">{formatCurrency(selectedExpense.marketing)}</p>
                  </div>
                  <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center">
                    <div className="w-5 h-5 bg-orange-500 rounded"></div>
                  </div>
                </div>
              </div>

              <div className="bg-card border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Travel</p>
                    <p className="text-xl font-semibold text-foreground">{formatCurrency(selectedExpense.travel)}</p>
                  </div>
                  <div className="w-10 h-10 bg-teal-100 dark:bg-teal-900/20 rounded-full flex items-center justify-center">
                    <div className="w-5 h-5 bg-teal-500 rounded"></div>
                  </div>
                </div>
              </div>

              <div className="bg-card border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Miscellaneous</p>
                    <p className="text-xl font-semibold text-foreground">{formatCurrency(selectedExpense.miscellaneous)}</p>
                  </div>
                  <div className="w-10 h-10 bg-pink-100 dark:bg-pink-900/20 rounded-full flex items-center justify-center">
                    <div className="w-5 h-5 bg-pink-500 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DetailViewModal>
      )}

      {/* Add Monthly Expense Form */}
      <OfficeExpenseForm
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSuccess={loadExpenses}
      />

      {/* Add Daily Expense Form */}
      <DailyOfficeExpenseForm
        isOpen={dailyExpenseModalOpen}
        onClose={() => setDailyExpenseModalOpen(false)}
        onSuccess={loadExpenses}
      />

      {/* Reports Modal */}
      <OfficeExpenseReports
        isOpen={reportsModalOpen}
        onClose={() => setReportsModalOpen(false)}
      />

    </MainLayout>
  );
};

export default OfficeExpenses;
