"use client";

import MessageWindow from "@/components/Conversation/message-window";
import PromptInputWithFaq from "@/components/Conversation/prompt-input-with-faq";
import { ConfigIcon } from "@/components/ui/icons";
import { RoleChip } from "@/components/ui/role-icons";
import {
  Message_Role_Enum,
  Role_Enum,
  useCreateNewMessageMutation,
  useGetAgentByIdQuery,
  useGetAgentUserRelationQuery,
} from "@/graphql/generated/types";
import { selectSelectedSessionId, selectSession } from "@/lib/features/chatListSlice";
import { AppDispatch } from "@/lib/store";
import { CHAT_MODE, MessageType, SourceType } from "@/types/chatTypes";
import { Avatar, Button, Tooltip } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

// Define the shape of our context
type ConversationContextType = {
  selectedSources: SourceType[];
  handleSelectedSource: (source: SourceType, selected: boolean) => void;
};

// Create the context
const ConversationContext = createContext<ConversationContextType | undefined>(undefined);

// Create a custom hook to use the context
export const useConversationContext = () => {
  const context = useContext(ConversationContext);
  if (context === undefined) {
    throw new Error("useConversationContext must be used within Conversation component");
  }
  return context;
};

export type Agent = {
  id: string;
  name: string;
  description?: string;
  avatar?: string;
  creator_id?: string;
  role?: string | Role_Enum;
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
  const searchParams = useSearchParams();
  const session = useSession();
  const dispatch: AppDispatch = useDispatch();
  const selectedSessionId = useSelector(selectSelectedSessionId);

  const [messageCount, setMessageCount] = useState<number>(0);
  const [isChating, setIsChating] = useState<boolean>(false);
  const [chatMode, setChatMode] = useState<string>(CHAT_MODE.simple.toString());
  const [selectedSources, setSelectedSources] = useState<SourceType[]>([]);

  // const selectedSessionId = searchParams.get("session_id");

  const [agent, setAgent] = useState<Agent>();
  const { data, loading, error } = useGetAgentByIdQuery({
    variables: {
      id: agentId,
    },
    skip: !agentId,
  });

  const relationQuery = useGetAgentUserRelationQuery({
    variables: {
      limit: 1,
      where: { user_id: { _eq: session.data?.user?.id }, agent_id: { _eq: agentId } },
      //  order_by: {}
    },
    skip: !agentId || !session.data?.user?.id,
  });

  const [createNewMessageMutation, { error: createError }] =
    useCreateNewMessageMutation();

  useEffect(() => {
    setIsChating(false);
    setSelectedSources([]);
  }, [selectedSessionId]);

  const handleMessageChange = useCallback((messages: MessageType[]) => {
    setMessageCount(messages.length);
  }, []);

  useEffect(() => {
    if (
      relationQuery.data &&
      relationQuery.data?.r_agent_user &&
      relationQuery.data?.r_agent_user[0]
    ) {
      setAgent((prev) => {
        if (!prev) return prev; // 如果 prev 是 undefined，则返回 undefined
        return { ...prev, role: relationQuery.data?.r_agent_user[0].role || "user" };
      });
    }
  }, [relationQuery]);

  useEffect(() => {
    if (data) {
      setAgent({
        id: data?.agent_by_pk?.id,
        name: data?.agent_by_pk?.name || "",
        description: data?.agent_by_pk?.description || "",
        avatar: data?.agent_by_pk?.avatar || "",
        creator_id: data?.agent_by_pk?.creator_id || "",
      });
    }
  }, [agentId, data]);

  const handleCreateNewMessage = (params: {
    id: string;
    query: string;
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
            id: params.id,
            query: params.query,
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

  const handleSelectedSource = (source: SourceType, selected: boolean) => {
    if (selected) {
      const hasThisSource = selectedSources.some((item) => item.fileId == source.fileId);
      if (!hasThisSource) {
        setSelectedSources((prev) => [...prev, source]);
      }
    } else {
      setSelectedSources((prev) => prev.filter((item) => item.fileId != source.fileId));
    }
  };

  if (!agent || loading) {
    return <div>Loading...</div>;
  }

  const headerElement = (
    <div className="relative flex flex-wrap items-center justify-center gap-2 border-b-small border-divider px-2 py-1 sm:justify-between">
      <div className="flex flex-row items-center">
        {agent.avatar ? (
          <Avatar
            alt={agent.name}
            className="flex-shrink-0"
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
          <div className="flex flex-row items-center">
            <p className="pr-2 text-3xl font-medium">{agent.name}</p>
            {agent.creator_id === session.data?.user?.id && (
              <Tooltip content="Configure Agent">
                <Button
                  isIconOnly={true}
                  startContent={<ConfigIcon size={28} />}
                  variant="light"
                  onClick={handleConfigCilck}></Button>
              </Tooltip>
            )}
          </div>
          <div className="flex flex-row items-center gap-2">
            {agent.role && <RoleChip role={agent.role || "user"} />}

            <Tooltip content={agent.description}>
              <p className="max-w-sm overflow-hidden text-ellipsis text-nowrap text-sm font-light">
                {agent.description}
              </p>
            </Tooltip>
          </div>
        </div>
      </div>
    </div>
  );

  const contextValue: ConversationContextType = {
    selectedSources,
    handleSelectedSource,
  };

  return (
    <ConversationContext.Provider value={contextValue}>
      <div className="flex h-full w-full max-w-full flex-col overflow-auto">
        {headerElement}
        <div className="flex max-h-full max-w-full flex-grow flex-row overflow-auto">
          <div className="min-[400px] mx-auto flex max-w-7xl flex-grow flex-col items-center overflow-auto pt-4">
            <MessageWindow
              isChating={isChating}
              selectedSources={selectedSources}
              handleChatingStatus={setIsChating}
              handleCreateNewMessage={handleCreateNewMessage}
              onSelectedSource={handleSelectedSource}
              onMessageChange={handleMessageChange}
            />
            <div className="flex w-full max-w-full flex-col">
              {messageCount >= 20 && (
                <div className="mx-6 flex max-w-full items-center justify-between rounded-lg bg-sky-100 px-6 py-3 shadow-sm">
                  <div className="flex flex-1 items-center">
                    <span className="mr-2 font-semibold text-sky-700">Tip:</span>
                    <span className="text-sky-800">
                      Long chats may affect the AI performance.
                    </span>
                  </div>
                  <Button
                    color="primary"
                    variant="flat"
                    size="sm"
                    className="ml-2"
                    onClick={() => {
                      dispatch(selectSession(null));
                    }}>
                    Start a new chat
                  </Button>
                </div>
              )}

              <PromptInputWithFaq
                isChating={isChating}
                selectedSources={selectedSources}
                onSelectedSource={handleSelectedSource}
                onChatingStatus={setIsChating}></PromptInputWithFaq>
              <p className="px-2 text-tiny text-default-400">
                AI can also make mistakes. Please verify important information.
              </p>
            </div>
          </div>
          {/* <div className="max-w-100 m-2 hidden w-80 rounded-lg border-2 md:flex">
          <FunctionTab agentId={agentId}></FunctionTab>
        </div> */}
        </div>
      </div>
    </ConversationContext.Provider>
  );
};
