import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BiHome, BiPhone } from "react-icons/bi";
import { MdLocalHospital } from "react-icons/md";
import { FaUserMd, FaSignOutAlt } from "react-icons/fa";
import { GrDashboard } from "react-icons/gr";
import { Menu, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { clearCredentials } from "../Features/auth/authSlice";
import { toast, Toaster } from "sonner";
import type { RootState } from "../App/store";

export const NavBar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
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
  };

  const handleToggle = () => setMobileOpen((prev) => !prev);
  const closeMenu = () => setMobileOpen(false);

  return (
    <nav className="bg-gradient-to-b from-white to-[#F0F9FF] shadow-lg border-b border-[#B8E6F8] sticky top-0 z-50">
      <Toaster richColors position="top-right" />
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 text-2xl font-bold text-[#1AB2E5] hover:text-[#159FCC] transition-all duration-300"
        >
          <MdLocalHospital className="text-3xl text-[#4CAF50]" /> {/* Green */}
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
              <BiHome className="text-[#2196F3]" /> {/* Blue */}
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
              <BiPhone className="text-[#FF9800]" /> {/* Orange */}
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
            <div className="relative group text-sm">
              <button className="flex items-center gap-2 text-gray-700 hover:text-[#1AB2E5] focus:outline-none transition-all duration-300">
                <span>Hi, {user?.firstName ?? "User"}</span>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Dropdown */}
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-[#B8E6F8] z-50 hidden group-hover:block">
                <Link
                  to={
                    userType === "admin"
                      ? "/admin/overview"
                      : userType === "doctor"
                      ? "/doctorDashBoard/overview"
                      : "/dashboard/main"
                  }
                  onClick={closeMenu}
                  className="block hover:text-[#1AB2E5] transition-all duration-300"
                >
                  <GrDashboard className="inline mr-2 text-[#8BC34A]" /> 
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-all duration-300"
                >
                  <FaSignOutAlt className="inline mr-2 text-[#D32F2F]" /> {/* Red */}
                  Logout
                </button>
              </div>
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
            <BiHome className="inline mr-2 text-[#2196F3]" /> {/* Blue */}
            Home
          </Link>
          <Link
            to="/doctors"
            onClick={closeMenu}
            className="block hover:text-[#1AB2E5] transition-all duration-300"
          >
            <FaUserMd className="inline mr-2 text-[#9C27B0]" /> {/* Purple */}
            Doctors
          </Link>
          <Link
            to="/contact"
            onClick={closeMenu}
            className="block hover:text-[#1AB2E5] transition-all duration-300"
          >
            <BiPhone className="inline mr-2 text-[#FF9800]" /> {/* Orange */}
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
              <Link
                  to={
                    userType === "admin"
                      ? "/admin/overview"
                      : userType === "doctor"
                      ? "/doctorDashBoard/overview"
                      : "/dashboard/main"
                  }
                  onClick={closeMenu}
                  className="block hover:text-[#1AB2E5] transition-all duration-300"
                >
                  <GrDashboard className="inline mr-2 text-[#8BC34A]" /> 
                  Dashboard
                </Link>

              <button
                onClick={handleLogout}
                className="block w-full text-left hover:text-red-600 transition-all duration-300"
              >
                <FaSignOutAlt className="inline mr-2 text-[#D32F2F]" /> {/* Red */}
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};