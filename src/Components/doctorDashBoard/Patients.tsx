// import { useSelector } from "react-redux";
// import { useState } from "react";
// import { format } from "date-fns";
// import { Dialog } from "@headlessui/react";
// import { CalendarIcon, ChatBubbleLeftEllipsisIcon,ClipboardDocumentListIcon, ClipboardDocumentCheckIcon, DocumentTextIcon, XMarkIcon } from "@heroicons/react/20/solid";

// import { userApi } from "../../Features/api/userAPI";
// import type { RootState } from "../../App/store";

// import { ModalWritePrescription } from "../../hooks/ModalWritePrescrption";
// import { ModalSendMessage } from "../../hooks/ModalSendMessage";
// import { PillIcon } from "lucide-react";

// export const Patients = () => {
//   const { user } = useSelector((state: RootState) => state.auth);
//   const { data: userDetails } = userApi.useGetUserByIdQuery(user?.userId!);

//   const [search, setSearch] = useState("");
//   const [selectedDiagnosis, setSelectedDiagnosis] = useState("");
//   const [selectedPatient, setSelectedPatient] = useState<any>(null);
//   const [selectedPatientPrescriptions, setSelectedPatientPrescriptions] = useState<any[]>([]);
//   const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
//   const [showMessageModal, setShowMessageModal] = useState(false);
//   const [showPrescriptionViewModal, setShowPrescriptionViewModal] = useState(false);
//   const [selectedAppointmentId, setSelectedAppointmentId] = useState<number | null>(null);


//   const allAppointments = userDetails?.doctorProfile?.appointments || [];

//   // Get latest appointment per unique patient
//   const patientMap = new Map<number, any>();
//   allAppointments.forEach((appt: any) => {
//     const patientId = appt.user.userId;
//     const existing = patientMap.get(patientId);
//     if (!existing || new Date(appt.appointmentDate) > new Date(existing.appointmentDate)) {
//       patientMap.set(patientId, appt);
//     }
//   });

//   // All unique diagnoses
//   const allDiagnoses = Array.from(
//     new Set(
//       allAppointments
//         .flatMap((appt: any) => appt.prescription || [])
//         .map((presc: any) => presc.diagnosis)
//         .filter(Boolean)
//     )
//   );

//   // Filter + sort patients by latest visit
//   const filteredPatients = Array.from(patientMap.values())
//     .filter((p: any) => {
//       const fullName = `${p.user.firstName} ${p.user.lastName}`.toLowerCase();
//       const diagnosis = p.prescription?.[0]?.diagnosis || "";
//       return (
//         fullName.includes(search.toLowerCase()) &&
//         (selectedDiagnosis === "" || diagnosis === selectedDiagnosis)
//       );
//     })
//     .sort(
//       (a: any, b: any) =>
//         new Date(b.appointmentDate).getTime() - new Date(a.appointmentDate).getTime()
//     );

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen font-sans">
//       <div className="max-w-5xl mx-auto">
//         {/* Header */}
//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
//           <h2 className="text-3xl font-bold text-gray-800" >Patient Records</h2>
//           <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
//             <input
//               placeholder="Search patient by name..."
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               className="w-full sm:w-72 px-4 py-2 border border-gray-200 rounded-md bg-white focus:ring-2 focus:ring-sky-400 focus:outline-none text-sm"
//             />
//             <select
//               value={selectedDiagnosis}
//               onChange={(e) => setSelectedDiagnosis(e.target.value)}
//               className="w-full sm:w-56 px-3 py-2 border border-gray-200 rounded-md bg-white text-sm focus:ring-2 focus:ring-sky-400"
//             >
//               <option value="">All Diagnoses</option>
//               {allDiagnoses.map((diag) => (
//                 <option key={diag as string} value={diag as string}>
//                   {diag as string}
//                 </option>
//               ))}
//             </select>
//           </div>
//         </div>

//         {/* Patient Cards */}
//         <div className="grid gap-5">
//           {filteredPatients.length === 0 ? (
//             <div className="text-center text-gray-500 bg-white rounded-md p-6 shadow-sm">
//               {search || selectedDiagnosis ? "No patient matches your filters." : "No patients found yet."}
//             </div>
//           ) : (
//             filteredPatients.map((appt: any) => {
//               // All prescriptions for this patient (all time)
//               const patientPrescriptions = allAppointments
//                 .filter((a: any) => a.user.userId === appt.user.userId && a.prescription?.length)
//                 .flatMap((a: any) => a.prescription)
//                 .sort((a: any, b: any) => new Date(b.issuedAt).getTime() - new Date(a.issuedAt).getTime());

//               const latestDiagnosis = patientPrescriptions.find((p: any) => p.diagnosis)?.diagnosis;

