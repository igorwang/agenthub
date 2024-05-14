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
    <div className="bg-slate-200  max-h-dvh">
      {headerElement}
      <div className="relative flex flex-col pt-2">
        <ScrollShadow className="flex max-h-[60vh] flex-col gap-6 overflow-y-auto pb-8">
          <MessageWindow />
          <MessageWindow />
        </ScrollShadow>
        {/* <div> */}
          {/* <PromptInputWithFaq></PromptInputWithFaq> */}
        {/* </div> */}
      </div>

      {/* <ScrollShadow className="max-h-dvh"> */}
      {/* <MessageWindow></MessageWindow> */}
      {/* </ScrollShadow> */}
    </div>
    // <div className={cn("flex w-full flex-col h-f", className)}>
    //   <div className="flex w-full flex-wrap items-center justify-center gap-2 border-b-small border-divider py-1 px-2 sm:justify-between">
    //     <div className="flex flex-row items-center">
    //       <Avatar
    //         alt={bot.name}
    //         className="flex-shrink-0 "
    //         size="md"
    //         src={bot.avatar}
    //       />
    //       <div className="pl-2">
    //         <p className="text-3xl font-medium">{bot.name}</p>
    //         <p className="text-sm font-light overflow-hidden text-nowrap text-ellipsis max-w-sm">
    //           {bot.description}
    //         </p>
    //       </div>
    //     </div>
    //     <Tabs className="justify-center" defaultSelectedKey="simple">
    //       <Tab key="simple" title="简洁" />
    //       <Tab key="technical" title="深入" />
    //       <Tab key="creative" title="创造" />
    //     </Tabs>
    //   </div>
    //   <div className="pt-2 ">
    //     <ScrollShadow
    //       className={cn("flex flex-col h-dvh")}
    //     >
    //       <MessageWindow></MessageWindow>
    //       {/* <div className="bg-yellow-100 h-60">Message</div> */}
    //     </ScrollShadow>
    //     <div className="h-7 bg-yellow-200">
    //       input
    //     </div>
    //   </div>
    // </div>
  );
};
