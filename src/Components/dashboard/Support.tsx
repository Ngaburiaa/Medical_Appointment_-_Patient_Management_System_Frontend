import { useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../App/store";

import { userApi } from "../../Features/api/userAPI";
import { TicketCard } from "../support/SupportCard";
import { TicketFilters } from "../support/SupportFilters";
import { TicketFormModal } from "../support/SupportFormModal";
import { TicketReplyModal } from "../support/SupportReplyModal";

// Types
interface Complaint {
  complaintId: number;
  subject: string;
  description: string;
  status: "Open" | "Resolved" | "In Progress" | "Closed"; 
  priority: string;
  reply?: string;
  createdAt: string;
  user?: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

interface FilterState {
  status: string;
  priority: string;
  user: string;
}

export const Support = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const userId = user?.userId;

  const { data: userDetails, isLoading, isError } = userApi.useGetUserByIdQuery(userId!, {
    skip: !userId,
  });

  const complaints: Complaint[] = userDetails?.complaints || [];

  const [filter, setFilter] = useState<FilterState>({ status: "", priority: "", user: "" });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<any | null>(null);

const openReplyModal = (ticket: any) => setSelectedTicket(ticket);
const closeReplyModal = () => setSelectedTicket(null);

  const filteredComplaints = complaints.filter((ticket) => {
    const statusMatch = filter.status ? ticket.status === filter.status : true;
    const priorityMatch = filter.priority ? ticket.priority === filter.priority : true;
    const userMatch = filter.user
      ? `${ticket.user?.firstName ?? ""} ${ticket.user?.lastName ?? ""}`
          .toLowerCase()
          .includes(filter.user.toLowerCase())
      : true;
    return statusMatch && priorityMatch && userMatch;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Support Tickets</h2>
        <button
          onClick={() => setIsFormOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          New Ticket
        </button>
      </div>

      <TicketFilters filter={filter} setFilter={setFilter} />

      {isLoading && <p>Loading complaints...</p>}
      {isError && <p>Failed to load complaints.</p>}
      {!isLoading && !filteredComplaints.length && (
        <p className="text-sm text-gray-500">No tickets found.</p>
      )}

      {filteredComplaints.map((ticket: any) => (
  <TicketCard
    key={ticket.complaintId}
    ticket={ticket}
    onClick={() => openReplyModal(ticket)}
  />
))}


      <TicketFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        userId={userId!}
      />

      <TicketReplyModal
        isOpen={selectedTicket !== null}
        onClose={closeReplyModal}
        ticket={selectedTicket}
      />
    </div>
  );
};
