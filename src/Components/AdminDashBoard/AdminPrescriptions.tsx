import { useState } from "react";
import { prescriptionApi } from "../../Features/api/prescriptionAPI";
import { format } from "date-fns";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import {
  Eye,
  Download,
  Search,
  Filter,
  Calendar,
  FileText,
  User,
  CheckCircle,
  XCircle,
  AlertCircle,
  Pill,
} from "lucide-react";

type PrescriptionItem = {
  itemId: number;
  drugName: string;
  dosage: string;
  route: string;
  frequency: string;
  duration: string;
  instructions: string;
  substitutionAllowed: boolean;
};

type Prescription = {
  prescriptionId: number;
  appointmentId: number;
  doctorId: number;
  patientId: number;
  diagnosis: string;
  notes: string;
  issuedAt: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  appointment: {
    appointmentId: number;
    appointmentDate: string;
    timeSlot: string;
    appointmentStatus: string;
  };
  doctor: {
    doctorId: number;
    specialization: string;
    user: {
      firstName: string;
      lastName: string;
      profileURL?: string;
    };
  };
  patient: {
    profileURL: any;
    userId: number;
    firstName: string;
    lastName: string;
    contactPhone: string;
  };
  items: PrescriptionItem[];
};

export const AdminPrescriptions = () => {
  const { data: prescriptions = [], isLoading } = prescriptionApi.useGetPrescriptionsQuery(undefined);
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredPrescriptions = prescriptions.filter((prescription: { patient: { firstName: string; lastName: string; }; diagnosis: string; prescriptionId: { toString: () => string | string[]; }; status: string; }) => {
    const matchesSearch = 
      prescription.patient.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prescription.patient.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prescription.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prescription.prescriptionId.toString().includes(searchTerm);
    const matchesStatus = statusFilter === "All" || prescription.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const activePrescriptions = filteredPrescriptions.filter(
    (prescription: { status: string; }) => prescription.status === 'active'
  ).length;

  const handleViewDetails = (prescription: Prescription) => {
    setSelectedPrescription(prescription);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => setOpenDialog(false);

const generatePrescriptionPDF = (prescription: Prescription) => {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(20).setTextColor(26, 178, 229);
  doc.text("MEDICAL PRESCRIPTION", 105, 20, { align: "center" });

  // Clinic details
  doc.setFontSize(12).setTextColor(0, 0, 0);
  doc.text("HealthPlus Clinic", 105, 30, { align: "center" });
  doc.text("123 Medical Drive, Health City", 105, 36, { align: "center" });
  doc.text("Phone: +254 700 123 456", 105, 42, { align: "center" });

  // Prescription details
  doc.setFontSize(10);
  doc.text(`Prescription ID: ${prescription.prescriptionId}`, 14, 55);
  doc.text(`Date Issued: ${format(new Date(prescription.issuedAt), "PPP")}`, 14, 62);

  // Doctor details
  doc.text(`Doctor: Dr. ${prescription.doctor.user.firstName} ${prescription.doctor.user.lastName}`, 14, 75);
  doc.text(`Specialization: ${prescription.doctor.specialization}`, 14, 82);

  // Patient details
  doc.text(`Patient: ${prescription.patient.firstName} ${prescription.patient.lastName}`, 14, 95);
  doc.text(`Phone: ${prescription.patient.contactPhone}`, 14, 102);

  // Diagnosis
  doc.text(`Diagnosis: ${prescription.diagnosis}`, 14, 115);
  doc.text(`Notes: ${prescription.notes}`, 14, 122);

  // Medications table
  autoTable(doc, {
    startY: 135,
    head: [["Drug Name", "Dosage", "Frequency", "Duration", "Instructions"]],
    body: prescription.items.map(item => [
      item.drugName,
      item.dosage,
      item.frequency,
      item.duration,
      item.instructions
    ]),
    theme: "grid",
    headStyles: { fillColor: [26, 178, 229], textColor: 255 },
  });

  // Get the final Y position safely
  const finalY = (doc as any).lastAutoTable?.finalY || 135;

  // Footer
  doc.setFontSize(10);
  doc.text("This prescription is valid for 30 days from date of issue", 105, finalY + 15, { align: "center" });
  doc.text("Doctor's Signature: ________________________", 105, finalY + 25, { align: "center" });
  doc.save(`prescription_${prescription.prescriptionId}.pdf`);
};

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="w-4 h-4" />;
      case "expired":
        return <XCircle className="w-4 h-4" />;
      case "pending":
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "expired":
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
          <p className="text-gray-600 font-medium">Loading prescriptions...</p>
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
                <FileText className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Prescriptions</h1>
                <p className="text-gray-600 mt-1">Manage all patient prescriptions</p>
              </div>
            </div>
            
            {/* Search and Filter Controls */}
            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search patient, diagnosis..."
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
                  <option>active</option>
                  <option>expired</option>
                  <option>pending</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Prescription Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Total Prescriptions</p>
              <p className="text-3xl font-bold">{filteredPrescriptions.length}</p>
            </div>
            <FileText className="w-10 h-10 text-green-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-[#1AB2E5] to-[#0ea5e9] rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Active Prescriptions</p>
              <p className="text-3xl font-bold">{activePrescriptions}</p>
            </div>
            <CheckCircle className="w-10 h-10 text-blue-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Medications Prescribed</p>
              <p className="text-3xl font-bold">
                {filteredPrescriptions.reduce((sum: any, prescription: { items: string | any[]; }) => sum + prescription.items.length, 0)}
              </p>
            </div>
            <Pill className="w-10 h-10 text-purple-200" />
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        {filteredPrescriptions.length === 0 ? (
          <div className="text-center py-16">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Prescriptions Found</h3>
            <p className="text-gray-500">No prescriptions match your search criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-[#1AB2E5] to-[#0ea5e9] text-white">
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                    Prescription Details
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                    Patient
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                    Doctor
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredPrescriptions.map((prescription:any) => (
                  <tr 
                    key={prescription.prescriptionId} 
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-[#1AB2E5]" />
                          <span className="font-mono text-sm font-semibold text-gray-900">
                            ID-{prescription.prescriptionId}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          {format(new Date(prescription.issuedAt), "PP")}
                        </div>
                        <div className="text-sm font-medium text-gray-900">
                          {prescription.diagnosis}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Pill className="w-4 h-4" />
                          {prescription.items.length} medication(s)
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 overflow-hidden">
                          {prescription.patient.profileURL ? (
                            <img 
                              className="h-full w-full object-cover" 
                              src={prescription.patient.profileURL} 
                              alt={`${prescription.patient.firstName} ${prescription.patient.lastName}`}
                            />
                          ) : (
                            <div className="h-full w-full bg-[#1AB2E5] flex items-center justify-center text-white font-medium">
                              {prescription.patient.firstName.charAt(0)}{prescription.patient.lastName.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {prescription.patient.firstName} {prescription.patient.lastName}
                          </div>
                          <div className="text-sm text-gray-600">
                            {prescription.patient.contactPhone}
                          </div>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 overflow-hidden">
                          {prescription.doctor.user.profileURL ? (
                            <img 
                              className="h-full w-full object-cover" 
                              src={prescription.doctor.user.profileURL} 
                              alt={`Dr. ${prescription.doctor.user.firstName} ${prescription.doctor.user.lastName}`}
                            />
                          ) : (
                            <div className="h-full w-full bg-[#1AB2E5] flex items-center justify-center text-white font-medium">
                              {prescription.doctor.user.firstName.charAt(0)}{prescription.doctor.user.lastName.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            Dr. {prescription.doctor.user.firstName} {prescription.doctor.user.lastName}
                          </div>
                          <div className="text-sm text-gray-600">
                            {prescription.doctor.specialization}
                          </div>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(prescription.status)}`}>
                        {getStatusIcon(prescription.status)}
                        {prescription.status.charAt(0).toUpperCase() + prescription.status.slice(1)}
                      </span>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleViewDetails(prescription)}
                          className="flex items-center gap-2 px-4 py-2 bg-[#1AB2E5] hover:bg-[#0ea5e9] text-white rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md text-sm font-medium"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </button>
                        <button
                          onClick={() => generatePrescriptionPDF(prescription)}
                          className="flex items-center gap-2 px-4 py-2 border-2 border-[#1AB2E5] text-[#1AB2E5] hover:bg-[#1AB2E5] hover:text-white rounded-lg transition-colors duration-200 text-sm font-medium"
                        >
                          <Download className="w-4 h-4" />
                          Print
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

      {/* Prescription Details Modal */}
      {openDialog && selectedPrescription && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-[#1AB2E5] to-[#0ea5e9] p-6 rounded-t-2xl">
              <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                <FileText className="w-8 h-8" />
                Prescription Details
              </h3>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Prescription Information */}
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#1AB2E5]" />
                  Prescription Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Prescription ID</label>
                    <p className="font-mono text-lg font-semibold text-gray-900">{selectedPrescription.prescriptionId}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Date Issued</label>
                    <p className="text-lg font-semibold text-gray-900">{format(new Date(selectedPrescription.issuedAt), "PPPP")}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Status</label>
                    <div className="mt-1">
                      <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(selectedPrescription.status)}`}>
                        {getStatusIcon(selectedPrescription.status)}
                        {selectedPrescription.status.charAt(0).toUpperCase() + selectedPrescription.status.slice(1)}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Last Updated</label>
                    <p className="text-sm font-semibold text-gray-900">{format(new Date(selectedPrescription.updatedAt), "PPpp")}</p>
                  </div>
                </div>
              </div>

              {/* Patient and Doctor Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <User className="w-5 h-5 text-[#1AB2E5]" />
                    Patient Details
                  </h4>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex-shrink-0 h-16 w-16 rounded-full bg-gray-200 overflow-hidden">
                      {selectedPrescription.patient.profileURL ? (
                        <img 
                          className="h-full w-full object-cover" 
                          src={selectedPrescription.patient.profileURL} 
                          alt={`${selectedPrescription.patient.firstName} ${selectedPrescription.patient.lastName}`}
                        />
                      ) : (
                        <div className="h-full w-full bg-[#1AB2E5] flex items-center justify-center text-white font-medium text-xl">
                          {selectedPrescription.patient.firstName.charAt(0)}{selectedPrescription.patient.lastName.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-xl font-semibold text-gray-900">
                        {selectedPrescription.patient.firstName} {selectedPrescription.patient.lastName}
                      </p>
                      <p className="text-gray-600">Patient ID: {selectedPrescription.patientId}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Phone</label>
                      <p className="text-gray-900">{selectedPrescription.patient.contactPhone}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <User className="w-5 h-5 text-[#1AB2E5]" />
                    Doctor Details
                  </h4>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex-shrink-0 h-16 w-16 rounded-full bg-gray-200 overflow-hidden">
                      {selectedPrescription.doctor.user.profileURL ? (
                        <img 
                          className="h-full w-full object-cover" 
                          src={selectedPrescription.doctor.user.profileURL} 
                          alt={`Dr. ${selectedPrescription.doctor.user.firstName} ${selectedPrescription.doctor.user.lastName}`}
                        />
                      ) : (
                        <div className="h-full w-full bg-[#1AB2E5] flex items-center justify-center text-white font-medium text-xl">
                          {selectedPrescription.doctor.user.firstName.charAt(0)}{selectedPrescription.doctor.user.lastName.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-xl font-semibold text-gray-900">
                        Dr. {selectedPrescription.doctor.user.firstName} {selectedPrescription.doctor.user.lastName}
                      </p>
                      <p className="text-gray-600">{selectedPrescription.doctor.specialization}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Doctor ID</label>
                      <p className="text-gray-900">{selectedPrescription.doctorId}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Diagnosis and Notes */}
              <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#1AB2E5]" />
                  Medical Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Diagnosis</label>
                    <p className="text-lg font-semibold text-gray-900">{selectedPrescription.diagnosis}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Appointment Date</label>
                    <p className="text-lg font-semibold text-gray-900">
                      {format(new Date(selectedPrescription.appointment.appointmentDate), "PPPP")}
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-gray-600">Doctor's Notes</label>
                    <p className="text-gray-900 whitespace-pre-line">
                      {selectedPrescription.notes || "No additional notes provided."}
                    </p>
                  </div>
                </div>
              </div>

              {/* Medications */}
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Pill className="w-5 h-5 text-[#1AB2E5]" />
                  Prescribed Medications ({selectedPrescription.items.length})
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Medication</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Dosage</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Frequency</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Duration</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Instructions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {selectedPrescription.items.map((item) => (
                        <tr key={item.itemId}>
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">{item.drugName}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{item.dosage}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{item.frequency}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{item.duration}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{item.instructions}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            
            {/* Modal Actions */}
            <div className="bg-gray-50 px-6 py-4 rounded-b-2xl flex flex-col sm:flex-row gap-3 justify-end border-t border-gray-200">
              <button 
                onClick={() => generatePrescriptionPDF(selectedPrescription)} 
                className="flex items-center justify-center gap-2 px-6 py-3 bg-[#1AB2E5] hover:bg-[#0ea5e9] text-white rounded-lg transition-colors duration-200 font-medium shadow-sm hover:shadow-md"
              >
                <Download className="w-5 h-5" />
                Download Prescription
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