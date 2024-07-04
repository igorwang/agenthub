import { MessageCard } from "@/components/AISearch/message-card";
import { CHAT_STATUS_ENUM, MessageType } from "@/types/chatTypes";
import { ScrollShadow } from "@nextui-org/react";
import React, { useEffect, useRef } from "react";

interface MessagePanelProps {
  isChating: boolean;
  chatStatus: CHAT_STATUS_ENUM | null;
  messages: MessageType[];
  handleStartNewQuery: (query: string) => void;
}

export const MessagePanel: React.FC<MessagePanelProps> = ({
  messages,
  isChating,
  chatStatus,
  handleStartNewQuery,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [isChating, messages]);

  return (
    <ScrollShadow ref={scrollRef} className="h-full" hideScrollBar={true}>
      {messages.map((item) => (
        <MessageCard
          key={item.id}
          message={item}
          isChating={isChating}
          chatStatus={chatStatus}
          handleStartNewQuery={handleStartNewQuery}></MessageCard>
      ))}
    </ScrollShadow>
  );
};
