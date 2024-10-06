import {
  selectRefreshSession,
  selectSelectedChatId,
  selectSelectedSessionId,
  setRefreshSession,
} from "@/lib/features/chatListSlice";
import { AppDispatch } from "@/lib/store";
import { useSession } from "next-auth/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import FeatureCards from "@/components/Conversation/feature-cards";
import { PromptTemplateType } from "@/components/PromptFrom";
import {
  Message_Role_Enum,
  Message_Status_Enum,
  Message_Type_Enum,
  Order_By,
  useFetchAllMessageListQuery,
  useGetAgentByIdQuery,
  useUpdateTopicHistoryByIdMutation,
} from "@/graphql/generated/types";
import { DEFAULT_LLM_MODEL, DEFAULT_TEMPLATES } from "@/lib/models";
import { createPrompt } from "@/lib/prompts";
import { ChatFlowRequestSchema, ChatFlowResponseSchema } from "@/restful/generated";
import {
  CHAT_STATUS_ENUM,
  LibraryCardType,
  MessageType,
  SOURCE_TYPE_ENUM,
  SourceType,
  ToolType,
} from "@/types/chatTypes";
import { Avatar, ScrollShadow } from "@nextui-org/react";
import { useTranslations } from "next-intl";
import { v4 } from "uuid";
import AgentWorkflowResultsPane from "./agent-workflow-result-pane";
import MessageCard from "./message-card";

type AgentProps = {
  id: string;
  name?: string;
  avatar?: string;
  defaultModel?: string;
  token_limit?: number;
  enable_search?: boolean | null;
  force_search?: boolean | null;
  tools?: ToolType[];
};

type QueryAnalyzeResultSchema = {
  isRelated?: boolean;
  refineQuery?: string;
  keywords?: string;
  knowledge_base_ids?: string[];
  isFollowUp?: boolean;
};

type MessageWindowProps = {
  workflow_id: string;
  chatStatus: CHAT_STATUS_ENUM | null;
  isChating: boolean;
  isTestMode?: boolean;
  selectedSources?: SourceType[];
  sessionFilesContext?: string;
  session_file_ids?: string[];
  onChatingStatusChange: (isChating: boolean, status: CHAT_STATUS_ENUM | null) => void;
  onSelectedSource?: (source: SourceType, selected: boolean) => void;
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
  }) => void;
};

