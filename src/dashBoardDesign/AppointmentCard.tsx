import { useState } from 'react';
import {
  FiUser, FiMapPin, FiPhone, FiInfo, FiFileText, FiDollarSign,
  FiCalendar, FiChevronDown, FiChevronUp
} from 'react-icons/fi';
import { FaRegCalendarCheck, FaRegCalendarTimes } from 'react-icons/fa';
import { toast } from 'sonner';
import { appointmentApi } from '../Features/api/appointmentAPI';
import { BookingModal } from '../hooks/BookingModal';

interface Appointment {
  appointmentId: number;
  appointmentDate: string;
  timeSlot: string;
  appointmentStatus: 'Pending' | 'Confirmed' | 'Cancelled';
  totalAmount: string;
  doctor: {
    doctorId: number;
    specialization: string;
    bio: string;
    availableDays: string;
    user: {
      firstName: string;
      lastName: string;
      address: string;
      profileURL?: string | null;
    };
  };
  user?: {
    firstName: string;
    lastName: string;
    contactPhone: string;
    address: string;
  };
  payments?: { paymentStatus: 'Pending' | 'Confirmed' | 'Cancelled'; amount: string; }[];
  prescription?: { notes: string; }[];
}

interface Props {
  appointment: Appointment;
  variant: 'upcoming' | 'past' | 'today';
  onAppointmentChange?: () => void;
  onCancel?: (appointmentId: number) => void;
  onReschedule?: (appointment: Appointment) => void;
}

