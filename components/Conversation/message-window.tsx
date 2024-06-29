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
  MessageType,
  SourceType,
  SOURCE_TYPE_ENUM,
} from "@/types/chatTypes";
import { Avatar, ScrollShadow } from "@nextui-org/react";
import MessageCard from "./message-card";

export const assistantMessages = [
  <div key="1">
    {/* <p className="mb-5"> */}
    Certainly! Here&apos;s a summary of five creative ways to use your Certainly!
    Here&apos;s a summary of five creative ways to use your Certainly! Here&apos;s a
    summary of five creative ways to use your Certainly! Here&apos;s a summary of five
    creative ways to use your Certainly! Here&apos;s a summary of five creative ways to
    use your Certainly! Here&apos;s a summary of five creative ways to use your Certainly!
    Here&apos;s a summary of five creative ways to use your Certainly! Here&apos;s a
    summary of five creative ways to use your kids&apos; art:
    {/* </p> */}
    {/* <ol className="space-y-2">
      <li>
        <strong>Create Art Books:</strong> Turn scanned artwork into custom
        photo books.
      </li>
      <li>
        <strong>Set Up a Gallery Wall:</strong> Use a dedicated wall with
        interchangeable frames for displaying art.
      </li>
      <li>
        <strong>Make Functional Items:</strong> Print designs on items like
        pillows, bags, or mugs.
      </li>
      <li>
        <strong>Implement an Art Rotation System:</strong> Regularly change the
        displayed art, archiving the older pieces.
      </li>
      <li>
        <strong>Use as Gift Wrap:</strong> Repurpose art as unique wrapping
        paper for presents.
      </li>
    </ol> */}
  </div>,
  <div key="2">
    <p className="mb-3">
      Of course! Here are five more creative suggestions for what to do with your
      children&apos;s art:
    </p>
    <ol className="space-y-2">
      <li>
        <strong>Create a Digital Archive:</strong> Scan or take photos of the artwork and
        save it in a digital cloud storage service for easy access and space-saving.
      </li>
      <li>
        <strong>Custom Calendar:</strong> Design a custom calendar with each month
        showcasing a different piece of your child&apos;s art.
      </li>
      <li>
        <strong>Storybook Creation:</strong> Compile the artwork into a storybook,
        possibly with a narrative created by your child, to make a personalized book.
      </li>
      <li>
        <strong>Puzzle Making:</strong> Convert their artwork into a jigsaw puzzle for a
        fun and unique pastime activity.
      </li>
      <li>
        <strong>Home Decor Items:</strong> Use the artwork to create home decor items like
        coasters, magnets, or lampshades to decorate your house.
      </li>
    </ol>
  </div>,
];

type AgentProps = {
  id: string;
  name?: string;
  avatar?: string;
  defaultModel?: string;
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
  const [refineQuery, setRefineQuery] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<SourceType[] | null>(null);
  const [promptTemplates, setPromptTemplates] = useState<PromptTemplateType[]>();
  const [streamingMessage, setStreamingMessage] = useState<string | null>(null);
  const [chatStatus, setChatStatus] = useState<CHAT_STATUS_ENUM | null>(null);

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
      const fetchRefineQuery = async () => {
        try {
          console.log(messages);
          const result = await queryAnalyzer(messages);

          setRefineQuery(result.content);

          console.log(result.content);
        } catch (error) {
          console.error("Error fetching refine query:", error);
          setRefineQuery(messages[messages.length - 1].message || "");
        }
      };
      fetchRefineQuery();
    }
  }, [messages]);

  useEffect(() => {
    if (isChating && refineQuery != null && chatStatus == CHAT_STATUS_ENUM.Analyzing) {
      setChatStatus(CHAT_STATUS_ENUM.Searching);
      const searchLibrary = async () => {
        try {
          const result = await librarySearcher(refineQuery, agent_id || "", user_id, 5);
          setSearchResults(() => {
            return result.map(
              (item: SearchDocumentResultSchema): SourceType => ({
                fileName: item.filename || "",
                fileId: item.file_id,
                url: item.url || "",
                pages: item.pages || [],
                contents: item.contents || [],
                sourceType: SOURCE_TYPE_ENUM.file,
              }),
            );
          });
        } catch (error) {
          console.error("Error searching library:", error);
        }
      };
      searchLibrary();
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
          refineQuery || "",
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
      className="flex flex-grow flex-col gap-6 pb-8 w-full"
      hideScrollBar={true}
    >
      <div className="flex flex-1 flex-grow flex-col px-1 gap-1 " ref={ref}>
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
        {isChating && (
          <MessageCard
            aria-label="streaming card"
            avatar={agentAvatarElement}
            message={streamingMessage || ""}
            messageClassName={""}
            chatStatus={chatStatus}
            sourceResults={searchResults || []}
            maxWidth={width}
          />
        )}
      </div>
    </ScrollShadow>
  );
}
