"use client";
import { MessagePanel } from "@/components/AISearch/message-panel";
import SearchPanel from "@/components/AISearch/search-panel";
import {
  Message_Role_Enum,
  Order_By,
  useCreateNewTopicMutation,
  useGetTopicsQuery,
  useSubscriptionMessageListSubscription,
} from "@/graphql/generated/types";
import { DEFAULT_LLM_MODEL } from "@/lib/models";
import {
  DEFAULT_RAG_TEMPLATES,
  createRagAnswerPrompt,
} from "@/lib/prompts/ragAnswerPrompt";
import { ragQueryAnalyzer } from "@/lib/prompts/ragQueryAnalyzer";
import { SearchDocumentResultSchema } from "@/restful/generated";
import {
  CHAT_STATUS_ENUM,
  MessageType,
  SOURCE_TYPE_ENUM,
  SourceType,
} from "@/types/chatTypes";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { v4 } from "uuid";

export type topicProps = {
  id: any;
  short_url?: string | null | undefined;
  title?: string;
  user_id?: any;
  created_at?: any;
  updated_at?: any;
  status?: "draft" | "saved";
};

type refineQueryType = { refineQuery: string; keywords: string };

export default function AISearch() {
  const sesssion = useSession();
  const userId = sesssion.data?.user?.id;

  const { id } = useParams<{ id: string }>();
  // const searchParams = useSearchParams();
  // const query = searchParams.get("query");
  const [topic, setTopic] = useState<topicProps>();

  const [isChating, setIsChating] = useState<boolean>(false);
  const [chatStatus, setChatStatus] = useState<CHAT_STATUS_ENUM | null>(null);
  const [query, setQuery] = useState<string>("");
  const [refineQuery, setRefineQuery] = useState<refineQueryType | null>(null);
  const [searchResults, setSearchResults] = useState<SourceType[] | null>(null);
  const [messages, setMessages] = useState<MessageType[]>([]);

  const [createNewTopicMutation, { loading: createLoading }] =
    useCreateNewTopicMutation();

  const { data: messageData } = useSubscriptionMessageListSubscription({
    variables: {
      order_by: { created_at: Order_By.AscNullsLast }, // value for 'order_by'
      where: { id: { _eq: topic?.id } }, // value for 'where'
    },
    skip: !topic?.id,
  });

  const {
    data: topicData,
    loading,
    error,
  } = useGetTopicsQuery({
    variables: {
      where: { short_url: { _eq: id } },
    },
    skip: !id,
  });

  useEffect(() => {
    const fetchOrCreateTopic = async () => {
      if (topicData?.topic_history && topicData.topic_history.length > 0) {
        setTopic({ ...topicData.topic_history[0], status: "saved" });
      } else if (topicData?.topic_history && topicData.topic_history.length == 0) {
        setTopic({
          id: v4(),
          title: query || "New Topic",
          short_url: id,
          user_id: userId,
          status: "draft",
        });
      }
    };
    fetchOrCreateTopic();
  }, [id, topicData]);

  useEffect(() => {
    if (isChating && topic && query && query.trim().length > 0) {
      setChatStatus(CHAT_STATUS_ENUM.Analyzing);
      const newMessageId = v4();
      setMessages((prev) => [
        ...prev,
        {
          id: newMessageId,
          role: Message_Role_Enum.Assistant,
          message: "",
          // sources: searchResults,
          status: "draft",
          sessionId: topic?.id,
          query: query,
        },
      ]);
      const fetchRefineQuery = async () => {
        try {
          const result = await ragQueryAnalyzer(query, null);
          const transformedResult = {
            refineQuery: Array.isArray(result.refineQuery)
              ? result.refineQuery.join(";")
              : result.refineQuery,
            keywords: Array.isArray(result.keywords)
              ? result.keywords.join(";")
              : result.keywords,
          };
          setRefineQuery(transformedResult);
        } catch (error) {
          toast.error("System error, please try later.");
          console.error("Error fetching refine query:", error);
          setIsChating(false);
          return;
        }
      };
      fetchRefineQuery();
    }
  }, [topic, isChating]);

  useEffect(() => {
    if (isChating && refineQuery != null && chatStatus == CHAT_STATUS_ENUM.Analyzing) {
      setChatStatus(CHAT_STATUS_ENUM.Searching);
      const searchLibrary = async () => {
        try {
          const searchBody = {
            query: `${refineQuery?.refineQuery};${refineQuery?.keywords}`,
            agent_id: null,
            user_id: userId || null,
            limit: 5,
          };

          const librarySearchPromise = fetch("/api/search", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(searchBody),
          })
            .then((response) => {
              if (!response.ok) {
                // If response is not ok, throw an error
                toast.error(`Library search failed.`);
                return [];
              }
              return response.json();
            })
            .catch((error) => {
              console.error(error);
              // Return empty result on error
              return [];
            });

          const webSearchPromise = fetch("/api/search/web", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(searchBody),
          });

          Promise.all([librarySearchPromise, webSearchPromise])
            .then(async ([librarySearchResponse, webSearchResponse]) => {
              const librarySearchResults = await librarySearchResponse;
              const webSearchResults = await webSearchResponse.json();
              // 在这里处理查询结果

              const libraryResults = librarySearchResults.map(
                (item: SearchDocumentResultSchema): SourceType => ({
                  fileName: item.filename || "",
                  fileId: item.file_id || "",
                  url: item.url || "",
                  pages: item.pages || [],
                  contents: item.contents || [],
                  sourceType: SOURCE_TYPE_ENUM.file,
                  knowledgeBaseId: item.knowledge_base_id || "",
                }),
              );

              const webResults = webSearchResults.map(
                (item: SearchDocumentResultSchema): SourceType => ({
                  fileName: item.filename || "",
                  fileId: item.file_id || "",
                  url: item.url || "",
                  pages: item.pages || [],
                  contents: item.contents || [],
                  sourceType: SOURCE_TYPE_ENUM.webpage,
                  knowledgeBaseId: item.knowledge_base_id || "",
                }),
              );
              const searchResults = [...libraryResults, ...webResults].map(
                (item, index) => ({ ...item, index: index + 1 }),
              );

              setSearchResults(() => searchResults || []);
              setMessages((prev) => [
                ...prev.slice(0, -1),
                { ...prev[prev.length - 1], sources: searchResults },
              ]);
            })
            .catch((error) => {
              toast.error("Error during search requests, please try again");
              console.error("Error during search requests:", error);
            });
        } catch (error) {
          console.error("Error searching library:", error);
          toast.error("Search Error: please try later.");
          setIsChating(false);
        }
      };
      searchLibrary();
    }
  }, [refineQuery]);

  useEffect(() => {
    if (
      isChating &&
      messages.length > 0 &&
      messages[messages.length - 1].status == "draft" &&
      chatStatus == CHAT_STATUS_ENUM.Searching
    ) {
      setChatStatus(CHAT_STATUS_ENUM.Generating);
      const generateAnswer = async () => {
        const prompt = await createRagAnswerPrompt(
          DEFAULT_RAG_TEMPLATES,
          query,
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
              model: DEFAULT_LLM_MODEL,
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
            // setStreamingMessage(
            //   (prevMessage) => (prevMessage != null ? prevMessage : "") + chunk,
            // );
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
        }
        setMessages((prev) => [
          ...prev.slice(0, -1),
          { ...prev[prev.length - 1], status: "success" },
        ]);
        setIsChating(false);
        // save results
        // handleCreateNewMessage?.({
        //   content: answer,
        //   session_id: selectedSessionId || "",
        //   role: Message_Role_Enum.Assistant,
        //   sources: searchResults,
        // });
        // handleChatingStatus?.(false);
      };
      generateAnswer();
    }
  }, [searchResults]);

  const handleStartNewQuery = (query: string) => {
    setIsChating(true);
    setQuery(query);
  };

  return (
    <div className="mx-auto flex h-full min-w-[460px] max-w-3xl flex-col space-y-2 px-12 pb-14 pt-6 sm:px-12 md:space-y-4 md:pb-24 md:pt-14">
      <MessagePanel
        messages={messages}
        isChating={isChating}
        chatStatus={chatStatus}
        handleStartNewQuery={handleStartNewQuery}></MessagePanel>
      <SearchPanel
        topic={topic}
        handleStartNewQuery={handleStartNewQuery}
        isChating={isChating}
        messages={messages}></SearchPanel>
    </div>
  );
}
