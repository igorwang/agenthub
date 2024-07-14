import {
  selectSelectedChatId,
  selectSelectedSessionId,
} from "@/lib/features/chatListSlice";
import { AppDispatch } from "@/lib/store";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import FeatureCards from "@/components/Conversation/feature-cards";
import { PromptTemplateType } from "@/components/PromptFrom";
import {
  Message_Role_Enum,
  useGetAgentByIdQuery,
  useGetMessageListSubscription,
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
} from "@/types/chatTypes";
import { Avatar, ScrollShadow } from "@nextui-org/react";
import { toast } from "sonner";
import MessageCard from "./message-card";

type AgentProps = {
  id: string;
  name?: string;
  avatar?: string;
  defaultModel?: string;
};

type QueryAnalyzeResultSchema = {
  isRelated?: boolean;
  refineQuery?: string;
  keywords?: string[];
  knowledge_base_ids?: string[];
};

type MessageWindowProps = {
  isChating?: boolean;
  chatMode?: CHAT_MODE;
  handleChatingStatus?: (stauts: boolean) => void;
  handleCreateNewMessage?: (params: {
    content: string;
    session_id: string;
    role: Message_Role_Enum;
    attachments?: any;
    sources?: any;
  }) => void;
};

export default function MessageWindow({
  isChating,
  chatMode,
  handleChatingStatus,
  handleCreateNewMessage,
}: MessageWindowProps) {
  const dispatch: AppDispatch = useDispatch();
  const selectedChatId = useSelector(selectSelectedChatId);
  const selectedSessionId = useSelector(selectSelectedSessionId);

  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  const [messages, setMessages] = useState<MessageType[]>([]);
  const [agent, setAgent] = useState<AgentProps>();
  const [refineQuery, setRefineQuery] = useState<QueryAnalyzeResultSchema | null>(null);
  const [searchResults, setSearchResults] = useState<SourceType[] | null>(null);
  const [promptTemplates, setPromptTemplates] = useState<PromptTemplateType[]>();
  const [streamingMessage, setStreamingMessage] = useState<string | null>(null);
  const [chatStatus, setChatStatus] = useState<CHAT_STATUS_ENUM | null>(null);
  const [libraries, setLibraries] = useState<LibraryCardType[]>();

  const session = useSession();
  const user_id = session.data?.user?.id;
  const agent_id = selectedChatId;
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data, loading, error } = useGetMessageListSubscription({
    variables: {
      session_id: selectedSessionId || "", // Provide a default value
      limit: 50,
    },
    skip: !selectedSessionId, // Skip the query if session_id is not provided
  });

  const { data: agentData } = useGetAgentByIdQuery({
    variables: {
      id: agent_id, // value for 'id'
    },
    skip: !agent_id,
  });

  useEffect(() => {
    setRefineQuery(null);
    setSearchResults(null);
    setStreamingMessage(null);
    setChatStatus(null);
  }, [selectedChatId, selectedSessionId, isChating]);

  useEffect(() => {
    const handleResize = () => {
      if (ref.current) {
        setWidth(ref.current.offsetWidth);
      }
    };

    handleResize(); // Set initial width
    window.addEventListener("resize", handleResize); // Update width on window resize

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (agentData) {
      setAgent({
        id: agentData.agent_by_pk?.id,
        name: agentData.agent_by_pk?.name,
        avatar: agentData.agent_by_pk?.avatar || "",
        defaultModel: agentData.agent_by_pk?.default_model || DEFAULT_LLM_MODEL,
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
      // const knowledge_bases = agentData.agent_by_pk
      if (agentData.agent_by_pk?.kbs) {
        console.log("agentData", agentData);
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
      setMessages(
        data.message.map((item) => ({
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
        })),
      );
    }
  }, [data]);

  useEffect(() => {
    if (isChating && messages.length > 0) {
      setChatStatus(CHAT_STATUS_ENUM.Analyzing);
      console.log("libraries", libraries);
      const fetchRefineQuery = async () => {
        try {
          console.log(messages);
          const result = await queryAnalyzer(
            messages,
            null,
            JSON.stringify(libraries ? libraries : ""),
          );
          const structuredQuery = result?.[0];
          setRefineQuery(structuredQuery || {});
        } catch (error) {
          console.error("Error fetching refine query:", error);
          toast.error("System error, please try later.");
          handleChatingStatus?.(false);
          return;
        }
      };
      fetchRefineQuery();
    }
  }, [messages]);

  useEffect(() => {
    if (isChating && refineQuery != null && chatStatus == CHAT_STATUS_ENUM.Analyzing) {
      setChatStatus(CHAT_STATUS_ENUM.Searching);
      console.log("refineQuery", refineQuery);
      const searchLibrary = async () => {
        console.log("Go to search something");
        try {
          const result = await librarySearcher({
            query: `${refineQuery?.refineQuery};${refineQuery?.keywords}`,
            agent_id: agent_id || "",
            user_id: user_id || "",
            filter_kb_ids: refineQuery.knowledge_base_ids,
            limit: 10,
          });
          setSearchResults(() => {
            return result.map(
              (item: SearchDocumentResultSchema, index: number): SourceType => ({
                fileName: item.filename || "",
                fileId: item.file_id || "",
                url: item.url || "",
                pages: item.pages || [],
                contents: item.contents || [],
                sourceType: SOURCE_TYPE_ENUM.file,
                knowledgeBaseId: item.knowledge_base_id || "",
                index: index + 1,
                metadata: item.metadata,
              }),
            );
          });
        } catch (error) {
          console.error("Error searching library:", error);
          toast.error("Search Error: please try later.");
          handleChatingStatus?.(false);
        }
      };
      if (refineQuery.isRelated && refineQuery.knowledge_base_ids) {
        searchLibrary();
      } else {
        console.log("Igonre Search");
        setSearchResults([]); // empty result
      }
      setStreamingMessage(""); // new message
    }
  }, [refineQuery]);

  useEffect(() => {
    if (isChating && searchResults != null && chatStatus == CHAT_STATUS_ENUM.Searching) {
      setChatStatus(CHAT_STATUS_ENUM.Generating);
      console.log("searchResults", searchResults);
      const generateAnswer = async () => {
        const prompt = await createPrompt(
          promptTemplates || DEFAULT_TEMPLATES,
          messages,
          searchResults || [],
          `${refineQuery?.refineQuery};${refineQuery?.keywords}` || "",
          {},
          4096,
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
            setStreamingMessage(
              (prevMessage) => (prevMessage != null ? prevMessage : "") + chunk,
            );

            // Continue reading the stream
            await readStream();
          };
          // Start reading the stream
          await readStream();
        } catch (error) {
          console.error("Error while streaming:", error);
        }
        // save results
        handleCreateNewMessage?.({
          content: answer,
          session_id: selectedSessionId || "",
          role: Message_Role_Enum.Assistant,
          sources: searchResults,
        });
        handleChatingStatus?.(false);
      };
      generateAnswer();
    }
  }, [searchResults]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, streamingMessage, chatStatus, isChating]);

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

  return (
    <ScrollShadow
      ref={scrollRef}
      className="flex w-full flex-grow flex-col gap-6 pb-8"
      hideScrollBar={true}>
      <div className="flex flex-1 flex-grow flex-col gap-1 px-1" ref={ref}>
        {messages.length === 0 && featureContent}
        {messages.map(({ role, message, files, sources }, index) => (
          <MessageCard
            key={index}
            attempts={index === 1 ? 2 : 1}
            avatar={
              role === "assistant" ? (
                agentAvatarElement
              ) : (
                <Avatar src="https://d2u8k2ocievbld.cloudfront.net/memojis/male/6.png" />
              )
            }
            currentAttempt={index === 1 ? 2 : 1}
            message={message || ""}
            isUser={role === "user"}
            messageClassName={
              role === "user" ? "bg-content3 text-content3-foreground" : "bg-slate-50"
            }
            showFeedback={role === "assistant"}
            sourceResults={sources || []}
            files={files}
            maxWidth={width}
            // className="bg-slate-50"
          />
        ))}
        {isChating && chatStatus != null && (
          <MessageCard
            aria-label="streaming card"
            avatar={agentAvatarElement}
            message={streamingMessage || ""}
            messageClassName={""}
            chatStatus={chatStatus}
            sourceResults={searchResults || []}
            maxWidth={width}
            isChating={isChating}
          />
        )}
      </div>
    </ScrollShadow>
  );
}