export default function MessageWindowWithWorkflow({
  workflow_id,
  isChating,
  chatStatus,
  isTestMode = false,
  selectedSources,
  sessionFilesContext = "",
  session_file_ids = [],
  onChatingStatusChange,
  handleCreateNewMessage,
  onSelectedSource,
  onMessageChange,
}: MessageWindowProps) {
  const dispatch: AppDispatch = useDispatch();
  const t = useTranslations();
  const selectedChatId = useSelector(selectSelectedChatId);
  const selectedSessionId = useSelector(selectSelectedSessionId);
  const refreshSession = useSelector(selectRefreshSession);

  const ref = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<MessageType[]>([]);
  const [agent, setAgent] = useState<AgentProps>();
  const [refineQuery, setRefineQuery] = useState<QueryAnalyzeResultSchema | null>(null);
  const [searchResults, setSearchResults] = useState<SourceType[] | null>(null);
  const [chatContext, setChatContext] = useState<string | null>(null);

  const [promptTemplates, setPromptTemplates] = useState<PromptTemplateType[]>();
  // const [chatStatus, setChatStatus] = useState<CHAT_STATUS_ENUM | null>(null);
  const [libraries, setLibraries] = useState<LibraryCardType[]>();
  const [workflowResults, setWorkflowResults] = useState<ChatFlowResponseSchema | null>(
    null,
  );
  const [updateTopicHistoryByIdMutation] = useUpdateTopicHistoryByIdMutation();

  const session = useSession();
  const user_id = session.data?.user?.id;
  const agent_id = selectedChatId;
  const scrollRef = useRef<HTMLDivElement>(null);

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
      id: agent_id, // value for 'id'
    },
    skip: !agent_id,
  });

  useEffect(() => {
    setRefineQuery(null);
    onChatingStatusChange(isChating, null);
    if (!selectedSessionId) {
      setMessages([]);
      setWorkflowResults(null);
    }
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
      } else {
        setMessages((prev) => prev.filter((item) => item.status != "draft"));
      }
    }
    query.refetch();
  }, [selectedChatId, selectedSessionId, isChating, query]);

  useEffect(() => {
    if (agentData) {
      setAgent({
        id: agentData.agent_by_pk?.id,
        name: agentData.agent_by_pk?.name,
        avatar: agentData.agent_by_pk?.avatar || "",
        defaultModel: agentData.agent_by_pk?.default_model || DEFAULT_LLM_MODEL,
        token_limit: agentData.agent_by_pk?.token_limit || 4096,
        enable_search: agentData.agent_by_pk?.enable_search || false,
        force_search: agentData.agent_by_pk?.force_search || false,
        tools: agentData.agent_by_pk?.tools?.map((item) => item.tool),
      });

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
      if (agentData.agent_by_pk?.kbs) {
        setLibraries(
          agentData.agent_by_pk?.kbs.map((item) => ({
            id: item.knowledge_base.id,
            name: item.knowledge_base.name,
            description: item.knowledge_base.description || "",
            base_type: item.knowledge_base.base_type,
          })),
        );
      }
    }
  }, [selectedChatId, agentData]);

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
        sources: item.sources?.map((item: SourceType) => ({ ...item })),
        messageType: item.message_type || Message_Type_Enum.Text,
        schema: item.schema || {},
      }));

      if (data.message.length == 1 && selectedSessionId) {
        const newMessageContent = data.message[0].content || t("New Chat");
        const response = updateTopicHistoryByIdMutation({
          variables: {
            id: selectedSessionId,
            _set: { title: newMessageContent.slice(0, 15) },
          },
        });
        dispatch(setRefreshSession(true));
      }

      setMessages(newMessages);
      onMessageChange?.(newMessages);
    }
  }, [data, onMessageChange]);

  useEffect(() => {
    if (
      isChating &&
      messages.length > 0 &&
      messages[messages.length - 1].status != "draft"
    ) {
      const newMessageId = v4();
      setSearchResults(null);
      setChatContext(null);
      setWorkflowResults(null);
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
      onChatingStatusChange(isChating, CHAT_STATUS_ENUM.New);
    }
  }, [messages]);

  useEffect(() => {
    if (
      isChating &&
      chatStatus === CHAT_STATUS_ENUM.New &&
      messages.length > 0 &&
      messages[messages.length - 1].status == "draft"
    ) {
      onChatingStatusChange(isChating, CHAT_STATUS_ENUM.Searching);

      const fetchChatWithWorkflow = async () => {
        const body: ChatFlowRequestSchema = {
          agent_id: agent_id || "",
          session_id: selectedSessionId || "",
          messages: messages.slice(0, -1).map((item) => ({
            role: item.role,
            content: item.message || "",
          })),
          workflow_id: workflow_id,
          session_file_ids: session_file_ids || [],
          sources: selectedSources?.map((item) => ({
            title: item.title || item.fileName,
            url: item.url,
            content: item.content || item.contents.join("\n") || "",
            ext: item.ext,
            file_id: item.fileId,
            knowledge_base_id: item.knowledgeBaseId,
          })),
        };

        const response = await fetch("/api/workflow", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        console.log("response error", response);

        if (!response.ok) {
          setSearchResults([]);
          setChatContext("");
          setWorkflowResults({
            error_message: `Workflow execution failed: ${response.statusText}`,
            workflow_output: {},
          });
          return;
        }

        const workflowResults: ChatFlowResponseSchema = await response.json();
        const workflowOutput = workflowResults.workflow_output;

        setWorkflowResults(workflowResults);

        if (workflowOutput.type === "humanInLoopNode") {
          onChatingStatusChange(false, CHAT_STATUS_ENUM.Finished);
          setSearchResults(null);
          setChatContext(null);
          setMessages((prev) => [
            ...prev.slice(0, -1),
            {
              ...prev[prev.length - 1],
              message: workflowOutput.question,
            },
          ]);
          handleCreateNewMessage?.({
            id: messages[messages.length - 1].id,
            query: "",
            content: workflowOutput.question || "",
            session_id: selectedSessionId || "",
            role: Message_Role_Enum.Assistant,
            sources: searchResults,
            status: Message_Status_Enum.Waiting,
            message_type: (workflowOutput.response_format || "text") as Message_Type_Enum,
            schema: workflowOutput.schema || {},
          });
          return null;
        }

        if (workflowOutput.sources) {
          const newSources = workflowOutput.sources.map((item) => ({
            fileName: item.title || "",
            fileId: item.file_id || "",
            url: item.url || "",
            pages: [],
            contents: item.content ? [item.content] : [],
            sourceType: SOURCE_TYPE_ENUM.file,
            knowledgeBaseId: item.knowledge_base_id || "",
            ext: item.ext || "Unknow",
          }));
          setSearchResults(newSources.slice(0, 10));
          setMessages((prev) => [
            ...prev.slice(0, -1),
            {
              ...prev[prev.length - 1],
              sources: newSources.slice(0, 10) || [],
            },
          ]);
        } else {
          setSearchResults([]);
        }

        if (workflowOutput.context) {
          setChatContext(workflowOutput.context);
        } else {
          setChatContext("");
        }
      };
      fetchChatWithWorkflow();
    }
  }, [chatStatus, messages, workflow_id]);

  useEffect(() => {
    if (
      isChating &&
      searchResults != null &&
      chatContext != null &&
      chatStatus == CHAT_STATUS_ENUM.Searching
    ) {
      onChatingStatusChange(isChating, CHAT_STATUS_ENUM.Generating);

      const controller = new AbortController(); // Create a new AbortController
      const signal = controller.signal; // Get the signal from the controller

      const generateAnswer = async () => {
        const historyMessage = messages.filter((item) => item.status != "draft");

        const prompt = await createPrompt(
          promptTemplates || DEFAULT_TEMPLATES,
          historyMessage,
          searchResults || [],
          agent?.token_limit,
          refineQuery?.refineQuery || "",
          chatContext || "",
          sessionFilesContext,
          {},
        );
        let answer = "";
        // call llm
        try {
          // Fetch the streaming data from the API
          const response = await fetch("/api/chat", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: agent?.defaultModel || DEFAULT_LLM_MODEL,
              prompt: prompt,
            }),
            signal: signal,
          }); // Adjust the endpoint as needed

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
                  return [{ ...prev[0], message: prev[0].message + chunk }];
                }
                const draftMessage = prev[prev.length - 1];
                return [
                  ...prev.slice(0, -1),
                  { ...draftMessage, status: Message_Status_Enum.Success },
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
          sources: searchResults,
          status: Message_Status_Enum.Success,
        });
        onChatingStatusChange(false, CHAT_STATUS_ENUM.Finished);
      };
      generateAnswer();
      return () => {
        controller.abort(); // Abort the fetch when the component unmounts or dependencies change
        return;
      };
    }
  }, [searchResults, isChating]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, chatStatus, isChating]);

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

  // Calculate props for each message outside the map to ensure consistent hook calls
  const messageCardPropsList = useMemo(() => {
    return messages.map((msg, index) => ({
      // key: msg.id,
      messageId: msg.id,
      isChating: msg.status === "draft" ? isChating : false,
      chatStatus: msg.status === "draft" ? chatStatus : null,
      attempts: index === 1 ? 2 : 1,
      avatar:
        msg.role === "assistant" ? (
          agentAvatarElement
        ) : (
          <Avatar name={session.data?.user?.name || "User"} size="md" />
        ),
      currentAttempt: index === 1 ? 2 : 1,
      message: msg.message || "",
      isUser: msg.role === "user",
      messageClassName:
        msg.role === "user" ? "bg-content3 text-content3-foreground" : "bg-slate-50",
      showFeedback: msg.role === "assistant",
      sourceResults: msg.sources || [],
      files: msg.files,
      onSelectedSource: onSelectedSource,
      tools: agent?.tools,
      agentId: agent?.id,
      status: msg.status,
      messageType: msg.messageType,
      schema: msg.schema,
      sessionId: selectedSessionId || "",
    }));
  }, [messages, isChating, chatStatus, agentAvatarElement, onSelectedSource]);

  return (
    <ScrollShadow
      ref={scrollRef}
      className="flex w-full flex-grow flex-col gap-2 pb-2"
      hideScrollBar={true}>
      <div className="flex flex-1 flex-grow flex-col gap-1 px-1" ref={ref}>
        {messages.length === 0 && featureContent}
        {messageCardPropsList.map((props) => (
          <MessageCard key={props.messageId} {...props} />
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
