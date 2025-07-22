import { useState } from "react";
import { useSelector } from "react-redux";
import { format } from "date-fns";
import { toast } from "sonner";
import { FiCalendar, FiClock } from "react-icons/fi";

import { userApi } from "../../Features/api/userAPI";
import { appointmentApi } from "../../Features/api/appointmentAPI";
import type { RootState } from "../../App/store";

export const UpcomingAppointments = () => {
  const [activeTab, setActiveTab] = useState<"today" | "upcoming" | "past">("upcoming");

  const { user } = useSelector((state: RootState) => state.auth);
  const { data: userDetails, isLoading, refetch } = userApi.useGetUserByIdQuery(user?.userId!);
  const [updateAppointment] = appointmentApi.useUpdateAppointmentProfileMutation();

  const appointments = userDetails?.doctorProfile?.appointments ?? [];

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const filteredAppointments = appointments
    .filter((appt: any) => {
      const apptDate = new Date(appt.appointmentDate);
      const apptDay = new Date(apptDate.getFullYear(), apptDate.getMonth(), apptDate.getDate());

      const isToday = apptDay.getTime() === today.getTime();
      const isUpcoming = apptDay > today;
      const isPast = apptDay < today;

      if (activeTab === "today") return isToday;
      if (activeTab === "upcoming") return isUpcoming;
      if (activeTab === "past") return isPast;

      return false;
    })
    .sort((a: any, b: any) => new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime());

  const statusBadgeClass = (status: string) => {
    switch (status) {
      case "Confirmed":
        return "bg-green-100 text-green-700";
      case "Cancelled":
        return "bg-red-100 text-red-600 line-through";
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  const toggleStatus = (currentStatus: string): string => {
    switch (currentStatus) {
      case "Pending":
        return "Confirmed";
      case "Confirmed":
        return "Cancelled";
      case "Cancelled":
        return "Pending";
      default:
        return "Pending";
    }
  };

  const handleToggleStatus = async (appointmentId: number, currentStatus: string) => {
    const newStatus = toggleStatus(currentStatus);
    try {
      await updateAppointment({ appointment_id: appointmentId, appointmentStatus: newStatus }).unwrap();
      toast.success(`Marked as ${newStatus}`);
      refetch();
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleReschedule = (appointment: any) => {
    toast.info("Rescheduling modal not implemented yet.");
    // TODO: Open BookingModal with appointment pre-filled
  };

  return (
    <div className="p-6 space-y-6">
      {/* Tabs */}
     <div className="flex justify-center mb-6">
  <div className="inline-flex rounded-md shadow-sm" role="group">
    {["today", "upcoming", "past"].map((tab) => {
      const Icon = tab === "past" ? FiClock : FiCalendar;
      return (
        <button
          key={tab}
          onClick={() => setActiveTab(tab as any)}
          className={`px-6 py-3 text-sm font-medium border flex items-center ${
            activeTab === tab
              ? "bg-[#1AB2E5] text-white border-[#1AB2E5]"
              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
          } ${tab === "today" ? "rounded-l-lg" : ""} ${tab === "past" ? "rounded-r-lg" : ""}`}
        >
          <Icon className="mr-2" />
          <span className="capitalize">{tab}</span>
        </button>
      );
    })}
  </div>
</div>


      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow border">
          <thead className="bg-[#E6F7FF] text-[#1AB2E5] text-left text-sm uppercase">
            <tr>
              <th className="px-4 py-2">Patient</th>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Time</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-700">
            {filteredAppointments.length ? (
              filteredAppointments.map((appt: any) => (
                <tr key={appt.appointmentId} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2 font-medium text-[#1AB2E5]">
                    {appt.user?.firstName} {appt.user?.lastName}
                  </td>
                  <td className="px-4 py-2">{format(new Date(appt.appointmentDate), "EEE, MMM d")}</td>
                  <td className="px-4 py-2">{appt.timeSlot}</td>
                  <td className="px-4 py-2 cursor-pointer">
                    <span
                      onClick={() => handleToggleStatus(appt.appointmentId, appt.appointmentStatus)}
                      className={`px-2 py-1 rounded-full text-xs font-medium transition-colors duration-200 ${statusBadgeClass(
                        appt.appointmentStatus
                      )}`}
                      title="Click to change status"
                    >
                      {appt.appointmentStatus}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-center">
                    <button
                      onClick={() => handleReschedule(appt)}
                      className="text-white bg-yellow-500 hover:bg-yellow-600 text-xs px-3 py-1 rounded-md"
                    >
                      Reschedule
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center text-gray-500 italic px-4 py-6">
                  No {activeTab} appointments
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
