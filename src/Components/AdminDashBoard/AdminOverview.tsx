import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  CalendarCheck2,
  Users,
  DollarSign,
  FileText,
  Stethoscope,
  AlertCircle,
  ClipboardList,
} from "lucide-react";
import { userApi } from "../../Features/api/userAPI";
import { prescriptionApi } from "../../Features/api/prescriptionAPI";
import { complaintApi } from "../../Features/api/complaintApi";
import { appointmentApi } from "../../Features/api/appointmentAPI";
import { doctorApi } from "../../Features/api/doctorAPI";
import { prescriptionItemApi } from "../../Features/api/prescriptionItemAPI";
import { paymentApi } from "../../Features/api/paymentAPI";

const cardStyle =
  "flex items-center gap-4 p-5 rounded-xl shadow-md bg-gradient-to-r from-[#E6F7FF] to-[#FFFFFF] border border-[#B8E6F8] hover:scale-[1.02] transition-transform duration-300";

const COLORS = ["#1AB2E5", "#4CAF50", "#FF9800", "#9C27B0", "#03A9F4"];

export const AdminOverview = () => {
  const { data: userData } = userApi.useGetUsersProfilesQuery(undefined);
  const { data: doctorData } = doctorApi.useGetAllDoctorsQuery(undefined);
  const { data: appData } =
    appointmentApi.useGetAppointmentsProfilesQuery(undefined);
  const { data: presData } =
    prescriptionApi.useGetPrescriptionsQuery(undefined);
  const { data: complaints } =
    complaintApi.useGetComplaintsProfilesQuery(undefined);
  const { data: presItem } =
    prescriptionItemApi.useGetPrescriptionItemsProfilesQuery(undefined);
 const { data: paymentData } = paymentApi.useGetPaymentsProfilesQuery(undefined);

 
  const totalUsers = userData?.length || 0;
  const totalDoctors = doctorData?.length || 0;
  const totalAppointments = appData?.length || 0;
  const totalPrescriptions =presData?.length || 0;
  const totalMedications = presItem?.length || 0;
  const totalComplaints = complaints?.length || 0;
const totalRevenue = Array.isArray(paymentData) ? paymentData
      .filter(p => p.paymentStatus === "Confirmed")
      .reduce((sum, payment) => {
        const amount = parseFloat(payment.amount ?? "0");
        return !isNaN(amount) ? sum + amount : sum;
      }, 0)
  : 0;


 
  const pieData = [
    { name: "Users", value: totalUsers },
    { name: "Doctors", value: totalDoctors },
    { name: "Appointments", value: totalAppointments },
    { name: "Prescriptions", value: totalPrescriptions },
    { name: "Complaints", value: totalComplaints },
  ];

  const barData = [
    { label: "Users", count: totalUsers },
    { label: "Doctors", count: totalDoctors },
    { label: "Appointments", count: totalAppointments },
    { label: "Prescriptions", count: totalPrescriptions },
    { label: "Medications", count: totalMedications },
    { label: "Complaints", count: totalComplaints },
  ];

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-[#1AB2E5] drop-shadow-sm">
        Admin Dashboard Overview
      </h1>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <div className={cardStyle}>
          <Users className="text-[#1AB2E5]" size={32} />
          <div>
            <p className="text-sm text-gray-500">Total Users</p>
            <p className="text-xl font-semibold text-gray-800">{totalUsers}</p>
          </div>
        </div>

        <div className={cardStyle}>
          <Stethoscope className="text-[#4CAF50]" size={32} />
          <div>
            <p className="text-sm text-gray-500">Registered Doctors</p>
            <p className="text-xl font-semibold text-gray-800">
              {totalDoctors}
            </p>
          </div>
        </div>

        <div className={cardStyle}>
          <CalendarCheck2 className="text-[#FF9800]" size={32} />
          <div>
            <p className="text-sm text-gray-500">Appointments</p>
            <p className="text-xl font-semibold text-gray-800">
              {totalAppointments}
            </p>
          </div>
        </div>

        <div className={cardStyle}>
          <FileText className="text-[#9C27B0]" size={32} />
          <div>
            <p className="text-sm text-gray-500">Prescriptions</p>
            <p className="text-xl font-semibold text-gray-800">
              {totalPrescriptions}
            </p>
          </div>
        </div>

        <div className={cardStyle}>
          <ClipboardList className="text-[#03A9F4]" size={32} />
          <div>
            <p className="text-sm text-gray-500">Medications Issued</p>
            <p className="text-xl font-semibold text-gray-800">
              {totalMedications}
            </p>
          </div>
        </div>

        <div className={cardStyle}>
          <AlertCircle className="text-red-500" size={32} />
          <div>
            <p className="text-sm text-gray-500">Complaints</p>
            <p className="text-xl font-semibold text-gray-800">
              {totalComplaints}
            </p>
          </div>
        </div>
        <div className={cardStyle}>
          <DollarSign className="text-[#2ECC71]" size={32} />
          <div>
            <p className="text-sm text-gray-500">Total Revenue</p>
            <p className="text-xl font-semibold text-gray-800">
              KES{" "}
              {totalRevenue.toLocaleString("en-KE", {
                minimumFractionDigits: 2,
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <h2 className="text-lg font-semibold mb-4 text-[#1AB2E5]">
            System Data Distribution
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label
              >
                {pieData.map((_entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <h2 className="text-lg font-semibold mb-4 text-[#4CAF50]">
            System Summary
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#1AB2E5" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
