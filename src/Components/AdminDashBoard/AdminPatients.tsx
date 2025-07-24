import { useState} from "react";
import { useForm } from "react-hook-form";
import { userApi } from "../../Features/api/userAPI";
import { doctorApi } from "../../Features/api/doctorAPI";
import { FiEdit2, FiTrash2, FiPlus, FiUser, FiPhone, FiMail, FiMapPin, FiCalendar, FiFileText, FiAlertCircle, FiSearch } from "react-icons/fi";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { EyeIcon, Users, Stethoscope, Shield } from "lucide-react";

export const AdminPatients = () => {
  const { data: usersData = [], refetch } = userApi.useGetUsersProfilesQuery(undefined);
  const [deleteUser] = userApi.useDeleteUserByIdMutation();
  const [updateUser] = userApi.useUpdateUserProfileMutation();
  const [addUser] = userApi.useCreateUserMutation();
  const [addDoctor] = doctorApi.useCreateDoctorMutation();

  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [viewDetails, setViewDetails] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "patients" | "doctors" | "admins">("all");

  // Filter users based on search and active tab
  const filteredUsers = usersData.filter((user: any) => {
    const matchesSearch = 
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTab = 
      activeTab === "all" ||
      (activeTab === "patients" && user.userType === "user") ||
      (activeTab === "doctors" && user.userType === "doctor") ||
      (activeTab === "admins" && user.userType === "admin");
    
    return matchesSearch && matchesTab;
  });

  const { register, handleSubmit, reset, watch } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      address: "",
      contactPhone: "",
      password: "defaultpass",
      userType: "user",
      bio: "",
      specialization: "",
      availableDays: "",
    },
  });

  const onSubmit = async (data: any) => {
    try {
      if (editMode) {
        await updateUser({ userId: selectedUser.userId, body: data }).unwrap();
        toast.success("User updated successfully");
      } else {
        const userRes = await addUser({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          address: data.address,
          contactPhone: data.contactPhone,
          userType: data.userType,
          password: data.password
        }).unwrap();

        if (data.userType === "doctor") {
          await addDoctor({
            userId: userRes.userId,
            bio: data.bio,
            specialization: data.specialization,
            availableDays: data.availableDays,
          }).unwrap();
        }
        toast.success("User created successfully");
      }
      setShowForm(false);
      reset();
      refetch();
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit form");
    }
  };

  const openEditForm = (user: any) => {
    setEditMode(true);
    setSelectedUser(user);
    reset({
      ...user,
      ...user.doctor 
    });
    setShowForm(true);
  };

  const openAddForm = () => {
    setEditMode(false);
    setSelectedUser(null);
    reset({
      firstName: "",
      lastName: "",
      email: "",
      address: "",
      contactPhone: "",
      password: "defaultpass",
      userType: "user",
      bio: "",
      specialization: "",
      availableDays: "",
    });
    setShowForm(true);
  };

  const handleDelete = async (userId: number) => {
    if (confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUser(userId).unwrap();
        toast.success("User deleted successfully");
        refetch();
      } catch {
        toast.error("Failed to delete user");
      }
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">User Management</h1>
          <p className="text-gray-600">Manage all user accounts and information</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={openAddForm}
          className="bg-[#1AB2E5] hover:bg-[#1498C5] text-white px-6 py-3 rounded-lg shadow-md flex items-center gap-2"
        >
          <FiPlus size={18} />
          Add New User
        </motion.button>
      </div>

      {/* Search and Filter Section */}
      <div className="mb-8 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Bar */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search users by name or email..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1AB2E5] focus:border-[#1AB2E5]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* User Type Tabs */}
        <div className="flex overflow-x-auto mt-4 pb-2 scrollbar-hide">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-4 py-2 text-sm font-medium rounded-l-lg flex items-center gap-2 whitespace-nowrap ${
              activeTab === "all"
                ? "bg-[#1AB2E5] text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <Users size={16} />
            All Users ({usersData.length})
          </button>
          <button
            onClick={() => setActiveTab("patients")}
            className={`px-4 py-2 text-sm font-medium flex items-center gap-2 whitespace-nowrap ${
              activeTab === "patients"
                ? "bg-[#1AB2E5] text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <FiUser size={16} />
            Patients ({usersData.filter((u: any) => u.userType === "user").length})
          </button>
          <button
            onClick={() => setActiveTab("doctors")}
            className={`px-4 py-2 text-sm font-medium flex items-center gap-2 whitespace-nowrap ${
              activeTab === "doctors"
                ? "bg-[#1AB2E5] text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <Stethoscope size={16} />
            Doctors ({usersData.filter((u: any) => u.userType === "doctor").length})
          </button>
          <button
            onClick={() => setActiveTab("admins")}
            className={`px-4 py-2 text-sm font-medium rounded-r-lg flex items-center gap-2 whitespace-nowrap ${
              activeTab === "admins"
                ? "bg-[#1AB2E5] text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <Shield size={16} />
            Admins ({usersData.filter((u: any) => u.userType === "admin").length})
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-[#E6F7FF]">
              <Users className="text-[#1AB2E5]" size={20} />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Total Users</p>
              <p className="text-2xl font-semibold">{usersData.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-[#E6F7FF]">
              <FiUser className="text-[#1AB2E5]" size={20} />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Patients</p>
              <p className="text-2xl font-semibold">
                {usersData.filter((u: any) => u.userType === "user").length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-[#E6F7FF]">
              <Stethoscope className="text-[#1AB2E5]" size={20} />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Doctors</p>
              <p className="text-2xl font-semibold">
                {usersData.filter((u: any) => u.userType === "doctor").length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-[#E6F7FF]">
              <Shield className="text-[#1AB2E5]" size={20} />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Admins</p>
              <p className="text-2xl font-semibold">
                {usersData.filter((u: any) => u.userType === "admin").length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user: any) => (
                  <tr key={user.userId} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-4">
                        <img
                          src={user.profileURL || "/default-avatar.png"}
                          className="w-10 h-10 rounded-full object-cover"
                          alt={user.firstName}
                        />
                        <div>
                          <p className="font-medium text-gray-900">{user.firstName} {user.lastName}</p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="flex items-center gap-2 text-sm">
                          <FiPhone className="text-gray-400" size={14} />
                          {user.contactPhone || "N/A"}
                        </span>
                        <span className="flex items-center gap-2 text-sm mt-1">
                          <FiMapPin className="text-gray-400" size={14} />
                          {user.address || "N/A"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        user.userType === "doctor" 
                          ? "bg-blue-100 text-blue-800" 
                          : user.userType === "admin"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-green-100 text-green-800"
                      }`}>
                        {user.userType}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Active</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => openEditForm(user)}
                          className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100"
                        >
                          <FiEdit2 size={16} />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDelete(user.userId)}
                          className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100"
                        >
                          <FiTrash2 size={16} />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => { setSelectedUser(user); setViewDetails(true); }}
                          className="p-2 rounded-lg bg-gray-50 text-gray-600 hover:bg-gray-100"
                        >
                          <EyeIcon size={16} />
                        </motion.button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    No users found matching your criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit User Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", damping: 20 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#1AB2E5] to-[#1498C5] p-6 text-white">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">
                  {editMode ? "Edit User" : "Create New User"}
                </h2>
                <button 
                  onClick={() => setShowForm(false)}
                  className="p-1 rounded-full hover:bg-white/20 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <p className="text-blue-100 mt-1">
                {editMode ? "Update user information" : "Fill in all required fields"}
              </p>
            </div>

            {/* Form Content */}
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* First Name */}
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        {...register("firstName", { required: true })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1AB2E5] focus:border-[#1AB2E5] transition-all"
                        placeholder="John"
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <FiUser className="text-gray-400" />
                      </div>
                    </div>
                  </div>

                  {/* Last Name */}
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        {...register("lastName", { required: true })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1AB2E5] focus:border-[#1AB2E5] transition-all"
                        placeholder="Doe"
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <FiUser className="text-gray-400" />
                      </div>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        {...register("email", { required: true })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1AB2E5] focus:border-[#1AB2E5] transition-all"
                        placeholder="john@example.com"
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <FiMail className="text-gray-400" />
                      </div>
                    </div>
                  </div>

                  {/* Contact Phone */}
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        {...register("contactPhone", { required: true })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1AB2E5] focus:border-[#1AB2E5] transition-all"
                        placeholder="+254 712 345 678"
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <FiPhone className="text-gray-400" />
                      </div>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Address <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        {...register("address", { required: true })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1AB2E5] focus:border-[#1AB2E5] transition-all"
                        placeholder="Nakuru, Kenya"
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <FiMapPin className="text-gray-400" />
                      </div>
                    </div>
                  </div>

                  {/* Password */}
                  {!editMode && (
                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">
                        Password <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="password"
                          {...register("password", { required: !editMode })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1AB2E5] focus:border-[#1AB2E5] transition-all"
                          placeholder="••••••••"
                        />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* User Type */}
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                      User Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      {...register("userType", { required: true })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1AB2E5] focus:border-[#1AB2E5] appearance-none bg-white bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iY3VycmVudENvbG9yIj48cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik01LjI5MyA5LjI5M2ExIDEgMCAwIDEgMS40MTQgMGwzLjI5MyAzLjI5MyA0LjI5My00LjI5M2ExIDEgMCAxIDEgMS40MTQgMS40MTRsLTUgNWExIDEgMCAwIDEtMS40MTQgMGwtNC00YTEgMSAwIDAgMSAwLTEuNDE0eiIgY2xpcC1ydWxlPSJldmVub2RkIi8+PC9zdmc+')] bg-no-repeat bg-[right_1rem_center]"
                    >
                      <option value="user">Patient</option>
                      <option value="doctor">Doctor</option>
                      <option value="admin">Administrator</option>
                    </select>
                  </div>

                  {/* Conditional Doctor Fields */}
                  {watch("userType") === "doctor" && (
                    <>
                      <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700">
                          Specialization <span className="text-red-500">*</span>
                        </label>
                        <input
                          {...register("specialization", { required: watch("userType") === "doctor" })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1AB2E5] focus:border-[#1AB2E5] transition-all"
                          placeholder="Cardiology"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700">
                          Bio <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          {...register("bio", { required: watch("userType") === "doctor" })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1AB2E5] focus:border-[#1AB2E5] transition-all"
                          placeholder="Brief professional background..."
                          rows={3}
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700">
                          Available Days <span className="text-red-500">*</span>
                        </label>
                        <input
                          {...register("availableDays", { required: watch("userType") === "doctor" })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1AB2E5] focus:border-[#1AB2E5] transition-all"
                          placeholder="Monday, Wednesday, Friday"
                        />
                      </div>
                    </>
                  )}
                </div>

                {/* Form Actions */}
                <div className="flex justify-end gap-3 pt-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-medium"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-[#1AB2E5] to-[#1498C5] text-white rounded-lg hover:from-[#1498C5] hover:to-[#1AB2E5] transition-all font-medium shadow-md"
                  >
                    {editMode ? "Update User" : "Create User"}
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}

      {/* User Details Modal */}
      {viewDetails && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                    <img
                      src={selectedUser.profileURL || "/default-avatar.png"}
                      className="w-12 h-12 rounded-full object-cover"
                      alt={selectedUser.firstName}
                    />
                    {selectedUser.firstName} {selectedUser.lastName}
                    <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                      selectedUser.userType === "doctor" 
                        ? "bg-blue-100 text-blue-800" 
                        : selectedUser.userType === "admin"
                        ? "bg-purple-100 text-purple-800"
                        : "bg-green-100 text-green-800"
                    }`}>
                      {selectedUser.userType}
                    </span>
                  </h2>
                  <p className="text-gray-600">{selectedUser.email}</p>
                </div>
                <button 
                  onClick={() => setViewDetails(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  &times;
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <FiUser className="text-[#1AB2E5]" /> Personal Info
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-gray-500">Phone:</span> {selectedUser.contactPhone || "N/A"}</p>
                    <p><span className="text-gray-500">Address:</span> {selectedUser.address || "N/A"}</p>
                    <p><span className="text-gray-500">Registered:</span> {new Date(selectedUser.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                
                {selectedUser.userType === "doctor" && selectedUser.doctor && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <Stethoscope className="text-[#1AB2E5]" /> Professional Info
                    </h3>
                    <div className="space-y-2 text-sm">
                      <p><span className="text-gray-500">Specialization:</span> {selectedUser.doctor.specialization || "N/A"}</p>
                      <p><span className="text-gray-500">Available Days:</span> {selectedUser.doctor.availableDays || "N/A"}</p>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="space-y-6">
                {selectedUser.userType === "user" && (
                  <>
                    <div>
                      <h3 className="font-semibold text-lg flex items-center gap-2 text-gray-800 mb-3">
                        <FiCalendar className="text-[#1AB2E5]" /> Appointments
                      </h3>
                      {selectedUser.appointments?.length > 0 ? (
                        <div className="space-y-2">
                          {selectedUser.appointments.map((appt: any) => (
                            <div key={appt.appointmentId} className="p-3 border border-gray-100 rounded-lg hover:bg-gray-50">
                              <div className="flex justify-between">
                                <p className="font-medium">{appt.appointmentDate} • {appt.timeSlot}</p>
                                <span className={`px-2 py-1 text-xs rounded-full ${
                                  appt.appointmentStatus === "Confirmed" 
                                    ? "bg-green-100 text-green-800" 
                                    : "bg-yellow-100 text-yellow-800"
                                }`}>
                                  {appt.appointmentStatus}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600">With Dr. {appt.doctor?.user?.firstName}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-sm">No appointments found</p>
                      )}
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-lg flex items-center gap-2 text-gray-800 mb-3">
                        <FiFileText className="text-[#1AB2E5]" /> Prescriptions
                      </h3>
                      {selectedUser.prescriptions?.length > 0 ? (
                        <div className="space-y-2">
                          {selectedUser.prescriptions.map((rx: any) => (
                            <div key={rx.prescriptionId} className="p-3 border border-gray-100 rounded-lg hover:bg-gray-50">
                              <div className="flex justify-between">
                                <p className="font-medium">{rx.diagnosis}</p>
                                <span className="text-sm text-gray-500">{rx.issuedAt}</span>
                              </div>
                              <p className="text-sm text-gray-600">{rx.notes}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-sm">No prescriptions found</p>
                      )}
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-lg flex items-center gap-2 text-gray-800 mb-3">
                        <FiAlertCircle className="text-[#1AB2E5]" /> Complaints
                      </h3>
                      {selectedUser.complaints?.length > 0 ? (
                        <div className="space-y-2">
                          {selectedUser.complaints.map((c: any) => (
                            <div key={c.complaintId} className="p-3 border border-gray-100 rounded-lg hover:bg-gray-50">
                              <div className="flex justify-between">
                                <p className="font-medium">{c.subject}</p>
                                <span className={`px-2 py-1 text-xs rounded-full ${
                                  c.status === "Resolved" 
                                    ? "bg-green-100 text-green-800" 
                                    : "bg-yellow-100 text-yellow-800"
                                }`}>
                                  {c.status}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 line-clamp-2">{c.message}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-sm">No complaints found</p>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};