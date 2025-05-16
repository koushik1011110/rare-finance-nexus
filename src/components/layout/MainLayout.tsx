
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  BarChart3, Users, GraduationCap, Building2, Home, ClipboardList, 
  Briefcase, DollarSign, LineChart, Settings, Menu, X, Download, User, ChevronLeft, ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type NavItem = {
  title: string;
  href: string;
  icon: React.ElementType;
  subItems?: { title: string; href: string }[];
};

const navItems: NavItem[] = [
  { title: "Dashboard", href: "/", icon: BarChart3 },
  { 
    title: "Students", 
    href: "/students", 
    icon: GraduationCap,
    subItems: [
      { title: "Direct Students", href: "/students/direct" },
      { title: "Agent Students", href: "/students/agent" },
    ]
  },
  { title: "Agents", href: "/agents", icon: Users },
  { title: "Universities", href: "/universities", icon: Building2 },
  { title: "Hostels", href: "/hostels", icon: Home },
  { title: "Office Expenses", href: "/office-expenses", icon: ClipboardList },
  { title: "Salary Management", href: "/salary", icon: Briefcase },
  { title: "Personal Expenses", href: "/personal-expenses", icon: DollarSign },
  { title: "Reports", href: "/reports", icon: LineChart },
  { title: "Settings", href: "/settings", icon: Settings },
];

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const location = useLocation();
  
  const toggleExpand = (title: string) => {
    setExpandedItems(prev => 
      prev.includes(title) 
        ? prev.filter(item => item !== title) 
        : [...prev, title]
    );
  };

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };
  
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-20 flex flex-col border-r bg-sidebar transition-all duration-300 ease-in-out lg:static",
          sidebarOpen ? "w-64" : "w-16",
          !sidebarOpen && "items-center",
          "translate-x-0 lg:translate-x-0"
        )}
      >
        <div className="flex h-16 items-center justify-between border-b px-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={toggleSidebar}
            className="flex items-center justify-center"
          >
            {sidebarOpen ? (
              <ChevronLeft className="h-5 w-5" />
            ) : (
              <ChevronRight className="h-5 w-5" />
            )}
          </Button>
        </div>
        <nav className={cn("flex-1 overflow-y-auto p-2", !sidebarOpen && "w-full")}>
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.title}>
                {item.subItems ? (
                  <>
                    <button
                      onClick={() => toggleExpand(item.title)}
                      className={cn(
                        "flex w-full items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                        expandedItems.includes(item.title) || location.pathname.startsWith(item.href)
                          ? "bg-sidebar-primary text-sidebar-primary-foreground"
                          : "text-sidebar-foreground",
                        !sidebarOpen && "justify-center px-1"
                      )}
                    >
                      <item.icon className={cn("h-5 w-5", sidebarOpen ? "mr-3" : "mr-0")} />
                      {sidebarOpen && (
                        <>
                          {item.title}
                          <span className="ml-auto">
                            {expandedItems.includes(item.title) ? (
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M18 15l-6-6-6 6"/>
                              </svg>
                            ) : (
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M6 9l6 6 6-6"/>
                              </svg>
                            )}
                          </span>
                        </>
                      )}
                    </button>
                    {(sidebarOpen && (expandedItems.includes(item.title) || location.pathname.startsWith(item.href))) && (
                      <ul className="ml-6 mt-1 space-y-1">
                        {item.subItems.map((subItem) => (
                          <li key={subItem.title}>
                            <Link
                              to={subItem.href}
                              className={cn(
                                "flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                                location.pathname === subItem.href
                                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                                  : "text-sidebar-foreground"
                              )}
                            >
                              {subItem.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                ) : (
                  <Link
                    to={item.href}
                    className={cn(
                      "flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                      location.pathname === item.href
                        ? "bg-sidebar-primary text-sidebar-primary-foreground"
                        : "text-sidebar-foreground",
                      !sidebarOpen && "justify-center px-1"
                    )}
                    title={!sidebarOpen ? item.title : undefined}
                  >
                    <item.icon className={cn("h-5 w-5", sidebarOpen ? "mr-3" : "mr-0")} />
                    {sidebarOpen && item.title}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-16 items-center justify-between border-b bg-background px-4 lg:px-6">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="icon"
              className="lg:hidden mr-2"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <span className="text-xl font-semibold text-rare-blue-500">Rare Education</span>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" className="hidden sm:flex">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <User className="h-4 w-4" />
            </Button>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
