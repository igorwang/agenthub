"use client";

import MessageWindow from "@/components/Conversation/message-window";
import MessageWindowWithWorkflow from "@/components/Conversation/message-windown-with-workflow";
import PromptInputWithFaq from "@/components/Conversation/prompt-input-with-faq";
import { ConfigIcon } from "@/components/ui/icons";
import { RoleChip } from "@/components/ui/role-icons";
import {
  Agent_Mode_Enum,
  Message_Role_Enum,
  Message_Status_Enum,
  Role_Enum,
  useCreateNewMessageMutation,
  useGetAgentByIdQuery,
  useGetAgentUserRelationQuery,
} from "@/graphql/generated/types";
import {
  selectIsChangeSession,
  selectSelectedSessionId,
  selectSession,
  setIsChangeSession,
} from "@/lib/features/chatListSlice";
import { AppDispatch } from "@/lib/store";
import { CHAT_STATUS_ENUM, MessageType, SourceType } from "@/types/chatTypes";
import { Icon } from "@iconify/react";
import { Avatar, Button, Chip, ScrollShadow, Spacer, Tooltip } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import FileIcon from "../ui/file-icons";

// Define the shape of our context
type ConversationContextType = {
  chatStatus: CHAT_STATUS_ENUM | null;
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
  workflow_id?: string | null;
  mode?: Agent_Mode_Enum | null;
};

export type ConversationProps = {
  agentId: string;
  sessionId?: string;
  className?: string;
  scrollShadowClassname?: string;
  hiddenHeader?: boolean;
  isTestMode?: boolean;
};

export const Conversation: React.FC<ConversationProps> = ({
  agentId,
  sessionId,
  className,
  hiddenHeader = false,
  isTestMode = false,
  scrollShadowClassname,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations();

  const session = useSession();
  const dispatch: AppDispatch = useDispatch();
  const selectedSessionId = useSelector(selectSelectedSessionId);
  const isChangeSession = useSelector(selectIsChangeSession);
  const userId = session.data?.user?.id;
  const [messageCount, setMessageCount] = useState<number>(0);
  const [isChating, setIsChating] = useState<boolean>(false);
  const [selectedSources, setSelectedSources] = useState<SourceType[]>([]);
  const [chatStatus, setChatStatus] = useState<CHAT_STATUS_ENUM | null>(null);

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
    },
    skip: !agentId || !session.data?.user?.id,
  });

  const [createNewMessageMutation, { error: createError }] =
    useCreateNewMessageMutation();

  useEffect(() => {
    setSelectedSources([]);
    if (isChangeSession) {
      setIsChating(false);
      dispatch(setIsChangeSession(false));
    }
  }, [pathname, router, selectedSessionId, isChangeSession, dispatch]);

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
        workflow_id: data?.agent_by_pk?.workflow?.id || null,
        mode: data?.agent_by_pk?.mode || null,
      });
    }
  }, [agentId, data]);

  const handleCreateNewMessage = (params: {
    id: string;
    query: string;
    content: string;
    session_id: string;
    role: Message_Role_Enum;
    status?: Message_Status_Enum;
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
            status: params.status,
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

  const handleSetChatStatus = (
    isChating: boolean,
    chatStatus: CHAT_STATUS_ENUM | null,
  ) => {
    setIsChating(isChating);
    setChatStatus(chatStatus);
  };

  if (!agent || loading) {
    return <div>{t("Loading...")}</div>;
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
              <Tooltip content={t("Configure Agent")}>
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
      {agent.mode === Agent_Mode_Enum.Workflow &&
        agent.workflow_id &&
        agent.creator_id == userId && (
          <div className="inline-block rounded-md px-2 py-1">
            <Chip color="primary" variant="flat">
              workflow
            </Chip>
          </div>
        )}
    </div>
  );

  const contextValue: ConversationContextType = {
    chatStatus,
    selectedSources,
    handleSelectedSource,
  };

  return (
    <ConversationContext.Provider value={contextValue}>
      <div className="flex h-full w-full max-w-full flex-col overflow-auto">
        {!hiddenHeader && headerElement}
        <div className="flex max-h-full max-w-full flex-grow flex-row overflow-auto">
          <div className="min-[400px] mx-auto flex max-w-7xl flex-grow flex-col items-center overflow-auto pt-4">
            {agent.mode === Agent_Mode_Enum.Workflow && agent.workflow_id ? (
              <MessageWindowWithWorkflow
                workflow_id={agent.workflow_id}
                isChating={isChating}
                chatStatus={chatStatus}
                selectedSources={selectedSources}
                isTestMode={isTestMode}
                onChatingStatusChange={handleSetChatStatus}
                handleCreateNewMessage={handleCreateNewMessage}
                onSelectedSource={handleSelectedSource}
                onMessageChange={handleMessageChange}
              />
            ) : (
              <MessageWindow
                isChating={isChating}
                chatStatus={chatStatus}
                selectedSources={selectedSources}
                onChatingStatusChange={handleSetChatStatus}
                handleCreateNewMessage={handleCreateNewMessage}
                onSelectedSource={handleSelectedSource}
                onMessageChange={handleMessageChange}
              />
            )}
            <div className="max-w-[calc(100%-40px)]">
              <ScrollShadow
                hideScrollBar
                className="flex max-w-full flex-nowrap gap-2 overflow-auto"
                orientation="horizontal">
                <div className="flex gap-2 pb-2">
                  {selectedSources?.map((item, index) => (
                    <Tooltip key={index} content={item.fileName}>
                      <div className="flex items-center gap-2 rounded-full bg-default-100 px-3 py-2 transition-colors hover:bg-default-200">
                        <FileIcon fileExtension={item.ext || "Unknow"} />
                        <p className="max-w-[200px] overflow-hidden text-ellipsis text-nowrap scrollbar-none">
                          {item.fileName}
                        </p>
                        <Icon
                          icon="clarity:remove-line"
                          onClick={() => handleSelectedSource?.(item, false)}
                          className="cursor-pointer text-default-500 hover:text-default-700"
                          fontSize={20}
                        />
                      </div>
                    </Tooltip>
                  ))}
                </div>
              </ScrollShadow>
            </div>
            <div className="flex w-full max-w-full flex-col">
              {(messageCount >= 20 || isTestMode) && (
                <div className="mx-6 flex max-w-full items-center justify-between rounded-lg bg-sky-100 px-6 py-3 shadow-sm">
                  <div className="flex flex-1 items-center">
                    <span className="mr-2 font-semibold text-sky-700">Tip:</span>
                    <span className="text-sky-800">
                      {isTestMode ? (
                        <div className="">
                          You are test in a{" "}
                          <strong className="font-bold text-gray-700">
                            {agent.mode || "simple"}
                          </strong>{" "}
                          agent mode.
                        </div>
                      ) : (
                        t("Long chats may affect the AI performance")
                      )}
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
                    {t("Start a new chat")}
                  </Button>
                </div>
              )}
              <Spacer />
              <PromptInputWithFaq
                isChating={isChating}
                selectedSources={selectedSources}
                onSelectedSource={handleSelectedSource}
                onChatingStatus={handleSetChatStatus}></PromptInputWithFaq>
              <p className="px-2 text-tiny text-default-400">
                {t("AI can also make mistakes. Please verify important information.")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </ConversationContext.Provider>
  );
};
