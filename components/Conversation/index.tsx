"use client";

import { cn } from "@/cn";
import { Avatar, ScrollShadow, Tab, Tabs, Tooltip } from "@nextui-org/react";
import React from "react";
import MessageWindow from "./message-window";
import PromptInputWithFaq from "./prompt-input-with-faq";
import { selectSelectedChatId } from "@/lib/features/chatListSlice";
import { useSelector } from "react-redux";
import { useAgentByIdQuery } from "@/graphql/generated/types";
import { FunctionTab } from "@/components/FunctionTab";

export type BotDTO = {
  id: number;
  name: string;
  description: string;
  avatar: string;
};

export type ConversationProps = {
  bot: BotDTO;
  className?: string;
  scrollShadowClassname?: string;
};

export const Conversation: React.FC<ConversationProps> = ({
  bot,
  className,
  scrollShadowClassname,
}) => {
  const agent_id = useSelector(selectSelectedChatId);
  console.log(agent_id);

  const { data, loading, error } = useAgentByIdQuery({
    variables: {
      id: agent_id,
    },
  });
  console.log(data);

  const agent = {
    id: data?.agent_by_pk?.id,
    name: data?.agent_by_pk?.name,
    description: data?.agent_by_pk?.description,
    avatar: data?.agent_by_pk?.avatar,
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
          <p className="text-3xl font-medium">{agent.name}</p>
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
    <div className="flex flex-col h-full w-full">
      {headerElement}
      <div className="flex flex-row flex-grow w-full overflow-auto ">
        <div className="hidden md:flex w-80 m-2 min-w-60 border-2 rounded-lg">
          {/* <ScrollShadow className="flex flex-grow flex-col gap-6 pb-8 "> */}
            <FunctionTab></FunctionTab>
          {/* </ScrollShadow> */}
        </div>
        <div className="flex flex-grow flex-col pt-2 ">
          <ScrollShadow className="flex flex-grow flex-col gap-6 pb-8 ">
            <MessageWindow />
            <MessageWindow />
          </ScrollShadow>
          <div className="flex flex-col">
            <PromptInputWithFaq></PromptInputWithFaq>
            <p className="px-2 text-tiny text-default-400">
              AI can make mistakes. Consider checking important information.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
