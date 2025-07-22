import { useState } from "react";
import {
  Home,
  CalendarCheck2,
  Stethoscope,
  FileText,
  Settings,
  SquareUserRound,
  Menu,
  X,
  CreditCard,
  MessageSquareText,
} from "lucide-react";
import type { RootState } from "../App/store";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

export const SideNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user } = useSelector((state: RootState) => state.auth);

  const navItems = [
    { path: "/dashboard/main", icon: <Home size={20} />, label: "Dashboard", color: "#1AB2E5" }, 
    { path: "/dashboard/doctors", icon: <Stethoscope size={20} />, label: "Find Doctors", color: "#4CAF50" }, 
    { path: "/dashboard/appointments", icon: <CalendarCheck2 size={20} />, label: "Appointments", color: "#2196F3" }, 
    { path: "/dashboard/prescriptions", icon: <FileText size={20} />, label: "Prescriptions", color: "#9C27B0" }, 
    { path: "/dashboard/payments", icon: <CreditCard size={20} />, label: "Payments", color: "#FF9800" }, 
    { path: "/dashboard/support", icon: <MessageSquareText size={20} />, label: "Support", color: "#673AB7" }, 
    { path: "/dashboard/profile", icon: <SquareUserRound size={20} />, label: "Profile", color: "#03A9F4" }, 
    { path: "/dashboard/settings", icon: <Settings size={20} />, label: "Settings", color: "#8BC34A" },
    { path: "/", icon: <Home size={20} />, label: "Home", color: "#1AB2E5" }, 
  ];

  return (
    <>
      {/* Mobile Toggle Button */}
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
        {/* Logo/Branding Section */}
        <div className="mb-8 p-4 border-b border-[#B8E6F8] bg-gradient-to-r from-[#E6F7FF] to-[#D1F1FF] rounded-lg shadow-inner">
          <h2 className="text-xl font-bold text-[#1AB2E5] drop-shadow-sm">PATIENT PORTAL</h2>
          <p className="text-xs text-gray-600 mt-1 font-semibold">Your Health, Our Priority</p>
        </div>

        {/* Navigation Items */}
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

        {/* User Profile/Footer */}
        <div className="mt-auto pt-4 border-t border-[#B8E8F8]">
          <div className="flex items-center gap-3 px-4 py-3 text-gray-700 bg-gradient-to-r from-[#E6F7FF] to-[#D1F1FF] rounded-lg shadow-inner">
            <div className="w-8 h-8 rounded-full bg-[#1AB2E5] flex items-center justify-center text-white">
              <SquareUserRound size={16} />
            </div>
            <div>
              <p className="text-sm font-medium">{user?.firstName || "Guest"}</p>
              <p className="text-xs text-gray-500">Patient</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};