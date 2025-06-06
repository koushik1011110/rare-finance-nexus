import React, { useState } from "react";
import { Sidebar } from "flowbite-react";
import {
  HiArrowSmRight,
  HiChartPie,
  HiInbox,
  HiOutlineCog,
  HiShoppingBag,
  HiTable,
  HiUser,
  HiViewBoards,
} from "react-icons/hi";
import { Home, Users, Book, GraduationCap, Building, Utensils } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const handleMenuItemClick = (href: string) => {
    navigate(href);
    closeSidebar();
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
        // { title: "Mess Expenses", href: "/hostels/mess-expenses" },
      ],
    },
    // {
    //   title: "Mess",
    //   icon: Utensils,
    //   subItems: [
    //     { title: "Mess Management", href: "/mess/management" },
    //     { title: "Mess Expenses", href: "/mess/expenses" },
    //   ],
    // },
    {
      title: "Agents",
      icon: HiUser,
      subItems: [
        { title: "Agent Management", href: "/agents/management" },
        // { title: "Agent Commission", href: "/agents/commission" },
      ],
    },
  ];

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar
        className={`bg-gray-50 dark:bg-gray-900 dark:border-gray-700 ${
          isSidebarOpen ? "w-64" : "w-16"
        } transition-width duration-300`}
      >
        <Sidebar.Items>
          {menuItems.map((item, index) => (
            <div key={index}>
              {item.href ? (
                <Sidebar.Item
                  as={Link}
                  to={item.href}
                  icon={item.icon}
                  active={location.pathname === item.href}
                  onClick={() => handleMenuItemClick(item.href)}
                >
                  {item.title}
                </Sidebar.Item>
              ) : (
                <>
                  <Sidebar.Collapse
                    icon={item.icon}
                    label={item.title}
                  >
                    {item.subItems &&
                      item.subItems.map((subItem, subIndex) => (
                        <Sidebar.Item
                          key={subIndex}
                          as={Link}
                          to={subItem.href}
                          onClick={() => handleMenuItemClick(subItem.href)}
                          active={location.pathname === subItem.href}
                        >
                          {subItem.title}
                        </Sidebar.Item>
                      ))}
                  </Sidebar.Collapse>
                </>
              )}
            </div>
          ))}
        </Sidebar.Items>
      </Sidebar>

      <div className="flex flex-col flex-1 overflow-y-auto">
        <main className="flex-1 p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
