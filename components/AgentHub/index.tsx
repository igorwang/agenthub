"use client";

import { ChatList } from "@/components/AgentHub/chat-list";
import { Spacer } from "@nextui-org/react";
import SearchBar from "./searchbar";

const ChatHub = () => {
  return (
    <div className="hidden sm:flex h-full min-w-40  flex-col border-r-1">
      <div className="text-3xl font-semibold leading-7 text-default-foreground px-2 pt-4">
        AgentHub
      </div>
      <Spacer y={4} />
      <SearchBar></SearchBar>
      <Spacer y={4} />
      <ChatList></ChatList>
    </div>
  );
};

export default ChatHub;
