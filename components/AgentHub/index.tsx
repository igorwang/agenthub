"use client";
import { ChatList } from "@/components/AgentHub/chat-list";
import { AppDispatch } from "@/lib/store";
import { Spacer } from "@nextui-org/react";
import { useDispatch } from "react-redux";
import SearchBar from "./searchbar";

import { useGetAgentListByTypeQuery } from "@/graphql/generated/types";
import {
  selectChatList,
  selectSelectedChatId,
  setChatList,
} from "@/lib/features/chatListSlice";
import { GroupedChatListDTO } from "@/types/chatTypes";
import { useSession } from "next-auth/react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useEffect, useId } from "react";
import { useSelector } from "react-redux";

const ChatHub = () => {
  const dispatch: AppDispatch = useDispatch();
  const chatList = useSelector(selectChatList);
  const selectedChatId = useSelector(selectSelectedChatId);

  const router = useRouter();
  const params = useParams();
  const pathname = usePathname();

  const { id: chatId } = params;

  const { data: sessionData, status } = useSession();
  const userId = sessionData?.user?.id;
  console.log(useId);
  const { data, loading, error } = useGetAgentListByTypeQuery({
    variables: {
      user_id: userId,
    },
    skip: !userId,
  });

  useEffect(() => {
    if (data) {
      const groupedChatList: GroupedChatListDTO[] = data.agent_type.map(
        (group) => ({
          id: group.id,
          name: group.name,
          agents: group.agents.map((agent) => ({
            id: agent.id,
            name: agent.name,
            description: agent.description,
            avatar: agent.avatar,
          })),
        }),
      );
      dispatch(setChatList(groupedChatList));
    }
  }, [data]);

  if (!data) {
    console.log("userId:", userId);
    console.log("chatId:", chatId);

    console.log("selectedChatId:", selectedChatId);
    console.log("selectedChatId:", error);
    console.log("error", error, data);
  }

  return (
    <div className="hidden sm:flex h-full min-w-[200px]  flex-col border-r-1 border-b-1">
      <div className="text-3xl font-semibold leading-7 text-default-foreground px-2 pt-4">
        AgentHub
      </div>
      <Spacer y={4} />
      <SearchBar></SearchBar>
      <Spacer y={4} />
      <ChatList groupedChatList={chatList}></ChatList>
    </div>
  );
};

export default ChatHub;
