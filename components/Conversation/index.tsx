"use client";

import { cn } from "@/cn";
import { Avatar, ScrollShadow, Tab, Tabs } from "@nextui-org/react";
import React from "react";
import MessageWindow from "./message-window";

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
  return (
    <div className={cn("flex h-full w-full max-w-full flex-col", className)}>
      <div className="flex w-full flex-wrap items-center justify-center gap-2 border-b-small border-divider py-1 px-2 sm:justify-between">
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
      <div className="pt-2">
        <ScrollShadow
          className={cn("flex h-full flex-col", scrollShadowClassname)}
        >
          <MessageWindow></MessageWindow>
        </ScrollShadow>
      </div>
    </div>
  );
};
