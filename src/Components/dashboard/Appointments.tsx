import { useState } from 'react';
import { useSelector } from 'react-redux';
import { FiCalendar, FiClock, FiPlus } from 'react-icons/fi';
import { toast } from "sonner";

import { AppointmentCard } from '../../dashBoardDesign/AppointmentCard';
import { BookingModal } from '../../hooks/BookingModal';
import { userApi } from '../../Features/api/userAPI';
import { appointmentApi } from '../../Features/api/appointmentAPI';
import type { RootState } from '../../App/store';

export const Appointments = () => {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'today'>('upcoming');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [, setSelectedDoctor] = useState<any | null>(null);

  const { user, userType } = useSelector((state: RootState) => state.auth);

  const {   data: userDetails,   isLoading,   refetch,    isError,  } = userApi.useGetUserByIdQuery(user?.userId!);

  const appointments = userDetails?.appointments ?? [];

  const filteredAppointments = appointments
    .filter((appt: any) => {
      const apptDate = new Date(appt.appointmentDate);
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const appointmentDay = new Date(apptDate.getFullYear(), apptDate.getMonth(), apptDate.getDate());

      const isToday = appointmentDay.getTime() === today.getTime();
      const isUpcoming = appointmentDay > today;
      const isPast = appointmentDay < today;

      if (activeTab === 'today') {
        return isToday && appt.appointmentStatus !== 'Cancelled';
      }
      if (activeTab === 'upcoming') {
        return isUpcoming && appt.appointmentStatus !== 'Cancelled';
      }
      if (activeTab === 'past') {
        return isPast || appt.appointmentStatus === 'Cancelled';
      }
      return false;
    })
    .sort((a: any, b: any) => {
      const getAppointmentTime = (appt: any) => {
        const date = new Date(appt.appointmentDate);
        const timePart = appt.timeSlot.split(' - ')[0];
        const [time, modifier] = timePart.split(/(am|pm)/i);
        let [hours, minutes] = time.split(':').map(Number);
        
        if (modifier?.toLowerCase() === 'pm' && hours < 12) hours += 12;
        if (modifier?.toLowerCase() === 'am' && hours === 12) hours = 0;
        
        date.setHours(hours, minutes || 0, 0, 0);
        return date.getTime();
      };

      const timeA = getAppointmentTime(a);
      const timeB = getAppointmentTime(b);

      if (activeTab === 'upcoming' || activeTab === 'today') {
        return timeA - timeB; // Closest first
      }
      return timeB - timeA; // Most recent first for past
    });

  const [deleteAppointment] = appointmentApi.useDeleteAppointmentProfileMutation();


 const handleCancel = async (appointmentId: number) => {
  try {
    await deleteAppointment(appointmentId).unwrap();
    toast.success("Appointment deleted successfully");
    refetch();
  } catch (error) {
    toast.error("Failed to delete appointment");
  }
};


  const handleReschedule = (appointment: any) => {
    setSelectedDoctor({
      doctorId: appointment.doctor?.doctorId,
      ...appointment.doctor,
    });
    setShowBookingModal(true);
  };

  const handleBookingSuccess = () => {
    setShowBookingModal(false);
    refetch();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Appointments</h1>
            <p className="text-lg text-gray-600">
              {activeTab === 'upcoming' 
                ? 'Upcoming consultations' 
                : activeTab === 'past' 
                ? 'Past appointment history' 
                : "Today's appointments"}
            </p>
          </div>
          {userType === 'user' && (
            <button
              onClick={() => setShowBookingModal(true)}
              className="hidden md:flex items-center gap-2 px-6 py-3 bg-[#1AB2E5] hover:bg-[#1598c4] text-white rounded-lg shadow-sm transition-colors"
            >
              <FiPlus className="text-lg" />
              Book Appointment
            </button>
          )}
        </div>

        {/* Mobile Book button */}
        {userType === 'user' && (
          <button
            onClick={() => setShowBookingModal(true)}
            className="md:hidden fixed bottom-6 right-6 z-10 p-4 bg-[#1AB2E5] text-white rounded-full shadow-lg"
          >
            <FiPlus className="text-xl" />
          </button>
        )}

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-md shadow-sm" role="group">
            <button
              onClick={() => setActiveTab('today')}
              className={`px-6 py-3 text-sm font-medium rounded-l-lg border flex items-center gap-2 ${
                activeTab === 'today'
                  ? 'bg-[#1AB2E5] text-white border-[#1AB2E5]'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              <FiCalendar className="text-lg" />
              Today
            </button>
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`px-6 py-3 text-sm font-medium border-t border-b flex items-center gap-2 ${
                activeTab === 'upcoming'
                  ? 'bg-[#1AB2E5] text-white border-[#1AB2E5]'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              <FiCalendar className="text-lg" />
              Upcoming
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className={`px-6 py-3 text-sm font-medium rounded-r-lg border flex items-center gap-2 ${
                activeTab === 'past'
                  ? 'bg-[#1AB2E5] text-white border-[#1AB2E5]'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              <FiClock className="text-lg" />
              Past
            </button>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1AB2E5]"></div>
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="text-center text-red-500 font-semibold">Failed to load appointments.</div>
        )}

        {/* Empty State */}
        {!isLoading && filteredAppointments.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm">
            <div className="mx-auto h-24 w-24 text-gray-400 mb-4">
              <FiCalendar className="w-full h-full" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              {activeTab === 'upcoming'
                ? 'No upcoming appointments'
                : activeTab === 'past'
                ? 'No past appointments'
                : "No appointments today"}
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              {activeTab === 'upcoming'
                ? "You don't have any upcoming appointments. Book one now!"
                : activeTab === 'past'
                ? "Your past appointments will appear here."
                : "You don't have any appointments scheduled for today."}
            </p>
          </div>
        )}

        {/* Appointments List */}
        {!isLoading && filteredAppointments.length > 0 && (
          <div className="space-y-4">
            {filteredAppointments.map((appointment: any) => (
              <AppointmentCard
                key={appointment.appointmentId}
                appointment={appointment}
                variant={activeTab}
                onCancel={handleCancel}
                onReschedule={handleReschedule}
              />
            ))}
          </div>
        )}

        {/* Booking Modal */}
        {showBookingModal && (
          <BookingModal onClose={() => setShowBookingModal(false)} onSuccess={handleBookingSuccess} />
        )}
      </div>
    </div>
  );
};