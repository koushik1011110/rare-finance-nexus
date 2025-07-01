
import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarHeader,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  Home,
  Users,
  GraduationCap,
  Building2,
  FileText,
  Calendar,
  UserCheck,
  Briefcase,
  DollarSign,
  ClipboardList,
  ChevronRight,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const menuItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
  },
  {
    title: "Students",
    icon: GraduationCap,
    items: [
      {
        title: "All Applicants",
        url: "/students/direct",
        icon: Users,
      },
      {
        title: "Student Admission",
        url: "/students/admission",
        icon: UserCheck,
      },
      {
        title: "Applications",
        url: "/students/applications",
        icon: FileText,
      },
      {
        title: "Visa Processing",
        url: "/students/visa",
        icon: Briefcase,
      },
    ],
  },
  {
    title: "Universities",
    url: "/universities",
    icon: Building2,
  },
  {
    title: "Agents",
    url: "/agents",
    icon: Users,
  },
  {
    title: "Hostels",
    url: "/hostels",
    icon: Building2,
  },
  {
    title: "Tasks",
    url: "/tasks",
    icon: ClipboardList,
  },
  {
    title: "Reports",
    url: "/reports",
    icon: FileText,
  },
];

export function AppSidebar() {
  const location = useLocation();

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-2">
          <GraduationCap className="h-6 w-6" />
          <span className="font-semibold">Agents Portal</span>
        </div>
        <SidebarTrigger className="ml-2" />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  {item.items ? (
                    <Collapsible
                      defaultOpen={item.items.some(subItem => 
                        location.pathname === subItem.url
                      )}
                    >
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton>
                          <item.icon className="mr-2 h-4 w-4" />
                          <span>{item.title}</span>
                          <ChevronRight className="ml-auto h-4 w-4" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.items.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton
                                asChild
                                isActive={location.pathname === subItem.url}
                              >
                                <Link to={subItem.url}>
                                  <subItem.icon className="mr-2 h-4 w-4" />
                                  <span>{subItem.title}</span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </Collapsible>
                  ) : (
                    <SidebarMenuButton
                      asChild
                      isActive={location.pathname === item.url}
                    >
                      <Link to={item.url}>
                        <item.icon className="mr-2 h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
