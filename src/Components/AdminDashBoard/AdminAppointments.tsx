import { appointmentApi } from "../../Features/api/appointmentAPI";
import { format, isToday, isAfter, isBefore, parseISO } from "date-fns";
import { Calendar, Clock, User, Stethoscope, CreditCard, Activity } from "lucide-react";
import { useState } from "react";

export const AdminAppointments = () => {
  const { data: appointments = [], isLoading } = appointmentApi.useGetAppointmentsProfilesQuery(undefined);
  const [activeTab, setActiveTab] = useState<'all' | 'today' | 'upcoming' | 'past'>('all');

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200"></div>
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#1AB2E5] border-t-transparent absolute top-0 left-0"></div>
        </div>
      </div>
    );
  }

  // Categorize appointments
  const todayAppointments = appointments.filter((a: any) => 
    isToday(parseISO(a.appointmentDate))
  );
  
  const upcomingAppointments = appointments.filter((a: any) => 
    isAfter(parseISO(a.appointmentDate), new Date()) && 
    !isToday(parseISO(a.appointmentDate))
  );
  
  const pastAppointments = appointments.filter((a: any) => 
    isBefore(parseISO(a.appointmentDate), new Date()) && 
    !isToday(parseISO(a.appointmentDate))
  );

  const getFilteredAppointments = () => {
    switch (activeTab) {
      case 'today': return todayAppointments;
      case 'upcoming': return upcomingAppointments;
      case 'past': return pastAppointments;
      default: return appointments;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmed':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Pending':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      default:
        return 'bg-red-100 text-red-800 border-red-200';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'SUCCESS':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Pending':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      default:
        return 'bg-red-100 text-red-800 border-red-200';
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-6 overflow-hidden">
          <div className="bg-gradient-to-r from-[#1AB2E5] to-[#159FCC] px-8 py-6">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-3 rounded-xl">
                <Activity className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Appointments Overview</h1>
                <p className="text-white/80 text-sm">Manage and monitor all appointment activities</p>
              </div>
            </div>
          </div>
          
          {/* Stats Cards with colored backgrounds */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6 bg-gray-50">
            <div 
              className={`bg-gradient-to-br from-[#1AB2E5]/10 to-[#159FCC]/10 rounded-xl p-4 border ${activeTab === 'all' ? 'border-[#1AB2E5]' : 'border-gray-100'} shadow-sm cursor-pointer`}
              onClick={() => setActiveTab('all')}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 font-medium">Total</p>
                  <p className="text-2xl font-bold text-[#1AB2E5]">{appointments.length}</p>
                </div>
                <div className="bg-white p-3 rounded-lg">
                  <Calendar className="h-5 w-5 text-[#1AB2E5]" />
                </div>
              </div>
            </div>
            
            <div 
              className={`bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-4 border ${activeTab === 'today' ? 'border-[#1AB2E5]' : 'border-gray-100'} shadow-sm cursor-pointer`}
              onClick={() => setActiveTab('today')}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 font-medium">Today's</p>
                  <p className="text-2xl font-bold text-emerald-600">
                    {todayAppointments.length}
                  </p>
                </div>
                <div className="bg-white p-3 rounded-lg">
                  <Clock className="h-5 w-5 text-emerald-600" />
                </div>
              </div>
            </div>
            
            <div 
              className={`bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border ${activeTab === 'upcoming' ? 'border-[#1AB2E5]' : 'border-gray-100'} shadow-sm cursor-pointer`}
              onClick={() => setActiveTab('upcoming')}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 font-medium">Upcoming</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {upcomingAppointments.length}
                  </p>
                </div>
                <div className="bg-white p-3 rounded-lg">
                  <Calendar className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </div>
            
            <div 
              className={`bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-4 border ${activeTab === 'past' ? 'border-[#1AB2E5]' : 'border-gray-100'} shadow-sm cursor-pointer`}
              onClick={() => setActiveTab('past')}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 font-medium">Past</p>
                  <p className="text-2xl font-bold text-amber-600">
                    {pastAppointments.length}
                  </p>
                </div>
                <div className="bg-white p-3 rounded-lg">
                  <User className="h-5 w-5 text-amber-600" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            className={`px-4 py-3 font-medium text-sm flex items-center gap-2 ${activeTab === 'all' ? 'text-[#1AB2E5] border-b-2 border-[#1AB2E5]' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('all')}
          >
            <span className={`w-2 h-2 rounded-full ${activeTab === 'all' ? 'bg-[#1AB2E5]' : 'bg-gray-300'}`}></span>
            All Appointments
          </button>
          <button
            className={`px-4 py-3 font-medium text-sm flex items-center gap-2 ${activeTab === 'today' ? 'text-[#1AB2E5] border-b-2 border-[#1AB2E5]' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('today')}
          >
            <span className={`w-2 h-2 rounded-full ${activeTab === 'today' ? 'bg-[#1AB2E5]' : 'bg-gray-300'}`}></span>
            Today's
          </button>
          <button
            className={`px-4 py-3 font-medium text-sm flex items-center gap-2 ${activeTab === 'upcoming' ? 'text-[#1AB2E5] border-b-2 border-[#1AB2E5]' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('upcoming')}
          >
            <span className={`w-2 h-2 rounded-full ${activeTab === 'upcoming' ? 'bg-[#1AB2E5]' : 'bg-gray-300'}`}></span>
            Upcoming
          </button>
          <button
            className={`px-4 py-3 font-medium text-sm flex items-center gap-2 ${activeTab === 'past' ? 'text-[#1AB2E5] border-b-2 border-[#1AB2E5]' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('past')}
          >
            <span className={`w-2 h-2 rounded-full ${activeTab === 'past' ? 'bg-[#1AB2E5]' : 'bg-gray-300'}`}></span>
            Past
          </button>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-[#1AB2E5] rounded-full"></span>
                      ID
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      Date & Time
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-400" />
                      Patient
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <Stethoscope className="h-4 w-4 text-gray-400" />
                      Doctor
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Specialization</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-gray-400" />
                      Amount
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Payment</th>
                </tr>
              </thead>
              
              <tbody className="divide-y divide-gray-100">
                {getFilteredAppointments().map((appointment: any, index: number) => (
                  <tr key={appointment.appointmentId} 
                      className="hover:bg-gradient-to-r hover:from-[#1AB2E5]/5 hover:to-transparent transition-all duration-200 group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-[#1AB2E5] to-[#159FCC] rounded-lg flex items-center justify-center text-white font-bold text-xs">
                          {index + 1}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col space-y-1">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className="font-medium text-gray-900">
                            {format(new Date(appointment.appointmentDate), "MMM dd, yyyy")}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{appointment.timeSlot}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div>
                          <div className="font-semibold text-gray-900">
                            {appointment.user.firstName} {appointment.user.lastName}
                          </div>
                          <div className="text-sm text-gray-500">{appointment.user.contactPhone}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div>
                          <div className="font-semibold text-gray-900">
                            Dr. {appointment.doctor.user.firstName} {appointment.doctor.user.lastName}
                          </div>
                          <div className="text-sm text-gray-500">{appointment.doctor.user.contactPhone}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="bg-[#1AB2E5]/10 text-[#1AB2E5] px-3 py-1 rounded-full text-sm font-medium inline-block">
                        {appointment.doctor.specialization}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(appointment.appointmentStatus)}`}>
                        <span className={`w-2 h-2 rounded-full mr-2 ${
                          appointment.appointmentStatus === 'Confirmed' ? 'bg-emerald-400' : 
                          appointment.appointmentStatus === 'Pending' ? 'bg-amber-400' : 'bg-red-400'
                        }`}></span>
                        {appointment.appointmentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-bold text-gray-900 text-lg">
                        {new Intl.NumberFormat('en-KE', {
                          style: 'currency',
                          currency: 'KES'
                        }).format(parseFloat(appointment.totalAmount))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {appointment.payments?.length > 0 ? (
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getPaymentStatusColor(appointment.payments[0].paymentStatus)}`}>
                          <span className={`w-2 h-2 rounded-full mr-2 ${
                            appointment.payments[0].paymentStatus === 'SUCCESS' ? 'bg-emerald-400' : 
                            appointment.payments[0].paymentStatus === 'Pending' ? 'bg-amber-400' : 'bg-red-400'
                          }`}></span>
                          {appointment.payments[0].paymentStatus}
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-600 border border-gray-200">
                          <span className="w-2 h-2 rounded-full mr-2 bg-gray-400"></span>
                          No Payment
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};