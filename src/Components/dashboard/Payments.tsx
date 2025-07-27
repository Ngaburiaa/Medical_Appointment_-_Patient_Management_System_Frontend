import { useState } from "react";
import { useSelector } from "react-redux";
import { userApi } from "../../Features/api/userAPI";
import type { RootState } from "../../App/store";
import { format } from "date-fns";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import {
  Eye,
  Download,
  Search,
  Filter,
  Calendar,
  CreditCard,
  User,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";

type DoctorUser = {
  firstName: string;
  lastName: string;
  contactPhone?: string;
};

type Doctor = {
  user: DoctorUser;
  specialization?: string;
};

type Payment = {
  paymentId: number;
  transactionId: string;
  paymentDate: string;
  amount: string; // Decimal value as string
  paymentStatus: "SUCCESS" | "Pending" | "Failed" | string;
  appointmentDate: string;
  timeSlot: string;
  appointmentStatus: string;
  appointmentId: number;
  doctor?: Doctor;
  user?: {
    firstName: string;
    lastName: string;
    email?: string;
    contactPhone?: string;
  };
};

// Utility function to safely parse decimal strings
const parseDecimal = (value: string): number => {
  if (!value) return 0;
  const cleaned = value.replace(/[^0-9.]/g, '');
  return parseFloat(cleaned) || 0;
};

// Format currency with proper decimal handling
const formatCurrency = (amount: string) => {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(parseDecimal(amount));
};

export const Payments = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { data: userDetails, isLoading, isError } = userApi.useGetUserByIdQuery(user?.userId!);

  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Extract payments based on user type with proper typing
  const payments: Payment[] =
    userDetails?.userType === "doctor"
      ? userDetails?.doctorProfile?.appointments?.flatMap((appointment: any) =>
          appointment.payments?.map((payment: any) => ({
            ...payment,
            appointmentDate: appointment.appointmentDate,
            timeSlot: appointment.timeSlot,
            user: appointment.user,
            appointmentStatus: appointment.appointmentStatus,
            appointmentId: appointment.appointmentId,
          })) || []
        ) || []
      : userDetails?.appointments?.flatMap((appointment: any) =>
          appointment.payments?.map((payment: any) => ({
            ...payment,
            appointmentDate: appointment.appointmentDate,
            timeSlot: appointment.timeSlot,
            doctor: appointment.doctor,
            appointmentStatus: appointment.appointmentStatus,
            appointmentId: appointment.appointmentId,
          })) || []
        ) || [];

  // Filter payments with decimal-safe calculations
  const filteredPayments = payments.filter((payment) => {
    const matchesSearch = payment.transactionId?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || payment.paymentStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalAmount = filteredPayments.reduce(
    (sum, payment) => sum + parseDecimal(payment.amount),
    0
  ).toFixed(2);

  const successfulPayments = filteredPayments.filter(
    (payment) => payment.paymentStatus === 'SUCCESS'
  ).length;

  const handleViewDetails = (payment: Payment) => {
    setSelectedPayment(payment);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => setOpenDialog(false);

  const generateReceipt = (payment: Payment) => {
    const doc = new jsPDF();
    const amount = parseDecimal(payment.amount).toFixed(2);

    // Header
    doc.setFontSize(20).setTextColor(26, 178, 229);
    doc.text("MEDICAL PAYMENT RECEIPT", 105, 20, { align: "center" });

    // Clinic details
    doc.setFontSize(12).setTextColor(0, 0, 0);
    doc.text("HealthPlus Clinic", 105, 30, { align: "center" });
    doc.text("123 Medical Drive, Health City", 105, 36, { align: "center" });
    doc.text("Phone: +254 700 123 456", 105, 42, { align: "center" });

    // Payment details
    doc.setFontSize(10);
    doc.text(`Receipt No: ${payment.transactionId}`, 14, 55);
    doc.text(`Date: ${format(new Date(payment.paymentDate), "PPP")}`, 14, 62);

    // User/Doctor details
    if (userDetails?.userType === "doctor") {
      doc.text(`Patient: ${payment.user?.firstName} ${payment.user?.lastName}`, 14, 75);
      doc.text(`Phone: ${payment.user?.contactPhone || "N/A"}`, 14, 82);
    } else {
      doc.text(`Doctor: Dr. ${payment.doctor?.user?.firstName} ${payment.doctor?.user?.lastName}`, 14, 75);
      doc.text(`Specialization: ${payment.doctor?.specialization || "N/A"}`, 14, 82);
    }

    // Appointment details
    doc.text(`Appointment Date: ${format(new Date(payment.appointmentDate), "PPP")}`, 14, 95);
    doc.text(`Time Slot: ${payment.timeSlot}`, 14, 102);

    // Payment table
    autoTable(doc, {
      startY: 115,
      head: [["Description", "Amount (KES)"]],
      body: [
        ["Consultation Fee", amount],
        ["Total", amount],
      ],
      theme: "grid",
      headStyles: { fillColor: [26, 178, 229], textColor: 255 },
    });

    // Footer
    doc.setFontSize(10);
    doc.text("Thank you for choosing HealthPlus Clinic!", 105, 170, { align: "center" });
    doc.save(`receipt_${payment.transactionId}.pdf`);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "SUCCESS":
      case "Confirmed":
        return <CheckCircle className="w-4 h-4" />;
      case "Pending":
        return <AlertCircle className="w-4 h-4" />;
      case "Failed":
        return <XCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "SUCCESS":
      case "Confirmed":
        return "bg-green-100 text-green-800 border-green-200";
      case "Pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Failed":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-blue-50 via-white to-cyan-50">
        <div className="bg-white p-8 rounded-2xl shadow-lg flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#1AB2E5] border-t-transparent"></div>
          <p className="text-gray-600 font-medium">Loading payment history...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-blue-50 via-white to-cyan-50">
        <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-md">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900">Error Loading Data</h3>
          <p className="text-gray-600">Failed to load payment history. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-6">
      {/* Header Section */}
      <div className="mb-8">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-r from-[#1AB2E5] to-[#0ea5e9] p-3 rounded-xl">
                <CreditCard className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Payment History</h1>
                <p className="text-gray-600 mt-1">Track and manage your payment transactions</p>
              </div>
            </div>
            
            {/* Search and Filter Controls */}
            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search Transaction ID..."
                  className="pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1AB2E5] focus:border-transparent outline-none transition-all duration-200 w-full sm:w-64 bg-white shadow-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  className="pl-10 pr-10 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1AB2E5] focus:border-transparent outline-none transition-all duration-200 bg-white shadow-sm appearance-none cursor-pointer"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option>All</option>
                  <option>SUCCESS</option>
                  <option>Pending</option>
                  <option>Failed</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Total Payments</p>
              <p className="text-3xl font-bold">{filteredPayments.length}</p>
            </div>
            <CheckCircle className="w-10 h-10 text-green-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-[#1AB2E5] to-[#0ea5e9] rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Amount</p>
              <p className="text-3xl font-bold">
                {formatCurrency(totalAmount)}
              </p>
            </div>
            <CreditCard className="w-10 h-10 text-blue-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Successful</p>
              <p className="text-3xl font-bold">
                {successfulPayments}
              </p>
            </div>
            <CheckCircle className="w-10 h-10 text-purple-200" />
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        {filteredPayments.length === 0 ? (
          <div className="text-center py-16">
            <CreditCard className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Payment History Found</h3>
            <p className="text-gray-500">Your payment transactions will appear here once available.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-[#1AB2E5] to-[#0ea5e9] text-white">
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                    Transaction Details
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                    Appointment
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredPayments.map((payment) => (
                  <tr 
                    key={payment.paymentId} 
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <CreditCard className="w-4 h-4 text-[#1AB2E5]" />
                          <span className="font-mono text-sm font-semibold text-gray-900">
                            {payment.transactionId || "N/A"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          {format(new Date(payment.paymentDate), "PP")}
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <span className="text-2xl font-bold text-gray-900">
                        {formatCurrency(payment.amount)}
                      </span>
                    </td>
                    
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(payment.paymentStatus)}`}>
                        {getStatusIcon(payment.paymentStatus)}
                        {payment.paymentStatus}
                      </span>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
                          <Calendar className="w-4 h-4 text-[#1AB2E5]" />
                          {format(new Date(payment.appointmentDate), "PP")}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock className="w-4 h-4" />
                          {payment.timeSlot}
                        </div>
                        {userDetails?.userType !== "doctor" && payment.doctor && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <User className="w-4 h-4" />
                            Dr. {payment.doctor.user.firstName} {payment.doctor.user.lastName}
                          </div>
                        )}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleViewDetails(payment)}
                          className="flex items-center gap-2 px-4 py-2 bg-[#1AB2E5] hover:bg-[#0ea5e9] text-white rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md text-sm font-medium"
                        >
                          <Eye className="w-4 h-4" />
                         
                        </button>
                        <button
                          onClick={() => generateReceipt(payment)}
                          className="flex items-center gap-2 px-4 py-2 border-2 border-[#1AB2E5] text-[#1AB2E5] hover:bg-[#1AB2E5] hover:text-white rounded-lg transition-colors duration-200 text-sm font-medium"
                        >
                          <Download className="w-4 h-4" />
                          
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Payment Details Modal */}
      {openDialog && selectedPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-[#1AB2E5] to-[#0ea5e9] p-6 rounded-t-2xl">
              <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                <CreditCard className="w-8 h-8" />
                Payment Details
              </h3>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Payment Information */}
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-[#1AB2E5]" />
                  Payment Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Transaction ID</label>
                    <p className="font-mono text-lg font-semibold text-gray-900">{selectedPayment.transactionId}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Payment Date</label>
                    <p className="text-lg font-semibold text-gray-900">{format(new Date(selectedPayment.paymentDate), "PPPP")}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Amount</label>
                    <p className="text-2xl font-bold text-[#1AB2E5]">{formatCurrency(selectedPayment.amount)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Status</label>
                    <div className="mt-1">
                      <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(selectedPayment.paymentStatus)}`}>
                        {getStatusIcon(selectedPayment.paymentStatus)}
                        {selectedPayment.paymentStatus}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Appointment Information */}
              <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-[#1AB2E5]" />
                  Appointment Details
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Appointment Date</label>
                    <p className="text-lg font-semibold text-gray-900">{format(new Date(selectedPayment.appointmentDate), "PPPP")}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Time Slot</label>
                    <p className="text-lg font-semibold text-gray-900">{selectedPayment.timeSlot}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Appointment Status</label>
                    <p className="text-lg font-semibold text-gray-900">{selectedPayment.appointmentStatus}</p>
                  </div>
                  {userDetails?.userType !== "doctor" && selectedPayment.doctor && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">Doctor</label>
                      <p className="text-lg font-semibold text-gray-900">
                        Dr. {selectedPayment.doctor.user.firstName} {selectedPayment.doctor.user.lastName}
                      </p>
                      <p className="text-sm text-gray-600">{selectedPayment.doctor.specialization}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Modal Actions */}
            <div className="bg-gray-50 px-6 py-4 rounded-b-2xl flex flex-col sm:flex-row gap-3 justify-end border-t border-gray-200">
              <button 
                onClick={() => generateReceipt(selectedPayment)} 
                className="flex items-center justify-center gap-2 px-6 py-3 bg-[#1AB2E5] hover:bg-[#0ea5e9] text-white rounded-lg transition-colors duration-200 font-medium shadow-sm hover:shadow-md"
              >
                <Download className="w-5 h-5" />
                Download Receipt
              </button>
              <button 
                onClick={handleCloseDialog} 
                className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-gray-300 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200 font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};