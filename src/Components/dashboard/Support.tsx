import { useState } from "react";
import { useSelector } from "react-redux";
import  type { RootState } from "../../App/store";

import { userApi } from "../../Features/api/userAPI";
import { TicketCard } from "../support/SupportCard";
import { TicketFilters } from "../support/SupportFilters";
import { TicketFormModal } from "../support/SupportFormModal";
import { TicketReplyModal } from "../support/SupportReplyModal";

export const Support = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const userId = user?.userId;

  const { data: userDetails, isLoading, isError } = userApi.useGetUserByIdQuery(userId!, {
    skip: !userId,
  });

  const complaints = userDetails?.complaints || [];

  const [filter, setFilter] = useState({ status: "", priority: "" });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedTicketId, setSelectedTicketId] = useState<number | null>(null);

  const openReplyModal = (ticketId: number) => setSelectedTicketId(ticketId);
  const closeReplyModal = () => setSelectedTicketId(null);

  const filteredComplaints = complaints.filter((ticket: { status: string; priority: string; }) => {
    const statusMatch = filter.status ? ticket.status === filter.status : true;
    const priorityMatch = filter.priority
      ? ticket.priority === filter.priority
      : true;
    return statusMatch && priorityMatch;
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

      {filteredComplaints.map((ticket:any) => (
        <TicketCard
          key={ticket.ticketId}
          ticket={ticket}
          onClick={() => openReplyModal(ticket.ticketId)}
        />
      ))}

      <TicketFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        userId={userId!}
      />

      <TicketReplyModal
        isOpen={selectedTicketId !== null}
        onClose={closeReplyModal}
        ticketId={selectedTicketId ?? 0}
      />
    </div>
  );
};
