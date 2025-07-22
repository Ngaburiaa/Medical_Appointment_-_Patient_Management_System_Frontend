import { useState } from "react";
import {
  Home,
  Settings,
  Users2,
  Stethoscope,
  CalendarCheck2,
  MessageSquareText,
  SquareUserRound,
  LayoutDashboard,
  Menu,
  X,
  CreditCard,
} from "lucide-react";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import type { RootState } from "../App/store";

export const AdminSideNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user } = useSelector((state: RootState) => state.auth);

  const navItems = [
    { path: "/admin/overview", icon: <LayoutDashboard size={20} />, label: "Overview", color: "#1AB2E5" },
    { path: "/admin/patients", icon: <Users2 size={20} />, label: "Manage Users", color: "#4CAF50" },
    { path: "/admin/doctors", icon: <Stethoscope size={20} />, label: "Manage Doctors", color: "#9C27B0" },
    { path: "/admin/appointments", icon: <CalendarCheck2 size={20} />, label: "Appointments", color: "#2196F3" },
    { path: "/admin/support", icon: <MessageSquareText size={20} />, label: "Support", color: "#FF9800" },
     { path: "/admin/payments", icon: <CreditCard size={20} />, label: "Payments", color: "#FF9800" }, 
    { path: "/admin/prescriptions", icon: <Settings size={20} />, label: "Settings", color: "#8BC34A" },
    { path: "/admin/profile", icon: <SquareUserRound size={20} />, label: "Profile", color: "#03A9F4" },

    { path: "/", icon: <Home size={20} />, label: "Home", color: "#1AB2E5" },
  ];

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden p-3 text-[#1AB2E5] fixed top-4 left-4 z-50 bg-white border border-[#B8E6F8] rounded-lg shadow-md hover:bg-gradient-to-r from-[#E6F7FF] to-[#B8E6F8] transition-all duration-300"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 transform transition-transform duration-300 ease-in-out fixed lg:static top-0 left-0 h-full w-64 bg-gradient-to-b from-[#E6F7FF] to-[#FFFFFF] p-4 shadow-lg border-r border-[#B8E6F8] z-40 flex flex-col`}
      >
        {/* Logo/Title */}
        <div className="mb-8 p-4 border-b border-[#B8E6F8] bg-gradient-to-r from-[#E6F7FF] to-[#D1F1FF] rounded-lg shadow-inner">
          <h2 className="text-xl font-bold text-[#1AB2E5] drop-shadow-sm">ADMIN DASHBOARD</h2>
          <p className="text-xs text-gray-600 mt-1 font-semibold">System Control Panel</p>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col gap-2 flex-grow">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                location.pathname === item.path
                  ? "bg-gradient-to-r from-[#1AB2E5] to-[#00AEEF] text-white font-semibold shadow-md transform scale-105"
                  : "text-gray-700 hover:bg-gradient-to-r hover:from-[#E6F7FF] hover:to-[#B8E6F8] hover:text-[#1AB2E5] hover:shadow-sm"
              }`}
              onClick={() => setIsOpen(false)}
            >
              <span
                className={`transition-colors duration-300 ${
                  location.pathname === item.path ? "text-white" : ""
                }`}
                style={{ color: location.pathname === item.path ? "#FFFFFF" : item.color }}
              >
                {item.icon}
              </span>
              <span className="text-sm">{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* User Info */}
        <div className="mt-auto pt-4 border-t border-[#B8E8F8]">
          <div className="flex items-center gap-3 px-4 py-3 text-gray-700 bg-gradient-to-r from-[#E6F7FF] to-[#D1F1FF] rounded-lg shadow-inner">
            <div className="w-8 h-8 rounded-full bg-[#1AB2E5] flex items-center justify-center text-white">
              <SquareUserRound size={16} />
            </div>
            <div>
              <p className="text-sm font-medium">{user?.firstName || "Admin"}</p>
              <p className="text-xs text-gray-500">Administrator</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
