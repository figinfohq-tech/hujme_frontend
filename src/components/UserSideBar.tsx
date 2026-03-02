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
} from "lucide-react";

const UserSideBar = () => {
  const [isOpen, setIsOpen] = useState(true);

  const menuItems = [
    { name: "Browse Packages", icon: <Package size={20} />, path: "/" },
    { name: "My Bookings", icon: <CalendarCheck size={20} />, path: "/bookings" },
    { name: "Ducoments", icon: <FileText size={20} />, path: "/ducoments" },
    { name: "Profiles", icon: <User size={20} />, path: "/profiles" },
    { name: "Reviews", icon: <Star size={20} />, path: "/reviews" },
    { name: "Analytics", icon: <BarChart2 size={20} />, path: "/analytics" },
  ];

  return (
    <div className="flex min-h-[calc(100vh-60px)]">
      
      {/* Sidebar */}
      <aside
        className={`bg-primary text-gray-100 p-4 z-50 pt-6 mt-1 transition-all duration-300
        ${isOpen ? "w-64" : "w-20"} fixed top-[60px] left-0 bottom-0 flex flex-col`}
      >
        {/* Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="absolute -right-3 top-6 bg-primary border border-white text-white rounded-full p-1 hover:bg-green-200 hover:text-primary"
        >
          <Menu size={20} />
        </button>

        {/* Logo */}
        <div className="flex items-center gap-2 mb-5 px-2">
          <div className="bg-indigo-500 p-2 rounded-lg">
            <LayoutDashboard size={22} />
          </div>
          {isOpen && <h1 className="text-xl font-semibold">User Interface</h1>}
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
      </aside>

      {/* Main Content */}
      <main
        className={`flex-1 transition-all duration-300 min-w-0
        ${isOpen ? "ml-64" : "ml-20"}`}
      >
        <Outlet />
      </main>
    </div>
  );
};

export default UserSideBar;