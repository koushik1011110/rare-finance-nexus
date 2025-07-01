
import React from "react";
import { Outlet } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Toaster } from "@/components/ui/toaster";

const MainLayout = ({ children }: { children?: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 p-6 bg-gray-50">
          {children || <Outlet />}
        </main>
      </div>
      <Toaster />
    </SidebarProvider>
  );
};

export default MainLayout;
