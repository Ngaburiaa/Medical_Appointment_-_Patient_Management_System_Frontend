import {
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  Reply,
  UserRound,
  ChevronDown,
  Mail,
  Trash2,
  Info,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import Swal from "sweetalert2";
import { complaintApi } from "../../Features/api/complaintApi";

interface TicketCardProps {
  ticket: {
    complaintId: number;
    createdAt: string;
    subject: string;
    description: string;
    status: 'Open' | 'Resolved'| "In Progress" | "Closed";
    reply?: string;
    user?: {
      firstName: string;
      lastName: string;
      email: string;
    };
  };
  onClick: () => void;
}

export const TicketCard = ({ ticket, onClick }: TicketCardProps) => {
    
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
  const [deleteTicket] = complaintApi.useDeleteComplaintByIdMutation();

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#1AB2E5",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      const toastId = toast.loading("Deleting...");
      try {
        await deleteTicket(ticket.complaintId).unwrap();
        toast.success("Deleted successfully", {
          id: toastId,
          icon: <CheckCircle2 className="text-green-600" />,
        });
      } catch (_err) {
        toast.error("Failed to delete ticket", {
          id: toastId,
          icon: <XCircle className="text-red-600" />,
        });
      }
    }
  };

  const createdAt = ticket?.createdAt ? new Date(ticket.createdAt) : null;
  const formattedDate = createdAt && !isNaN(createdAt.getTime())
    ? format(createdAt, "PPp")
    : "Invalid Date";

  return (
    <>
      <div
        onClick={onClick}
        className="bg-white border border-gray-200 shadow-lg rounded-2xl hover:scale-[1.01] hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden"
      >
        {/* Top Bar */}
        <div className="bg-gradient-to-r from-[#1AB2E5] to-[#0ea5e9] text-white px-5 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <MessageSquare size={20} className="text-white" />
            <span className="font-semibold text-sm">#{ticket.complaintId}</span>
          </div>
          <span className="text-xs opacity-80">{formattedDate}</span>
        </div>

        {/* Body */}
        <div className="px-5 py-4 space-y-3">
          <h3 className="text-lg font-bold text-gray-800 leading-tight">{ticket.subject}</h3>
          <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">{ticket.description}</p>

          {ticket.user && (
            <div className="text-xs text-gray-500 flex items-center gap-2 mt-3 p-2 bg-gray-50 rounded-lg">
              <UserRound size={14} className="text-[#1AB2E5]" />
              <span className="font-medium">{ticket.user.firstName} {ticket.user.lastName}</span>
              <Mail size={12} className="ml-2 text-[#1AB2E5]" />
              <span className="ml-1 truncate">{ticket.user.email}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-5 py-3 flex justify-between items-center border-t border-gray-100">
          {/* Status */}
          <div className="flex items-center gap-2 text-sm">
            {ticket.status === "Open" ? (
              <AlertCircle className="text-orange-500" size={16} />
            ) : ticket.status === "In Progress" ? (
              <AlertCircle className="text-[#1AB2E5]" size={16} />
            ) : (
              <CheckCircle2 className="text-green-600" size={16} />
            )}
            <span className={`font-medium ${
              ticket.status === "Open" 
                ? "text-orange-600" 
                : ticket.status === "In Progress"
                ? "text-[#1AB2E5]"
                : "text-green-700"
            }`}>
              {ticket.status}
            </span>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            {ticket.reply && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsReplyModalOpen(true);
                }}
                className="text-xs text-[#1AB2E5] bg-[#1AB2E5]/10 px-3 py-1.5 rounded-full flex items-center gap-1 hover:bg-[#1AB2E5]/20 transition-colors duration-200 font-medium"
              >
                <Reply size={14} />
                View Reply
                <ChevronDown size={14} />
              </button>
            )}
            <button
              onClick={handleDelete}
              className="text-xs text-red-600 flex items-center gap-1 hover:text-red-700 hover:bg-red-50 px-2 py-1.5 rounded-full transition-colors duration-200"
            >
              <Trash2 size={14} />
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Reply Modal */}
      {isReplyModalOpen && ticket.reply && (
        <dialog className="modal modal-open z-50 bg-black/30 backdrop-blur-sm" onClick={() => setIsReplyModalOpen(false)}>
          <div
            className="modal-box max-w-2xl rounded-xl p-0 shadow-2xl border border-gray-200 bg-white overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#1AB2E5] to-[#0ea5e9] text-white px-6 py-4 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Info className="text-white" size={22} />
                <h3 className="text-lg font-bold">Admin Reply</h3>
              </div>
              <button
                onClick={() => setIsReplyModalOpen(false)}
                className="text-white hover:text-gray-200 transition-colors text-xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10"
                title="Close"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <div className="bg-[#1AB2E5]/5 border border-[#1AB2E5]/20 text-gray-700 p-5 rounded-lg shadow-inner whitespace-pre-line text-sm leading-relaxed">
                {ticket.reply}
              </div>
              <p className="mt-3 text-right text-xs text-[#1AB2E5] italic font-medium">— Admin</p>

              <form method="dialog" className="mt-6">
                <button
                  onClick={() => setIsReplyModalOpen(false)}
                  className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-[#1AB2E5] to-[#0ea5e9] text-white hover:from-[#1AB2E5]/90 hover:to-[#0ea5e9]/90 transition-all duration-200 font-semibold text-sm tracking-wide shadow-md hover:shadow-lg"
                >
                  Close
                </button>
              </form>
            </div>
          </div>
        </dialog>
      )}
    </>
  );
};