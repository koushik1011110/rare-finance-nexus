
import React, { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import StatCard from "@/components/dashboard/StatCard";
import ChartCard from "@/components/dashboard/ChartCard";
import AlertCard, { Alert } from "@/components/dashboard/AlertCard";
import PageHeader from "@/components/shared/PageHeader";
import DataTable from "@/components/ui/DataTable";
import { Button } from "@/components/ui/button";
import SearchFilter from "@/components/dashboard/SearchFilter";
import { DollarSign, CreditCard, TrendingUp, AlertCircle, Download, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

interface DashboardStats {
  totalIncome: number;
  totalExpenses: number;
  amountReceivable: number;
  universityFeesDue: number;
}

interface ChartData {
  name: string;
  income: number;
  expense: number;
}

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: string;
  status: string;
  category: string;
}

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
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalIncome: 0,
    totalExpenses: 0,
    amountReceivable: 0,
    universityFeesDue: 0,
  });
  const [cashFlowData, setCashFlowData] = useState<ChartData[]>([]);
  const [sourceData, setSourceData] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load financial stats
      const [
        feeCollectionsData,
        hostelExpensesData,
        messExpensesData,
        feePaymentsData,
        studentsCount,
      ] = await Promise.all([
        supabase.from('fee_collections').select('amount_paid'),
        supabase.from('hostel_expenses').select('amount'),
        supabase.from('mess_expenses').select('amount'),
        supabase.from('fee_payments').select('amount_due, amount_paid, payment_status'),
        supabase.from('students').select('id', { count: 'exact' }),
      ]);

      // Calculate stats
      const totalIncome = feeCollectionsData.data?.reduce((sum, item) => sum + Number(item.amount_paid), 0) || 0;
      const hostelExpenses = hostelExpensesData.data?.reduce((sum, item) => sum + Number(item.amount), 0) || 0;
      const messExpenses = messExpensesData.data?.reduce((sum, item) => sum + Number(item.amount), 0) || 0;
      const totalExpenses = hostelExpenses + messExpenses;
      
      const pendingPayments = feePaymentsData.data?.filter(p => p.payment_status === 'pending') || [];
      const amountReceivable = pendingPayments.reduce((sum, item) => sum + (Number(item.amount_due) - Number(item.amount_paid)), 0);
      const universityFeesDue = pendingPayments.reduce((sum, item) => sum + Number(item.amount_due), 0);

      setStats({
        totalIncome,
        totalExpenses,
        amountReceivable,
        universityFeesDue,
      });

      // Generate chart data (last 6 months)
      const chartData: ChartData[] = [];
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
      months.forEach(month => {
        chartData.push({
          name: month,
          income: Math.floor(totalIncome / 6 + Math.random() * 2000),
          expense: Math.floor(totalExpenses / 6 + Math.random() * 1000),
        });
      });
      setCashFlowData(chartData);

      // Generate source data
      const sources = [
        { name: "Fee Collections", income: totalIncome * 0.6 },
        { name: "Hostel Fees", income: totalIncome * 0.25 },
        { name: "Other Services", income: totalIncome * 0.15 },
      ];
      setSourceData(sources);

      // Generate alerts
      const dashboardAlerts: Alert[] = [
        {
          id: "1",
          title: "Pending Payments",
          description: `${pendingPayments.length} payments are pending`,
          type: "warning",
        },
        {
          id: "2",
          title: "Active Students",
          description: `${studentsCount.count || 0} students are currently enrolled`,
          type: "reminder",
        },
      ];
      setAlerts(dashboardAlerts);

      // Load recent transactions
      const { data: recentFeeCollections } = await supabase
        .from('fee_collections')
        .select(`
          id,
          amount_paid,
          payment_date,
          payment_method,
          receipt_number,
          students(first_name, last_name)
        `)
        .order('created_at', { ascending: false })
        .limit(5);

      const transactions: Transaction[] = recentFeeCollections?.map(collection => ({
        id: collection.id.toString(),
        date: new Date(collection.payment_date).toLocaleDateString(),
        description: `Fee payment from ${collection.students?.first_name} ${collection.students?.last_name}`,
        amount: `$${Number(collection.amount_paid).toLocaleString()}`,
        status: "Completed",
        category: "Fee Collection",
      })) || [];

      setRecentTransactions(transactions);

    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

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

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading dashboard...</div>
        </div>
      </MainLayout>
    );
  }

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
          value={`$${stats.totalIncome.toLocaleString()}`}
          icon={<DollarSign className="h-5 w-5" />}
          variant="income"
        />
        <StatCard
          title="Total Expenses"
          value={`$${stats.totalExpenses.toLocaleString()}`}
          icon={<CreditCard className="h-5 w-5" />}
          variant="expense"
        />
        <StatCard
          title="Amount Receivable"
          value={`$${stats.amountReceivable.toLocaleString()}`}
          icon={<TrendingUp className="h-5 w-5" />}
          variant="receivable"
        />
        <StatCard
          title="University Fees Due"
          value={`$${stats.universityFeesDue.toLocaleString()}`}
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
