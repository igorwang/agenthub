import {
  selectIsFollowUp,
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
import { queryAnalyzer } from "@/lib/prompts/queryAnalyzer";
import { librarySearcher } from "@/lib/searchs/librarySearch";
import { SearchDocumentResultSchema } from "@/restful/generated";
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
import { toast } from "sonner";
import { useTranslations } from "use-intl";
import { v4 } from "uuid";
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
  isChating: boolean;
  chatStatus: CHAT_STATUS_ENUM | null;
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
    attachments?: any;
    sources?: any;
    status?: Message_Status_Enum;
  }) => void;
};

export default function MessageWindow({
  isChating,
  chatMode,
  chatStatus,
  selectedSources,
  onChatingStatusChange,
  handleCreateNewMessage,
  onSelectedSource,
  onMessageChange,
}: MessageWindowProps) {
  const dispatch: AppDispatch = useDispatch();
  const selectedChatId = useSelector(selectSelectedChatId);
  const selectedSessionId = useSelector(selectSelectedSessionId);
  const isFollowUp = useSelector(selectIsFollowUp);
  const t = useTranslations();

  const ref = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<MessageType[]>([]);
  const [agent, setAgent] = useState<AgentProps>();
  const [refineQuery, setRefineQuery] = useState<QueryAnalyzeResultSchema | null>(null);
  const [searchResults, setSearchResults] = useState<SourceType[] | null>(null);
  const [promptTemplates, setPromptTemplates] = useState<PromptTemplateType[]>();
  const [libraries, setLibraries] = useState<LibraryCardType[]>();

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
    setSearchResults(null);
    onChatingStatusChange(isChating, null);
    if (!selectedSessionId) {
      setMessages([]);
    }
    query.refetch();
  }, [selectedChatId, isChating, selectedSessionId, query]);

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
      setMessages(newMessages);
      onMessageChange?.(newMessages);
    }
  }, [data]);

  useEffect(() => {
    if (
      isChating &&
      messages.length > 0 &&
      messages[messages.length - 1].status != "draft"
    ) {
      const newMessageId = v4();
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
      onChatingStatusChange(isChating, CHAT_STATUS_ENUM.Analyzing);
      const fetchRefineQuery = async () => {
        const historyMessage = messages.filter((item) => item.status != "draft");
        console.log("historyMessage", historyMessage);
        try {
          const result = await queryAnalyzer(
            historyMessage,
            agent?.defaultModel,
            JSON.stringify(libraries ? libraries : ""),
          );
          const structuredQuery = result;
          setRefineQuery(structuredQuery || {});
        } catch (error) {
          console.error("Error fetching refine query:", error);
          toast.error("System error, please try later.");
          onChatingStatusChange(false, CHAT_STATUS_ENUM.Interpret);
          return;
        }
      };
      fetchRefineQuery();
    }
  }, [chatStatus, messages]);

  useEffect(() => {
    if (isChating && refineQuery != null && chatStatus == CHAT_STATUS_ENUM.Analyzing) {
      onChatingStatusChange(isChating, CHAT_STATUS_ENUM.Searching);
      const filter_kb_ids = selectedSources
        ?.map((item) => item.knowledgeBaseId || null)
        .filter((id) => id !== null);
      const filter_file_ids = selectedSources?.map((item) => item.fileId);

      const searchLibrary = async () => {
        try {
          const librarySearchPromise = librarySearcher({
            query: `${refineQuery?.refineQuery};${refineQuery?.keywords}`,
            agent_id: agent_id || "",
            user_id: user_id || "",
            filter_kb_ids: filter_kb_ids ? filter_kb_ids : refineQuery.knowledge_base_ids,
            filter_file_ids: filter_file_ids || null,
            limit: 10,
          });

          const searchBody = {
            query: `${refineQuery?.refineQuery};${refineQuery?.keywords}`,
            agent_id: null,
            user_id: user_id || null,
            limit: 5,
          };
          const webSearchPromise = agent?.enable_search
            ? fetch("/api/search/web", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(searchBody),
              })
            : null;

          const searchPromises = [librarySearchPromise, webSearchPromise];

          Promise.all(searchPromises)
            .then(async ([librarySearchResponse, webSearchResponse]) => {
              const librarySearchResults = await librarySearchResponse;
              const webSearchResults = webSearchResponse
                ? await webSearchResponse.json()
                : [];
              const libraryResults = librarySearchResults.map(
                (item: SearchDocumentResultSchema): SourceType => ({
                  fileName: item.filename || "",
                  fileId: item.file_id || "",
                  url: item.url || "",
                  pages: item.pages || [],
                  contents: item.contents || [],
                  sourceType: SOURCE_TYPE_ENUM.file,
                  knowledgeBaseId: item.knowledge_base_id || "",
                  ext: item.ext || "Unknow",
                }),
              );

              const webResults =
                webSearchResults.map(
                  (item: SearchDocumentResultSchema): SourceType => ({
                    fileName: item.filename || "",
                    fileId: item.file_id || "",
                    url: item.url || "",
                    pages: item.pages || [],
                    contents: item.contents || [],
                    sourceType: SOURCE_TYPE_ENUM.webpage,
                    knowledgeBaseId: item.knowledge_base_id || "",
                    ext: "webpage",
                  }),
                ) || [];
              const searchResults = [...libraryResults, ...webResults]
                .map((item, index) => ({ ...item, index: index + 1 }))
                .slice(0, 10);

              setSearchResults(() => searchResults || []);
              setMessages((prev) => [
                ...prev.slice(0, -1),
                { ...prev[prev.length - 1], sources: searchResults || [] },
              ]);
            })
            .catch((error) => {
              console.error(error);
              console.error("Error searching library:", error);
              toast.error("Search Error: please try later.");
              onChatingStatusChange(false, CHAT_STATUS_ENUM.Interpret);
            });
        } catch (error) {
          console.error("Error searching library:", error);
          toast.error("Search Error: please try later.");
          onChatingStatusChange(false, CHAT_STATUS_ENUM.Interpret);
        }
      };
      const latestSources = messages?.filter(
        (item) => item.role == Message_Role_Enum.Assistant && item.sources,
      );
      console.log("selectedSources", selectedSources);
      console.log("isFollowUp", isFollowUp);
      if (selectedSources && selectedSources.length > 0) {
        setSearchResults(selectedSources);
        setMessages((prev) => [
          ...prev.slice(0, -1),
          { ...prev[prev.length - 1], sources: selectedSources || [] },
        ]);
      } else if (refineQuery.isFollowUp && latestSources.length > 0) {
        setSearchResults(latestSources[latestSources.length - 1].sources || []);
        setMessages((prev) => [
          ...prev.slice(0, -1),
          {
            ...prev[prev.length - 1],
            sources: latestSources[latestSources.length - 1].sources || [],
          },
        ]);
      } else if (
        (refineQuery.knowledge_base_ids && refineQuery.knowledge_base_ids.length > 0) ||
        agent?.force_search
      ) {
        searchLibrary();
      } else {
        setSearchResults([]);
      }
    }
  }, [refineQuery]);

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
          agent?.token_limit,
          `${refineQuery?.refineQuery};${refineQuery?.keywords}` || "",
          "",
          "",
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

            // Continue reading the stream
            await readStream();
          };
          // Start reading the stream
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
        controller.abort();
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
    }));
  }, [messages, isChating, chatStatus, agentAvatarElement, onSelectedSource]);

  return (
    <ScrollShadow
      ref={scrollRef}
      className="flex w-full flex-grow flex-col gap-6 pb-8"
      hideScrollBar={true}>
      <div className="flex flex-1 flex-grow flex-col gap-1 px-1" ref={ref}>
        {messages.length === 0 && featureContent}
        {messageCardPropsList.map((props) => (
          <MessageCard key={props.messageId} {...props} />
        ))}
      </div>
    </ScrollShadow>
  );
}
