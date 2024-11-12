import {
  selectChatSessionContext,
  selectChatStatus,
  selectIsChangeSession,
  selectIsChating,
  selectSelectedSessionId,
  selectSelectedSources,
  selectSessionFiles,
  setChatSessionContext,
  setChatStatus,
  setCurrentAircraftId,
  setIsAircraftGenerating,
  setIsAircraftOpen,
  setIsChangeSession,
  setIsChating,
  setMessagesContext,
  setRefreshSession,
  setSelectedSources,
  setSessionFiles,
} from "@/lib/features/chatListSlice";
import { fetchEventSource } from "@microsoft/fetch-event-source";

import { AppDispatch } from "@/lib/store";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import FeatureCards from "@/components/Conversation/feature-cards";
import MessageCardV1 from "@/components/Conversation/message-card-v1";
import { PromptTemplateType } from "@/components/PromptFrom";
import {
  AgentFragmentFragment,
  Message_Role_Enum,
  Message_Status_Enum,
  Message_Type_Enum,
  Order_By,
  useCreateOneAircraftMutation,
  useFetchAllMessageListQuery,
  useGetAgentByIdQuery,
  useUpdateTopicHistoryByIdMutation,
} from "@/graphql/generated/types";
import { DEFAULT_LLM_MODEL, DEFAULT_TEMPLATES } from "@/lib/models";
import { createMessages } from "@/lib/prompts/createMessages";
import {
  AircraftModel,
  ChatFlowRequestSchema,
  ChatFlowResponseSchema,
} from "@/restful/generated";
import {
  CHAT_STATUS_ENUM,
  MessageType,
  SOURCE_TYPE_ENUM,
  SourceType,
} from "@/types/chatTypes";
import { mapChatMessagesToStoredMessages } from "@langchain/core/messages";
import { Avatar, ScrollShadow } from "@nextui-org/react";
import { useTranslations } from "next-intl";
import { v4 } from "uuid";
import AgentWorkflowResultsPane from "./agent-workflow-result-pane";

type MessageWindowProps = {
  agentId: string;
  workflow_id: string;
  isTestMode?: boolean;
  onMessageChange?: (messages: MessageType[]) => void;
  handleCreateNewMessage?: (params: {
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
    context?: string;
  }) => void;
};

