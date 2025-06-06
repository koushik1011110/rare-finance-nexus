
import React, { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import PageHeader from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Plus, Search, Edit, Eye, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";
import DataTable from "@/components/ui/DataTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import DetailViewModal from "@/components/shared/DetailViewModal";
import EditModal from "@/components/shared/EditModal";
import ExpenseForm from "@/components/forms/ExpenseForm";
import { messExpensesAPI, MessExpense } from "@/lib/mess-expenses-api";
import { format } from "date-fns";

const MessExpenses = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [expenses, setExpenses] = useState<MessExpense[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentExpense, setCurrentExpense] = useState<MessExpense | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = async () => {
    try {
      setLoading(true);
      const data = await messExpensesAPI.getAll();
      setExpenses(data);
    } catch (error) {
      console.error('Error loading mess expenses:', error);
      toast({
        title: "Error",
        description: "Failed to load expense data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const filteredData = expenses.filter(
    (expense) => 
      expense.expense_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.vendor_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewExpense = (expense: MessExpense) => {
    setCurrentExpense(expense);
    setIsViewModalOpen(true);
  };

  const handleEditExpense = (expense: MessExpense) => {
    setCurrentExpense(expense);
    setIsEditModalOpen(true);
  };

  const handleAddExpense = () => {
    setIsAddModalOpen(true);
  };

  const handleSaveExpense = async (formData: any) => {
    setIsSubmitting(true);
    
    try {
      if (formData.id) {
        await messExpensesAPI.update(formData.id, formData);
        toast({
          title: "Expense Updated",
          description: "Mess expense has been updated successfully.",
        });
      } else {
        await messExpensesAPI.create(formData);
        toast({
          title: "Expense Added",
          description: "Mess expense has been added successfully.",
        });
      }
      
      await loadExpenses();
      setIsAddModalOpen(false);
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Error saving expense:', error);
      toast({
        title: "Error",
        description: "Failed to save expense data.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const columns = [
    { 
      header: "Date", 
      accessorKey: "expense_date" as keyof MessExpense,
      cell: (row: MessExpense) => format(new Date(row.expense_date), 'dd MMM yyyy')
    },
    { header: "Expense Type", accessorKey: "expense_type" as keyof MessExpense },
    { header: "Category", accessorKey: "category" as keyof MessExpense },
    { 
      header: "Amount", 
      accessorKey: "amount" as keyof MessExpense,
      cell: (row: MessExpense) => `$${row.amount.toFixed(2)}`
    },
    { header: "Vendor", accessorKey: "vendor_name" as keyof MessExpense },
    {
      header: "Status",
      accessorKey: "status" as keyof MessExpense,
      cell: (row: MessExpense) => (
        <span
          className={`rounded-full px-2 py-1 text-xs font-medium ${
            row.status === "Paid"
              ? "bg-green-100 text-green-800"
              : row.status === "Pending"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {row.status}
        </span>
      ),
    },
    {
      header: "Actions",
      accessorKey: "actions" as "actions",
      cell: (row: MessExpense) => (
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={() => handleViewExpense(row)}>
            <Eye className="mr-2 h-4 w-4" />
            View
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleEditExpense(row)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
        </div>
      ),
    },
  ];

  // Calculate summary statistics
  const totalExpenses = filteredData.reduce((sum, exp) => sum + exp.amount, 0);
  const paidExpenses = filteredData
    .filter(exp => exp.status === 'Paid')
    .reduce((sum, exp) => sum + exp.amount, 0);
  const pendingExpenses = filteredData
    .filter(exp => exp.status === 'Pending')
    .reduce((sum, exp) => sum + exp.amount, 0);

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading expenses...</div>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <PageHeader
        title="Mess Expenses"
        description="Manage mess-related expenses and payments"
        actions={
          <Button variant="default" size="sm" onClick={handleAddExpense}>
            <Plus className="mr-2 h-4 w-4" />
            Add Expense
          </Button>
        }
      />
      
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalExpenses.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Paid Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${paidExpenses.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">${pendingExpenses.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>
      
      <div className="mb-6">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search expenses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
      
      <div className="rounded-lg border bg-card shadow-sm">
        <DataTable columns={columns} data={filteredData} />
      </div>

      {/* Add Expense Modal */}
      <EditModal
        title="Add New Expense"
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      >
        <ExpenseForm 
          onSubmit={handleSaveExpense}
          isSubmitting={isSubmitting}
          expenseType="mess"
        />
      </EditModal>

      {/* View Expense Modal */}
      {currentExpense && (
        <DetailViewModal
          title={`Expense: ${currentExpense.expense_type}`}
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <h3 className="font-semibold">Expense Type</h3>
              <p>{currentExpense.expense_type}</p>
            </div>
            <div>
              <h3 className="font-semibold">Category</h3>
              <p>{currentExpense.category}</p>
            </div>
            <div>
              <h3 className="font-semibold">Amount</h3>
              <p>${currentExpense.amount.toFixed(2)}</p>
            </div>
            <div>
              <h3 className="font-semibold">Date</h3>
              <p>{format(new Date(currentExpense.expense_date), 'dd MMM yyyy')}</p>
            </div>
            <div>
              <h3 className="font-semibold">Payment Method</h3>
              <p>{currentExpense.payment_method}</p>
            </div>
            <div>
              <h3 className="font-semibold">Status</h3>
              <p>{currentExpense.status}</p>
            </div>
            <div>
              <h3 className="font-semibold">Vendor</h3>
              <p>{currentExpense.vendor_name || 'N/A'}</p>
            </div>
            <div>
              <h3 className="font-semibold">Receipt #</h3>
              <p>{currentExpense.receipt_number || 'N/A'}</p>
            </div>
            <div className="md:col-span-2">
              <h3 className="font-semibold">Description</h3>
              <p>{currentExpense.description || 'No description provided'}</p>
            </div>
            <div className="md:col-span-2">
              <h3 className="font-semibold">Notes</h3>
              <p>{currentExpense.notes || 'No notes'}</p>
            </div>
          </div>
        </DetailViewModal>
      )}

      {/* Edit Expense Modal */}
      {currentExpense && (
        <EditModal
          title={`Edit Expense: ${currentExpense.expense_type}`}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
        >
          <ExpenseForm 
            defaultValues={{
              id: currentExpense.id,
              hostel_id: currentExpense.hostel_id?.toString() || '',
              expense_type: currentExpense.expense_type,
              description: currentExpense.description || '',
              amount: currentExpense.amount.toString(),
              expense_date: currentExpense.expense_date,
              category: currentExpense.category,
              payment_method: currentExpense.payment_method,
              receipt_number: currentExpense.receipt_number || '',
              vendor_name: currentExpense.vendor_name || '',
              notes: currentExpense.notes || '',
              status: currentExpense.status,
            }}
            onSubmit={handleSaveExpense}
            isSubmitting={isSubmitting}
            expenseType="mess"
          />
        </EditModal>
      )}
    </MainLayout>
  );
};

export default MessExpenses;
