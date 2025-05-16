
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Student Module
import DirectStudents from "./pages/students/DirectStudents";
import AgentStudents from "./pages/students/AgentStudents";

// Agent Management
import AgentManagement from "./pages/agents/AgentManagement";

// University Section
import Universities from "./pages/universities/Universities";
import UniversityDetail from "./pages/universities/UniversityDetail";

// Hostel Expenses
import HostelExpenses from "./pages/hostels/HostelExpenses";
import HostelManagement from "./pages/hostels/HostelManagement";

// Office Expenses
import OfficeExpenses from "./pages/office/OfficeExpenses";

// Salary Management
import SalaryManagement from "./pages/salary/SalaryManagement";

// Personal Expenses
import PersonalExpenses from "./pages/personal/PersonalExpenses";

// Reports Section
import Reports from "./pages/reports/Reports";

// Settings
import Settings from "./pages/settings/Settings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          
          {/* Student Module */}
          <Route path="/students/direct" element={<DirectStudents />} />
          <Route path="/students/agent" element={<AgentStudents />} />
          
          {/* Agent Management */}
          <Route path="/agents" element={<AgentManagement />} />
          
          {/* University Section */}
          <Route path="/universities" element={<Universities />} />
          <Route path="/universities/:universityId" element={<UniversityDetail />} />
          
          {/* Hostel Expenses */}
          <Route path="/hostels/management" element={<HostelManagement />} />
          <Route path="/hostels/expenses" element={<HostelExpenses />} />
          
          {/* Office Expenses */}
          <Route path="/office-expenses" element={<OfficeExpenses />} />
          
          {/* Salary Management */}
          <Route path="/salary" element={<SalaryManagement />} />
          
          {/* Personal Expenses */}
          <Route path="/personal-expenses" element={<PersonalExpenses />} />
          
          {/* Reports Section */}
          <Route path="/reports" element={<Reports />} />
          
          {/* Settings */}
          <Route path="/settings" element={<Settings />} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
