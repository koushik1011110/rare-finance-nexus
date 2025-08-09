import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calendar, Download, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { officeExpensesAPI, officesAPI, type OfficeExpense, type Office } from "@/lib/supabase-database";
import DataTable from "@/components/ui/DataTable";

interface OfficeExpenseReportsProps {
  isOpen: boolean;
  onClose: () => void;
}

type ReportType = 'daily' | 'weekly' | 'monthly';

const OfficeExpenseReports: React.FC<OfficeExpenseReportsProps> = ({
  isOpen,
  onClose,
}) => {
  const [reportType, setReportType] = useState<ReportType>('daily');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedOffice, setSelectedOffice] = useState<string>('all');
  const [reportData, setReportData] = useState<OfficeExpense[]>([]);
  const [offices, setOffices] = useState<Office[]>([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);

  React.useEffect(() => {
    if (isOpen) {
      loadOffices();
      setQuickDateRange();
    }
  }, [isOpen]);

  const loadOffices = async () => {
    try {
      const data = await officesAPI.getAll();
      setOffices(data.filter(office => office.status === 'Active'));
    } catch (error) {
      console.error('Error loading offices:', error);
      toast({
        title: "Error",
        description: "Failed to load offices.",
        variant: "destructive",
      });
    }
  };

  const setQuickDateRange = () => {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    
    switch (reportType) {
      case 'daily':
        setStartDate(todayStr);
        setEndDate(todayStr);
        break;
      case 'weekly':
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay());
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        setStartDate(weekStart.toISOString().split('T')[0]);
        setEndDate(weekEnd.toISOString().split('T')[0]);
        break;
      case 'monthly':
        const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
        const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        setStartDate(monthStart.toISOString().split('T')[0]);
        setEndDate(monthEnd.toISOString().split('T')[0]);
        break;
    }
  };

  React.useEffect(() => {
    setQuickDateRange();
  }, [reportType]);

  const generateReport = async () => {
    if (!startDate || !endDate) {
      toast({
        title: "Error",
        description: "Please select both start and end dates.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      const data = await officeExpensesAPI.getByDateRange(startDate, endDate);
      
      let filteredData = data;
      if (selectedOffice !== 'all') {
        const office = offices.find(o => o.id.toString() === selectedOffice);
        if (office) {
          filteredData = data.filter(expense => expense.location === office.name);
        }
      }
      
      setReportData(filteredData);
      
      toast({
        title: "Success",
        description: `Generated ${reportType} report with ${filteredData.length} records.`,
      });
    } catch (error) {
      console.error('Error generating report:', error);
      toast({
        title: "Error",
        description: "Failed to generate report.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const exportReport = async () => {
    if (reportData.length === 0) {
      toast({
        title: "Error",
        description: "No data to export. Please generate a report first.",
        variant: "destructive",
      });
      return;
    }

    try {
      setGenerating(true);
      
      const csvHeaders = [
        "Date", "Office", "Category", "Amount", "Notes"
      ];
      
      const csvData = reportData.map(expense => [
        new Date(expense.expense_date).toLocaleDateString(),
        expense.location,
        expense.expense_category,
        `$${expense.amount.toFixed(2)}`,
        expense.notes || ''
      ]);

      const csvContent = [
        csvHeaders.join(","),
        ...csvData.map(row => row.map(cell => `"${cell}"`).join(","))
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `office_expenses_${reportType}_${startDate}_to_${endDate}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Success",
        description: "Report exported successfully.",
      });
    } catch (error) {
      console.error('Error exporting report:', error);
      toast({
        title: "Error",
        description: "Failed to export report.",
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  };

  const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`;
  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString();

  const columns = [
    { 
      header: "Date", 
      accessorKey: "expense_date" as const,
      cell: (row: OfficeExpense) => formatDate(row.expense_date)
    },
    { header: "Office", accessorKey: "location" as const },
    { header: "Category", accessorKey: "expense_category" as const },
    { 
      header: "Amount", 
      accessorKey: "amount" as const,
      cell: (row: OfficeExpense) => formatCurrency(row.amount)
    },
    { header: "Notes", accessorKey: "notes" as const },
  ];

  const totalAmount = reportData.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Office Expense Reports
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Report Configuration */}
          <Card>
            <CardHeader>
              <CardTitle>Report Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="reportType">Report Type</Label>
                  <Select
                    value={reportType}
                    onValueChange={(value: ReportType) => setReportType(value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="office">Office</Label>
                  <Select
                    value={selectedOffice}
                    onValueChange={setSelectedOffice}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select office" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Offices</SelectItem>
                      {offices.map((office) => (
                        <SelectItem key={office.id} value={office.id.toString()}>
                          {office.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex gap-2 mt-4">
                <Button onClick={generateReport} disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    'Generate Report'
                  )}
                </Button>
                
                {reportData.length > 0 && (
                  <Button variant="outline" onClick={exportReport} disabled={generating}>
                    {generating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Exporting...
                      </>
                    ) : (
                      <>
                        <Download className="mr-2 h-4 w-4" />
                        Export CSV
                      </>
                    )}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Report Results */}
          {reportData.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>Report Results</span>
                  <span className="text-lg font-bold text-primary">
                    Total: {formatCurrency(totalAmount)}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <DataTable columns={columns} data={reportData} />
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OfficeExpenseReports;