export default function MessageWindowWithWorkflow({
  agentId,
  workflow_id,
  isTestMode = false,
  handleCreateNewMessage,
  onMessageChange,
}: MessageWindowProps) {
  const dispatch: AppDispatch = useDispatch();
  const t = useTranslations();
  const selectedSessionId = useSelector(selectSelectedSessionId);
  const isChating = useSelector(selectIsChating);
  const chatStatus = useSelector(selectChatStatus);

  const ref = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<MessageType[]>([]);

  const [agent, setAgent] = useState<AgentFragmentFragment>();
  const [workflowResults, setWorkflowResults] = useState<ChatFlowResponseSchema | null>(
    null,
  );
  const [promptTemplates, setPromptTemplates] = useState<PromptTemplateType[]>();

  const [updateTopicHistoryByIdMutation] = useUpdateTopicHistoryByIdMutation();

  const [createOneAircraftMutation] = useCreateOneAircraftMutation();

  const chatSessionContext = useSelector(selectChatSessionContext);
  const sessionFiles = useSelector(selectSessionFiles);
  const selectedSources = useSelector(selectSelectedSources);
  const isChangeSession = useSelector(selectIsChangeSession);
  const session = useSession();
  const user_id = session.data?.user?.id;
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isUserScrolling, setIsUserScrolling] = useState(false);

  const query = useFetchAllMessageListQuery({
    variables: {
      where: { session_id: { _eq: selectedSessionId } },
      order_by: { created_at: Order_By.AscNullsLast },
      limit: 100,
    },
    skip: !selectedSessionId, // Skip the query if session_id is not provided
  });

  const { data, loading, error } = query;

  const { data: agentData } = useGetAgentByIdQuery({
    variables: {
      id: agentId, // value for 'id'
    },
    skip: !agentId,
  });

  const handleCreateNewAircraft = useCallback(
    async (message_id: string, aircraft: AircraftModel) => {
      try {
        const response = await createOneAircraftMutation({
          variables: {
            object: {
              title: aircraft.title,
              description: aircraft.description,
              template: aircraft.template,
              commentary: aircraft.commentary,
              message_id: message_id,
              content: "",
            },
          },
        });
        dispatch(setIsAircraftOpen(true));
        dispatch(setCurrentAircraftId(response.data?.insert_aircraft_one?.id || null));
        dispatch(setIsAircraftGenerating(true));
      } catch (error) {
        console.error("Error while creating aircraft:", error);
        dispatch(setChatStatus(CHAT_STATUS_ENUM.Failed));
        dispatch(setIsChating(false));
      }
    },
    [createOneAircraftMutation],
  );

  const createMessagesContext = useCallback(async () => {
    const historyMessage = messages.filter((item) => item.status != "draft");
    const sessionFileContexts = sessionFiles
      ?.map((item) => {
        const content = `<File fileName=${item.name} fileId=${item.id} />`;
        return content;
      })
      .join("\n");
    const chatMessages = await createMessages(
      agent?.default_model || DEFAULT_LLM_MODEL,
      promptTemplates || DEFAULT_TEMPLATES,
      historyMessage,
      chatSessionContext?.sources || [],
      chatSessionContext?.context || "",
      `User uploaded files: <UserUploadedFiles>${sessionFileContexts}</UserUploadedFiles>`,
    );
    dispatch(setMessagesContext(mapChatMessagesToStoredMessages(chatMessages)));
  }, [agent, promptTemplates, messages, chatSessionContext]);

  // set agent
  useEffect(() => {
    if (agentData?.agent_by_pk) {
      setAgent(agentData.agent_by_pk);

      const templates = agentData.agent_by_pk?.system_prompt?.templates;
      if (templates) {
        setPromptTemplates(
          templates.map((item) => ({
            id: item.id,
            role: item.role,
            template: item.template,
            order: item.order || -1,
            status: "saved",
          })),
        );
      } else {
        setPromptTemplates(DEFAULT_TEMPLATES);
      }
    }
  }, [agentId, agentData]);

  // set messages
  useEffect(() => {
    if (data && data.message) {
      const newMessages = data.message.map((item) => ({
        id: item.id,
        role: item.role,
        message: item.content,
        status: item.status,
        feedback: item.feedback,
        files:
          item.attachments?.map((attachment: { fileName: string }, index: number) => ({
            key: index,
            fileName: attachment.fileName,
          })) || [],
        sources: item.sources?.map((item: SourceType) => ({
          ...item,
          contents: item?.contents,
        })),
        messageType: item.message_type || Message_Type_Enum.Text,
        schema: item.schema || {},
        imageUrls: item.imageUrls || [],
        aircraft: item.aircraft || null,
        context: item.context || "",
      }));

      if (data.message.length == 1 && selectedSessionId) {
        const newMessageContent = data.message[0].content || t("New Chat");
        const response = updateTopicHistoryByIdMutation({
          variables: {
            id: selectedSessionId,
            _set: { title: newMessageContent.slice(0, 50) },
          },
        });
        dispatch(setRefreshSession(true));
      }
      setMessages(newMessages);
    }
  }, [data]);

  // control session change
  useEffect(() => {
    if (!selectedSessionId || isChangeSession) {
      setWorkflowResults(null);
      dispatch(setIsChangeSession(false));
      dispatch(setSelectedSources([]));
      dispatch(setIsChating(false));
      dispatch(setCurrentAircraftId(null));
      dispatch(setIsAircraftGenerating(false));
      dispatch(setIsAircraftOpen(false));
    }

    if (!selectedSessionId) {
      setMessages([]);
      dispatch(setSessionFiles([]));
    }
    query.refetch();
  }, [selectedSessionId, isChangeSession]);

  // refetch message list
  useEffect(() => {
    if (chatStatus === CHAT_STATUS_ENUM.New) {
      query.refetch();
      dispatch(setChatStatus(CHAT_STATUS_ENUM.Analyzing));
    }
  }, [chatStatus]);

  // new chat message check
  useEffect(() => {
    if (
      chatStatus === CHAT_STATUS_ENUM.Analyzing &&
      messages.length > 0 &&
      messages[messages.length - 1].status != "draft"
    ) {
      const newMessageId = v4();
      setWorkflowResults(null);
      setIsUserScrolling(false);
      dispatch(setChatSessionContext(null));
      setMessages((prev) => [
        ...prev,
        {
          id: newMessageId,
          role: Message_Role_Enum.Assistant,
          message: "",
          // sources: searchResults,
          status: "draft",
          sessionId: selectedSessionId || "",
          // query: query,
        },
      ]);
    }
  }, [messages]);

  // chat interpret
  useEffect(() => {
    if (
      chatStatus == CHAT_STATUS_ENUM.Interpret &&
      messages.length > 0 &&
      messages[messages.length - 1].status == "draft"
    ) {
      const draftMessage = messages[messages.length - 1];
      if (draftMessage.message) {
        handleCreateNewMessage?.({
          ...draftMessage,
          query: messages[messages.length - 2].message || "",
          content: draftMessage.message || "",
          session_id: selectedSessionId || "",
          role: Message_Role_Enum.Assistant,
          status: Message_Status_Enum.Failed,
        });
        dispatch(setChatStatus(null));
        query.refetch();
      } else {
        setMessages((prev) => prev.filter((item) => item.status != "draft"));
      }
    }
  }, [chatStatus, isChating, messages]);

  // chat with workflow
  useEffect(() => {
    if (
      chatStatus === CHAT_STATUS_ENUM.Analyzing &&
      chatSessionContext === null &&
      messages.length > 0 &&
      messages[messages.length - 1].status === "draft"
    ) {
      dispatch(setChatStatus(CHAT_STATUS_ENUM.Searching));

      let controller = new AbortController();

      const fetchChatWithWorkflow = async () => {
        const body: ChatFlowRequestSchema = {
          agent_id: agentId || "",
          session_id: selectedSessionId || "",
          messages: messages.slice(0, -1).map((item) => ({
            role: item.role,
            content: item.message || "",
          })),
          workflow_id: workflow_id,
          session_file_ids: sessionFiles?.map((item) => item.id) || [],
          sources: selectedSources?.map((item) => ({
            title: item.title || item.fileName,
            url: item.url,
            content: item.content || item.contents.join("\n") || "",
            ext: item.ext,
            file_id: item.fileId,
            knowledge_base_id: item.knowledgeBaseId,
          })),
        };

        let streamData = {};

        await fetchEventSource("/api/workflow/stream", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
          signal: controller.signal,
          onmessage: (event) => {
            try {
              const data = JSON.parse(event.data);
              streamData = { ...streamData, ...data };
              console.log("Received", data);
            } catch (error) {
              console.error("Error parsing message:", error);
            }
          },
          onerror: (error) => {
            dispatch(setChatStatus(CHAT_STATUS_ENUM.Failed));
            dispatch(setChatSessionContext(null));
            dispatch(setIsChating(false));
            setMessages((prev) => [
              ...prev.slice(0, -1),
              {
                ...prev[prev.length - 1],
                message: t("Agent execution failed, please try again"),
                status: "failed",
              },
            ]);
            setWorkflowResults({
              error_message: `Workflow execution failed: ${error.statusText}`,
              workflow_output: {},
            });
            return;
          },
        });

        const workflowResults: ChatFlowResponseSchema =
          streamData as ChatFlowResponseSchema;
        const workflowOutput = workflowResults.workflow_output;
        setWorkflowResults(workflowResults);

        // Stop workflow
        if (workflowOutput?.type === "humanInLoopNode") {
          await handleCreateNewMessage?.({
            id: messages[messages.length - 1].id,
            query: "",
            content: workflowOutput.question || "",
            session_id: selectedSessionId || "",
            role: Message_Role_Enum.Assistant,
            sources: [],
            status: Message_Status_Enum.Waiting,
            message_type: (workflowOutput.response_format || "text") as Message_Type_Enum,
            schema: workflowOutput.schema || {},
          });
          dispatch(setChatSessionContext(null));
          dispatch(setChatStatus(null));
          query.refetch();
          return null;
        }

        const sources =
          workflowOutput.sources?.map((item) => ({
            fileName: item.title || "",
            fileId: item.file_id || "",
            url: item.url || "",
            pages: [],
            contents: item.content ? [item.content] : [],
            sourceType: SOURCE_TYPE_ENUM.file,
            knowledgeBaseId: item.knowledge_base_id || "",
            ext: item.ext || "Unknow",
          })) || [];

        const context = workflowOutput.context || "";
        const aircraft = workflowOutput.aircraft || {};
        dispatch(setChatSessionContext({ context, aircraft, sources }));
        dispatch(setChatStatus(CHAT_STATUS_ENUM.Generating));
      };
      fetchChatWithWorkflow();
    }
  }, [chatStatus, messages]);

  useEffect(() => {
    if (
      chatStatus == CHAT_STATUS_ENUM.Generating &&
      chatSessionContext != null &&
      messages.length > 0 &&
      messages[messages.length - 1].status === "draft"
    ) {
      const aircraft = chatSessionContext?.aircraft;
      if (aircraft && aircraft.action == "create") {
        handleCreateNewMessage?.({
          id: messages[messages.length - 1].id,
          query: "",
          content: aircraft.commentary || "",
          session_id: selectedSessionId || "",
          role: Message_Role_Enum.Assistant,
          sources: chatSessionContext?.sources || [],
          context: chatSessionContext?.context || "",
          status: Message_Status_Enum.Generating,
        });
        // create new aircraft
        handleCreateNewAircraft(messages[messages.length - 1].id, aircraft);
        createMessagesContext();
        query.refetch();
        return;
      }

      const controller = new AbortController(); // Create a new AbortController
      const signal = controller.signal; // Get the signal from the controller

      const generateAnswer = async () => {
        const historyMessage = messages.filter((item) => item.status != "draft");

        const sessionFileContexts = sessionFiles
          ?.map((item) => {
            const content = `<File fileName=${item.name} fileId=${item.id} />`;
            return content;
          })
          .join("\n");

        const chatMessages = await createMessages(
          agent?.default_model || DEFAULT_LLM_MODEL,
          promptTemplates || DEFAULT_TEMPLATES,
          historyMessage,
          chatSessionContext?.sources || [],
          chatSessionContext?.context || "",
          `User uploaded files: <UserUploadedFiles>${sessionFileContexts}</UserUploadedFiles>`,
        );

        let answer = "";

        try {
          const response = await fetch("/api/v1/chat", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: agent?.default_model || DEFAULT_LLM_MODEL,
              messages: chatMessages.map((message) => message.toJSON()),
            }),
            signal: signal,
          });

          if (!response.body) {
            throw new Error("ReadableStream not supported by the browser.");
          }

          const reader = response.body.getReader();
          const decoder = new TextDecoder();
          // Function to read the stream
          const readStream = async () => {
            const { done, value } = await reader.read();
            if (done) {
              setMessages((prev) => {
                if (prev.length == 1) {
                  return [
                    {
                      ...prev[0],
                      message: prev[0].message,
                      sources: chatSessionContext?.sources || [],
                      context: chatSessionContext?.context || "",
                      status: Message_Status_Enum.Success,
                    },
                  ];
                }
                const draftMessage = prev[prev.length - 1];
                return [
                  ...prev.slice(0, -1),
                  {
                    ...draftMessage,
                    status: Message_Status_Enum.Success,
                    sources: chatSessionContext?.sources || [],
                    context: chatSessionContext?.context || "",
                  },
                ];
              });
              return;
            }
            const chunk = decoder.decode(value, { stream: true });
            answer += chunk;
            setMessages((prev) => {
              if (prev.length == 1) {
                return [{ ...prev[0], message: prev[0].message + chunk }];
              }
              const draftMessage = prev[prev.length - 1];
              return [
                ...prev.slice(0, -1),
                { ...draftMessage, message: draftMessage.message + chunk },
              ];
            });

            await readStream();
          };
          await readStream();
        } catch (error) {
          console.error("Error while streaming:", error);
          return;
        }
        // save results
        handleCreateNewMessage?.({
          id: messages[messages.length - 1].id,
          query: historyMessage[historyMessage.length - 1].message || "",
          content: answer,
          session_id: selectedSessionId || "",
          role: Message_Role_Enum.Assistant,
          sources: chatSessionContext?.sources || [],
          status: Message_Status_Enum.Success,
          context: chatSessionContext?.context || "",
        });
        dispatch(setChatStatus(CHAT_STATUS_ENUM.Finished));
        dispatch(setIsChating(false));
      };
      generateAnswer();
      return () => {
        controller.abort(); // Abort the fetch when the component unmounts or dependencies change
        return;
      };
    }
  }, [chatSessionContext, chatStatus]);

  useEffect(() => {
    const scrollElement = scrollRef.current;
    if (!scrollElement) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = scrollElement;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10; // 10px threshold
      setIsUserScrolling(!isAtBottom);
    };

    scrollElement.addEventListener("scroll", handleScroll);

    return () => {
      scrollElement.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (scrollRef.current && !isUserScrolling) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, chatStatus, isChating, isUserScrolling]);

  const agentAvatarElement =
    agent && agent?.avatar ? (
      <Avatar size="md" src={agent.avatar} />
    ) : (
      <Avatar
        className="flex-shrink-0 bg-blue-400"
        size="md"
        name={agent && agent.name?.charAt(0)}
        classNames={{ name: "text-xl" }}
      />
    );

  const featureContent = (
    <div className="flex h-full flex-col justify-center">
      <div className="flex w-full flex-col items-center justify-center gap-10">
        {agentAvatarElement}
        <h1 className="text-xl font-medium text-default-700">
          {t("How can I help you today")}?
        </h1>
        <FeatureCards />
      </div>
    </div>
  );

  return (
    <ScrollShadow
      ref={scrollRef}
      className="flex w-full flex-grow flex-col gap-2 pb-2"
      hideScrollBar={true}>
      <div className="flex flex-1 flex-grow flex-col gap-1 px-1" ref={ref}>
        {messages.length === 0 && featureContent}
        {messages.map((message) => (
          <MessageCardV1
            key={message.id}
            message={message}
            workflow_id={workflow_id}
            chatingMessageId={message.status === "draft" ? message.id : null}
            avatar={
              message.role === "assistant" ? (
                agentAvatarElement
              ) : (
                <Avatar name={session.data?.user?.name || "User"} size="md" />
              )
            }
            currentAttempt={1}
            messageClassName={
              message.role === "user"
                ? "bg-content3 text-content3-foreground"
                : "bg-slate-50"
            }
            showFeedback={message.role === "assistant"}
            tools={[]}
            agentId={agent?.id}
            promptTemplates={promptTemplates || DEFAULT_TEMPLATES}
          />
        ))}
      </div>
      {isTestMode && workflowResults && isChating != true && (
        <div className="px-1">
          <AgentWorkflowResultsPane data={workflowResults} />
        </div>
      )}
    </ScrollShadow>
  );
}
