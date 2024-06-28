"use client";
import { ChatList } from "@/components/AgentHub/chat-list";
import { AppDispatch } from "@/lib/store";
import { Button, Spacer, Tooltip } from "@nextui-org/react";
import { useDispatch } from "react-redux";
import SearchBar from "./searchbar";
import { Icon } from "@iconify/react";

import { useCreateOneAgentMutation, useGetAgentListByTypeQuery } from "@/graphql/generated/types";
import {
  selectChatList,
  selectSelectedChatId,
  setChatList,
} from "@/lib/features/chatListSlice";
import { GroupedChatListDTO } from "@/types/chatTypes";
import { useSession } from "next-auth/react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSelector } from "react-redux";

const ChatHub = () => {
  const dispatch: AppDispatch = useDispatch();
  const chatList = useSelector(selectChatList);
  const selectedChatId = useSelector(selectSelectedChatId);
  const [createAgentMutation] = useCreateOneAgentMutation();

  const router = useRouter();
  const params = useParams();
  const pathname = usePathname();

  const { id: chatId } = params;

  const { data: sessionData, status } = useSession();
  const userId = sessionData?.user?.id;
  const agentListQuery = useGetAgentListByTypeQuery({
    variables: {
      user_id: userId,
    },
    skip: !userId,
  });
  const data = agentListQuery.data;

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
  }, [data, dispatch]);

  function createAgent() {
    createAgentMutation({
      variables: {
        object: { name: "New Agent", type_id: 2, creator_id: userId },
      },
    }).then(res => {
      agentListQuery.refetch();
      const newAgentId = res?.data?.insert_agent_one?.id;
      const path = `/chat/${newAgentId}/settings`;
      router.push(path);
    });
  }

  return (
    <div className="hidden sm:flex h-full min-w-[200px]  flex-col border-r-1 border-b-1">
      <div className="flex justify-between items-center text-3xl font-semibold leading-7 text-default-foreground px-2 pt-4">
        <div>AgentHub</div>
        <Tooltip content="Add new agent">
          <Icon
            className={"cursor-pointer"}
            onClick={() => createAgent()}
            icon="material-symbols-light:chat-add-on-outline"
            width={"1.2em"}
          />
        </Tooltip>
      </div>
      <Spacer y={4} />
      <SearchBar></SearchBar>
      <Spacer y={4} />
      <ChatList groupedChatList={chatList}></ChatList>
    </div>
  );
};

export default ChatHub;
