import React from "react";
import {
  BarChart3,
  UserSearch,
  FileText,
  GraduationCap,
  Users,
  Receipt,
  Home,
  CreditCard,
  BookOpen,
  MapPin,
  UserPlus,
  Building2,
  Calculator,
  User,
  Settings,
} from "lucide-react";

export type NavItem = {
  title: string;
  href: string;
  icon: React.ElementType;
  subItems?: { title: string; href: string; allowedRoles?: string[] }[];
  allowedRoles?: string[];
};

export const allNavItems: NavItem[] = [
  { 
    title: "Dashboard", 
    href: "/", 
    icon: BarChart3
  },
  { 
    title: "Leads", 
    href: "/lead", 
    icon: UserSearch,
    subItems: [
      { title: "Lead Enquiry", href: "/lead/enquiry" },
      { title: "Add Lead", href: "/lead/add" },
    ]
  },
  {
    title: "Applicants",
    href: "/students/application",
    icon: FileText,
  },
  { 
    title: "Students", 
    href: "/students", 
    icon: GraduationCap,
    subItems: [
      { title: "All Students", href: "/students/direct", allowedRoles: ['admin', 'finance', 'staff', 'hostel_team'] },
      { title: "Add Students", href: "/students/add", allowedRoles: ['admin', 'finance'] },
      { title: "Agent Students", href: "/students/agent" },
      { title: "Admission Letter Upload", href: "/students/admission-letters" },
      { title: "Character", href: "/students/character" },
    ]
  },
  { 
    title: "Agents",
    href: "/agents",
    icon: Users,
    subItems: [
      { title: "All Agents", href: "/agents" },
      { title: "Add Agent", href: "/agents/add" },
      { title: "Payout", href: "/agents/payout" },
    ],
  },
  { 
    title: "Invoice", 
    href: "#", 
    icon: Receipt,
    subItems: [
      { title: "All Invoices", href: "/invoices" },
      { title: "Make Invoice", href: "/invoices/create" },
      { title: "Fees Master", href: "/fees/master", allowedRoles: ['admin', 'finance'] },
      { title: "Collect Fees", href: "/fees/collect", allowedRoles: ['admin', 'finance'] }
    ]
  },
  { 
    title: "Office Expenses", 
    href: "/office-expenses", 
    icon: FileText,
    allowedRoles: ['admin', 'finance', 'office', 'office_guwahati', 'office_delhi', 'office_mumbai', 'office_bangalore', 'office_kolkata'],
    subItems: [
      { title: "Office Management", href: "/office-expenses/management", allowedRoles: ['admin', 'finance'] },
      { title: "Expenses", href: "/office-expenses", allowedRoles: ['admin', 'finance', 'office', 'office_guwahati', 'office_delhi', 'office_mumbai', 'office_bangalore', 'office_kolkata'] },
    ]
  },
  { 
    title: "Hostel & Mess", 
    href: "/hostel-mess", 
    icon: Home,
    allowedRoles: ['admin', 'hostel_team'],
    subItems: [
      { title: "Hostel Management", href: "/hostels/management" },
      { title: "Hostel Expenses", href: "/hostels/expenses" },
      { title: "Mess Management", href: "/mess/management" },
      { title: "Add Students", href: "/hostels/add-students" },
      { title: "Student Requests", href: "/hostels/requests" },
    ]
  },
  { 
    title: "Accounts", 
    href: "/accounts", 
    icon: CreditCard,
    allowedRoles: ['admin', 'finance'],
    subItems: [
      { title: "Students", href: "/accounts/students" },
      { title: "Staff Accounts", href: "/staff/my" },
      { title: "Agent Accounts", href: "/accounts/agents" },
    ]
  },
  { 
    title: "Document Management", 
    href: "/documents", 
    icon: BookOpen,
    allowedRoles: ['admin', 'finance', 'hostel_team']
  },
  { 
    title: "Visa", 
    href: "/students/visa", 
    icon: MapPin,
    allowedRoles: ['admin', 'finance']
  },
  { 
    title: "Staff",
    href: "/staff",
    icon: UserPlus,
    subItems: [
      { title: "My Staff", href: "/staff/my" },
      { title: "Add Staff", href: "/staff/add" },
      { title: "Attendance", href: "/staff/attendance" },
      { title: "Leave", href: "/staff/leave" },
      { title: "Payroll", href: "/staff/payroll" },
      { title: "Payout", href: "/staff/payout" },
    ],
    allowedRoles: ['admin']
  },
  { 
    title: "Universities", 
    href: "/universities", 
    icon: Building2,
    allowedRoles: ['admin']
  },
  { title: "Salary Management", href: "/salary", icon: Receipt, allowedRoles: ['admin', 'finance'] },
  { title: "Personal Expenses", href: "/personal-expenses", icon: Calculator, allowedRoles: ['admin', 'finance'] },
  { title: "Reports", href: "/reports", icon: BarChart3, allowedRoles: ['admin', 'finance'] },
  { 
    title: "Profile", 
    href: "/profile", 
    icon: User,
    allowedRoles: ['agent']
  },
  { 
    title: "Settings", 
    href: "/settings", 
    icon: Settings,
    allowedRoles: ['admin', 'finance', 'hostel_team'],
    subItems: [
      { title: "General Settings", href: "/settings" },
      { title: "Country Management", href: "/settings/countries" },
      { title: "Role Management", href: "/settings/rbac", allowedRoles: ['admin'] }
    ]
  },
];
