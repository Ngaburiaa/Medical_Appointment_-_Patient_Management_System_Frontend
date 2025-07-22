import { Dialog } from "@headlessui/react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { prescriptionApi } from "../Features/api/prescriptionAPI";

type PrescriptionItem = {
  itemId: number;
  drugName: string;
  dosage: string;
  route: string;
  frequency: string;
  duration: string;
  instructions?: string;
  substitutionAllowed: number;
};

type EditPrescriptionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  prescriptionId: number;
  initialData: {
    diagnosis: string;
    notes: string;
    items: PrescriptionItem[];
  };
};

export const EditPrescriptionModal = ({
  isOpen,
  onClose,
  prescriptionId,
  initialData,
}: EditPrescriptionModalProps) => {
  const { register, handleSubmit, } = useForm({
    defaultValues: {
      diagnosis: initialData.diagnosis,
      notes: initialData.notes,
    },
  });

  const [updatePrescription] = prescriptionApi.useUpdatePrescriptionMutation();

  const onSubmit = async (data: any) => {
    try {
      await updatePrescription({
        prescriptionId,
        diagnosis: data.diagnosis,
        notes: data.notes,
      }).unwrap();
      toast.success("Prescription updated");
      onClose();
    } catch (error) {
      toast.error("Failed to update");
      console.error("Error updating prescription:", error);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-md bg-white rounded-lg shadow p-6">
          <Dialog.Title className="text-xl font-bold mb-4">Edit Prescription</Dialog.Title>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <input
              {...register("diagnosis", { required: true })}
              className="w-full border p-2 rounded"
              placeholder="Diagnosis"
            />
            <textarea
              {...register("notes")}
              className="w-full border p-2 rounded"
              placeholder="Clinical Notes"
              rows={3}
            />
            <div className="flex justify-end gap-2">
              <button onClick={onClose} className="border px-4 py-2 rounded">Cancel</button>
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Save</button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};
