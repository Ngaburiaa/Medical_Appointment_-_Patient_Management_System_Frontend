import { useEffect, useRef, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import axios from "axios";
import { toast } from "sonner";
import { FaCamera, FaEdit, FaTimes } from "react-icons/fa";
import { SaveIcon } from "lucide-react";
import { useDispatch } from "react-redux";
import { userApi } from "../../Features/api/userAPI";
import type { RootState } from '../../App/store';
import { useSelector } from 'react-redux';
import { setCredentials } from "../../Features/auth/authSlice";

interface FormValues {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
}


export const Profile = () => {
   const dispatch = useDispatch();
  const { user, userType,token } = useSelector((state: RootState) => state.auth);
   const {   data: userData,     refetch,    } = userApi.useGetUserByIdQuery(user?.userId!);
  const [updateUserProfile] = userApi.useUpdateUserProfileMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"personal" | "security">("personal");
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const cloudName = "dgrdlpkoz";
  const presetKey = "Theranos";

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>();

  useEffect(() => {
    if (userData) {
      reset({
        firstName: userData.firstName ?? "",
        lastName: userData.lastName ?? "",
        email: userData.email ?? "",
        address: userData.address ?? "",
      });
    }
  }, [userData, reset]);

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      await updateUserProfile({ user_id: user?.userId, ...data }).unwrap();
      dispatch(setCredentials({ token:token || "", userType:userType ||"user",userId:user?.userId!, ...data, profileURL: userData?.profileURL }));
      toast.success("Profile updated");
      setIsModalOpen(false);
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Update failed");
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setPreviewImage(previewUrl);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", presetKey);

    setUploading(true);
    const loadingToast = toast.loading("Uploading image...");

    try {
      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        formData,
        {
          onUploadProgress: (event) => {
            const percent = Math.round((event.loaded * 100) / (event.total || 1));
            setUploadProgress(percent);
          },
        }
      );

      const profileURL = res.data.secure_url;
      await updateUserProfile({ user_id: user?.userId, profileURL }).unwrap();

     dispatch(setCredentials({
  token: token || "",
  userType: userType || "user",
  userId: user?.userId!,
  firstName: userData?.firstName ?? "",
  lastName: userData?.lastName ?? "",
  email: userData?.email ?? "",
  address: userData?.address ?? "",
  profileURL,
}));

      toast.success("Profile image updated", { id: loadingToast });
      setPreviewImage(null);
      refetch();
    } catch {
      toast.error("Image upload failed", { id: loadingToast });
    } finally {
      setUploading(false);
    }
  };


  const profileURL =
    previewImage ||
    userData?.profileURL ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      userData?.firstName || "User"
    )}&background=4ade80&color=fff&size=128`;

  return (
    <div className="min-h-screen bg-[#F0F9FF] py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-[#E6F7FF] to-[#F0F9FF] p-8 border-b">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4 relative">
              <div className="relative group z-10">
                <img
                  src={profileURL}
                  alt="Profile"
                  className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
                />
                {uploading && (
                  <div className="absolute inset-0 bg-black/50 flex flex-col justify-center items-center rounded-full pointer-events-none">
                    <div className="w-20 h-2 bg-gray-300 rounded-full overflow-hidden">
                      <div className="bg-blue-500 h-full" style={{ width: `${uploadProgress}%` }}></div>
                    </div>
                    <span className="text-white text-xs mt-1">{uploadProgress}%</span>
                  </div>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="absolute bottom-0 right-0 bg-white border p-1 rounded-full pointer-events-auto"
                >
                  <FaCamera className="text-blue-600 w-4 h-4" />
                </button>
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-gray-800">
                  {userData?.firstName} {userData?.lastName}
                </h2>
                <p className="text-gray-600">{userData?.email}</p>
                <span className="text-xs bg-[#E6F7FF] text-[#1AB2E5] px-2 py-1 rounded-full inline-block mt-1">
  {userType
    ? userType.charAt(0).toUpperCase() + userType.slice(1)
    : "Unknown"}
</span>

              </div>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-[#1AB2E5] hover:bg-[#1489b8] text-white font-medium py-2 px-5 rounded-lg flex items-center gap-2"
            >
              <FaEdit className="text-sm" /> Edit Profile
            </button>
          </div>
        </div>

        <div className="border-b flex">
          {["personal", "security"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as "personal" | "security")}
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === tab ? "text-[#1AB2E5] border-b-2 border-[#1AB2E5]" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab === "personal" ? "Personal Information" : "Security Settings"}
            </button>
          ))}
        </div>

        <div className="p-8">
          {activeTab === "personal" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InfoCard label="First Name" value={userData?.firstName} />
              <InfoCard label="Last Name" value={userData?.lastName} />
              <InfoCard label="Email" value={userData?.email} />
              <InfoCard label="Address" value={userData?.address} />
            </div>
          )}
          {activeTab === "security" && (
            <div className="bg-[#F0F9FF] rounded-lg p-6 flex justify-between items-center">
              <div>
                <h3 className="text-sm font-medium text-gray-700">Password</h3>
                <p className="text-sm text-gray-500">Last changed recently</p>
              </div>
              <button className="bg-white border text-[#1AB2E5] hover:bg-[#E6F7FF] py-2 px-4 rounded-lg text-sm">
                Change Password
              </button>
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-semibold">Edit Profile</h2>
              <button onClick={() => setIsModalOpen(false)}>
                <FaTimes className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
              {["firstName", "lastName", "address"].map((field) => (
                <div key={field}>
                  <label className="text-sm capitalize">{field}</label>
                  <input
                    type="text"
                    {...register(field as keyof FormValues, {
                      required: `${field} is required`,
                    })}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                  {errors[field as keyof FormValues] && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors[field as keyof FormValues]?.message}
                    </p>
                  )}
                </div>
              ))}
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border text-gray-700 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#1AB2E5] hover:bg-[#1489b8] text-white rounded-lg flex items-center gap-2"
                >
                  <SaveIcon className="w-4 h-4" />
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const InfoCard = ({ label, value }: { label: string; value?: string }) => (
  <div className="bg-[#F0F9FF] rounded-lg p-4">
    <p className="text-sm font-medium text-gray-500">{label}</p>
    <p className="text-gray-800 mt-1">{value || "-"}</p>
  </div>
);
