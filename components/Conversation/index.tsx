"use client";

import { cn } from "@/cn";
import { Avatar, ScrollShadow, Tab, Tabs } from "@nextui-org/react";
import React from "react";
import MessageWindow from "./message-window";
import PromptInputWithFaq from "./prompt-input-with-faq";

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
  const headerElement = (
    <div className="relative flex flex-wrap items-center justify-center gap-2 border-b-small border-divider py-1 px-2 sm:justify-between">
      <div className="flex flex-row items-center">
        <Avatar
          alt={bot.name}
          className="flex-shrink-0 "
          size="md"
          src={bot.avatar}
        />
        <div className="pl-2">
          <p className="text-3xl font-medium">{bot.name}</p>
          <p className="text-sm font-light overflow-hidden text-nowrap text-ellipsis max-w-sm">
            {bot.description}
          </p>
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
    <div className="max-h-screen flex flex-col w-full">
      {headerElement}
      <div className="flex flex-row h-full overflow-y-auto">
        <div className="flex flex-col pt-2 flex-grow">
          <ScrollShadow className="flex flex-col gap-6 pb-8 overflow-auto">
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
        {/* <div className="w-52">right</div> */}
      </div>
    </div>
  );
};
