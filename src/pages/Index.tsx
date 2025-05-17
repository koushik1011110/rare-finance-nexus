
import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import StatCard from "@/components/dashboard/StatCard";
import ChartCard from "@/components/dashboard/ChartCard";
import AlertCard, { Alert } from "@/components/dashboard/AlertCard";
import PageHeader from "@/components/shared/PageHeader";
import DataTable from "@/components/ui/DataTable";
import { Button } from "@/components/ui/button";
import SearchFilter from "@/components/dashboard/SearchFilter";
import { DollarSign, CreditCard, TrendingUp, AlertCircle, Download, FileText } from "lucide-react";

// Sample data for the dashboard
const cashFlowData = [
  { name: "Jan", income: 5000, expense: 3200 },
  { name: "Feb", income: 5500, expense: 3700 },
  { name: "Mar", income: 6000, expense: 4000 },
  { name: "Apr", income: 7000, expense: 3800 },
  { name: "May", income: 8000, expense: 4500 },
  { name: "Jun", income: 8500, expense: 5000 },
  { name: "Jul", income: 9000, expense: 4800 },
];

const sourceData = [
  { name: "Tuition Fees", income: 28000 },
  { name: "Agent Commissions", income: 12000 },
  { name: "Hostel Fees", income: 9000 },
  { name: "Application Fees", income: 4500 },
  { name: "Other Services", income: 3200 },
];

const alerts: Alert[] = [
  {
    id: "1",
    title: "University Fee Due",
    description: "London University has 5 pending fee payments",
    type: "due",
    date: "Aug 15, 2025",
  },
  {
    id: "2",
    title: "Agent Commission",
    description: "Commission payment due for Global Education",
    type: "reminder",
    date: "Aug 20, 2025",
  },
  {
    id: "3",
    title: "Student Fee Reminder",
    description: "Send reminder to 3 students with overdue fees",
    type: "warning",
  },
];

const recentTransactions = [
  {
    id: "T1",
    date: "Aug 10, 2025",
    description: "University of London - Fee Payment",
    amount: "$12,500",
    status: "Completed",
    category: "University Fee",
  },
  {
    id: "T2",
    date: "Aug 8, 2025",
    description: "Student: John Smith - Course Fee",
    amount: "$3,200",
    status: "Completed",
    category: "Student Fee",
  },
  {
    id: "T3",
    date: "Aug 5, 2025",
    description: "Agent: Global Education - Commission",
    amount: "$1,800",
    status: "Pending",
    category: "Agent Commission",
  },
  {
    id: "T4",
    date: "Aug 2, 2025",
    description: "Office Rent - Downtown Branch",
    amount: "$2,500",
    status: "Completed",
    category: "Office Expense",
  },
];

const transactionColumns = [
  { header: "Date", accessorKey: "date" },
  { header: "Description", accessorKey: "description" },
  { header: "Amount", accessorKey: "amount" },
  {
    header: "Status",
    accessorKey: "status",
    cell: (row: any) => (
      <span
        className={cn(
          "rounded-full px-2 py-1 text-xs font-medium",
          row.status === "Completed"
            ? "bg-green-100 text-green-800"
            : "bg-yellow-100 text-yellow-800"
        )}
      >
        {row.status}
      </span>
    ),
  },
  { header: "Category", accessorKey: "category" },
];

import { cn } from "@/lib/utils";

const Index = () => {
  const handleSearch = (query: string) => {
    console.log("Search query:", query);
    // Implement search functionality
  };

  const handleFilterChange = (filterType: string, value: string) => {
    console.log(`Filter ${filterType}:`, value);
    // Implement filter functionality
  };

  const handleDateRangeChange = (range: any) => {
    console.log("Date range:", range);
    // Implement date filter functionality
  };

  return (
    <MainLayout>
      <PageHeader 
        title="Financial Dashboard" 
        description="Overview of your financial data and activities"
        actions={
          <>
            <Button variant="outline" size="sm">
              <FileText className="mr-2 h-4 w-4" />
              Reports
            </Button>
            <Button variant="default" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </>
        }
      />
      
      {/* Search and Filter */}
      <SearchFilter 
        onSearch={handleSearch}
        onFilterChange={handleFilterChange}
        onDateRangeChange={handleDateRangeChange}
      />
      
      {/* Stats Overview */}
      <div className="dashboard-grid mb-6">
        <StatCard
          title="Total Income"
          value="$56,800"
          change={{ value: 12, isPositive: true }}
          icon={<DollarSign className="h-5 w-5" />}
          variant="income"
        />
        <StatCard
          title="Total Expenses"
          value="$24,500"
          change={{ value: 8, isPositive: false }}
          icon={<CreditCard className="h-5 w-5" />}
          variant="expense"
        />
        <StatCard
          title="Amount Receivable"
          value="$18,200"
          change={{ value: 5, isPositive: true }}
          icon={<TrendingUp className="h-5 w-5" />}
          variant="receivable"
        />
        <StatCard
          title="University Fees Due"
          value="$32,400"
          icon={<AlertCircle className="h-5 w-5" />}
          variant="due"
        />
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 mb-6 lg:grid-cols-2">
        <ChartCard
          title="Monthly Cash Flow"
          description="Income vs Expenses"
          type="line"
          data={cashFlowData}
        />
        <ChartCard
          title="Income by Source"
          description="Breakdown by category"
          type="bar"
          data={sourceData}
        />
      </div>
      
      {/* Alerts and Recent Transactions */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <AlertCard title="Important Alerts" alerts={alerts} />
        </div>
        <div className="lg:col-span-2">
          <div className="rounded-lg border bg-card p-4 shadow-sm">
            <h3 className="mb-4 text-lg font-medium">Recent Transactions</h3>
            <DataTable columns={transactionColumns} data={recentTransactions} />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;
