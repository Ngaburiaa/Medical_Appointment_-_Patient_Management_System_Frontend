import { Filter, Search, ChevronDown } from "lucide-react";

type TicketFiltersProps = {
  filter: { priority: string; status: string; user: string };
  setFilter: (filter: { priority: string; status: string; user: string }) => void;
};

export const TicketFilters = ({ filter, setFilter }: TicketFiltersProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilter({ ...filter, [e.target.name]: e.target.value });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Filter className="text-[#1AB2E5]" size={20} />
        <h3 className="text-lg font-semibold text-gray-800">Filter Tickets</h3>
      </div>

      <div className="flex gap-6 flex-wrap items-end">
        {/* Priority Filter */}
        <div className="min-w-[140px]">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Priority
          </label>
          <div className="relative">
            <select 
              name="priority" 
              value={filter.priority} 
              onChange={handleChange} 
              className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2.5 pr-10 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1AB2E5] focus:border-[#1AB2E5] transition-colors duration-200 hover:border-gray-400"
            >
              <option value="">All Priorities</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
            <ChevronDown 
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" 
              size={16} 
            />
          </div>
        </div>

        {/* Status Filter */}
        <div className="min-w-[140px]">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <div className="relative">
            <select 
              name="status" 
              value={filter.status} 
              onChange={handleChange} 
              className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2.5 pr-10 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1AB2E5] focus:border-[#1AB2E5] transition-colors duration-200 hover:border-gray-400"
            >
              <option value="">All Status</option>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
            </select>
            <ChevronDown 
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" 
              size={16} 
            />
          </div>
        </div>

        {/* User Search */}
        <div className="min-w-[200px] flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search User
          </label>
          <div className="relative">
            <Search 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
              size={16} 
            />
            <input
              type="text"
              name="user"
              value={filter.user}
              onChange={handleChange}
              placeholder="Search by name or email..."
              className="w-full bg-white border border-gray-300 rounded-lg pl-10 pr-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1AB2E5] focus:border-[#1AB2E5] transition-colors duration-200 hover:border-gray-400"
            />
          </div>
        </div>

        {/* Clear Filters Button */}
        {(filter.priority || filter.status || filter.user) && (
          <div className="flex items-end">
            <button
              onClick={() => setFilter({ priority: "", status: "", user: "" })}
              className="px-4 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200 border border-gray-300 hover:border-gray-400"
            >
              Clear All
            </button>
          </div>
        )}
      </div>

      {/* Active Filters Summary */}
      {(filter.priority || filter.status || filter.user) && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-gray-600">Active filters:</span>
            {filter.priority && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#1AB2E5]/10 text-[#1AB2E5] text-xs font-medium rounded-full border border-[#1AB2E5]/20">
                Priority: {filter.priority}
                <button
                  onClick={() => setFilter({ ...filter, priority: "" })}
                  className="ml-1 hover:text-[#1AB2E5]/80"
                >
                  ×
                </button>
              </span>
            )}
            {filter.status && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#1AB2E5]/10 text-[#1AB2E5] text-xs font-medium rounded-full border border-[#1AB2E5]/20">
                Status: {filter.status}
                <button
                  onClick={() => setFilter({ ...filter, status: "" })}
                  className="ml-1 hover:text-[#1AB2E5]/80"
                >
                  ×
                </button>
              </span>
            )}
            {filter.user && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#1AB2E5]/10 text-[#1AB2E5] text-xs font-medium rounded-full border border-[#1AB2E5]/20">
                User: {filter.user}
                <button
                  onClick={() => setFilter({ ...filter, user: "" })}
                  className="ml-1 hover:text-[#1AB2E5]/80"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};