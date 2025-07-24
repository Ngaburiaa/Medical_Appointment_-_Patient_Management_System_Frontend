type TicketFiltersProps = {
  filter: { priority: string; status: string; user: string };
  setFilter: (filter: { priority: string; status: string; user: string }) => void;
};

export const TicketFilters = ({ filter, setFilter }: TicketFiltersProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilter({ ...filter, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex gap-4 flex-wrap items-center py-2">
      <div className="relative">
        <label className="text-sm mr-2">Priority:</label>
        <select name="priority" value={filter.priority} onChange={handleChange} className="border rounded px-3 py-1">
          <option value="">All</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
      </div>

      <div className="relative">
        <label className="text-sm mr-2">Status:</label>
        <select name="status" value={filter.status} onChange={handleChange} className="border rounded px-3 py-1">
          <option value="">All</option>
          <option value="Open">Open</option>
          <option value="Pending">Pending</option>
          <option value="Closed">Closed</option>
        </select>
      </div>

      <div className="relative">
        <label className="text-sm mr-2">User:</label>
        <input
          type="text"
          name="user"
          value={filter.user}
          onChange={handleChange}
          placeholder="Search user..."
          className="border rounded px-3 py-1"
        />
      </div>
    </div>
  );
};
