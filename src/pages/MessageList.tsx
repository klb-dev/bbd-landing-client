import MessageCard from './MessageCard';
import type { Message } from '@shared/dataTypes';

type MessageListProps = {
  messages: Message[];
  selectedIds: string[];
  replyToggles: { [id: string]: boolean };
  replyContent: { [id: string]: string };
  onSelect: (id: string, checked: boolean) => void;
  onReplyToggle: (id: string) => void;
  onReplyChange: (id: string, value: string) => void;
  onSendReply: (msg: Message, replyText: string) => void;
  onDelete: (id: string) => void;
  onArchive: (id: string) => void;
  onRestore: (id: string) => void;
};

const MessageList = ({
  messages,
  selectedIds,
  replyToggles,
  replyContent,
  onSelect,
  onReplyToggle,
  onReplyChange,
  onSendReply,
  onDelete,
  onArchive,
  onRestore,
}: MessageListProps) => {
  if (messages.length === 0) {
    return (
      <p className="text-gray-600 dark:text-gray-400">
        No messages in this status.
      </p>
    );
  }

  return (
    <ul className="space-y-4">
      {messages.map((msg) => (
        <MessageCard
          key={msg.id}
          msg={msg}
          isSelected={selectedIds.includes(msg.id)}
          onSelect={(checked) => onSelect(msg.id, checked)}
          onReplyToggle={() => onReplyToggle(msg.id)}
          isReplyOpen={!!replyToggles[msg.id]}
          replyContent={replyContent[msg.id] || ''}
          onReplyChange={(val) => onReplyChange(msg.id, val)}
          onSendReply={() => onSendReply(msg, replyContent[msg.id] || '')}
          onDelete={() => onDelete(msg.id)}
          onArchive={() => onArchive(msg.id)}
          onRestore={() => onRestore(msg.id)}
        />
      ))}
    </ul>
  );
};

export default MessageList;
