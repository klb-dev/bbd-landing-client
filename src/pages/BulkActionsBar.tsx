type BulkActionsBarProps = {
  selectedCount: number;
  onDeleteSelected: () => void;
  onExport: () => void;
};

const BulkActionsBar = ({ selectedCount, onDeleteSelected, onExport }: BulkActionsBarProps) => {
  return (
    <div className="mx-6 mb-4 flex flex-wrap gap-4 items-center">
      {selectedCount > 0 && (
        <button
          onClick={onDeleteSelected}
          className="bg-red-600 text-white px-4 py-2 rounded shadow hover:bg-red-500"
        >
          Delete Selected ({selectedCount})
        </button>
      )}
      <button
        onClick={onExport}
        className="bg-indigo-600 text-white px-4 py-2 rounded shadow hover:bg-indigo-500"
      >
        Export as CSV
      </button>
    </div>
  );
};

export default BulkActionsBar;
