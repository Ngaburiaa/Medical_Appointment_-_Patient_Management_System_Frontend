import { useState } from "react";
import { useSelector } from "react-redux";
import { format } from "date-fns";
import { Dialog } from "@headlessui/react";
import {
  CalendarIcon,
  ChatBubbleLeftEllipsisIcon,
  ClipboardDocumentCheckIcon,
  ClipboardDocumentListIcon,
  DocumentTextIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import { PillIcon } from "lucide-react";
import { userApi } from "../../Features/api/userAPI";
import { ModalWritePrescription } from "../../hooks/ModalWritePrescrption";
import { ModalSendMessage } from "../../hooks/ModalSendMessage";
import type { RootState } from "../../App/store";

type User = {
  userId: number;
  firstName: string;
  lastName: string;
  contactPhone: string;
  profileURL?: string;
};

type PrescriptionItem = {
  drugName: string;
  dosage: string;
  route: string;
  frequency: string;
  duration: string;
  instructions?: string;
  substitutionAllowed: number;
};

type Prescription = {
  diagnosis: string;
  notes?: string;
  issuedAt: string;
  items?: PrescriptionItem[];
};

type Appointment = {
  appointmentId: number;
  appointmentDate: string;
  timeSlot: string;
  user: User;
  prescription?: Prescription[];
};

export const Patients = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { data: userDetails } = userApi.useGetUserByIdQuery(user?.userId!);

  const [search, setSearch] = useState("");
  const [selectedDiagnosis, setSelectedDiagnosis] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<User | null>(null);
  const [selectedPatientPrescriptions, setSelectedPatientPrescriptions] = useState<
    { appointmentDate: string; timeSlot: string; prescriptions: Prescription[] }[]
  >([]);
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showPrescriptionViewModal, setShowPrescriptionViewModal] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<number | null>(null);

  const allAppointments: Appointment[] = userDetails?.doctorProfile?.appointments ?? [];

  // Group latest appointment per patient
  const patientMap = new Map<number, Appointment>();
  allAppointments.forEach((appt) => {
    const existing = patientMap.get(appt.user.userId);
    if (!existing || new Date(appt.appointmentDate) > new Date(existing.appointmentDate)) {
      patientMap.set(appt.user.userId, appt);
    }
  });

  // Get all diagnoses
  const allDiagnoses: string[] = Array.from(
    new Set(
      allAppointments
        .flatMap((appt) => appt.prescription ?? [])
        .map((presc) => presc.diagnosis)
        .filter(Boolean)
    )
  );

  const filteredPatients = Array.from(patientMap.values())
    .filter((appt) => {
      const fullName = `${appt.user.firstName} ${appt.user.lastName}`.toLowerCase();
      const diagnosis = appt.prescription?.[0]?.diagnosis ?? "";
      return (
        fullName.includes(search.toLowerCase()) &&
        (selectedDiagnosis === "" || diagnosis === selectedDiagnosis)
      );
    })
    .sort(
      (a, b) =>
        new Date(b.appointmentDate).getTime() - new Date(a.appointmentDate).getTime()
    );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Patient Management</h1>
                <p className="text-gray-600 mt-1">View and manage your patient records</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search patients..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
                <select
                  value={selectedDiagnosis}
                  onChange={(e) => setSelectedDiagnosis(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Diagnoses</option>
                  {allDiagnoses.map((diag) => (
                    <option key={diag} value={diag}>
                      {diag}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Patients</p>
                <p className="text-3xl font-bold text-gray-800">{patientMap.size}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Active Prescriptions</p>
                <p className="text-3xl font-bold text-gray-800">
                  {allAppointments.flatMap(a => a.prescription ?? []).length}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <PillIcon className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Unique Diagnoses</p>
                <p className="text-3xl font-bold text-gray-800">{allDiagnoses.length}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <ClipboardDocumentCheckIcon className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Patient Cards */}
        <div className="space-y-4">
          {filteredPatients.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center border border-gray-200">
              <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-300" />
              <h3 className="mt-4 text-lg font-medium text-gray-700">No patients found</h3>
              <p className="mt-2 text-gray-500">
                {search || selectedDiagnosis 
                  ? "No patients match your search criteria" 
                  : "You don't have any patients yet"}
              </p>
            </div>
          ) : (
            filteredPatients.map((appt) => {
              const patientPrescriptions = allAppointments
                .filter((a) => a.user.userId === appt.user.userId && a.prescription?.length)
                .flatMap((a) => a.prescription!)
                .sort((a, b) => new Date(b.issuedAt).getTime() - new Date(a.issuedAt).getTime());

              const latestDiagnosis = patientPrescriptions.find((p) => p.diagnosis)?.diagnosis;

              return (
                <div
                  key={appt.user.userId}
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200 overflow-hidden"
                >
                  <div className="p-5">
                    <div className="flex flex-col sm:flex-row justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <img
                          src={
                            appt.user.profileURL ||
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(
                              appt.user.firstName + ' ' + appt.user.lastName
                            )}&background=1AB2E5&color=fff&size=128`
                          }
                          alt={`${appt.user.firstName}'s profile`}
                          className="w-16 h-16 rounded-full object-cover border-2 border-white shadow"
                        />
                        <div>
                          <h3 className="text-xl font-bold text-gray-800">
                            {appt.user.firstName} {appt.user.lastName}
                          </h3>
                          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
                            <div className="flex items-center text-sm text-gray-600">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                              </svg>
                              {appt.user.contactPhone}
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <CalendarIcon className="h-4 w-4 mr-1" />
                              {format(new Date(appt.appointmentDate), "MMM d, yyyy")}
                            </div>
                            {latestDiagnosis && (
                              <div className="flex items-center text-sm text-gray-600">
                                <ClipboardDocumentCheckIcon className="h-4 w-4 mr-1" />
                                {latestDiagnosis}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2 self-center sm:self-start">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedPatient(appt.user);
                            setSelectedAppointmentId(appt.appointmentId);
                            setShowPrescriptionModal(true);
                          }}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium flex items-center gap-1"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                          New Prescription
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedPatient(appt.user);
                            setShowMessageModal(true);
                          }}
                          className="px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-medium flex items-center gap-1"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                          </svg>
                          Message
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const prescriptionsByAppointment = allAppointments
                              .filter((a) => a.user.userId === appt.user.userId && a.prescription?.length)
                              .map((a) => ({
                                appointmentDate: a.appointmentDate,
                                timeSlot: a.timeSlot,
                                prescriptions: a.prescription!,
                              }))
                              .sort(
                                (a, b) =>
                                  new Date(b.appointmentDate).getTime() -
                                  new Date(a.appointmentDate).getTime()
                              );

                            setSelectedPatient(appt.user);
                            setSelectedPatientPrescriptions(prescriptionsByAppointment);
                            setShowPrescriptionViewModal(true);
                          }}
                          className="px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-medium flex items-center gap-1"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          View History
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modals */}
        {selectedPatient && selectedAppointmentId !== null && (
          <ModalWritePrescription
            isOpen={showPrescriptionModal}
            onClose={() => setShowPrescriptionModal(false)}
            patient={selectedPatient}
            doctorId={userDetails?.doctorProfile?.doctorId!}
            appointmentId={selectedAppointmentId}
          />
        )}

        {selectedPatient && (
          <ModalSendMessage
            isOpen={showMessageModal}
            onClose={() => setShowMessageModal(false)}
            patient={selectedPatient}
          />
        )}

        <Dialog 
          open={showPrescriptionViewModal} 
          onClose={() => setShowPrescriptionViewModal(false)} 
          className="relative z-50"
        >
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="w-full max-w-4xl bg-white rounded-xl shadow-lg">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <Dialog.Title className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <ClipboardDocumentListIcon className="h-5 w-5 text-blue-600" />
                    Medical History for {selectedPatient?.firstName} {selectedPatient?.lastName}
                  </Dialog.Title>
                  <button
                    onClick={() => setShowPrescriptionViewModal(false)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {selectedPatientPrescriptions.length} prescription records
                </p>
              </div>

              <div className="p-6 max-h-[70vh] overflow-y-auto">
                {selectedPatientPrescriptions.length === 0 ? (
                  <div className="text-center py-10">
                    <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-300" />
                    <h3 className="mt-4 text-lg font-medium text-gray-700">No prescriptions found</h3>
                    <p className="mt-2 text-gray-500">
                      This patient doesn't have any prescription history yet.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {selectedPatientPrescriptions.map((group, gIndex) => (
                      <div key={gIndex} className="border border-gray-200 rounded-lg overflow-hidden">
                        <div className="bg-gray-50 px-4 py-3 flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <CalendarIcon className="h-5 w-5 text-gray-500" />
                            <span className="font-medium text-gray-700">
                              {format(new Date(group.appointmentDate), "MMMM d, yyyy")}
                            </span>
                            <span className="text-sm text-gray-500">• {group.timeSlot}</span>
                          </div>
                        </div>

                        <div className="divide-y divide-gray-200">
                          {group.prescriptions.map((presc: any, i: number) => (
                            <div key={i} className="p-4">
                              <div className="flex items-start gap-3">
                                <div className="bg-blue-100 p-2 rounded-lg">
                                  <ClipboardDocumentCheckIcon className="h-5 w-5 text-blue-600" />
                                </div>
                                <div>
                                  <h4 className="font-medium text-gray-800">Diagnosis</h4>
                                  <p className="text-gray-700 mt-1">
                                    {presc.diagnosis || <span className="text-gray-400">Not specified</span>}
                                  </p>
                                </div>
                              </div>

                              {presc.notes && (
                                <div className="mt-4 flex items-start gap-3">
                                  <div className="bg-purple-100 p-2 rounded-lg">
                                    <ChatBubbleLeftEllipsisIcon className="h-5 w-5 text-purple-600" />
                                  </div>
                                  <div>
                                    <h4 className="font-medium text-gray-800">Clinical Notes</h4>
                                    <p className="text-gray-700 mt-1">{presc.notes}</p>
                                  </div>
                                </div>
                              )}

                              {presc.items?.length > 0 && (
                                <div className="mt-6">
                                  <h4 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
                                    <PillIcon className="h-5 w-5 text-green-600" />
                                    Prescribed Medications
                                  </h4>
                                  <div className="space-y-3">
                                    {presc.items.map((item: any, j: number) => (
                                      <div key={j} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                                        <div className="flex justify-between">
                                          <span className="font-medium text-gray-800">{item.drugName}</span>
                                          <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                            {item.dosage}
                                          </span>
                                        </div>
                                        <div className="grid grid-cols-3 gap-2 mt-2 text-sm">
                                          <div>
                                            <span className="text-gray-500">Frequency:</span> {item.frequency}
                                          </div>
                                          <div>
                                            <span className="text-gray-500">Duration:</span> {item.duration}
                                          </div>
                                          <div>
                                            <span className="text-gray-500">Route:</span> {item.route}
                                          </div>
                                        </div>
                                        {item.instructions && (
                                          <div className="mt-2 text-sm bg-yellow-50 border-l-4 border-yellow-300 pl-3 py-1">
                                            <span className="text-gray-700 font-medium">Instructions:</span> {item.instructions}
                                          </div>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t border-gray-200">
                <button
                  onClick={() => {
                    setShowPrescriptionViewModal(false);
                    setShowPrescriptionModal(true);
                  }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
                >
                  Add New Prescription
                </button>
                <button
                  onClick={() => setShowPrescriptionViewModal(false)}
                  className="px-4 py-2 border border-gray-300 hover:bg-gray-100 text-gray-700 rounded-lg font-medium"
                >
                  Close
                </button>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
      </div>
    </div>
  );
};