
import { motion } from 'framer-motion'; 
import { FaUserMd, FaCalendarCheck, FaPrescriptionBottle } from 'react-icons/fa';

interface DoctorCardProps {
  doctor: {
    doctorId: number;
    specialization: string;
    bio: string;
    availableDays: string;
    user: {
      firstName: string;
      lastName: string;
      address: string;
      profileURL: string | null;
    };
    appointments: {
      appointmentId: number;
      appointmentStatus: string;
    }[];
    prescriptions: {
      prescriptionId: number;
    }[];
  };
  onBook: (doctorId: number) => void;
}

export const DoctorCard = ({ doctor, onBook }: DoctorCardProps) => {
  const fullName = `Dr. ${doctor.user.firstName} ${doctor.user.lastName}`;
  const totalAppointments = doctor.appointments.length;
  const confirmedAppointments = doctor.appointments.filter(
    (appt) => appt.appointmentStatus === "Confirmed"
  ).length;
  const totalPrescriptions = doctor.prescriptions.length;

  return (
    <motion.div
      className="border border-gray-200 rounded-2xl p-6 shadow-lg bg-white hover:shadow-xl transition-all duration-300 max-w-sm mx-auto"
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col items-center text-center">
        <div className="relative">
          <img
            src={
              doctor.user.profileURL ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                doctor.user?.firstName ?? "Guest"
              )}&background=1AB2E5&color=fff&size=128`
            }
            alt={fullName}
            className="h-28 w-28 object-cover rounded-full border-4 border-blue-100 mb-4 transition-transform duration-300 hover:scale-105"
          />
          <div className="absolute -top-1 -right-1 bg-blue-500 text-white rounded-full p-1.5">
            <FaUserMd size={14} />
          </div>
        </div>
        <h3 className="text-xl font-bold text-gray-800">{fullName}</h3>
        <p className="text-sm font-medium text-blue-500 mt-1">{doctor.specialization}</p>
        <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
          <span>📍</span>
          <p>{doctor.user.address}</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span>🗓</span>
          <p>Available: {doctor.availableDays}</p>
        </div>
      </div>

      <div className="mt-5 text-sm text-gray-600 bg-gray-50 p-4 rounded-lg italic relative">
        <span className="absolute -top-2 left-3 text-blue-500 text-xs">"</span>
        <p>{doctor.bio}</p>
        <span className="absolute -bottom-2 right-3 text-blue-500 text-xs">"</span>
      </div>

      <div className="grid grid-cols-3 gap-3 text-center mt-6">
        <motion.div
          className="bg-blue-50 p-3 rounded-lg flex flex-col items-center"
          whileHover={{ backgroundColor: '#E6F0FA', transition: { duration: 0.2 } }}
        >
          <FaCalendarCheck className="text-blue-600 mb-1" size={18} />
          <p className="text-blue-600 font-semibold text-sm">{totalAppointments}</p>
          <p className="text-xs text-gray-600">Appointments</p>
        </motion.div>
        <motion.div
          className="bg-green-50 p-3 rounded-lg flex flex-col items-center"
          whileHover={{ backgroundColor: '#E6F5E9', transition: { duration: 0.2 } }}
        >
          <FaCalendarCheck className="text-green-600 mb-1" size={18} />
          <p className="text-green-600 font-semibold text-sm">{confirmedAppointments}</p>
          <p className="text-xs text-gray-600">Confirmed</p>
        </motion.div>
        <motion.div
          className="bg-pink-50 p-3 rounded-lg flex flex-col items-center"
          whileHover={{ backgroundColor: '#FDE8EF', transition: { duration: 0.2 } }}
        >
          <FaPrescriptionBottle className="text-pink-600 mb-1" size={18} />
          <p className="text-pink-600 font-semibold text-sm">{totalPrescriptions}</p>
          <p className="text-xs text-gray-600">Prescriptions</p>
        </motion.div>
      </div>

      <motion.button
        onClick={() => onBook(doctor.doctorId)}
        className="mt-6 w-full py-2.5 text-sm font-medium bg-gradient-to-r from-[#1AB2E5] to-[#159FCC] hover:from-[#159FCC] hover:to-[#0F86A8] text-white rounded-lg transition-all duration-300 shadow-md"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Book Appointment
      </motion.button>
    </motion.div>
  );
};