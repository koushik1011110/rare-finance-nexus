
import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import StatCard from "@/components/dashboard/StatCard";
import ChartCard from "@/components/dashboard/ChartCard";
import AlertCard, { Alert } from "@/components/dashboard/AlertCard";
import PageHeader from "@/components/shared/PageHeader";
import DataTable from "@/components/ui/DataTable";
import { Button } from "@/components/ui/button";
import SearchFilter from "@/components/dashboard/SearchFilter";
import { 
  DollarSign, CreditCard, TrendingUp, AlertCircle, Download, FileText, 
  Home as HomeIcon, Briefcase
} from "lucide-react";
import AnimatedCounter from "@/components/dashboard/AnimatedCounter";
import PieChart from "@/components/dashboard/PieChart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

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

const universityPaymentsData = [
  { name: "Tashkent State Medical", value: 580000, color: "#0088FE" },
  { name: "Samarkand State Medical", value: 420000, color: "#00C49F" },
  { name: "Bukhara State Medical", value: 340000, color: "#FFBB28" },
  { name: "Qarshi State University", value: 280000, color: "#FF8042" }
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
    amount: "₹12,500",
    status: "Completed",
    category: "University Fee",
  },
  {
    id: "T2",
    date: "Aug 8, 2025",
    description: "Student: John Smith - Course Fee",
    amount: "₹3,200",
    status: "Completed",
    category: "Student Fee",
  },
  {
    id: "T3",
    date: "Aug 5, 2025",
    description: "Agent: Global Education - Commission",
    amount: "₹1,800",
    status: "Pending",
    category: "Agent Commission",
  },
  {
    id: "T4",
    date: "Aug 2, 2025",
    description: "Office Rent - Downtown Branch",
    amount: "₹2,500",
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
      
      {/* Redesigned Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {/* Total Revenue Collected - Large card with animated counter */}
        <Card className="col-span-full md:col-span-2 lg:col-span-1">
          <CardHeader>
            <CardTitle>Total Revenue Collected</CardTitle>
            <CardDescription>Overall revenue for current period</CardDescription>
          </CardHeader>
          <CardContent>
            <AnimatedCounter value={1250000} prefix="₹" className="text-5xl text-green-600" />
          </CardContent>
        </Card>

        {/* Total Due from Students - Alert-style (Red) card */}
        <Card className="border-l-4 border-red-500 bg-red-50 dark:bg-red-900/20">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <AlertCircle className="mr-2 h-5 w-5 text-red-500" />
              Total Due from Students
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600 dark:text-red-400">₹245,800</div>
            <p className="mt-2 text-sm text-red-600 dark:text-red-400">
              15 students with outstanding payments
            </p>
          </CardContent>
        </Card>

        {/* Paid to Universities - Light themed card with pie chart */}
        <Card className="col-span-full md:col-span-2 lg:col-span-1 bg-slate-50 dark:bg-slate-900/50">
          <CardHeader className="pb-2">
            <CardTitle>Paid to Universities</CardTitle>
            <CardDescription>Distribution of payments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">₹1,620,000</div>
            <PieChart data={universityPaymentsData} height={220} />
          </CardContent>
        </Card>

        {/* Agent Commission Pending - Gradient background card */}
        <Card className="overflow-hidden">
          <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-6 text-white">
            <h3 className="text-lg font-medium mb-1">Agent Commission Pending</h3>
            <div className="text-3xl font-bold">₹87,200</div>
            <div className="mt-4 flex gap-2">
              <span className="inline-flex items-center rounded-md bg-white/20 px-2 py-1 text-xs font-medium text-white">
                5 Agents
              </span>
              <span className="inline-flex items-center rounded-md bg-white/20 px-2 py-1 text-xs font-medium text-white">
                Due in 7 days
              </span>
            </div>
          </div>
        </Card>

        {/* Total Hostel Expenses - Card with icon */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg">
              <HomeIcon className="mr-2 h-5 w-5 text-blue-500" />
              Total Hostel Expenses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹124,500</div>
            <p className="text-sm text-muted-foreground mt-1">
              For the current month
            </p>
          </CardContent>
        </Card>

        {/* Staff Salaries - Simple card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg">
              <Briefcase className="mr-2 h-5 w-5 text-green-500" />
              Staff Salaries (This Month)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹184,700</div>
            <p className="text-sm text-muted-foreground mt-1">
              12 staff members
            </p>
          </CardContent>
        </Card>
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
