import { useState, useEffect } from "react";
import {
  Home,
  CalendarCheck2,
  Stethoscope,
  FileText,
  Settings,
  SquareUserRound,
   CreditCard,
  MessageSquareText,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import type { RootState } from "../App/store";

export const SideNav = () => {
  const [isOpen, setIsOpen] = useState(false); 
  const [isMobile, setIsMobile] = useState(false);
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
  ];

  // Detect mobile
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static top-0 left-0 h-full
          ${isMobile ? (isOpen ? "w-48" : "w-20") : "w-64"}
          bg-gradient-to-b from-[#E6F7FF] to-[#FFFFFF]
          shadow-lg border-r border-[#B8E6F8] z-40 flex flex-col
          transition-all duration-300 ease-in-out
        `}
        onMouseEnter={() => isMobile && setIsOpen(true)}
        onMouseLeave={() => isMobile && setIsOpen(false)}
      >
        {/* Logo Section */}
        <div className="mb-6 p-4 border-b border-[#B8E6F8] bg-gradient-to-r from-[#E6F7FF] to-[#D1F1FF] shadow-inner flex items-center justify-center">
          {isMobile && !isOpen ? (
            <div className="w-10 h-10 rounded-full bg-[#1AB2E5] flex items-center justify-center text-white font-bold">
              P
            </div>
          ) : (
            <div>
              <h2 className="text-xl font-bold text-[#1AB2E5]">PATIENT PORTAL</h2>
              <p className="text-xs text-gray-600 mt-1 font-semibold">Your Health, Our Priority</p>
            </div>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="flex flex-col gap-2 flex-grow overflow-y-auto px-2">
          {navItems.map((item) => {
            const tooltipId = `tooltip-${item.path}`;
            return (
              <Link
                key={item.path}
                to={item.path}
                data-tooltip-id={tooltipId}
                data-tooltip-content={item.label}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                  location.pathname === item.path
                    ? "bg-gradient-to-r from-[#1AB2E5] to-[#00AEEF] text-white font-semibold shadow-md"
                    : "text-gray-700 hover:bg-gradient-to-r hover:from-[#E6F7FF] hover:to-[#B8E6F8] hover:text-[#1AB2E5]"
                }`}
              >
                <span style={{ color: location.pathname === item.path ? "#FFFFFF" : item.color }}>
                  {item.icon}
                </span>
                {(!isMobile || isOpen) && <span className="text-sm">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className="mt-auto p-4 border-t border-[#B8E8F8] bg-gradient-to-r from-[#E6F7FF] to-[#D1F1FF] flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#1AB2E5] flex items-center justify-center text-white">
            {user?.firstName?.[0] || "G"}
          </div>
          {(!isMobile || isOpen) && (
            <div>
              <p className="text-sm font-medium">{user?.firstName || "Guest"} {user?.lastName || ""}</p>
              <p className="text-xs text-gray-500">Patient</p>
            </div>
          )}
        </div>
      </aside>

    
      {isMobile &&
        navItems.map((item) => (
          <Tooltip key={item.path} id={`tooltip-${item.path}`} place="right" delayShow={200} />
        ))}
    </>
  );
};

