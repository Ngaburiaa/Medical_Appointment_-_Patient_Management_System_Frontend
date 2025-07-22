import { useState } from "react";
import { userApi } from "../../Features/api/userAPI";
import {
  CalendarCheck2,
  Users,
  FileText,
  Clock,
  CalendarX2,
  DollarSign,
  DownloadCloud,
} from "lucide-react";
import { format, subDays, eachDayOfInterval } from "date-fns";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";
import { useSelector } from "react-redux";
import type { RootState } from "../../App/store";

type Appointment = {
  appointmentId: number;
  appointmentDate: string;
  timeSlot: string;
  userId: number;
  user?: { userId: number; firstName: string; lastName: string };
  appointmentStatus: string;
  totalAmount: string;
};

export const Overview = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const skipQuery = !user?.userId;

  const {
    data: userDetails,
    isLoading: doctorLoading,
  } = userApi.useGetUserByIdQuery(user?.userId!, { skip: skipQuery });

  const doctorProfile = userDetails?.doctorProfile;
  const appointments: Appointment[] = doctorProfile?.appointments || [];
  const prescriptions = doctorProfile?.prescriptions || [];
  const availableDays = doctorProfile?.availableDays;

  const todayStr = format(new Date(), "yyyy-MM-dd");

  const [showAllUpcoming, setShowAllUpcoming] = useState(false);

  const to24Hr = (timeStr: string): string => {
    try {
      return new Date(`1970-01-01T${timeStr.trim()}`).toTimeString().slice(0, 5);
    } catch {
      return "00:00";
    }
  };

  const normalizeDate = (dateStr: string) => format(new Date(dateStr), "yyyy-MM-dd");

  const sortAppointmentsChronologically = (a: Appointment, b: Appointment) => {
    const dateA = new Date(`${normalizeDate(a.appointmentDate)}T${to24Hr(a.timeSlot.split(" - ")[0])}`);
    const dateB = new Date(`${normalizeDate(b.appointmentDate)}T${to24Hr(b.timeSlot.split(" - ")[0])}`);
    return dateA.getTime() - dateB.getTime();
  };

  const todayAppointments = appointments
    .filter((appt) => normalizeDate(appt.appointmentDate) === todayStr)
    .sort(sortAppointmentsChronologically);

  const upcomingAppointments = appointments
    .filter((appt) => normalizeDate(appt.appointmentDate) > todayStr)
    .sort(sortAppointmentsChronologically);

  const nextAppointment = [...todayAppointments, ...upcomingAppointments][0] || null;

  const totalPatients = [...new Set(appointments.map((appt) => appt.userId))].length;
  const prescriptionsCount = prescriptions.length;

  const currentDayShort = new Date().toLocaleDateString("en-US", {
    weekday: "short",
  });

  const isAvailableToday = availableDays
    ?.split(",")
    .map((day: string) => day.trim())
    .includes(currentDayShort);

  const confirmedRevenue = appointments.reduce((sum, appt) => {
    const amount = parseFloat(appt.totalAmount);
    return appt.appointmentStatus === "Confirmed" && !isNaN(amount)
      ? sum + amount
      : sum;
  }, 0);

  const getLast7DaysStats = () => {
    const sevenDaysAgo = subDays(new Date(), 6);
    const days = eachDayOfInterval({ start: sevenDaysAgo, end: new Date() });

    return days.map((day) => {
      const dateStr = format(day, "yyyy-MM-dd");
      const count = appointments.filter(
        (appt) => normalizeDate(appt.appointmentDate) === dateStr
      ).length;

      return {
        date: format(day, "EEE"),
        count,
      };
    });
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Doctor Dashboard Overview", 20, 20);
    doc.text(`Total Revenue: KES ${confirmedRevenue}`, 20, 40);
    doc.text(`Total Patients: ${totalPatients}`, 20, 50);
    doc.save("doctor-overview.pdf");
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(appointments);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Appointments");
    XLSX.writeFile(wb, "appointments.xlsx");
  };

  const cardStyle =
    "flex items-center gap-4 p-5 rounded-xl shadow-md bg-gradient-to-r from-[#E6F7FF] to-[#FFFFFF] border border-[#B8E6F8] hover:scale-[1.02] transition-transform duration-300";

  if (doctorLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header with Export Buttons */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[#1AB2E5] drop-shadow-sm">Overview Summary</h1>
        <div className="flex gap-4">
          <button
            onClick={exportToPDF}
            className="flex items-center gap-1 text-sm px-3 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
          >
            <DownloadCloud size={16} /> Export PDF
          </button>
          <button
            onClick={exportToExcel}
            className="flex items-center gap-1 text-sm px-3 py-2 bg-green-100 text-green-700 rounded-md hover:bg-green-200"
          >
            <DownloadCloud size={16} /> Export Excel
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <div className={cardStyle}>
          <CalendarCheck2 className="text-[#1AB2E5]" size={32} />
          <div>
            <p className="text-sm text-gray-500">Today's Appointments</p>
            <p className="text-xl font-semibold text-gray-800">{todayAppointments.length}</p>
          </div>
        </div>

        <div className={cardStyle}>
          <Users className="text-[#4CAF50]" size={32} />
          <div>
            <p className="text-sm text-gray-500">Total Patients Treated</p>
            <p className="text-xl font-semibold text-gray-800">{totalPatients}</p>
          </div>
        </div>

        <div className={cardStyle}>
          <FileText className="text-[#9C27B0]" size={32} />
          <div>
            <p className="text-sm text-gray-500">Prescriptions Issued</p>
            <p className="text-xl font-semibold text-gray-800">{prescriptionsCount}</p>
          </div>
        </div>

        <div className={cardStyle}>
          <Clock className="text-[#FF9800]" size={32} />
          <div>
            <p className="text-sm text-gray-500">Next Appointment</p>
            {nextAppointment ? (
              <p className="text-md text-gray-800 font-medium">
                {nextAppointment.timeSlot} –{" "}
                <span className="font-semibold">
                  {nextAppointment.user
                    ? `${nextAppointment.user.firstName} ${nextAppointment.user.lastName}`
                    : `Patient #${nextAppointment.userId}`}
                </span>
              </p>
            ) : (
              <p className="text-md text-gray-500 italic">No upcoming appointment</p>
            )}
          </div>
        </div>

        <div className={cardStyle}>
          <CalendarX2 className={isAvailableToday ? "text-[#03A9F4]" : "text-gray-400"} size={32} />
          <div>
            <p className="text-sm text-gray-500">Availability Status</p>
            <p className={`text-md font-medium ${isAvailableToday ? "text-green-600" : "text-red-500"}`}>
              {isAvailableToday ? "Available Today" : "Off Today"}
            </p>
          </div>
        </div>

        <div className={cardStyle}>
          <DollarSign className="text-[#2ECC71]" size={32} />
          <div>
            <p className="text-sm text-gray-500">Total Revenue</p>
            <p className="text-xl font-semibold text-gray-800">
              KES {confirmedRevenue.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {/* Appointment Trend Chart */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
        <h2 className="text-lg font-semibold mb-4 text-[#1AB2E5]">Appointment Trends (Last 7 Days)</h2>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={getLast7DaysStats()}>
            <defs>
              <linearGradient id="colorAppt" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1AB2E5" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#1AB2E5" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="count"
              stroke="#1AB2E5"
              fillOpacity={1}
              fill="url(#colorAppt)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Upcoming Appointments List */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
        <h2 className="text-lg font-semibold mb-4 text-[#4CAF50]">Upcoming Appointments</h2>
        <ul className="space-y-2">
          {(showAllUpcoming ? upcomingAppointments : upcomingAppointments.slice(0, 5)).map((appt) => (
            <li
              key={appt.appointmentId}
              className="text-sm text-gray-700 border-b py-2 flex justify-between"
            >
              <span>
                {format(new Date(appt.appointmentDate), "EEE, MMM d")} – {appt.timeSlot}
              </span>
              <span className="font-semibold text-[#1AB2E5]">
                {appt.user
                  ? `${appt.user.firstName} ${appt.user.lastName}`
                  : `Patient #${appt.userId}`}
              </span>
            </li>
          ))}
          {upcomingAppointments.length === 0 && (
            <p className="text-gray-500 italic text-sm">No upcoming appointments</p>
          )}
        </ul>

        {upcomingAppointments.length > 5 && (
          <button
            onClick={() => setShowAllUpcoming(!showAllUpcoming)}
            className="mt-3 text-sm text-blue-600 hover:underline"
          >
            {showAllUpcoming ? "Show Less" : "View All"}
          </button>
        )}
      </div>
    </div>
  );
};
