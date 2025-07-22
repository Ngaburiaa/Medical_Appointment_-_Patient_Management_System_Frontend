import { format } from "date-fns";
import {
  PencilIcon,
   EyeIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { useSelector } from "react-redux";
import { toast } from "sonner";

import type { RootState } from "../../App/store";
import { userApi } from "../../Features/api/userAPI";
import { prescriptionApi } from "../../Features/api/prescriptionAPI";
import { useState } from "react";
import { EditPrescriptionModal } from "../../hooks/EditPrescriptionModal";
import { ViewPrescriptionModal } from "../../hooks/ViewPrescriptionModal";

interface PrescriptionItem {
  itemId: number;
  drugName: string;
  dosage: string;
  route: string;
  frequency: string;
  duration: string;
  instructions?: string;
  substitutionAllowed: number;
}

interface Patient {
  userId: number;
  firstName: string;
  lastName: string;
  contactPhone: string;
  profileURL?: string;
}

interface Appointment {
  appointmentDate: string;
  timeSlot: string;
}

interface Prescription {
  prescriptionId: number;
  appointmentId: number;
  doctorId: number;
  patientId: number;
  diagnosis: string;
  notes?: string;
  issuedAt: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  items: PrescriptionItem[];
  patient: Patient;
  appointment: Appointment;
}

export const DoctorPrescription = () => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingPrescription, setEditingPrescription] =
    useState<Prescription | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [viewPrescription, setViewPrescription] = useState<Prescription | null>(
    null
  );

  const { user } = useSelector((state: RootState) => state.auth);
  const { data: userDetails, refetch } = userApi.useGetUserByIdQuery(
    user?.userId ?? 0
  );
  const [deletePrescription, { isLoading: isDeleting }] =
    prescriptionApi.useDeletePrescriptionMutation();

  if (!userDetails) return <div>Loading...</div>;

  const prescriptions: Prescription[] =
    userDetails?.doctorProfile?.prescriptions || [];

  const handleDelete = async (prescriptionId: number) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this prescription?"
    );
    if (!confirm) return;

    try {
      await deletePrescription(prescriptionId).unwrap();
      toast.success("Prescription deleted successfully");
      refetch(); // Refresh data
    } catch (error) {
      toast.error("Failed to delete prescription");
      console.error(error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4">Recent Prescriptions</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Patient
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Appointment Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Issued Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Diagnosis
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Medications
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {prescriptions.map((prescription) => (
              <tr key={prescription.prescriptionId}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <img
                      className="h-10 w-10 rounded-full object-cover"
                      src={
                        prescription.patient.profileURL ||
                        `https://ui-avatars.com/api/?name=${prescription.patient.firstName}+${prescription.patient.lastName}&background=random`
                      }
                      alt={`${prescription.patient.firstName} ${prescription.patient.lastName}`}
                    />
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {prescription.patient.firstName}{" "}
                        {prescription.patient.lastName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {prescription.patient.contactPhone}
                      </div>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {format(
                      new Date(prescription.appointment.appointmentDate),
                      "MMM dd, yyyy"
                    )}
                  </div>
                  <div className="text-sm text-gray-500">
                    {prescription.appointment.timeSlot}
                  </div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {format(new Date(prescription.issuedAt), "MMM dd, yyyy")}
                  </div>
                  <div className="text-xs text-gray-500">
                    {prescription.status}
                  </div>
                </td>

                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">
                    {prescription.diagnosis}
                  </div>
                  {prescription.notes && (
                    <div className="text-xs text-gray-500 mt-1 line-clamp-2">
                      {prescription.notes}
                    </div>
                  )}
                </td>

                <td className="px-6 py-4">
                  <div className="space-y-1">
                    {prescription.items.map((item) => (
                      <div key={item.itemId} className="text-sm">
                        <span className="font-medium">{item.drugName}</span>
                        <span className="text-gray-600 ml-1">
                          ({item.dosage})
                        </span>
                        <div className="text-xs text-gray-500">
                          {item.frequency} for {item.duration}
                        </div>
                      </div>
                    ))}
                  </div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="flex space-x-2 justify-end">
                    <button
                      className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                      title="View"
                      onClick={() => {
                        setViewPrescription(prescription);
                        setIsViewOpen(true);
                      }}
                    >
                      <EyeIcon className="h-5 w-5" />
                    </button>

                    <button
                      className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50"
                      title="Edit"
                      onClick={() => {
                        setEditingPrescription(prescription);
                        setIsEditOpen(true);
                      }}
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>

                    <button
                      title="Delete"
                      onClick={() => handleDelete(prescription.prescriptionId)}
                      disabled={isDeleting}
                      className="text-red-600 hover:text-red-800 p-1 hover:bg-red-50 rounded"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {prescriptions.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No prescriptions found
          </div>
        )}

        {editingPrescription && (
          <EditPrescriptionModal
            isOpen={isEditOpen}
            onClose={() => setIsEditOpen(false)}
            prescriptionId={editingPrescription.prescriptionId}
            initialData={{
              diagnosis: editingPrescription.diagnosis,
              notes: editingPrescription.notes || "",
              items: editingPrescription.items,
            }}
          />
        )}

        {viewPrescription && (
          <ViewPrescriptionModal
            isOpen={isViewOpen}
            onClose={() => setIsViewOpen(false)}
            diagnosis={viewPrescription.diagnosis}
            notes={viewPrescription.notes}
            issuedAt={viewPrescription.issuedAt}
            appointmentDate={viewPrescription.appointment.appointmentDate}
            timeSlot={viewPrescription.appointment.timeSlot}
            items={viewPrescription.items}
          />
        )}
      </div>
    </div>
  );
};
