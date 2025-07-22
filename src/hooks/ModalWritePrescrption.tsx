
import { Dialog } from "@headlessui/react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { prescriptionApi } from "../Features/api/prescriptionAPI";
import { prescriptionItemApi } from "../Features/api/prescriptionItemAPI";

type PrescriptionFormData = {
  diagnosis: string;
  notes: string;
  drugName: string;
  dosage: string;
  route: string;
  frequency: string;
  duration: string;
  instructions?: string;
  substitutionAllowed: boolean;
};

type Patient = {
  userId: number;
  firstName: string;
  lastName: string;
  contactPhone: string;
};

type ModalWritePrescriptionProps = {
  isOpen: boolean;
  onClose: () => void;
  patient: Patient;
  doctorId: number;
  appointmentId: number;
};

export const ModalWritePrescription = ({
  isOpen,
  onClose,
  doctorId,
  appointmentId,
  patient,
}: ModalWritePrescriptionProps) => {
  const { register, handleSubmit, reset } = useForm<PrescriptionFormData>();

  const [createPrescription] = prescriptionApi.useCreatePrescriptionMutation();
  const [createPrescriptionItem] = prescriptionItemApi.useCreatePrescriptionItemMutation();

  // const onSubmit = async (data: PrescriptionFormData) => {
  //    console.log("DEBUG values:", {
  //   patientUserId: patient?.userId,
  //   doctorId,
  //   appointmentId,
  // });
  //   if (!patient?.userId || !doctorId || !appointmentId) {
  //   toast.error("Missing required information");
  //   return;
  // }
  //   try {
  //     const payload = {
  //       patientId: patient.userId,
  //       doctorId,
  //       appointmentId,
  //       diagnosis: data.diagnosis,
  //       notes: data.notes,
  //     };

  //     console.log("Submitting prescription:", payload);

  //     const prescriptionRes = await createPrescription(payload).unwrap();

  //     const prescriptionId =prescriptionRes?.prescriptionId || prescriptionRes?.id;

  //     await createPrescriptionItem({
  //       prescriptionId,
  //       drugName: data.drugName,
  //       dosage: data.dosage,
  //       route: data.route,
  //       frequency: data.frequency,
  //       duration: data.duration,
  //       instructions: data.instructions || "",
  //       substitutionAllowed: data.substitutionAllowed ? 1 : 0,
  //     }).unwrap();

  //     toast.success("Prescription saved successfully");
  //     reset();
  //     onClose();
  //   } catch (error) {
  //     console.error("Error:", error);
  //     toast.error("Failed to save prescription");
  //   }
  // };

  const onSubmit = async (data: PrescriptionFormData) => {
  if (!patient?.userId || !doctorId || !appointmentId) {
    toast.error("Missing required information");
    return;
  }

  try {
    const payload = {
      patientId: patient.userId,
      doctorId,
      appointmentId,
      diagnosis: data.diagnosis,
      notes: data.notes,
    };

    console.log("Submitting prescription:", payload);
    const prescriptionRes = await createPrescription(payload).unwrap();

    console.log("prescriptionRes:", prescriptionRes);

    const prescriptionId = prescriptionRes?.prescriptionId || prescriptionRes?.id;
    if (!prescriptionId) {
      throw new Error("Missing prescriptionId from response");
    }

    const itemPayload = {
      prescriptionId,
      drugName: data.drugName,
      dosage: data.dosage,
      route: data.route,
      frequency: data.frequency,
      duration: data.duration,
      instructions: data.instructions || "",
      substitutionAllowed: data.substitutionAllowed ? 1 : 0,
    };

    console.log("Submitting item:", itemPayload);

    await createPrescriptionItem(itemPayload).unwrap();

    toast.success("Prescription saved successfully");
    reset();
    onClose();
  } catch (error) {
    console.error("Error:", error);
    toast.error("Failed to save prescription");
  }
};


  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-md bg-white rounded-xl p-6 shadow-lg">
          <Dialog.Title className="text-lg font-bold mb-4">
            Write Prescription for {patient.firstName} {patient.lastName}
          </Dialog.Title>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <input
              placeholder="Diagnosis"
              {...register("diagnosis", { required: true })}
              className="w-full p-2 border rounded-md"
            />
            <input
              placeholder="Notes"
              {...register("notes")}
              className="w-full p-2 border rounded-md"
            />
            <input
              placeholder="Drug Name"
              {...register("drugName", { required: true })}
              className="w-full p-2 border rounded-md"
            />
            <input
              placeholder="Dosage"
              {...register("dosage", { required: true })}
              className="w-full p-2 border rounded-md"
            />
            <input
              placeholder="Route (e.g., oral)"
              {...register("route", { required: true })}
              className="w-full p-2 border rounded-md"
            />
            <input
              placeholder="Frequency (e.g., 3 times a day)"
              {...register("frequency", { required: true })}
              className="w-full p-2 border rounded-md"
            />
            <input
              placeholder="Duration (e.g., 5 days)"
              {...register("duration", { required: true })}
              className="w-full p-2 border rounded-md"
            />
            <input
              placeholder="Instructions"
              {...register("instructions")}
              className="w-full p-2 border rounded-md"
            />
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                {...register("substitutionAllowed")}
                className="accent-[#1AB2E5]"
              />
              Substitution Allowed
            </label>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#1AB2E5] text-white rounded-md hover:bg-[#1593c4]"
              >
                Save
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};
