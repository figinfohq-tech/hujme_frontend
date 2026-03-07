import React, { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
  Menu,
  LayoutDashboard,
  Package,
  CalendarCheck,
  User,
  BarChart2,
  FileText,
  Star,
  Crown,
  Landmark,
  FileCheck,
  Building,
  Building2,
  Users,
  BarChart3,
  Settings,
  LogOut,
} from "lucide-react";
import { Button } from "./ui/button";

const AdminSideBar = () => {
  const [isOpen, setIsOpen] = useState(true);

  const menuItems = [
    {
      name: "Dashboard",
      icon: <LayoutDashboard size={20} />,
      path: "/",
    },
    {
      name: "Agent Verification",
      icon: <FileCheck size={20} />,
      path: "/agent-verification",
    },
    {
      name: "Subscription Tiers",
      icon: <Crown size={20} />,
      path: "subscription-tiers",
    },
    { name: "Facility Master", icon: <Building size={20} />, path: "/facility-master" },
    { name: "Hotel Master", icon: <Building2 size={20} />, path: "/hotel-master" },
    { name: "Agent Management", icon: <Users size={20} />, path: "/agent-management" },
    {
      name: "Reports & Analytics",
      icon: <BarChart3 size={20} />,
      path: "/reports",
    },
  ];

  return (
    <div className="flex  h-screen">
      {/* Sidebar */}
      <div
        className={`bg-primary text-gray-100 h-screen p-4 pt-6 transition-all duration-300
        ${isOpen ? "w-64" : "w-20"} fixed left-0 flex flex-col`}
      >
        {/* Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="absolute -right-3 top-6 bg-primary border border-white text-white rounded-full p-1 hover:bg-green-200 hover:text-green-900"
        >
          <Menu size={20} />
        </button>

        {/* Logo */}
        <div className="flex items-center gap-2 mb-5 px-2">
          <div className="bg-secondary p-2 text-primary rounded-lg">
            <LayoutDashboard size={22} />
          </div>
          {isOpen && <h1 className="text-xl font-semibold">Dashboard</h1>}
        </div>

        {/* Menu */}
        <div>
        <nav className="flex flex-col gap-2">
          {menuItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all 
                ${
                  isActive
                    ? "bg-green-200 text-green-900"
                    : "hover:bg-green-200 hover:text-green-900 text-gray-300"
                }`
              }
            >
              {item.icon}
              {isOpen && <span>{item.name}</span>}
            </NavLink>
          ))}
        </nav>
         <div className="absolute bottom-13 left-0 right-0 p-4 border-t border-border">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-primary">
                {'A'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{"Admin User"}</p>
              <p className="text-xs truncate">Administrator</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" className="flex-1 hover:bg-secondary">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
            <Button variant="ghost" size="sm" className="hover:bg-secondary">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
        </div>
      </div>

      {/* Content Area (for demo) */}
      <div
        className={`flex-1 min-h-screen transition-all duration-300 ${
          isOpen ? "ml-64" : "ml-20"
        } h-[calc(100vh-64px)] p-5`}
      >
        <Outlet />
      </div>
    </div>
  );
};

export default AdminSideBar;