export const AppointmentCard = ({ appointment, variant, onAppointmentChange, onCancel }: Props) => {
  const [showDetails, setShowDetails] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [deleteAppointment] = appointmentApi.useDeleteAppointmentProfileMutation();

  const {
    appointmentId, appointmentDate, timeSlot, appointmentStatus,
    doctor, user, payments = [], prescription = [], totalAmount,
  } = appointment;

  const formattedDate = new Date(appointmentDate).toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  const statusToUse = variant === 'today' ? 'Today' : appointmentStatus;

  const handleCancel = async () => {
    if (variant !== 'upcoming' && variant !== 'today') return;
    try {
      setIsProcessing(true);
      if (onCancel) {
        await onCancel(appointmentId);
      } else {
        await deleteAppointment(appointmentId).unwrap();
        toast.success('Appointment cancelled successfully');
        onAppointmentChange?.();
      }
    } catch {
      toast.error('Failed to cancel appointment');
    } finally {
      setIsProcessing(false);
    }
  };

  const payment = payments[0];
  const prescriptionNote = prescription[0]?.notes;

  const statusConfig = {
    Confirmed: { color: 'bg-green-100 text-green-800', icon: <FaRegCalendarCheck className="text-green-500" /> },
    Pending: { color: 'bg-yellow-100 text-yellow-800', icon: <FaRegCalendarCheck className="text-yellow-500" /> },
    Cancelled: { color: 'bg-red-100 text-red-800', icon: <FaRegCalendarTimes className="text-red-500" /> },
    Today: { color: 'bg-[#1AB2E5]/10 text-[#1AB2E5]', icon: <FaRegCalendarCheck className="text-[#1AB2E5]" /> },
  };

  const paymentConfig = {
    Confirmed: { text: 'Paid', color: 'text-green-600', icon: '✅' },
    Pending: { text: 'Pending', color: 'text-yellow-600', icon: '⏳' },
    Cancelled: { text: 'Refunded', color: 'text-red-600', icon: '↩️' },
    default: { text: 'Unpaid', color: 'text-gray-600', icon: '💳' },
  };

  const paymentStatus = payment?.paymentStatus ? paymentConfig[payment.paymentStatus] : paymentConfig.default;

  return (
    <>
      <div className={`bg-white rounded-xl shadow-sm border transition-all ${statusToUse === 'Cancelled' ? 'border-gray-200 opacity-80' : 'border-gray-100 hover:shadow-md'}`}>
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex justify-between items-start gap-4">
          <div className="flex items-start gap-4 flex-1 min-w-0">
            <div className={`p-3 rounded-lg flex-shrink-0 ${statusToUse === 'Today' ? 'bg-[#1AB2E5]/10 text-[#1AB2E5]' : 'bg-blue-50 text-blue-600'}`}>
              <FiUser className="text-xl" />
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-lg text-gray-900 truncate">
                Dr. {doctor?.user?.firstName ?? "unknown"} {doctor?.user?.lastName ?? ""}
              </h3>
              <p className={`font-medium truncate ${statusToUse === 'Today' ? 'text-[#1AB2E5]' : 'text-blue-600'}`}>
                {doctor?.specialization}
              </p>
              <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                <FiCalendar className="text-gray-400" />
                {formattedDate} at {timeSlot}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusConfig[statusToUse].color}`}>
              {statusToUse}
            </span>
            <button 
              onClick={() => setShowDetails(!showDetails)} 
              className={`p-2 hover:bg-blue-50 rounded-full transition-colors ${statusToUse === 'Today' ? 'text-[#1AB2E5] hover:text-[#1AB2E5]' : 'text-gray-500 hover:text-blue-600'}`}
            >
              {showDetails ? <FiChevronUp className="text-lg" /> : <FiChevronDown className="text-lg" />}
            </button>
          </div>
        </div>

        {/* Details */}
        <div className={`transition-all duration-300 overflow-hidden ${showDetails ? 'max-h-[500px]' : 'max-h-0'}`}>
          <div className="p-5 pt-0 grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-4">
              {user?.address && <Detail icon={<FiMapPin />} label="Address" value={user.address} />}
              {user?.contactPhone && <Detail icon={<FiPhone />} label="Contact" value={user.contactPhone} />}
            </div>
            <div className="space-y-4">
              <Detail icon={<FiDollarSign />} label="Payment Status" value={
                <span className={`${paymentStatus.color}`}>
                  {paymentStatus.icon} {paymentStatus.text} - Ksh {payment?.amount || totalAmount}
                </span>
              } />
              {prescriptionNote && <Detail icon={<FiFileText />} label="Prescription" value={prescriptionNote} />}
            </div>
          </div>

          <div className="mb-6 px-5">
            <div className="flex items-center gap-2 mb-2 text-gray-700">
              <FiInfo className={`${statusToUse === 'Today' ? 'text-[#1AB2E5]' : 'text-blue-500'}`} />
              <h4 className="font-medium">About the Doctor</h4>
            </div>
            <p className="text-gray-600 text-sm pl-6">{doctor?.bio}</p>
          </div>

          {(variant === 'upcoming' || variant === 'today') && statusToUse !== 'Cancelled' && (
            <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-100 px-5 pb-5">
              <button 
                onClick={handleCancel} 
                disabled={isProcessing} 
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg disabled:bg-gray-300"
              >
                {isProcessing ? 'Processing...' : 'Cancel'}
              </button>
              <button 
                onClick={() => setShowRescheduleModal(true)} 
                disabled={isProcessing} 
                className={`px-4 py-2 text-white rounded-lg disabled:bg-gray-300 ${statusToUse === 'Today' ? 'bg-[#1AB2E5] hover:bg-[#1598c4]' : 'bg-blue-600 hover:bg-blue-700'}`}
              >
                Reschedule
              </button>
              <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg">
                View Full Details
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Reschedule Modal */}
      {showRescheduleModal && (
        <BookingModal
          doctor={{
            doctorId: doctor.doctorId,
            specialization: doctor?.specialization,
            bio: doctor?.bio,
            availableDays: doctor.availableDays,
            user: {
              firstName: doctor?.user?.firstName,
              lastName: doctor?.user?.lastName,
              address: doctor.user.address,
              profileURL: doctor.user.profileURL ?? undefined
            }
          }}
          initialDate={appointmentDate}
          initialTime={timeSlot}
          onClose={() => setShowRescheduleModal(false)}
          onSuccess={onAppointmentChange || (() => {})}
          appointmentIdToUpdate={appointmentId}
          mode="reschedule"
        />
      )}
    </>
  );
};

// Reusable Detail Row
const Detail = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) => (
  <div className="flex items-start gap-3">
    <div className="text-gray-400 mt-1 flex-shrink-0">{icon}</div>
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  </div>
);