"use client";
import React from "react";

import { Spacer } from "@nextui-org/react";
import SearchBar from "./searchbar";
import {
  GetAgentListByTypeDocument,
  useGetAgentListByTypeQuery,
  useGetAgentListByTypeSuspenseQuery,
} from "@/graphql/generated/types";
import { fetchData } from "@/lib/apolloRequest";
import { GroupedChatListDTO } from "@/types/chatTypes";
import { ChatList } from "@/components/AgentHub/chat-list";
import { AppDispatch } from "@/lib/store";
import { useDispatch, useSelector } from "react-redux";
import {
  selectChatList,
  selectSelectedChatId,
} from "@/lib/features/chatListSlice";
import { useQuery } from "@apollo/client";
import { GetAgentListByTypeQuery } from "../../graphql/generated/types";

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
