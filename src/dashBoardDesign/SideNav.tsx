import { useState, useEffect, useRef } from "react";
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
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../App/store";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";

export const SideNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const { user } = useSelector((state: RootState) => state.auth);

  const navItems = [
    { path: "/dashboard/main", icon: <Home size={22} />, label: "Dashboard", color: "#1AB2E5" },
    { path: "/dashboard/doctors", icon: <Stethoscope size={22} />, label: "Find Doctors", color: "#4CAF50" },
    { path: "/dashboard/appointments", icon: <CalendarCheck2 size={22} />, label: "Appointments", color: "#2196F3" },
    { path: "/dashboard/prescriptions", icon: <FileText size={22} />, label: "Prescriptions", color: "#9C27B0" },
    { path: "/dashboard/payments", icon: <CreditCard size={22} />, label: "Payments", color: "#FF9800" },
    { path: "/dashboard/support", icon: <MessageSquareText size={22} />, label: "Support", color: "#673AB7" },
    { path: "/dashboard/profile", icon: <SquareUserRound size={22} />, label: "Profile", color: "#03A9F4" },
    { path: "/dashboard/settings", icon: <Settings size={22} />, label: "Settings", color: "#8BC34A" },
  ];

  // Detect mobile and handle initial state
  useEffect(() => {
    const handleResize = () => {
      const mobileCheck = window.innerWidth < 1024;
      setIsMobile(mobileCheck);
      if (!mobileCheck) {
        setIsOpen(false); // Always show full sidebar on desktop
      } else {
        setIsCollapsed(false); // Disable collapse on mobile
      }
    };

    handleResize(); // Initialize
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Improved swipe gesture handling
  useEffect(() => {
    if (!isMobile) return;

    const handleTouchStart = (e: TouchEvent) => {
      // Only register swipes that start near the edge
      if (e.touches[0].clientX < 30) {
        touchStartX.current = e.touches[0].clientX;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (touchStartX.current === null) return;
      
      const currentX = e.touches[0].clientX;
      const diff = currentX - touchStartX.current;
      
      // Only allow right swipe to open when closed
      if (!isOpen && diff > 50) {
        setIsOpen(true);
        touchStartX.current = null;
      }
      // Only allow left swipe to close when open
      else if (isOpen && diff < -50) {
        setIsOpen(false);
        touchStartX.current = null;
      }
    };

    const handleTouchEnd = () => {
      touchStartX.current = null;
    };

    document.addEventListener("touchstart", handleTouchStart);
    document.addEventListener("touchmove", handleTouchMove, { passive: false });
    document.addEventListener("touchend", handleTouchEnd);

    return () => {
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isMobile, isOpen]);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
    // Haptic feedback for mobile
    if (navigator.vibrate) navigator.vibrate(10);
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isMobile && 
        isOpen && 
        sidebarRef.current && 
        !sidebarRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobile, isOpen]);

  return (
    <>
      {/* Mobile Toggle Button */}
      {isMobile && (
        <button
          onClick={toggleSidebar}
          className="lg:hidden fixed top-4 left-4 z-[100] p-3 bg-[#1AB2E5] text-white rounded-full shadow-lg hover:bg-[#159FCC] transition-all"
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      )}

      {/* Mobile Overlay */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-[90] transition-opacity duration-300"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className={`${isMobile ? "fixed" : "relative"} top-0 left-0 h-full 
        ${isMobile ? (isOpen ? "translate-x-0 w-64" : "-translate-x-full w-16") : 
           isCollapsed ? "w-20" : "w-64"}
        bg-gradient-to-b from-[#E6F7FF] to-[#FFFFFF] shadow-xl border-r border-[#B8E6F8]
        z-[100] flex flex-col transition-all duration-300 ease-in-out`}
      >
        {/* Collapse Button (Desktop only) */}
        {!isMobile && (
          <button
            onClick={toggleCollapse}
            className="absolute -right-3 top-6 z-[110] bg-white border border-[#B8E6F8] rounded-full p-1 shadow-lg hover:bg-[#E6F7FF] transition-all hover:scale-110"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <ChevronRight size={18} className="text-[#1AB2E5]" />
            ) : (
              <ChevronLeft size={18} className="text-[#1AB2E5]" />
            )}
          </button>
        )}

        {/* Logo Section */}
        <div 
          className={`p-4 border-b border-[#B8E6F8] bg-gradient-to-r from-[#E6F7FF] to-[#D1F1FF] ${
            (isCollapsed || (isMobile && !isOpen)) ? "flex justify-center py-6" : ""
          }`}
        >
          {(isCollapsed || (isMobile && !isOpen)) ? (
            <div 
              className="w-10 h-10 rounded-full bg-[#1AB2E5] flex items-center justify-center text-white font-bold text-lg"
              data-tooltip-id="logo-tooltip"
              data-tooltip-content="Patient Portal"
            >
              P
              <Tooltip id="logo-tooltip" place="right" />
            </div>
          ) : (
            <div>
              <h2 className="text-xl font-bold text-[#1AB2E5]">PATIENT PORTAL</h2>
              <p className="text-xs text-gray-600 mt-1 font-semibold">Your Health, Our Priority</p>
            </div>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="flex flex-col gap-1 flex-grow p-2 overflow-y-auto">
          {navItems.map((item) => {
            const tooltipId = `nav-tooltip-${item.path.replace(/\//g, '-')}`;
            return (
              <div key={item.path}>
                <Link
                  to={item.path}
                  data-tooltip-id={tooltipId}
                  data-tooltip-content={item.label}
                  className={`flex items-center ${
                    (isCollapsed || (isMobile && !isOpen)) ? "justify-center px-2 py-4" : "gap-3 px-4 py-3"
                  } rounded-lg transition-all duration-200 ${
                    location.pathname === item.path
                      ? "bg-gradient-to-r from-[#1AB2E5] to-[#00AEEF] text-white font-medium shadow-md"
                      : "text-gray-700 hover:bg-[#E6F7FF] hover:text-[#1AB2E5]"
                  }`}
                  onClick={() => isMobile && setIsOpen(false)}
                >
                  <span style={{ color: location.pathname === item.path ? "#FFFFFF" : item.color }}>
                    {item.icon}
                  </span>
                  {!(isCollapsed || (isMobile && !isOpen)) && (
                    <span className="text-sm">{item.label}</span>
                  )}
                </Link>
                <Tooltip 
                  id={tooltipId} 
                  place="right" 
                  delayShow={300}
                  className="z-[120]"
                />
              </div>
            );
          })}
        </nav>

        {/* User Profile Section */}
        <div className="p-2 border-t border-[#B8E8F8]">
          <div 
            className={`flex items-center ${
              (isCollapsed || (isMobile && !isOpen)) ? "justify-center" : "gap-3"
            } p-2 rounded-lg bg-gradient-to-r from-[#E6F7FF] to-[#D1F1FF]`}
            data-tooltip-id="profile-tooltip"
            data-tooltip-content={`${user?.firstName || "Guest"} ${user?.lastName || ""}`}
          >
            <div className="w-10 h-10 rounded-full bg-[#1AB2E5] flex items-center justify-center text-white shrink-0">
              {user?.firstName?.[0] || "G"}
            </div>
            {!(isCollapsed || (isMobile && !isOpen)) && (
              <div className="overflow-hidden">
                <p className="text-sm font-medium truncate">
                  {user?.firstName || "Guest"} {user?.lastName}
                </p>
                <p className="text-xs text-gray-500 truncate">Patient</p>
              </div>
            )}
            <Tooltip id="profile-tooltip" place="right" />
          </div>
        </div>
      </aside>
    </>
  );
};