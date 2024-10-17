"use client";

import MessageWindow from "@/components/Conversation/message-window";
import MessageWindowWithWorkflow from "@/components/Conversation/message-windown-with-workflow";
import PromptInputWithFaq from "@/components/Conversation/prompt-input-with-faq";
import PromptInputWithFaqV1 from "@/components/Conversation/prompt-input-with-faq-v1";
import SessionFilesHeader from "@/components/Conversation/session-files-header";
import { RoleChip } from "@/components/ui/role-icons";
import ShareLinkCard from "@/components/ui/share-link-card";
import {
  Agent_Mode_Enum,
  FilesListQuery,
  Message_Role_Enum,
  Message_Status_Enum,
  Message_Type_Enum,
  Order_By,
  Role_Enum,
  useCreateNewMessageMutation,
  useGetAgentByIdQuery,
  useGetAgentUserRelationQuery,
  useSubscriptionFilesListSubscription,
  WorkflowFragmentFragment,
} from "@/graphql/generated/types";
import {
  selectIsChangeSession,
  selectSelectedSessionId,
  selectSession,
  setIsAircraftOpen,
  setIsChangeSession,
  setSessionFiles,
} from "@/lib/features/chatListSlice";
import { AppDispatch } from "@/lib/store";
import { CHAT_STATUS_ENUM, MessageType, SourceType } from "@/types/chatTypes";
import { Icon } from "@iconify/react";
import {
  Avatar,
  Button,
  Chip,
  Popover,
  PopoverContent,
  ScrollShadow,
  Spacer,
  Tooltip,
} from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
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
  handleCreateNewMessage: (params: {
    id: string;
    query: string;
    content: string;
    session_id: string;
    role: Message_Role_Enum;
    status?: Message_Status_Enum;
    attachments?: any;
    sources?: any;
    message_type?: Message_Type_Enum;
    schema?: { [key: string]: any };
  }) => void;
  handleSetChatStatus: (isChating: boolean, chatStatus: CHAT_STATUS_ENUM | null) => void;
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
  default_model?: string | null;
};

export type ConversationProps = {
  agentId: string;
  sessionId?: string;
  className?: string;
  scrollShadowClassname?: string;
  hiddenHeader?: boolean;
  hiddenInput?: boolean;
  isTestMode?: boolean;
  isChatHubOpen?: boolean;
  isAircraftOpen?: boolean;
  onToggleChatHub?: (isOpen: boolean) => void;
};

