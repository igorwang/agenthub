"use client";
import { ChatList } from "@/components/AgentHub/chat-list";
import { AppDispatch } from "@/lib/store";
import { Icon } from "@iconify/react";
import { Spacer, Tooltip } from "@nextui-org/react";
import { useDispatch } from "react-redux";
import SearchBar from "./searchbar";

import {
  Order_By,
  Role_Enum,
  useCreateOneAgentMutation,
  useDeleteAgentUserRelationMutation,
  useSubMyAgentListSubscription,
} from "@/graphql/generated/types";

import {
  selectChatList,
  selectSelectedChatId,
  setChatList,
} from "@/lib/features/chatListSlice";
import { GroupedChatListDTO } from "@/types/chatTypes";
import { useSession } from "next-auth/react";
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const ChatHub = () => {
  const router = useRouter();
  const searcParams = useSearchParams();
  const params = useParams();
  const pathname = usePathname();
  const session = useSession();
  const userRoles = session.data?.user?.roles;
  const isCreatorView =
    userRoles &&
    userRoles.some((role) =>
      [Role_Enum.Admin, Role_Enum.Creator].includes(role as Role_Enum),
    );
  const { id: chatId } = params;
  const dispatch: AppDispatch = useDispatch();
  const chatList = useSelector(selectChatList);
  const selectedChatId = useSelector(selectSelectedChatId);
  const [createAgentMutation] = useCreateOneAgentMutation();
  const [deleteAgentUserRelationMutation] = useDeleteAgentUserRelationMutation();
  const [chatListOpenStatus, setChatListOpenStatus] = useState<boolean>(
    searcParams.get("openStatus") === "1",
  );
  const { data: sessionData, status } = useSession();
  const userId = sessionData?.user?.id;

  const agentListQuery = useSubMyAgentListSubscription({
    variables: {
      limit: 50,
      order_by: [
        { agent: { agent_type: { order: Order_By.DescNullsLast } } },
        { updated_at: Order_By.DescNullsLast },
      ],
      where: {
        _or: [
          { user_id: { _eq: userId } },
          { agent: { agent_type: { name: { _eq: "system" } } } },
          // { agent: { agent_type: { creator_id: { _eq: userId } } } },
        ],
      },
    },
    skip: !userId,
  });
  const { data: agentListData, loading, error } = agentListQuery;

  useEffect(() => {
    if (agentListData) {
      // toast.info("You have new agent message", { position: "bottom-left" });
      const groupedChatList: GroupedChatListDTO[] = [];
      agentListData.r_agent_user.forEach((item) => {
        const agentType = item.agent?.agent_type;
        const group = groupedChatList.find((g) => g.name == agentType?.name);
        if (agentType && agentType.id && agentType?.name) {
          if (group) {
            group.agents.push({ ...item.agent });
          } else {
            groupedChatList.push({
              id: agentType.id,
              name: agentType?.name,
              agents: [{ ...item.agent }],
            });
          }
        }
      });
      dispatch(setChatList(groupedChatList));
      if (!chatId || chatId == "default") {
        const defaultChatId = agentListData.r_agent_user?.[0].agent?.id;
        router.push(`/chat/${defaultChatId}?openStatus=1`);
      }
    }
  }, [agentListData, dispatch]);

  const handleDeleteAgent = (agentId: string) => {
    deleteAgentUserRelationMutation({
      variables: {
        where: { _and: [{ agent_id: { _eq: agentId } }, { user_id: { _eq: userId } }] },
      },
    });
  };

  function createAgent() {
    createAgentMutation({
      variables: {
        object: { name: "New Agent", type_id: 2, creator_id: userId },
      },
    }).then((res) => {
      // agentListQuery.refetch();
      const newAgentId = res?.data?.insert_agent_one?.id;
      const path = `/chat/${newAgentId}/settings`;
      router.push(path);
    });
  }

  return (
    <div className="hidden h-full w-[260px] max-w-sm flex-col border-b-1 border-r-1 sm:flex">
      <div className="flex items-center justify-between px-2 pt-4 text-3xl font-semibold leading-7 text-default-foreground">
        <div>AgentHub</div>
        {isCreatorView && (
          <Tooltip content="Add new agent">
            <Icon
              className={"cursor-pointer pt-1"}
              onClick={() => createAgent()}
              icon="material-symbols-light:chat-add-on-outline"
              width={"1.2em"}
            />
          </Tooltip>
        )}
      </div>
      <Spacer y={4} />
      <SearchBar></SearchBar>
      <Spacer y={4} />
      <ChatList
        groupedChatList={chatList}
        chatListOpenStatus={chatListOpenStatus}
        setChatListOpenStatus={(stauts: boolean) => {
          setChatListOpenStatus(stauts);
        }}></ChatList>
    </div>
  );
};

export default ChatHub;
