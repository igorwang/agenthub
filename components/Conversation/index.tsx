"use client";

import { FunctionTab } from "@/components/FunctionTab";
import { ConfigIcon } from "@/components/ui/icons";
import { useAgentByIdQuery } from "@/graphql/generated/types";
import { selectSelectedChatId } from "@/lib/features/chatListSlice";
import { Avatar, Button, Tab, Tabs, Tooltip } from "@nextui-org/react";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { useSelector } from "react-redux";
import MessageWindow from "./message-window";
import PromptInputWithFaq from "./prompt-input-with-faq";

export type BotDTO = {
  id: number;
  name: string;
  description: string;
  avatar: string;
};

export type ConversationProps = {
  className?: string;
  scrollShadowClassname?: string;
};

export const Conversation: React.FC<ConversationProps> = ({
  className,
  scrollShadowClassname,
}) => {
  const agent_id = useSelector(selectSelectedChatId);
  const router = useRouter();
  const pathname = usePathname();

  const { data, loading, error } = useAgentByIdQuery({
    variables: {
      id: agent_id,
    },
    skip: !agent_id,
  });

  const agent = {
    id: data?.agent_by_pk?.id,
    name: data?.agent_by_pk?.name,
    description: data?.agent_by_pk?.description,
    avatar: data?.agent_by_pk?.avatar,
  };

  const handleConfigCilck = () => {
    router.push(`${pathname}/settings`);
  };
  // const{data} = use
  const headerElement = (
    <div className="relative flex flex-wrap items-center justify-center gap-2 border-b-small border-divider py-1 px-2 sm:justify-between">
      <div className="flex flex-row items-center">
        <Avatar
          alt={agent.name}
          className="flex-shrink-0 "
          size="md"
          src={agent.avatar || ""}
        />
        <div className="pl-2">
          <div className="flex flex-row items-center ">
            <p className="text-3xl font-medium pr-2">{agent.name}</p>
            <Button
              isIconOnly={true}
              startContent={<ConfigIcon />}
              variant="light"
              onClick={handleConfigCilck}
            ></Button>
          </div>
          <Tooltip content={agent.description}>
            <p className="text-sm font-light overflow-hidden text-nowrap text-ellipsis max-w-sm">
              {agent.description}
            </p>
          </Tooltip>
        </div>
      </div>
      <Tabs className="justify-center" defaultSelectedKey="simple">
        <Tab key="simple" title="简洁" />
        <Tab key="technical" title="深入" />
        <Tab key="creative" title="创造" />
      </Tabs>
    </div>
  );

  return (
    <div className="flex flex-col h-full w-full max-w-full overflow-auto">
      {headerElement}
      <div className="flex flex-row flex-grow max-w-full overflow-auto">
        <div className="flex flex-grow flex-col pt-2 max-w-full overflow-auto">
          <MessageWindow />
          <div className="flex flex-col w-full max-w-full overflow-auto">
            <PromptInputWithFaq></PromptInputWithFaq>
            <p className="px-2 text-tiny text-default-400">
              AI can also make mistakes. Please verify important information.
            </p>
          </div>
        </div>
        <div className="hidden md:flex w-80 max-w-100 m-2 border-2 rounded-lg">
          <FunctionTab></FunctionTab>
        </div>
      </div>
    </div>
  );
};
