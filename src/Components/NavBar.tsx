import { useRef, useEffect ,useState} from "react";
import { Link, useNavigate } from "react-router-dom";
import { BiHome, BiPhone } from "react-icons/bi";
import { MdLocalHospital } from "react-icons/md";
import { FaUserMd, FaSignOutAlt } from "react-icons/fa";
import { GrDashboard } from "react-icons/gr";
import { Menu, X, ChevronDown } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { clearCredentials } from "../Features/auth/authSlice";
import { toast, Toaster } from "sonner";
import type { RootState } from "../App/store";

export const NavBar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const dispatch = useDispatch();
  
  const navigate = useNavigate();
  const { isAuthenticated, user, userType } = useSelector(
    (state: RootState) => state.auth
  );

  const handleLogout = () => {
    dispatch(clearCredentials());
    navigate("/", { replace: true });
    toast.success("Logged out successfully");
    setMobileOpen(false);
    setProfileDropdownOpen(false);
  };

  const handleToggle = () => setMobileOpen((prev) => !prev);
  const closeMenu = () => setMobileOpen(false);

  const toggleProfileDropdown = () => setProfileDropdownOpen((prev) => !prev);

  const handleDashboardClick = () => {
    const dashboardPath = 
      userType === "admin"
        ? "/admin/overview"
        : userType === "doctor"
        ? "/doctorDashBoard/overview"
        : "/dashboard/main";
    
    navigate(dashboardPath);
    setProfileDropdownOpen(false);
    closeMenu();
  };

  // Generate user initials for avatar fallback
  const getUserInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
    }
    if (user?.firstName) {
      return user.firstName.charAt(0).toUpperCase();
    }
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return "U";
  };

useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setProfileDropdownOpen(false);
    }
  };
  document.addEventListener("mousedown", handleClickOutside);
  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);


  return (
    <nav className="bg-gradient-to-b from-white to-[#F0F9FF] shadow-lg border-b border-[#B8E6F8] sticky top-0 z-50">
      <Toaster richColors position="top-right" />
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 text-2xl font-bold text-[#1AB2E5] hover:text-[#159FCC] transition-all duration-300"
        >
          <MdLocalHospital className="text-3xl text-[#4CAF50]" />
          Theranos
        </Link>

        {/* Mobile Toggle */}
        <button
          onClick={handleToggle}
          aria-label="Toggle Menu"
          className="lg:hidden text-[#1AB2E5] hover:text-[#159FCC] transition-all duration-300"
        >
          {mobileOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-8">
          <div className="flex gap-6 text-gray-700 font-medium text-sm">
            <Link
              to="/"
              className="flex items-center gap-1 hover:text-[#1AB2E5] transition-all duration-300"
            >
              <BiHome className="text-[#2196F3]" />
              Home
            </Link>
            <Link
              to="/doctors"
              className="flex items-center gap-1 hover:text-[#1AB2E5] transition-all duration-300"
            >
              <FaUserMd className="text-[#9C27B0]" /> 
              Doctors
            </Link>
            <Link
              to="/contact"
              className="flex items-center gap-1 hover:text-[#1AB2E5] transition-all duration-300"
            >
              <BiPhone className="text-[#FF9800]" />
              Contact
            </Link>
          </div>

          {/* Auth Desktop */}
          {!isAuthenticated ? (
            <div className="flex gap-4">
              <Link
                to="/login"
                className="px-5 py-2 text-sm rounded-full border border-[#1AB2E5] text-[#1AB2E5] hover:bg-[#E6F7FF] transition-all duration-300"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-5 py-2 text-sm rounded-full bg-gradient-to-r from-[#1AB2E5] to-[#00AEEF] text-white hover:from-[#159FCC] hover:to-[#00AEEF] transition-all duration-300"
              >
                Register
              </Link>
            </div>
          ) : (
            <div className="relative">
              <button 
                onClick={toggleProfileDropdown}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#E6F7FF] focus:outline-none transition-all duration-300"
              >
                {/* Profile Picture */}
                <div className="relative">
                  {user?.profileURL ? (
                    <img
                      src={user.profileURL}
                      alt={`${user.firstName || 'User'}'s profile`}
                      className="w-10 h-10 rounded-full object-cover border-2 border-[#1AB2E5]"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#1AB2E5] to-[#00AEEF] flex items-center justify-center text-white font-semibold text-sm">
                      {getUserInitials()}
                    </div>
                  )}
                  {/* Online indicator */}
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#4CAF50] border-2 border-white rounded-full"></div>
                </div>

                {/* User Info */}
                <div className="flex flex-col items-start text-sm">
                  <span className="font-semibold text-gray-800">
                    {user?.firstName && user?.lastName 
                      ? `${user.firstName} ${user.lastName}`
                      : user?.firstName || "User"}
                  </span>
                  <span className="text-gray-500 text-xs truncate max-w-[150px]">
                    {user?.email || "user@example.com"}
                  </span>
                </div>

                <ChevronDown 
                  className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                    profileDropdownOpen ? 'rotate-180' : ''
                  }`} 
                />
              </button>

              {/* Dropdown */}
           {profileDropdownOpen && (
  <div
    ref={dropdownRef}
    onMouseLeave={() => setProfileDropdownOpen(false)}
    className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-[#B8E6F8] z-50 py-2"
  >
    <button
      onClick={handleDashboardClick}
      className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-700 hover:bg-[#E6F7FF] hover:text-[#1AB2E5] transition-all duration-300"
    >
      <GrDashboard className="text-[#8BC34A] text-lg" />
      <span className="font-medium">Dashboard</span>
    </button>
    <button
      onClick={handleLogout}
      className="w-full flex items-center gap-3 px-4 py-3 text-left text-red-600 hover:bg-red-50 transition-all duration-300"
    >
      <FaSignOutAlt className="text-[#D32F2F] text-lg" />
      <span className="font-medium">Logout</span>
    </button>
  </div>
)}

            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden px-6 pb-4 space-y-4 text-gray-700 font-medium text-sm bg-[#F0F9FF]">
          <Link
            to="/"
            onClick={closeMenu}
            className="block hover:text-[#1AB2E5] transition-all duration-300"
          >
            <BiHome className="inline mr-2 text-[#2196F3]" />
            Home
          </Link>
          <Link
            to="/doctors"
            onClick={closeMenu}
            className="block hover:text-[#1AB2E5] transition-all duration-300"
          >
            <FaUserMd className="inline mr-2 text-[#9C27B0]" />
            Doctors
          </Link>
          <Link
            to="/contact"
            onClick={closeMenu}
            className="block hover:text-[#1AB2E5] transition-all duration-300"
          >
            <BiPhone className="inline mr-2 text-[#FF9800]" />
            Contact
          </Link>

          <hr className="my-2 border-gray-200" />

          {/* Auth Mobile */}
          {!isAuthenticated ? (
            <>
              <Link
                to="/login"
                onClick={closeMenu}
                className="block py-2 rounded text-center border border-[#1AB2E5] text-[#1AB2E5] hover:bg-[#E6F7FF] transition-all duration-300"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={closeMenu}
                className="block py-2 rounded text-center bg-gradient-to-r from-[#1AB2E5] to-[#00AEEF] text-white hover:from-[#159FCC] hover:to-[#00AEEF] transition-all duration-300"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <>
              {/* Mobile User Profile */}
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-[#B8E6F8]">
                {user?.profileURL ? (
                  <img
                    src={user.profileURL}
                    alt="Profile"
                    className="w-12 h-12 rounded-full object-cover border-2 border-[#1AB2E5]"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#1AB2E5] to-[#00AEEF] flex items-center justify-center text-white font-semibold">
                    {getUserInitials()}
                  </div>
                )}
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-800">
                    {user?.firstName && user?.lastName 
                      ? `${user.firstName} ${user.lastName}`
                      : user?.firstName || "User"}
                  </span>
                  <span className="text-gray-500 text-xs">
                    {user?.email || "user@example.com"}
                  </span>
                  <span className="text-xs text-[#1AB2E5] capitalize font-medium">
                    {userType || "User"}
                  </span>
                </div>
              </div>

              <button
                onClick={handleDashboardClick}
                className="block w-full text-left hover:text-[#1AB2E5] transition-all duration-300 py-2"
              >
                <GrDashboard className="inline mr-2 text-[#8BC34A]" /> 
                Dashboard
              </button>

              <button
                onClick={handleLogout}
                className="block w-full text-left hover:text-red-600 transition-all duration-300 py-2"
              >
                <FaSignOutAlt className="inline mr-2 text-[#D32F2F]" />
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};