import { Dialog } from "@headlessui/react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { XCircle, Send } from "lucide-react";
import { complaintApi } from "../../Features/api/complaintApi";

type TicketReplyModalProps = {
  isOpen: boolean;
  onClose: () => void;
  ticketId: number;
};

export const TicketReplyModal = ({ isOpen, onClose, ticketId }: TicketReplyModalProps) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<{ message: string }>();
  const [addReply, { isLoading }] = complaintApi.useCreateComplaintMutation();

  const onSubmit = async (data: { message: string }) => {
    try {
      await addReply({ ticketId, ...data }).unwrap();
      toast.success("Reply sent.");
      reset();
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Failed to send reply.");
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <div className="fixed inset-0 bg-black/30" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white rounded-xl p-6 max-w-md w-full space-y-4 shadow-xl">
          <div className="flex justify-between items-center">
            <Dialog.Title className="text-xl font-semibold">Reply to Ticket</Dialog.Title>
            <button onClick={onClose}><XCircle className="w-5 h-5 text-gray-500 hover:text-red-500" /></button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block mb-1 font-medium">Message</label>
              <textarea
                {...register("message", { required: "Message is required" })}
                className="w-full border rounded-md px-3 py-2"
                rows={4}
              />
              {errors.message && <p className="text-red-500 text-sm">{errors.message.message}</p>}
            </div>

            <button
              type="submit"
              className="bg-green-600 text-white w-full py-2 rounded-md flex items-center justify-center hover:bg-green-700"
              disabled={isLoading}
            >
              <Send className="w-4 h-4 mr-2" /> Send Reply
            </button>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};
