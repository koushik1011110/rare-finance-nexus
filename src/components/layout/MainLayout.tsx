
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home, Users, Book, GraduationCap, Building, Utensils, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleNavigation = (href: string) => {
    navigate(href);
    setOpen(false);
  };

  const menuItems = [
    {
      title: "Dashboard",
      href: "/",
      icon: Home,
    },
    {
      title: "Students",
      icon: Users,
      subItems: [
        { title: "Student List", href: "/students/list" },
      ],
    },
    {
      title: "Academics",
      icon: Book,
      subItems: [
        { title: "Courses", href: "/academics/courses" },
        { title: "Academic Sessions", href: "/academics/sessions" },
      ],
    },
    {
      title: "Fees",
      icon: GraduationCap,
      subItems: [
        { title: "Fee Types", href: "/fees/types" },
        { title: "Fee Structures", href: "/fees/structures" },
        { title: "Student Fees", href: "/fees/student-fees" },
        { title: "Fee Collection", href: "/fees/collection" },
      ],
    },
    {
      title: "Hostels",
      icon: Building,
      subItems: [
        { title: "Hostel Management", href: "/hostels/management" },
        { title: "Hostel Expenses", href: "/hostels/expenses" },
        { title: "Mess Management", href: "/hostels/mess-management" },
        { title: "Mess Expenses", href: "/hostels/mess-expenses" },
      ],
    },
    {
      title: "Agents",
      icon: Users,
      subItems: [
        { title: "Agent Management", href: "/agents/management" },
      ],
    },
  ];

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile menu */}
      <div className="md:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="absolute top-4 left-4 z-50">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <div className="flex flex-col h-full py-4">
              <div className="px-4 py-2 font-semibold text-lg border-b">
                School Management
              </div>
              <nav className="flex-1 overflow-y-auto">
                {menuItems.map((item, index) => (
                  <div key={index} className="px-4 py-2">
                    {item.href ? (
                      <Button 
                        variant="ghost" 
                        className={`w-full justify-start ${location.pathname === item.href ? 'bg-accent' : ''}`}
                        onClick={() => handleNavigation(item.href || '/')}
                      >
                        <item.icon className="mr-2 h-4 w-4" />
                        {item.title}
                      </Button>
                    ) : (
                      <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value={`item-${index}`} className="border-none">
                          <AccordionTrigger className="py-1 hover:no-underline">
                            <div className="flex items-center">
                              <item.icon className="mr-2 h-4 w-4" />
                              {item.title}
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="flex flex-col space-y-1 pl-6">
                              {item.subItems?.map((subItem, subIndex) => (
                                <Button 
                                  key={subIndex} 
                                  variant="ghost" 
                                  size="sm"
                                  className={`justify-start ${location.pathname === subItem.href ? 'bg-accent' : ''}`}
                                  onClick={() => handleNavigation(subItem.href)}
                                >
                                  {subItem.title}
                                </Button>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    )}
                  </div>
                ))}
              </nav>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden md:flex md:flex-col md:w-64 md:border-r bg-white dark:bg-gray-800">
        <div className="p-4 font-semibold text-lg border-b">
          School Management
        </div>
        <nav className="flex-1 overflow-y-auto p-4">
          {menuItems.map((item, index) => (
            <div key={index} className="mb-2">
              {item.href ? (
                <Button 
                  variant="ghost" 
                  className={`w-full justify-start ${location.pathname === item.href ? 'bg-accent' : ''}`}
                  onClick={() => handleNavigation(item.href || '/')}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.title}
                </Button>
              ) : (
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value={`item-${index}`} className="border-none">
                    <AccordionTrigger className="py-2 hover:no-underline">
                      <div className="flex items-center">
                        <item.icon className="mr-2 h-4 w-4" />
                        {item.title}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="flex flex-col space-y-1 pl-6">
                        {item.subItems?.map((subItem, subIndex) => (
                          <Button 
                            key={subIndex} 
                            variant="ghost" 
                            size="sm"
                            className={`justify-start ${location.pathname === subItem.href ? 'bg-accent' : ''}`}
                            onClick={() => handleNavigation(subItem.href)}
                          >
                            {subItem.title}
                          </Button>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              )}
            </div>
          ))}
        </nav>
      </div>

      <div className="flex flex-col flex-1 overflow-y-auto">
        <main className="flex-1 p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
