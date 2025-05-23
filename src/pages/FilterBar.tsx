import { allProjectTypes } from '@shared/dataTypes';
import type { FilterStatus } from '@shared/dataTypes';


type FilterBarProps = {
  filter: string;
  setFilter: (filter: FilterStatus) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  startDate: string;
  setStartDate: (date: string) => void;
  endDate: string;
  setEndDate: (date: string) => void;
  selectedProjectType: string;
  setSelectedProjectType: (type: string) => void;
  statusCounts: Record<string, number>;
};

const statuses: FilterStatus[] = [
  'all',
  'new',
  'considering',
  'inprogress',
  'completed',
  'replied',
  'archived',
  'deleted'
];


const FilterBar = ({
  filter,
  setFilter,
  searchQuery,
  setSearchQuery,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  selectedProjectType,
  setSelectedProjectType,
  statusCounts
}: FilterBarProps) => {
  return (
    <div className="m-6 flex flex-wrap gap-3 items-center">
      {/* Status filter buttons */}
      <div className="flex flex-wrap gap-2">
        {statuses.map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded text-sm font-medium ${
              filter === status
                ? 'bg-cyan-700 text-white'
                : 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white'
            }`}
          >
            {status === 'inprogress'
              ? 'In Progress'
              : status.charAt(0).toUpperCase() + status.slice(1)}{' '}
            ({statusCounts[status] ?? 0})
          </button>
        ))}
      </div>

      {/* Search input */}
      <input
        type="text"
        placeholder="Search by name or email..."
        className="px-4 py-2 border border-gray-300 rounded dark:bg-slate-800 dark:text-white"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value.toLowerCase())}
      />

      {/* Date range */}
      <label className="text-sm text-slate-700 dark:text-white">
        From:
        <input
          type="date"
          className="ml-2 px-2 py-1 border border-gray-300 rounded dark:bg-slate-800 dark:text-white"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
      </label>
      <label className="text-sm text-slate-700 dark:text-white">
        To:
        <input
          type="date"
          className="ml-2 px-2 py-1 border border-gray-300 rounded dark:bg-slate-800 dark:text-white"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </label>

      {/* Project Type */}
      <label className="text-sm text-slate-700 dark:text-white">
        Project Type:
        <select
          className="ml-2 px-2 py-1 border border-gray-300 rounded dark:bg-slate-800 dark:text-white"
          value={selectedProjectType}
          onChange={(e) => setSelectedProjectType(e.target.value)}
        >
          <option value="all">All</option>
          {allProjectTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
};

export default FilterBar;
