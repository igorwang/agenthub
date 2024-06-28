"use client";

import MessageWindow from "@/components/Conversation/message-window";
import PromptInputWithFaq from "@/components/Conversation/prompt-input-with-faq";
import FunctionTab from "@/components/FunctionTab";
import { ConfigIcon } from "@/components/ui/icons";
import {
  Message_Role_Enum,
  useCreateNewMessageMutation,
  useGetAgentByIdQuery,
} from "@/graphql/generated/types";
import { CHAT_MODE } from "@/types/chatTypes";
import { Avatar, Button, Tab, Tabs, Tooltip } from "@nextui-org/react";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

export type Agent = {
  id: string;
  name: string;
  description?: string;
  avatar?: string;
};

export type ConversationProps = {
  agentId: string;
  sessionId?: string;
  className?: string;
  scrollShadowClassname?: string;
};

export const Conversation: React.FC<ConversationProps> = ({
  agentId,
  sessionId,
  className,
  scrollShadowClassname,
}) => {
  const router = useRouter();
  const pathname = usePathname();

  const [isChating, setIsChating] = useState<boolean>(false);
  const [chatMode, setChatMode] = useState<string>(CHAT_MODE.simple.toString());

  const [agent, setAgent] = useState<Agent>();
  const { data, loading, error } = useGetAgentByIdQuery({
    variables: {
      id: agentId,
    },
    skip: !agentId,
  });

  const [createNewMessageMutation, { error: createError }] =
    useCreateNewMessageMutation();

  useEffect(() => {
    if (data) {
      setAgent({
        id: data?.agent_by_pk?.id,
        name: data?.agent_by_pk?.name || "",
        description: data?.agent_by_pk?.description || "",
        avatar: data?.agent_by_pk?.avatar || "",
      });
    }
  }, [agentId, data]);

  const handleCreateNewMessage = (params: {
    content: string;
    session_id: string;
    role: Message_Role_Enum;
    attachments?: any;
    sources?: any;
  }) => {
    try {
      createNewMessageMutation({
        variables: {
          object: {
            content: params.content,
            role: params.role,
            session_id: params.session_id,
            attachments: params.attachments,
            sources: params.sources,
          },
          session_id: params.session_id,
        },
      });
    } catch (error) {
      toast.error("Create message error");
    }
  };

  const handleConfigCilck = () => {
    router.push(`${pathname}/settings`);
  };

  if (!agent || loading) {
    return <div>Loading...</div>;
  }

  const headerElement = (
    <div className="relative flex flex-wrap items-center justify-center gap-2 border-b-small border-divider py-1 px-2 sm:justify-between">
      <div className="flex flex-row items-center">
        {agent.avatar ? (
          <Avatar
            alt={agent.name}
            className="flex-shrink-0 "
            size="md"
            src={agent.avatar || ""}
          />
        ) : (
          <Avatar
            alt={agent.name}
            className="flex-shrink-0 bg-blue-400"
            size="md"
            name={agent.name?.charAt(0) || "New Agent"}
            classNames={{ name: "text-xl" }}
          />
        )}
        <div className="pl-2">
          <div className="flex flex-row items-center ">
            <p className="text-3xl font-medium pr-2">{agent.name}</p>
            <Button
              isIconOnly={true}
              startContent={<ConfigIcon size={28} />}
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
      <Tabs
        className="justify-center"
        selectedKey={chatMode}
        onSelectionChange={(key) => setChatMode(key.toString())}
      >
        <Tab key={CHAT_MODE.simple.toString()} title="simple" />
        <Tab key={CHAT_MODE.deep.toString()} title="deep" />
        <Tab key={CHAT_MODE.creative.toString()} title="creative" />
      </Tabs>
    </div>
  );

  return (
    <div className="flex flex-col h-full w-full max-w-full overflow-auto">
      {headerElement}
      <div className="flex flex-row flex-grow max-w-full overflow-auto">
        <div className="flex flex-col flex-grow  pt-2 max-w-full overflow-auto items-end">
          <MessageWindow
            isChating={isChating}
            handleChatingStatus={setIsChating}
            handleCreateNewMessage={handleCreateNewMessage}
          />
          <div className="flex flex-col w-full max-w-full">
            <PromptInputWithFaq
              isChating={isChating}
              handleChatingStatus={setIsChating}
            ></PromptInputWithFaq>
            <p className="px-2 text-tiny text-default-400 ">
              AI can also make mistakes. Please verify important information.
            </p>
          </div>
        </div>
        <div className="hidden md:flex w-80 max-w-100 m-2 border-2 rounded-lg">
          <FunctionTab agentId={agentId}></FunctionTab>
        </div>
      </div>
    </div>
  );
};
