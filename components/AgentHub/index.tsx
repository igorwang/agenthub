"use client";
import { ChatList } from "@/components/AgentHub/chat-list";
import { TopicHistory } from "@/components/TopicHistory";
import { AppDispatch } from "@/lib/store";
import { Icon } from "@iconify/react";
import { Button, Divider, ScrollShadow } from "@nextui-org/react";
import { useDispatch } from "react-redux";
import SearchBar from "./searchbar";

import {
  Order_By,
  Role_Enum,
  useCreateOneAgentMutation,
  useSubMyAgentListSubscription,
} from "@/graphql/generated/types";

import { selectChatList, setChatList } from "@/lib/features/chatListSlice";
import { GroupedChatListDTO } from "@/types/chatTypes";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

interface ChatHubProps {
  onToggleChatHub?: (isOpen: boolean) => void;
}

const ChatHub = ({ onToggleChatHub }: ChatHubProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams<{ id: string }>();
  const t = useTranslations("");
  const session = useSession();
  const userRoles = session.data?.user?.roles;
  const hasCreatorPermission = userRoles?.some((role) =>
    [Role_Enum.Admin, Role_Enum.Creator].includes(role as Role_Enum),
  );
  const dispatch: AppDispatch = useDispatch();
  const chatList = useSelector(selectChatList);
  const [isAddLoading, setIsAddLoading] = useState<boolean>(false);
  const [createAgentMutation] = useCreateOneAgentMutation();
  const [chatListOpenStatus, setChatListOpenStatus] = useState<boolean>(
    searchParams.get("openStatus") === "1",
  );
  const { data: sessionData } = useSession();
  const userId = sessionData?.user?.id;

  const { data: agentListData, loading } = useSubMyAgentListSubscription({
    variables: {
      limit: 50,
      order_by: [
        { agent: { agent_type: { order: Order_By.DescNullsLast } } },
        { updated_at: Order_By.DescNullsLast },
      ],
      where: {
        _or: [
          { user_id: { _eq: userId } },
          // { agent: { agent_type: { name: { _eq: "system" } } } },
        ],
      },
    },
    skip: !userId,
  });

  useEffect(() => {
    if (agentListData) {
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
              agents: [{ ...item.agent, role: item.role || "" }],
            });
          }
        }
      });

      dispatch(setChatList(groupedChatList));
      if (!params.id || params.id == "default") {
        if (agentListData.r_agent_user?.[0]?.agent?.id) {
          const defaultChatId = agentListData.r_agent_user?.[0].agent?.id;
          router.push(`/chat/${defaultChatId}?openStatus=1`);
        } else {
          router.push(`/chat/empty`);
        }
      }
    }
  }, [agentListData, dispatch]);

  const handleCreateAgent = async () => {
    setIsAddLoading(true);
    try {
      const res = await createAgentMutation({
        variables: {
          object: { name: "New Agent", type_id: 2, creator_id: userId },
        },
      });
      const newAgentId = res?.data?.insert_agent_one?.id;
      const path = `/chat/${newAgentId}/settings?step=0`;
      router.push(path);
    } catch (error) {
      console.error("Error creating agent:", error);
    } finally {
      setIsAddLoading(false);
    }
  };

  return (
    <div className="flex h-full w-full flex-col gap-y-2 border-r-1">
      <div className="z-10 flex items-center justify-between px-2 pt-4 text-xl font-semibold">
        <div>{process.env.APP_NAME || "AgentHub"}</div>
        <Button
          isIconOnly
          variant="light"
          onClick={() => onToggleChatHub?.(chatListOpenStatus)}>
          <Icon icon="ant-design:menu-fold-outlined" fontSize={24} />
        </Button>
      </div>
      {hasCreatorPermission && chatListOpenStatus && (
        <div className="px-2 py-1">
          <Button
            variant="light"
            color="primary"
            isLoading={isAddLoading}
            isDisabled={isAddLoading}
            startContent={<Icon icon="mdi:plus" className="text-lg" />}
            className="w-full rounded-lg py-4 text-sm font-medium transition-all hover:bg-primary-50 hover:text-primary-600"
            onClick={handleCreateAgent}>
            {t("New Agent")}
          </Button>
        </div>
      )}
      <SearchBar />
      <div className="h-full overflow-hidden">
        <ScrollShadow className="h-full w-full" hideScrollBar={true}>
          <ChatList
            groupedChatList={chatList}
            chatListOpenStatus={chatListOpenStatus}
            setChatListOpenStatus={setChatListOpenStatus}
          />
          {!chatListOpenStatus && (
            <>
              <Divider className="my-2" />
              <TopicHistory agent_id={params.id} />
            </>
          )}
        </ScrollShadow>
      </div>
    </div>
  );
};

export default ChatHub;