export const Conversation: React.FC<ConversationProps> = ({
  agentId,
  sessionId,
  onToggleChatHub,
  isChatHubOpen,
  isAircraftOpen,
  className,
  hiddenHeader = false,
  isTestMode = false,
  hiddenInput = false,
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
  const [isConfigLoading, setIsConfigLoading] = useState(false);
  const [isDashboardLoading, setIsDashboardLoding] = useState(false);
  const [isShareLoading, setIsShareLoading] = useState(false);
  const [workflowTools, setWorkflowTools] = useState<WorkflowFragmentFragment[]>([]);
  const [selectedSources, setSelectedSources] = useState<SourceType[]>([]);
  const [chatStatus, setChatStatus] = useState<CHAT_STATUS_ENUM | null>(null);
  const [recentUsedTools, setRecentUsedTools] = useState<WorkflowFragmentFragment[]>([]);
  // const [sessionFiles, setSessionFiles] = useState<FilesListQuery["files"]>([]);
  const [shareLink, setShareLink] = useState<string | null>(null);
  const [isSharePopoverOpen, setIsSharePopoverOpen] = useState<boolean>(false);

  // const [sessionFilesContext, setSessionFilesContext] = useState("");

  const { data: sessionFilesData } = useSubscriptionFilesListSubscription({
    variables: {
      limit: 5,
      order_by: { created_at: Order_By.Desc },
      where: { session_id: { _eq: selectedSessionId } },
    },
    skip: !selectedSessionId,
  });

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

  const shareButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (sessionFilesData?.files) {
      // setSessionFiles(sessionFilesData?.files);

      // setSessionFilesContext(
      //   sessionFilesData.files
      //     .map((item, index) => `File-${index + 1}:${item.name}`)
      //     .join("\n"),
      // );
      dispatch(setSessionFiles(sessionFilesData.files));
    }
  }, [sessionFilesData]);

  useEffect(() => {
    setMessageCount(0);
    setSelectedSources([]);
    if (isChangeSession) {
      setIsChating(false);
      dispatch(setIsChangeSession(false));
      setSessionFiles([]);
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
        default_model: data?.agent_by_pk?.default_model || null,
      });
      setWorkflowTools(
        data?.agent_by_pk?.r_agent_workflows
          .map((item) => item.workflow)
          .filter(
            (workflow): workflow is WorkflowFragmentFragment =>
              workflow !== null && workflow !== undefined,
          ) || [],
      );
    }
  }, [agentId, data]);

  const handleCreateNewMessage = useCallback(
    async (params: {
      id: string;
      query: string;
      content: string;
      session_id: string;
      role: Message_Role_Enum;
      status?: Message_Status_Enum;
      attachments?: any;
      sources?: any;
      message_type?: Message_Type_Enum;
      schema?: { [key: string]: any };
    }) => {
      try {
        const result = await createNewMessageMutation({
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
              schema: params.schema,
              message_type: params.message_type,
            },
            session_id: params.session_id,
          },
        });
        console.log("createNewMessageMutation", result);
      } catch (error) {
        toast.error("Create message error");
      }
    },
    [],
  );

  const handleConfigClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();
      router.push(`${pathname}/settings?step=0`);
      setIsConfigLoading(true);
    },
    [router, pathname],
  );

  const handleToDashboard = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();
      router.push(`${pathname}/dashboard?agentName=${agent?.name || ""}`);
      setIsDashboardLoding(true);
    },
    [router, pathname, agent?.name],
  );

  const handleShareClick = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsShareLoading(true);
      try {
        const response = await fetch("/api/chat/agent/share", {
          method: "POST",
          body: JSON.stringify({
            agent_id: agentId,
            expires_at: 60 * 60 * 24,
          }),
        });
        const data = await response.json();
        setIsShareLoading(false);
        setShareLink(`${window.location.origin}/discover/share/${data.key}`);
        setIsSharePopoverOpen(true);
        toast.success("Share link created");
      } catch (error) {
        toast.error("Create share link error");
      }
      setIsShareLoading(false);
    },
    [agentId],
  );

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

  const handleSetChatStatus = useCallback(
    (isChating: boolean, chatStatus: CHAT_STATUS_ENUM | null) => {
      setIsChating(isChating);
      setChatStatus(chatStatus);
    },
    [],
  );

  const handleSessionFileChange = (files: FilesListQuery["files"]) => {
    setSessionFiles(files);
  };

  const handleRunWorkflowTool = (tool: WorkflowFragmentFragment) => {
    console.log(tool);
    setRecentUsedTools((prev) =>
      [tool, ...prev.filter((t) => t.id !== tool.id)].slice(0, 3),
    );
  };

  if (!agent || loading) {
    return <div>{t("Loading")}</div>;
  }

  const headerElement = (
    <div className="relative flex flex-wrap items-center justify-center gap-2 border-b-small border-divider px-2 py-1 sm:justify-between">
      <div className="flex flex-row items-center">
        {!isChatHubOpen && (
          <Button isIconOnly variant="light" onClick={() => onToggleChatHub?.(false)}>
            <Icon icon="ant-design:menu-unfold-outlined" fontSize={24} />
          </Button>
        )}
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
            {agent.mode === Agent_Mode_Enum.Workflow &&
              // agent.workflow_id &&
              agent.creator_id == userId && (
                <div className="inline-block rounded-md px-2 py-1">
                  <Chip color="primary" variant="flat">
                    workflow
                  </Chip>
                </div>
              )}
          </div>
          <div className="flex flex-row items-center gap-2">
            {agent.role && <RoleChip role={agent.role || "user"} />}
            <Tooltip content={agent.description} className="max-w-md">
              <p className="max-w-sm overflow-hidden text-ellipsis text-nowrap text-sm font-light">
                {agent.description}
              </p>
            </Tooltip>
          </div>
        </div>
      </div>
      <div className="flex gap-1">
        {agent.creator_id === session.data?.user?.id && (
          <>
            <Popover
              isOpen={isSharePopoverOpen}
              onOpenChange={(open) => setIsSharePopoverOpen(open)}
              triggerRef={shareButtonRef}>
              <Tooltip content={t("Share")}>
                <Button
                  ref={shareButtonRef}
                  isIconOnly
                  variant="light"
                  onClick={handleShareClick}
                  isLoading={isShareLoading}
                  disabled={isShareLoading}>
                  {!isShareLoading && <Icon icon="lucide:share" fontSize={24} />}
                </Button>
              </Tooltip>
              <PopoverContent>
                {shareLink && <ShareLinkCard shareLink={shareLink} />}
              </PopoverContent>
            </Popover>
            <Tooltip content={t("Configure Agent")}>
              <Button
                isIconOnly
                variant="light"
                onClick={handleConfigClick}
                isLoading={isConfigLoading}
                disabled={isConfigLoading || isDashboardLoading}>
                {!isConfigLoading && <Icon icon="lucide:settings" fontSize={24} />}
              </Button>
            </Tooltip>
            <Tooltip content={t("Agent Dashboard")}>
              <Button
                isIconOnly
                variant="light"
                onClick={handleToDashboard}
                isLoading={isDashboardLoading}
                disabled={isConfigLoading || isDashboardLoading}>
                {!isDashboardLoading && (
                  <Icon icon="lucide:layout-dashboard" fontSize={24} />
                )}
              </Button>
            </Tooltip>
          </>
        )}
        {!isAircraftOpen && (
          <Tooltip content={t("Aircraft")}>
            <Button
              isIconOnly
              variant="light"
              onClick={() => dispatch(setIsAircraftOpen(true))}>
              <Icon icon="mdi:canvas" fontSize={24} />
            </Button>
          </Tooltip>
        )}
      </div>
    </div>
  );

  const contextValue: ConversationContextType = {
    chatStatus,
    selectedSources,
    handleSelectedSource,
    handleCreateNewMessage,
    handleSetChatStatus,
  };

  return (
    <ConversationContext.Provider value={contextValue}>
      <div className="flex h-full w-full max-w-full flex-col">
        <div className="relative flex flex-col">{!hiddenHeader && headerElement}</div>
        <div className="custom-scrollbar relative flex min-h-fit justify-normal overflow-x-auto sm:justify-center">
          <SessionFilesHeader
            model={agent.default_model || ""}
            sessionId={selectedSessionId || ""}
            // files={sessionFiles}
            onFilesChange={handleSessionFileChange}
          />
        </div>
        <div className="flex max-h-full max-w-full flex-grow flex-row overflow-auto">
          <div className="min-[400px] mx-auto flex max-w-7xl flex-grow flex-col items-center overflow-auto px-2 pt-4 sm:px-6 md:px-8 lg:px-10">
            {agent.mode === Agent_Mode_Enum.Workflow ? (
              <MessageWindowWithWorkflow
                agentId={agentId}
                workflow_id={agent.workflow_id || ""}
                isTestMode={isTestMode}
                onMessageChange={handleMessageChange}
                handleCreateNewMessage={handleCreateNewMessage}
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
                className="custom-scrollbar flex max-w-full flex-nowrap gap-2 overflow-auto"
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
            <div className="flex max-w-[calc(100%-40px)] gap-2">
              {recentUsedTools.map((item, index) => (
                <Button
                  key={index}
                  size="sm"
                  onClick={() => handleRunWorkflowTool(item)}
                  startContent={
                    <Icon
                      icon={item.icon || "fluent:toolbox-24-regular"}
                      className="text-default-500"
                      width={18}
                    />
                  }
                  variant="flat">
                  {item.name}
                </Button>
              ))}
              {recentUsedTools.length > 0 && (
                <Button
                  isIconOnly
                  size="sm"
                  variant="flat"
                  startContent={
                    <Icon icon="ic:round-close" className="text-default-500" width={18} />
                  }
                  onClick={() => setRecentUsedTools([])}></Button>
              )}
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
              {!hiddenInput &&
                (agent.mode === Agent_Mode_Enum.Workflow ? (
                  <PromptInputWithFaqV1
                    model={agent.default_model || ""}
                    agentId={agentId}
                    agentMode={agent.mode || Agent_Mode_Enum.Simple}
                    workflowTools={workflowTools}
                    onRunWorkflowTool={handleRunWorkflowTool}
                  />
                ) : (
                  <PromptInputWithFaq
                    model={agent.default_model || ""}
                    agentId={agentId}
                    agentMode={agent.mode || Agent_Mode_Enum.Simple}
                    isChating={isChating}
                    onChatingStatus={handleSetChatStatus}
                    workflowTools={workflowTools}
                    onRunWorkflowTool={handleRunWorkflowTool}
                  />
                ))}
              <p className="px-2 text-tiny text-default-400">
                {t("AI can also make mistakes")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </ConversationContext.Provider>
  );
};
