
import { Dialog } from "@headlessui/react";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { toast } from "sonner";
import { XCircle, Send } from "lucide-react";
import { complaintApi } from "../../Features/api/complaintApi";

type TicketReplyModalProps = {
  isOpen: boolean;
  onClose: () => void;
  ticket: any | null;
};

export const TicketReplyModal = ({ isOpen, onClose, ticket }: TicketReplyModalProps) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<{ reply: string; status: string }>({
    defaultValues: { reply: "", status: "Open" },
  });

  const [updateComplaint, { isLoading }] = complaintApi.useUpdateComplaintProfileMutation();

  // Reset form when ticket changes
  useEffect(() => {
    if (ticket) {
      reset({
        reply: ticket.reply || "",
        status: ticket.status || "Open",
      });
    }
  }, [ticket, reset]);

  const onSubmit = async (data: { reply: string; status: string }) => {
    if (!ticket?.complaintId) {
      toast.error("Invalid complaint ID");
      return;
    }
    try {
      await updateComplaint({
        complaintId: ticket?.complaintId,
        ...data
      }).unwrap();
      toast.success("Reply updated successfully!");
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update ticket.");
    }
  };

  if (!isOpen || !ticket) return null;

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <div className="fixed inset-0 bg-black/30" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white rounded-xl p-6 max-w-md w-full space-y-4 shadow-xl">
          <div className="flex justify-between items-center">
            <Dialog.Title className="text-xl font-semibold">
              Reply to: {ticket.subject}
            </Dialog.Title>
            <button onClick={onClose}><XCircle className="w-5 h-5 text-gray-500 hover:text-red-500" /></button>
          </div>

          <p className="text-sm text-gray-700 mb-2">{ticket.description}</p>

          {ticket.reply && (
            <div className="p-3 rounded bg-yellow-50 text-sm border border-yellow-200">
              <strong>Previous Reply:</strong> {ticket.reply}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block mb-1 font-medium">Reply</label>
              <textarea
                {...register("reply", { required: "Message is required" })}
                className="w-full border rounded-md px-3 py-2"
                rows={4}
              />
              {errors.reply && <p className="text-red-500 text-sm">{errors.reply.message}</p>}
            </div>

            <div>
              <label className="block mb-1 font-medium">Status</label>
              <select {...register("status")} className="border rounded px-3 py-2 w-full">
                <option value="Open">Open</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>

            <button
              type="submit"
              className="bg-green-600 text-white w-full py-2 rounded-md flex items-center justify-center hover:bg-green-700"
              disabled={isLoading}
            >
              <Send className="w-4 h-4 mr-2" /> {isLoading ? "Saving..." : "Send Reply"}
            </button>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

