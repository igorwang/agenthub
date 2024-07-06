import { SourceSection } from "@/components/Conversation/source-section";
import MarkdownRenderer from "@/components/MarkdownRender";
import { MessageSkeleton } from "@/components/ui/message-skeleton";
import { CHAT_STATUS_ENUM, MessageType, SOURCE_TYPE_ENUM } from "@/types/chatTypes";
import { Icon } from "@iconify/react";
import { Button, Divider, Spacer, Spinner, Textarea } from "@nextui-org/react";
import { useRef, useState } from "react";

interface MessageCardProps {
  isChating: boolean;
  chatStatus?: CHAT_STATUS_ENUM | null;
  message: MessageType;
  defaultIsOpen?: boolean;
  handleStartNewQuery: (query: string) => void;
}

const getTipString = (status: CHAT_STATUS_ENUM | null) => {
  switch (status) {
    case CHAT_STATUS_ENUM.Analyzing:
      return "Analyzing question...";
    case CHAT_STATUS_ENUM.Searching:
      return "Searching relevant information...";
    case CHAT_STATUS_ENUM.Generating:
      return "Organizing the response...";
    default:
      return "Analyzing question...";
  }
};

export const MessageCard: React.FC<MessageCardProps> = ({
  isChating,
  chatStatus,
  message,
  defaultIsOpen = true,
  handleStartNewQuery,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(defaultIsOpen);
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const headerElement = (
    <div className="flex flex-row justify-between">
      <span className="text-2xl">{message.query}</span>
      <Button
        isIconOnly
        disableAnimation
        disableRipple
        variant="light"
        onClick={() => setIsOpen((prev) => !prev)}
        className="data-[hover]:bg-transparent"
        startContent={
          isOpen ? (
            <Icon icon={"oui:arrow-down"} fontSize={20} />
          ) : (
            <Icon icon={"oui:arrow-up"} fontSize={20} />
          )
        }></Button>
    </div>
  );
  const statusElement = (
    <div className={"flex flex-row items-center justify-start gap-1"}>
      <Spinner size="md"></Spinner>
      <h4 className="text-slate-400">{getTipString(chatStatus || null)}</h4>
    </div>
  );

  const messageElement = (
    <div className="my-2 flex flex-col gap-1">
      <div className={"flex flex-row items-center justify-start gap-1"}>
        <Icon className={"text-lg text-default-600"} icon="hugeicons:idea-01" />
        <span className="text-slate-500">Answer</span>
      </div>
      <MarkdownRenderer content={message.message || ""}></MarkdownRenderer>
    </div>
  );

  const followUpElement = (
    <div className="my-2 flex flex-col gap-1 px-0">
      <div className={"flex flex-row items-center justify-start gap-1"}>
        <Icon className={"text-lg text-default-600"} icon="fluent:chat-16-regular" />
        <span className="text-slate-500">Follow-up</span>
      </div>
      <Textarea
        ref={inputRef}
        size="sm"
        maxRows={2}
        className={
          "relative flex items-center justify-center rounded-xl border-1 bg-white shadow-sm"
        }
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
        }}
        classNames={{
          inputWrapper: "rounded-xl bg-white ",
          input: "placeholder:translate-y-1/2",
        }}
        placeholder="Ask a follow up question..."
        endContent={
          <Button
            isIconOnly
            disableAnimation
            disableRipple
            variant="light"
            className={input.length > 0 ? "visible" : "hidden"}
            onClick={() => {
              handleStartNewQuery(input);
              setInput("");
            }}
            endContent={<Icon icon={"fluent:arrow-right-20-regular"} />}></Button>
        }></Textarea>
    </div>
  );

  const librarySources = message.sources?.filter(
    (item) => item.sourceType == SOURCE_TYPE_ENUM.file,
  );

  const webSources = message.sources?.filter(
    (item) => item.sourceType == SOURCE_TYPE_ENUM.webpage,
  );
  return (
    <div className={"flex w-full max-w-full flex-col gap-2 pb-10"}>
      {headerElement}
      {!isOpen && <Divider />}
      <Spacer />
      <div className={"flex flex-col" && !isOpen ? "hidden" : "visible"}>
        {isChating && message.status == "draft" && statusElement}
        {!message.sources && !message.message && <MessageSkeleton></MessageSkeleton>}
        {librarySources && librarySources.length > 0 && (
          <SourceSection title="Source" items={librarySources || []}></SourceSection>
        )}
        {webSources && webSources.length > 0 && (
          <SourceSection title="Web Source" items={webSources || []}></SourceSection>
        )}
        {message.message && messageElement}
        {message.status == "success" && followUpElement}
      </div>
    </div>
  );
};
