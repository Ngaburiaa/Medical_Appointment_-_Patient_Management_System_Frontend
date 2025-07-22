import { Outlet } from "react-router-dom";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

const pieData = [
  { name: "Upcoming Appointments", value: 28 },
  { name: "Prescriptions", value: 12 },
  { name: "Visits", value: 20 },
];

const COLORS = ["#34D399", "#60A5FA", "#F472B6"];

const barData = [
  { month: "Jan", visits: 5, prescriptions: 2 },
  { month: "Feb", visits: 4, prescriptions: 1 },
  { month: "Mar", visits: 6, prescriptions: 3 },
  { month: "Apr", visits: 7, prescriptions: 4 },
];

export const Main= () => {
  return (
    <>
      <div className="flex min-h-screen bg-gray-50">
        <div className="flex-1 flex flex-col">
          <header className="h-16 bg-white shadow-sm px-6 flex items-center justify-between border-b border-gray-200">
            <h1 className="text-xl font-semibold text-gray-700">My Health Dashboard</h1>
          </header>

         <main className="p-6 flex-1 overflow-y-auto space-y-8">
  {/* Summary Cards */}
  <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
    <div className="p-6 rounded-xl bg-gradient-to-r from-blue-100 to-blue-200 shadow-sm">
      <h2 className="text-lg font-semibold text-blue-900 mb-1 flex items-center gap-2">📅 Next Appointment</h2>
      <p className="text-sm text-blue-800">
        You have an appointment on <strong>July 15</strong> at <strong>10:00 AM</strong> with <strong>Dr. Achieng</strong>.
      </p>
    </div>
    <div className="p-6 rounded-xl bg-gradient-to-r from-green-100 to-green-200 shadow-sm">
      <h2 className="text-lg font-semibold text-green-900 mb-1 flex items-center gap-2">💊 Active Prescriptions</h2>
      <p className="text-sm text-green-800">
        You currently have <strong>3 prescriptions</strong>. Refill your BP medication by <strong>July 20</strong>.
      </p>
    </div>
    <div className="p-6 rounded-xl bg-gradient-to-r from-purple-100 to-purple-200 shadow-sm">
      <h2 className="text-lg font-semibold text-purple-900 mb-1 flex items-center gap-2">🩺 Recent Visits</h2>
      <p className="text-sm text-purple-800">
        Last visit was on <strong>June 12</strong>. Next general check-up in <strong>3 months</strong>.
      </p>
    </div>
    <div className="p-6 rounded-xl bg-gradient-to-r from-yellow-100 to-yellow-200 shadow-sm">
      <h2 className="text-lg font-semibold text-yellow-900 mb-1 flex items-center gap-2">🧬 Vitals Summary</h2>
      <p className="text-sm text-yellow-800">
        BP: <strong>120/80</strong> | Sugar: <strong>5.5 mmol/L</strong> | HR: <strong>76 bpm</strong>
      </p>
    </div>
    <div className="p-6 rounded-xl bg-gradient-to-r from-pink-100 to-pink-200 shadow-sm">
      <h2 className="text-lg font-semibold text-pink-900 mb-1 flex items-center gap-2">📝 Doctor's Note</h2>
      <p className="text-sm text-pink-800">
        “Continue medication. Avoid salt. Exercise 30 mins daily.” — <strong>Dr. Achieng</strong>
      </p>
    </div>
    <div className="p-6 rounded-xl bg-gradient-to-r from-sky-100 to-sky-200 shadow-sm">
      <h2 className="text-lg font-semibold text-sky-900 mb-1 flex items-center gap-2">🎯 Health Goal</h2>
      <p className="text-sm text-sky-800">
        Maintain BP under <strong>130/85</strong>, Weight loss target: <strong>-3 kg</strong> in 1 month
      </p>
    </div>
  </section>

  {/* Charts Section */}
  <section className="grid grid-cols-1 xl:grid-cols-2 gap-6">
    {/* Pie Chart */}
    <div className="bg-white rounded-xl shadow-md border p-6">
      <h3 className="text-lg font-semibold mb-4">📊 Health Distribution</h3>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
            {pieData.map((_entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>

    {/* Bar Chart */}
    <div className="bg-white rounded-xl shadow-md border p-6">
      <h3 className="text-lg font-semibold mb-4">📅 Monthly Visits & Prescriptions</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={barData}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="visits" fill="#34D399" name="Visits" />
          <Bar dataKey="prescriptions" fill="#60A5FA" name="Prescriptions" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </section>

  {/* Nested Content */}
  <div className="mt-10">
    <Outlet />
  </div>
</main>

        </div>
      </div>
    </>
  );
};