//               return (
//                 <div
//                   key={appt.user.userId}
//                   onClick={() => {
//                     const prescriptionsByAppointment = allAppointments
//                       .filter((a: any) => a.user.userId === appt.user.userId && a.prescription?.length)
//                       .map((a: any) => ({
//                         appointmentDate: a.appointmentDate,
//                         timeSlot: a.timeSlot,
//                         prescriptions: a.prescription,
//                       }))
//                       .sort((a: any, b: any) => new Date(b.appointmentDate).getTime() - new Date(a.appointmentDate).getTime());

//                     setSelectedPatient(appt.user);
//                     setSelectedPatientPrescriptions(prescriptionsByAppointment);
//                     setShowPrescriptionViewModal(true);
//                   }}
//                   className="bg-white rounded-xl shadow hover:shadow-md transition-all p-5 cursor-pointer border border-transparent hover:border-sky-400"
//                 >
//                   <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
//                     <div className="flex items-start gap-4">
//                       <img
//                         src={appt.user.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.firstName ?? "Guest")}&background=1AB2E5&color=fff&size=128`}
//                         alt={`${appt.user.firstName}'s profile`}
//                         className="w-14 h-14 rounded-full object-cover border shadow"
//                       />
//                       <div className="space-y-1">
//                         <h3 className="text-xl font-semibold text-gray-800">
//                           {appt.user.firstName} {appt.user.lastName}
//                         </h3>
//                         <p className="text-gray-500 text-sm">Phone: {appt.user.contactPhone}</p>
//                         <p className="text-sm text-gray-500">
//                           Last Visit: {format(new Date(appt.appointmentDate), "dd MMM yyyy")}
//                         </p>
//                         <p className="text-sm">
//                           <span className="font-medium text-gray-600">Diagnosis:</span>{" "}
//                           <span className={latestDiagnosis ? "text-gray-800" : "text-gray-400"}>
//                             {latestDiagnosis || "No diagnosis"}
//                           </span>
//                         </p>

//                         {patientPrescriptions.length > 0 && (
//                           <span className="inline-block mt-1 bg-sky-100 text-sky-700 text-xs px-2 py-1 rounded-full">
//                             {patientPrescriptions.length} Diagnoses
//                           </span>
//                         )}
//                       </div>
//                     </div>

//                     <div className="flex gap-2 flex-wrap">
//                       <button
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           setSelectedPatient(appt.user);
//                            setSelectedAppointmentId(appt.appointmentId);
//                           setShowPrescriptionModal(true);
//                           console.log("Selected appointmentId:", appt.appointmentId);

//                         }}
//                         className="px-4 py-2 bg-sky-500 text-white rounded-md hover:bg-sky-600 text-sm"
//                       >
//                         Write Prescription
//                       </button>
//                       <button
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           setSelectedPatient(appt.user);
//                           setShowMessageModal(true);
//                          }}
//                         className="px-4 py-2 border border-sky-500 text-sky-500 rounded-md hover:bg-sky-50 text-sm"
//                       >
//                         Send Message
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               );
//             })
//           )}
//         </div>

//         {/* Modals */}
//         {selectedPatient && (
//           <>
//             <ModalWritePrescription
//   isOpen={showPrescriptionModal}
//   onClose={() => setShowPrescriptionModal(false)}
//   patient={selectedPatient}
//   doctorId={userDetails?.doctorProfile?.doctorId!}
//   appointmentId={selectedAppointmentId!}
// />

//             <ModalSendMessage
//               isOpen={showMessageModal}
//               onClose={() => setShowMessageModal(false)}
//               patient={selectedPatient}
//             />
//           </>
//         )}

//         {/* Prescription View Modal */}
//    <Dialog 
//   open={showPrescriptionViewModal} 
//   onClose={() => setShowPrescriptionViewModal(false)} 
//   className="relative z-50"
// >
//   {/* Semi-transparent backdrop with subtle blur */}
//   <div className="fixed inset-0 bg-gray-900/70 backdrop-blur-sm" aria-hidden="true" />
  
//   {/* Centered modal container */}
//   <div className="fixed inset-0 flex items-center justify-center p-4 overflow-y-auto">
//     <Dialog.Panel className="w-full max-w-4xl bg-white rounded-xl shadow-2xl overflow-hidden">
//       {/* Header with gradient background */}
//       <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-5">
//         <div className="flex justify-between items-center">
//           <div>
//             <Dialog.Title className="text-2xl font-bold text-white flex items-center gap-2">
//   <ClipboardDocumentListIcon className="w-6 h-6" />
//   Medical History for {selectedPatient?.firstName} {selectedPatient?.lastName}
// </Dialog.Title>

