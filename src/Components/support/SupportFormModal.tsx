import { Dialog } from "@headlessui/react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { complaintApi } from "../../Features/api/complaintApi";
import { toast } from "sonner";
import { XCircle, Send } from "lucide-react";

type TicketFormInputs = {
  subject: string;
  description: string;
  priority: "Low" | "Medium" | "High";
};

type TicketFormModalProps = {
  isOpen: boolean;
  onClose: () => void;
  userId: number;
};

export const TicketFormModal = ({ isOpen, onClose, userId }: TicketFormModalProps) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<TicketFormInputs>();

  const [createComplaint, { isLoading }] = complaintApi.useCreateComplaintMutation();

  const onSubmit: SubmitHandler<TicketFormInputs> = async (data) => {
    try {
      await createComplaint({ ...data, userId }).unwrap();
      toast.success("Ticket submitted successfully!");
      reset();
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit ticket.");
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 space-y-4">
          <div className="flex justify-between items-center">
            <Dialog.Title className="text-xl font-semibold">Submit a Ticket</Dialog.Title>
            <button onClick={onClose}><XCircle className="w-5 h-5 text-gray-500 hover:text-red-500" /></button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block font-medium mb-1">Subject</label>
              <input
                {...register("subject", { required: "Subject is required" })}
                className="w-full border rounded-md px-3 py-2"
              />
              {errors.subject && <p className="text-red-500 text-sm">{errors.subject.message}</p>}
            </div>

            <div>
              <label className="block font-medium mb-1">Description</label>
              <textarea
                {...register("description", { required: "Description is required" })}
                rows={4}
                className="w-full border rounded-md px-3 py-2"
              />
              {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
            </div>

            <div>
              <label className="block font-medium mb-1">Priority</label>
              <select
                {...register("priority", { required: true })}
                className="w-full border rounded-md px-3 py-2"
              >
                <option value="">Select priority</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
              {errors.priority && <p className="text-red-500 text-sm">Priority is required</p>}
            </div>

            <button
              type="submit"
              className="flex items-center justify-center w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
              disabled={isLoading}
            >
              <Send className="w-4 h-4 mr-2" /> Submit Ticket
            </button>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};
