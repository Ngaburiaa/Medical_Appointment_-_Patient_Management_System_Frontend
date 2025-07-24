import { useEffect, useState } from "react";
import { complaintApi } from "../../Features/api/complaintApi";
import { TicketCard } from "../../Components/support/SupportCard";
import { TicketReplyModal } from "../../Components/support/SupportReplyModal";
import { TicketFilters } from "../../Components/support/SupportFilters";
import { useSelector } from "react-redux";
import type { RootState } from "../../App/store";
import { Loader } from "lucide-react";

export const AdminSupport = () => {
  const { data: tickets, isLoading, refetch } = complaintApi.useGetComplaintsProfilesQuery(undefined);
  const [selectedTicket, setSelectedTicket] = useState<any | null>(null);
  const { userType } = useSelector((state: RootState) => state.auth);
  const [filters, setFilters] = useState({ status: "", user: "", priority: "" });

  useEffect(() => { refetch(); }, [tickets]);

  const filteredTickets = tickets?.filter((ticket: any) => {
    const matchesStatus = filters.status ? ticket.status === filters.status : true;
    const matchesUser = filters.user
      ? `${ticket.user?.firstName ?? ""} ${ticket.user?.lastName ?? ""}`.toLowerCase().includes(filters.user.toLowerCase())
      : true;
    const matchesPriority = filters.priority ? ticket.priority === filters.priority : true;
    return matchesStatus && matchesUser && matchesPriority;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#ffffff] to-[#e5e5e5] px-6 md:px-10 py-10 text-[#14213d]">
      {/* Filters */}
      <div className="bg-white px-6 py-4 rounded-xl border border-[#e5e5e5] shadow-sm">
        <TicketFilters filter={filters} setFilter={setFilters} />
      </div>

      {/* Ticket List */}
      <section className="mt-8 grid gap-6">
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader className="animate-spin text-[#fca311]" size={32} />
          </div>
        ) : filteredTickets?.length ? (
          filteredTickets.map((ticket: any, index: number) => (
            <TicketCard
              key={ticket.complaintId ?? index}
              ticket={ticket}
              onClick={() => setSelectedTicket(ticket)}
            />
          ))
        ) : (
          <div className="text-center py-20 text-[#6b7280] text-lg">
            No tickets match the current filters.
          </div>
        )}
      </section>

      {/* Reply Modal (Admin only) */}
     {userType === "admin" && selectedTicket && (
  <TicketReplyModal
    isOpen={!!selectedTicket}
    onClose={() => setSelectedTicket(null)}
    ticket={selectedTicket}
  />
)}

    </div>
  );
};
