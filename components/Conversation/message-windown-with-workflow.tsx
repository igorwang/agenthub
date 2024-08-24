import {
  selectSelectedChatId,
  selectSelectedSessionId,
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
  Order_By,
  useFetchAllMessageListQuery,
  useGetAgentByIdQuery,
} from "@/graphql/generated/types";
import { DEFAULT_LLM_MODEL, DEFAULT_TEMPLATES } from "@/lib/models";
import { createPrompt } from "@/lib/prompts";
import { ChatFlowRequestSchema, ChatFlowResponseSchema } from "@/restful/generated";
import {
  CHAT_MODE,
  CHAT_STATUS_ENUM,
  LibraryCardType,
  MessageType,
  SOURCE_TYPE_ENUM,
  SourceType,
  ToolType,
} from "@/types/chatTypes";
import { Avatar, ScrollShadow } from "@nextui-org/react";
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
  chatMode?: CHAT_MODE;
  onChatingStatusChange: (isChating: boolean, status: CHAT_STATUS_ENUM | null) => void;
  selectedSources?: SourceType[];
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
  }) => void;
};

export default function MessageWindowWithWorkflow({
  workflow_id,
  isChating,
  chatStatus,
  chatMode,
  isTestMode = false,
  selectedSources,
  onChatingStatusChange,
  handleCreateNewMessage,
  onSelectedSource,
  onMessageChange,
}: MessageWindowProps) {
  const dispatch: AppDispatch = useDispatch();
  const selectedChatId = useSelector(selectSelectedChatId);
  const selectedSessionId = useSelector(selectSelectedSessionId);

  const ref = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<MessageType[]>([]);
  const [agent, setAgent] = useState<AgentProps>();
  const [refineQuery, setRefineQuery] = useState<QueryAnalyzeResultSchema | null>(null);
  const [searchResults, setSearchResults] = useState<SourceType[] | null>(null);
  const [promptTemplates, setPromptTemplates] = useState<PromptTemplateType[]>();
  // const [chatStatus, setChatStatus] = useState<CHAT_STATUS_ENUM | null>(null);
  const [libraries, setLibraries] = useState<LibraryCardType[]>();
  const [workflowResults, setWorkflowResults] = useState<ChatFlowResponseSchema | null>(
    null,
  );

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
      }));
      console.log("old Message:", messages);
      console.log("new Messages:", newMessages);
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

        if (!response.ok) {
          console.log("Workflow failed");
          setSearchResults([]);
          return;
        }

        const workflowResults: ChatFlowResponseSchema = await response.json();
        const workflowOutput = workflowResults.workflow_output;
        console.log("workflowResults", workflowResults);

        if (isTestMode) {
          setWorkflowResults(workflowResults);
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
      };
      fetchChatWithWorkflow();
    }
  }, [chatStatus, messages]);

  useEffect(() => {
    if (isChating && searchResults != null && chatStatus == CHAT_STATUS_ENUM.Searching) {
      const controller = new AbortController(); // Create a new AbortController
      const signal = controller.signal; // Get the signal from the controller

      onChatingStatusChange(isChating, CHAT_STATUS_ENUM.Generating);

      const generateAnswer = async () => {
        const historyMessage = selectedSources
          ? messages.filter((item) => item.status != "draft").slice(-1) // only last message need to generation
          : messages.filter((item) => item.status != "draft");

        const prompt = await createPrompt(
          promptTemplates || DEFAULT_TEMPLATES,
          historyMessage,
          searchResults || [],
          `${refineQuery?.refineQuery};${refineQuery?.keywords}` || "",
          {},
          agent?.token_limit,
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
            // Decode the chunk and update the message state
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
  }, [searchResults]);

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
          How can I help you today?
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
