import { Link } from "react-router-dom";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import { Toaster, toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { userApi } from "../Features/api/userAPI";
import { useDispatch } from "react-redux";
import { setCredentials } from "../Features/auth/authSlice";
import { setCredentials as setDoctorCredentials } from "../Features/auth/doctorSlice";

import { NavBar } from "../Components/NavBar";

type UserLoginFormValues = {
  error: any;
  email: string;
  password: string;
};

export const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { register, handleSubmit, formState: { errors } } = useForm<UserLoginFormValues>();
  const [loginUser, { isLoading }] = userApi.useLoginUserMutation();
  
  const onSubmit = async (data: UserLoginFormValues) => {
    const loadingToastId = toast.loading("Logging in...");
    try {
      const res = await loginUser(data).unwrap();
      const { email, firstName, lastName, token, userId, address,userType ,doctor} = res;
     
      dispatch(setCredentials({ email, firstName, lastName,address, userId, token, userType}));

      if (userType === "doctor" && doctor) {
      dispatch(setDoctorCredentials(doctor)); 
    }



      toast.success(res?.message || "Login successful", { id: loadingToastId });

    const pendingDoctorId = localStorage.getItem("pendingBookingDoctorId");
    if (pendingDoctorId) {
      localStorage.removeItem("pendingBookingDoctorId");
      navigate(`/dashboard/doctors?book=${pendingDoctorId}`);
      return;
    }

      if (userType === "admin") {
        navigate("/admin/overview");
      } else if (userType === "doctor") {
        navigate("/doctorDashBoard/overview");
      } else if (userType === "user") {
        navigate("/dashboard/main");
      } else {
        toast.error("Unknown user type", { id: loadingToastId });
      }
    } catch (err: any) {
      console.log(err)
      toast.error(
        "Login failed: " + (err?.data?.error|| "Unknown error"),
        { id: loadingToastId }
      );
    }
  };

  return (
    <>
      <Toaster richColors position="top-right" />
      <NavBar />
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">Welcome back</h1>
          </div>
          
          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6 bg-white p-8 rounded-lg shadow-sm">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  {...register("email", { required: true })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1AB2E5] focus:border-[#1AB2E5]"
                  placeholder="Enter your email"
                />
                {errors.email && <p className="text-red-600 text-xs mt-1">Email is required</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    {...register("password", { required: true })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1AB2E5] focus:border-[#1AB2E5] pr-10"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && <p className="text-red-600 text-xs mt-1">Password is required</p>}
              </div>

              <div className="flex items-center justify-end">
                <Link to="/forgot-password" className="text-sm text-[#1AB2E5] hover:text-[#1489b8]">
                  Forgot password?
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#1AB2E5] hover:bg-[#1489b8] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1AB2E5]"
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Log in"}
              </button>
            </div>
          </form>

          <div className="text-center text-sm text-gray-600">
            <p>
              Don't have an account?{" "}
              <Link to="/register" className="font-medium text-[#1AB2E5] hover:text-[#1489b8]">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};