//             <p className="text-blue-100 text-sm mt-1">
//               {selectedPatientPrescriptions.length} prescription records
//             </p>
//           </div>
//           <button
//             onClick={() => setShowPrescriptionViewModal(false)}
//             className="text-white/80 hover:text-white transition-colors"
//           >
//             <XMarkIcon className="w-6 h-6" />
//           </button>
//         </div>
//       </div>

//       {/* Content area */}
//       <div className="p-6 max-h-[70vh] overflow-y-auto">
//         {selectedPatientPrescriptions.length === 0 ? (
//           <div className="text-center py-10">
//             <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-300" />
//             <h3 className="mt-4 text-lg font-medium text-gray-700">No prescriptions found</h3>
//             <p className="mt-2 text-gray-500">
//               This patient doesn't have any prescription history yet.
//             </p>
//           </div>
//         ) : (
//           <div className="space-y-6">
//             {selectedPatientPrescriptions.map((group, gIndex) => (
//               <div key={gIndex} className="border border-gray-200 rounded-lg overflow-hidden">
//                 <div className="bg-gray-50 px-4 py-3 flex justify-between items-center">
//                   <div className="flex items-center gap-3">
//                     <CalendarIcon className="h-5 w-5 text-gray-500" />
//                     <span className="font-medium text-gray-700">
//                       {format(new Date(group.appointmentDate), "MMMM d, yyyy")}
//                     </span>
//                     <span className="text-sm text-gray-500">• {group.timeSlot}</span>
//                   </div>
//                   <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
//                     View Full Appointment
//                   </button>
//                 </div>

//                 <div className="divide-y divide-gray-200">
//                   {group.prescriptions.map((presc: any, i: number) => (
//                     <div key={i} className="p-4">
//                       {/* Diagnosis section */}
//                       <div className="flex items-start gap-3">
//                         <div className="bg-blue-100 p-2 rounded-lg">
//                           <ClipboardDocumentCheckIcon className="h-5 w-5 text-blue-600" />
//                         </div>
//                         <div>
//                           <h4 className="font-medium text-gray-800">Diagnosis</h4>
//                           <p className="text-gray-700 mt-1">
//                             {presc.diagnosis || <span className="text-gray-400">Not specified</span>}
//                           </p>
//                         </div>
//                       </div>

//                       {/* Notes section */}
//                       {presc.notes && (
//                         <div className="mt-4 flex items-start gap-3">
//                           <div className="bg-purple-100 p-2 rounded-lg">
//                             <ChatBubbleLeftEllipsisIcon className="h-5 w-5 text-purple-600" />
//                           </div>
//                           <div>
//                             <h4 className="font-medium text-gray-800">Clinical Notes</h4>
//                             <p className="text-gray-700 mt-1">{presc.notes}</p>
//                           </div>
//                         </div>
//                       )}

//                       {/* Medications section */}
//                       {presc.items?.length > 0 && (
//                         <div className="mt-6">
//                           <h4 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
//                             <PillIcon className="h-5 w-5 text-green-600" />
//                             Prescribed Medications
//                           </h4>
//                           <div className="space-y-3">
//                             {presc.items.map((item: any, j: number) => (
//                               <div key={j} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
//                                 <div className="flex justify-between">
//                                   <span className="font-medium text-gray-800">{item.drugName}</span>
//                                   <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
//                                     {item.dosage}
//                                   </span>
//                                 </div>
//                                 <div className="grid grid-cols-3 gap-2 mt-2 text-sm">
//                                   <div>
//                                     <span className="text-gray-500">Frequency:</span> {item.frequency}
//                                   </div>
//                                   <div>
//                                     <span className="text-gray-500">Duration:</span> {item.duration}
//                                   </div>
//                                   <div>
//                                     <span className="text-gray-500">Route:</span> {item.route}
//                                   </div>
//                                 </div>
//                                 {item.instructions && (
//                                   <div className="mt-2 text-sm bg-yellow-50 border-l-4 border-yellow-300 pl-3 py-1">
//                                     <span className="text-gray-700 font-medium">Instructions:</span> {item.instructions}
//                                   </div>
//                                 )}
//                               </div>
//                             ))}
//                           </div>
//                         </div>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* Footer with action buttons */}
//       <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t border-gray-200">
//         <button
//           onClick={() => {
//             setShowPrescriptionViewModal(false);
//             setShowPrescriptionModal(true);
//           }}
//           className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
//         >
//           Add New Prescription
//         </button>
//         <button
//           onClick={() => setShowPrescriptionViewModal(false)}
//           className="px-4 py-2 border border-gray-300 hover:bg-gray-100 text-gray-700 rounded-lg font-medium transition-colors"
//         >
//           Close
//         </button>
//       </div>
//     </Dialog.Panel>
//   </div>
// </Dialog>

