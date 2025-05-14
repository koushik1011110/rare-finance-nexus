
import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import PageHeader from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Download, FileText } from "lucide-react";
import { toast } from "@/hooks/use-toast";

// Define report types
interface Report {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const Reports = () => {
  const reports: Report[] = [
    {
      id: "agent-student",
      title: "Agent-wise Student Report",
      description: "View student distribution and fees by agent",
      icon: <FileText className="h-8 w-8 text-blue-500" />,
    },
    {
      id: "university-fee",
      title: "University Fee Summary",
      description: "Track university fee payments and pending amounts",
      icon: <FileText className="h-8 w-8 text-green-500" />,
    },
    {
      id: "profit-loss",
      title: "Profit & Loss Report",
      description: "Monthly and annual financial performance",
      icon: <FileText className="h-8 w-8 text-purple-500" />,
    },
    {
      id: "hostel-expense",
      title: "Hostel Expense Summary",
      description: "Detailed breakdown of hostel expenses by university",
      icon: <FileText className="h-8 w-8 text-yellow-500" />,
    },
    {
      id: "due-payments",
      title: "Due Payment Alerts",
      description: "List of outstanding payments from students and to universities",
      icon: <FileText className="h-8 w-8 text-red-500" />,
    },
    {
      id: "agent-commission",
      title: "Agent Commission Report",
      description: "Agent commission structure and pending payments",
      icon: <FileText className="h-8 w-8 text-indigo-500" />,
    },
  ];

  const handleGenerateReport = (reportId: string) => {
    toast({
      title: "Generating Report",
      description: "Your report is being prepared for download.",
    });

    // Simulate report generation delay
    setTimeout(() => {
      toast({
        title: "Report Ready",
        description: "Your report has been generated and is ready for download.",
      });
    }, 1500);
  };

  return (
    <MainLayout>
      <PageHeader
        title="Reports"
        description="Generate and download comprehensive financial and operational reports"
      />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {reports.map((report) => (
          <div
            key={report.id}
            className="rounded-lg border bg-card p-6 shadow-sm transition-all hover:shadow-md"
          >
            <div className="mb-4 flex items-center justify-center">
              {report.icon}
            </div>
            <h3 className="mb-2 text-center text-lg font-medium">{report.title}</h3>
            <p className="mb-4 text-center text-sm text-muted-foreground">
              {report.description}
            </p>
            <div className="flex justify-center gap-2">
              <Button
                onClick={() => handleGenerateReport(report.id)}
                className="w-full"
              >
                <Download className="mr-2 h-4 w-4" />
                Generate
              </Button>
            </div>
          </div>
        ))}
      </div>
    </MainLayout>
  );
};

export default Reports;
