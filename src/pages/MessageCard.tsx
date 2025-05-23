import type { Message } from './data/dataTypes'; // or wherever your types.ts is located



type MessageCardProps = {
  msg: Message;
  isSelected: boolean;
  onSelect: (checked: boolean) => void;
  onReplyToggle: () => void;
  isReplyOpen: boolean;
  replyContent: string;
  onReplyChange: (value: string) => void;
  onSendReply: () => void;
  onDelete: () => void;
  onArchive: () => void;
  onRestore?: () => void;
  onUpdateStatus: (id: string, status: string) => void;
};

const MessageCard = ({
  msg,
  isSelected,
  onSelect,
  onReplyToggle,
  isReplyOpen,
  replyContent,
  onReplyChange,
  onSendReply,
  onDelete,
  onArchive,
  onRestore,
  onUpdateStatus,
}: MessageCardProps) => {
  return (
    <li className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => onSelect(e.target.checked)}
          />
          <p className="text-sm text-gray-500 dark:text-gray-300">
            <strong>{msg.name}</strong> ({msg.email}) – <em>{msg.status ?? 'new'}</em>
            {msg.reply && (
              <span className="ml-2 text-green-600 dark:text-green-400 text-xs font-semibold">
                Replied
              </span>
            )}
          </p>
        </div>

        <div className="relative group">
          <button className="bg-slate-600 text-white px-3 py-1 rounded text-sm hover:bg-slate-700">
            ⋮
          </button>
          <div className="absolute right-0 mt-1 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
            {msg.status === 'deleted' ? (
              <button
                onClick={onRestore}
                className="block w-full px-4 py-2 text-left text-sm text-green-600 hover:bg-green-100 dark:hover:bg-green-900"
              >
                Restore
              </button>
            ) : (
              <>
                <button
                  onClick={() => onUpdateStatus(msg.id, 'considering')}
                  className="block w-full px-4 py-2 text-left text-sm text-yellow-800 hover:bg-yellow-300"
                >
                  Considering
                </button>
                <button
                  onClick={() => onUpdateStatus(msg.id, 'inprogress')}
                  className="block w-full px-4 py-2 text-left text-sm text-blue-800 hover:bg-blue-300"
                >
                  In Progress
                </button>
                <button
                  onClick={() => onUpdateStatus(msg.id, 'completed')}
                  className="block w-full px-4 py-2 text-left text-sm text-green-800 hover:bg-green-300"
                >
                  Completed
                </button>
                <button
                  onClick={onArchive}
                  className="block w-full px-4 py-2 text-left text-sm text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-slate-700"
                >
                  Archive
                </button>
                <button
                  onClick={onDelete}
                  className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-100 dark:hover:bg-red-900"
                >
                  Delete
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <p className="mt-2 text-slate-800 dark:text-white">{msg.message}</p>
      <div className="mt-2 text-sm text-gray-600 dark:text-gray-300 space-y-1">
        {msg.phone && <p><strong>Phone:</strong> {msg.phone}</p>}
        {msg.projectType && <p><strong>Project Type:</strong> {msg.projectType}</p>}
        {msg.budget && <p><strong>Budget:</strong> {msg.budget}</p>}
        {msg.timeframe && <p><strong>Timeframe:</strong> {msg.timeframe}</p>}
      </div>
      <p className="mt-1 text-xs text-gray-400">
        {msg.createdAt?.toDate?.().toLocaleString() ?? 'No timestamp'}
      </p>

      <button
        onClick={onReplyToggle}
        className="mt-3 text-sm text-blue-500 hover:underline"
      >
        {isReplyOpen ? 'Cancel Reply' : 'Reply'}
      </button>

      {isReplyOpen && (
        <div className="mt-2">
          <textarea
            className="w-full p-2 border border-gray-300 rounded dark:bg-slate-700 dark:text-white"
            rows={3}
            placeholder="Type your reply..."
            value={replyContent}
            onChange={(e) => onReplyChange(e.target.value)}
          />
          <button
            onClick={onSendReply}
            className="mt-2 bg-blue-600 text-white px-4 py-2 rounded"
          >
            Send Reply
          </button>
        </div>
      )}
    </li>
  );
};

export default MessageCard;