//       </div>
//     </div>
//   );
// };


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
  profileImage?: string;
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
    <div className="p-6 bg-gray-50 min-h-screen font-sans">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h2 className="text-3xl font-bold text-gray-800">Patient Records</h2>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <input
              placeholder="Search patient by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-72 px-4 py-2 border border-gray-200 rounded-md bg-white focus:ring-2 focus:ring-sky-400 focus:outline-none text-sm"
            />
            <select
              value={selectedDiagnosis}
              onChange={(e) => setSelectedDiagnosis(e.target.value)}
              className="w-full sm:w-56 px-3 py-2 border border-gray-200 rounded-md bg-white text-sm focus:ring-2 focus:ring-sky-400"
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

        {/* Patient Cards */}
        <div className="grid gap-5">
          {filteredPatients.length === 0 ? (
            <div className="text-center text-gray-500 bg-white rounded-md p-6 shadow-sm">
              {search || selectedDiagnosis
                ? "No patient matches your filters."
                : "No patients found yet."}
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
                  onClick={() => {
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
                  className="bg-white rounded-xl shadow hover:shadow-md transition-all p-5 cursor-pointer border border-transparent hover:border-sky-400"
                >
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                    <div className="flex items-start gap-4">
                      <img
                        src={
                          appt.user.profileImage ||
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            appt.user.firstName
                          )}&background=1AB2E5&color=fff&size=128`
                        }
                        alt={`${appt.user.firstName}'s profile`}
                        className="w-14 h-14 rounded-full object-cover border shadow"
                      />
                      <div className="space-y-1">
                        <h3 className="text-xl font-semibold text-gray-800">
                          {appt.user.firstName} {appt.user.lastName}
                        </h3>
                        <p className="text-gray-500 text-sm">Phone: {appt.user.contactPhone}</p>
                        <p className="text-sm text-gray-500">
                          Last Visit:{" "}
                          {format(new Date(appt.appointmentDate), "dd MMM yyyy")}
                        </p>
                        <p className="text-sm">
                          <span className="font-medium text-gray-600">Diagnosis:</span>{" "}
                          <span className={latestDiagnosis ? "text-gray-800" : "text-gray-400"}>
                            {latestDiagnosis || "No diagnosis"}
                          </span>
                        </p>
                        {patientPrescriptions.length > 0 && (
                          <span className="inline-block mt-1 bg-sky-100 text-sky-700 text-xs px-2 py-1 rounded-full">
                            {patientPrescriptions.length} Diagnoses
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedPatient(appt.user);
                          setSelectedAppointmentId(appt.appointmentId);
                          setShowPrescriptionModal(true);
                        }}
                        className="px-4 py-2 bg-sky-500 text-white rounded-md hover:bg-sky-600 text-sm"
                      >
                        Write Prescription
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedPatient(appt.user);
                          setShowMessageModal(true);
                        }}
                        className="px-4 py-2 border border-sky-500 text-sky-500 rounded-md hover:bg-sky-50 text-sm"
                      >
                        Send Message
                      </button>
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
  {/* Semi-transparent backdrop with subtle blur */}
  <div className="fixed inset-0 bg-gray-900/70 backdrop-blur-sm" aria-hidden="true" />
  
  {/* Centered modal container */}
  <div className="fixed inset-0 flex items-center justify-center p-4 overflow-y-auto">
    <Dialog.Panel className="w-full max-w-4xl bg-white rounded-xl shadow-2xl overflow-hidden">
      {/* Header with gradient background */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-5">
        <div className="flex justify-between items-center">
          <div>
            <Dialog.Title className="text-2xl font-bold text-white flex items-center gap-2">
  <ClipboardDocumentListIcon className="w-6 h-6" />
  Medical History for {selectedPatient?.firstName} {selectedPatient?.lastName}
</Dialog.Title>

            <p className="text-blue-100 text-sm mt-1">
              {selectedPatientPrescriptions.length} prescription records
            </p>
          </div>
          <button
            onClick={() => setShowPrescriptionViewModal(false)}
            className="text-white/80 hover:text-white transition-colors"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Content area */}
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
                  <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                    View Full Appointment
                  </button>
                </div>

                <div className="divide-y divide-gray-200">
                  {group.prescriptions.map((presc: any, i: number) => (
                    <div key={i} className="p-4">
                      {/* Diagnosis section */}
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

                      {/* Notes section */}
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

                      {/* Medications section */}
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

      {/* Footer with action buttons */}
      <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t border-gray-200">
        <button
          onClick={() => {
            setShowPrescriptionViewModal(false);
            setShowPrescriptionModal(true);
          }}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
        >
          Add New Prescription
        </button>
        <button
          onClick={() => setShowPrescriptionViewModal(false)}
          className="px-4 py-2 border border-gray-300 hover:bg-gray-100 text-gray-700 rounded-lg font-medium transition-colors"
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
