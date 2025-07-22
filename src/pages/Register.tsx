import { Link, useNavigate } from "react-router-dom";
import { Footer } from "../Components/Footer";
import { NavBar } from "../Components/NavBar";
import { useForm } from "react-hook-form";
import { userApi } from "../Features/api/userAPI";
import { Toaster, toast } from "sonner";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useState } from "react";

type UserRegisterFormValues = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  contactPhone: string;
address: string;
};

export const Register = () => {
  const { register, handleSubmit, formState: { errors }, watch } = useForm<UserRegisterFormValues>();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [registerUser, { isLoading }] = userApi.useRegisterUserMutation();
  const navigate = useNavigate();


const onSubmit = async (data: UserRegisterFormValues) => {
  const loadingToastId = toast.loading("Creating your account...");
  const { confirmPassword, ...payload } = data;

  try {
    console.log("Payload sent to backend:", payload);
    const res = await registerUser(payload).unwrap();
    toast.success(res?.message || "Registration successful", { id: loadingToastId });
    navigate("/login", {
      state: { email: data.email, password: data.password },
      replace: true,
    });
  } catch (err: any) {
    toast.error("Failed to Register: " + (err.data?.message || err.message || err), {
      id: loadingToastId,
    });
  }
};



  return (
    <>
      <Toaster richColors position="top-right" />
      <NavBar />
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create your account</h1>
          </div>

          {/* Form */}
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <strong>First Name</strong>
                </label>
                <input
                  {...register("firstName", { required: true })}
                  placeholder="Enter your first name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500 focus:outline-none"
                />
                {errors.firstName && <p className="text-red-600 text-xs mt-1">First name is required</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <strong>Last Name</strong>
                </label>
                <input
                  {...register("lastName", { required: true })}
                  placeholder="Enter your last name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500 focus:outline-none"
                />
                {errors.lastName && <p className="text-red-600 text-xs mt-1">Last name is required</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <strong>Contact Phone</strong>
                </label>
                <input
                  {...register("contactPhone", { required: true })}
                  placeholder="Enter your contact phone"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500 focus:outline-none"
                />
                {errors.contactPhone && <p className="text-red-600 text-xs mt-1">Phone number is required</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <strong>Email</strong>
                </label>
                <input
                  {...register("email", { required: true })}
                  placeholder="Enter your email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500 focus:outline-none"
                />
                {errors.email && <p className="text-red-600 text-xs mt-1">Email is required</p>}
              </div>
              <div>
  <label className="block text-sm font-medium text-gray-700 mb-1">
    <strong>Address</strong>
  </label>
  <input
    {...register("address", { required: true })}
    placeholder="Enter your address"
    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500 focus:outline-none"
  />
  {errors.address && <p className="text-red-600 text-xs mt-1">Address is required</p>}
</div>


              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <strong>Password</strong>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    {...register("password", { required: true })}
                    placeholder="Enter your password"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500 focus:outline-none"
                  />
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute top-2.5 right-3 cursor-pointer text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
                {errors.password && <p className="text-red-600 text-xs mt-1">Password is required</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <strong>Confirm Password</strong>
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    {...register("confirmPassword", {
                      required: true,
                      validate: (value) => value === watch('password') || "Passwords don't match"
                    })}
                    placeholder="Confirm your password"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500 focus:outline-none"
                  />
                  <span
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute top-2.5 right-3 cursor-pointer text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-600 text-xs mt-1">
                    {errors.confirmPassword.message || "Please confirm your password"}
                  </p>
                )}
              </div>


              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#00AEEF] hover:bg-[#0091CC] focus:outline-none"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating account..." : "Register"}
                </button>
              </div>
            </form>

            <div className="mt-6 text-center text-sm text-gray-500">
              <p>
                Already have an account?{" "}
                <Link to="/login" className="font-medium text-[#00AEEF] hover:text-[#0091CC]">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};