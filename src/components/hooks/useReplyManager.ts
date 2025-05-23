import { useState } from 'react';

const useReplyManager = () => {
  const [replyToggles, setReplyToggles] = useState<{ [id: string]: boolean }>({});
  const [replyContent, setReplyContent] = useState<{ [id: string]: string }>({});

  const toggleReply = (id: string) => {
    setReplyToggles((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const updateReply = (id: string, content: string) => {
    setReplyContent((prev) => ({ ...prev, [id]: content }));
  };

  const resetReply = (id: string) => {
    setReplyToggles((prev) => ({ ...prev, [id]: false }));
    setReplyContent((prev) => ({ ...prev, [id]: '' }));
  };

  return {
    replyToggles,
    replyContent,
    toggleReply,
    updateReply,
    resetReply,
  };
};

export default useReplyManager;
