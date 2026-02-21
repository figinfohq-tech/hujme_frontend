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
} from "lucide-react";

const AgentSidebar = () => {
  const [isOpen, setIsOpen] = useState(true);

  const menuItems = [
    {
      name: "Packages",
      icon: <Package size={20} />,
      path: "/",
    },
    {
      name: "Bookings",
      icon: <CalendarCheck size={20} />,
      path: "/bookings",
    },
    {
      name: "Documents",
      icon: <FileText size={20} />,
      path: "/documents",
    },
    { name: "Profiles", icon: <User size={20} />, path: "/profiles" },
    { name: "Bank Accounts", icon: <Landmark size={20} />, path: "/bank-account" },
    { name: "Subscriptions", icon: <Crown size={20} />, path: "/subscription-details" },
    {
      name: "Analytics",
      icon: <BarChart2 size={20} />,
      path: "/analytics",
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
          <div className="bg-indigo-500 p-2 rounded-lg">
            <LayoutDashboard size={22} />
          </div>
          {isOpen && <h1 className="text-xl font-semibold">Agent Dashboard</h1>}
        </div>

        {/* Menu */}
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

export default AgentSidebar;
