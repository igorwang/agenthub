"use client";
import React, { ReactNode } from "react";

import { cn } from "@/cn";
import { MessageSkeleton } from "@/components/Conversation/message-skeleton";
import { SourceSection } from "@/components/Conversation/source-section";
import { UploadFile, UploadFileProps } from "@/components/Conversation/upload-file";
import MarkdownRenderer from "@/components/MarkdownRender";
import { CHAT_STATUS_ENUM, SourceType } from "@/types/chatTypes";
import { Icon } from "@iconify/react";
import { Badge, Button, Link, Spacer, Spinner } from "@nextui-org/react";
import { useClipboard } from "@nextui-org/use-clipboard";

export type MessageCardProps = React.HTMLAttributes<HTMLDivElement> & {
  avatar?: ReactNode;
  showFeedback?: boolean;
  isUser?: boolean;
  message?: React.ReactNode;
  files?: UploadFileProps[];
  sourceResults?: SourceType[];
  currentAttempt?: number;
  status?: "success" | "failed";
  attempts?: number;
  messageClassName?: string;
  chatStatus?: CHAT_STATUS_ENUM | null;
  onAttemptChange?: (attempt: number) => void;
  onMessageCopy?: (content: string | string[]) => void;
  onFeedback?: (feedback: "like" | "dislike") => void;
  onAttemptFeedback?: (feedback: "like" | "dislike" | "same") => void;
};

const MessageCard = React.forwardRef<HTMLDivElement, MessageCardProps>(
  (
    {
      avatar,
      chatStatus,
      message,
      showFeedback,
      attempts = 1,
      currentAttempt = 1,
      isUser,
      status,
      files,
      sourceResults,
      onMessageCopy,
      onAttemptChange,
      onFeedback,
      onAttemptFeedback,
      className,
      messageClassName,
      ...props
    },
    ref,
  ) => {
    const [feedback, setFeedback] = React.useState<"like" | "dislike">();
    const [attemptFeedback, setAttemptFeedback] = React.useState<
      "like" | "dislike" | "same"
    >();

    const messageRef = React.useRef<HTMLDivElement>(null);

    const { copied, copy } = useClipboard();

    const failedMessageClassName =
      status === "failed"
        ? "bg-danger-100/50 border border-danger-100 text-foreground"
        : "";
    const failedMessage = (
      <p>
        Something went wrong, if the issue persists please contact us through our help
        center at&nbsp;
        <Link href="mailto:support@acmeai.com" size="sm">
          support@acmeai.com
        </Link>
      </p>
    );

    const hasFailed = status === "failed";

    const handleCopy = React.useCallback(() => {
      let stringValue = "";

      if (typeof message === "string") {
        stringValue = message;
      } else if (Array.isArray(message)) {
        message.forEach((child) => {
          // @ts-ignore
          const childString =
            typeof child === "string" ? child : child?.props?.children?.toString();

          if (childString) {
            stringValue += childString + "\n";
          }
        });
      }

      const valueToCopy = stringValue || messageRef.current?.textContent || "";

      copy(valueToCopy);

      onMessageCopy?.(valueToCopy);
    }, [copy, message, onMessageCopy]);

    const handleFeedback = React.useCallback(
      (liked: boolean) => {
        setFeedback(liked ? "like" : "dislike");

        onFeedback?.(liked ? "like" : "dislike");
      },
      [onFeedback],
    );

    const handleAttemptFeedback = React.useCallback(
      (feedback: "like" | "dislike" | "same") => {
        setAttemptFeedback(feedback);

        onAttemptFeedback?.(feedback);
      },
      [onAttemptFeedback],
    );

    const getTipString = (status: CHAT_STATUS_ENUM) => {
      switch (status) {
        case CHAT_STATUS_ENUM.Analyzing:
          return "Analyzing question...";
        case CHAT_STATUS_ENUM.Searching:
          return "Searching relevant information...";
        case CHAT_STATUS_ENUM.Generating:
          return "Organizing the response...";
        default:
          return "Think...";
      }
    };

    if (chatStatus != null && chatStatus != CHAT_STATUS_ENUM.Generating) {
      return (
        <div className="flex flex-row w-full">
          {avatar}
          <Spacer x={4}></Spacer>
          <div className="flex flex-col w-full mr-10 items-start gap-1">
            <div className="flex flex-row justify-center gap-1 items-center">
              <Spinner size="md"></Spinner>
              <h4 className="text-slate-400">{getTipString(chatStatus)}</h4>
            </div>
            <MessageSkeleton />
          </div>
        </div>
      );
    }

    const avatarBadgeContent = (
      <div className="relative flex-shrink">
        <Badge
          isOneChar
          color="danger"
          content={
            <Icon className="text-background" icon="gravity-ui:circle-exclamation-fill" />
          }
          isInvisible={!hasFailed}
          placement="bottom-right"
          shape="circle"
        >
          {avatar}
        </Badge>
      </div>
    );

    const userMessageContent = (
      <div className="flex w-full flex-col gap-2 ml-14">
        <div
          className={cn(
            "relative w-full rounded-medium px-4 py-2 text-default-800 ",
            failedMessageClassName,
            messageClassName,
          )}
        >
          <div ref={messageRef} className={"px-1 text-medium flex justify-end"}>
            {hasFailed ? failedMessage : message}
          </div>
          <div className="flex flex-row flex-wrap w-full ">
            {files &&
              files.map((item) => <UploadFile className="flex shrink" {...item} />)}
          </div>
        </div>
      </div>
    );

    const aiMessageContent = (
      <div className="flex flex-grow w-full flex-col gap-4 mr-14">
        <div
          className={cn(
            "relative flex-grow  w-full rounded-medium bg-content2 px-4 py-1 text-default-600",
            failedMessageClassName,
            messageClassName,
          )}
        >
          <div ref={messageRef} className={"px-1 text-medium min-h-8"}>
            {hasFailed ? (
              failedMessage
            ) : (
              <MarkdownRenderer content={message?.toString() || ""}></MarkdownRenderer>
            )}
          </div>

          <div className="flex flex-row justify-between items-center">
            {showFeedback && !hasFailed && (
              <div className="flex ">
                <Button
                  isIconOnly
                  radius="full"
                  size="sm"
                  variant="light"
                  onPress={handleCopy}
                >
                  {copied ? (
                    <Icon className="text-lg text-default-600" icon="gravity-ui:check" />
                  ) : (
                    <Icon className="text-lg text-default-600" icon="gravity-ui:copy" />
                  )}
                </Button>
                <Button
                  isIconOnly
                  radius="full"
                  size="sm"
                  variant="light"
                  onPress={() => handleFeedback(true)}
                >
                  {feedback === "like" ? (
                    <Icon
                      className="text-lg text-default-600"
                      icon="gravity-ui:thumbs-up-fill"
                    />
                  ) : (
                    <Icon
                      className="text-lg text-default-600"
                      icon="gravity-ui:thumbs-up"
                    />
                  )}
                </Button>
                <Button
                  isIconOnly
                  radius="full"
                  size="sm"
                  variant="light"
                  onPress={() => handleFeedback(false)}
                >
                  {feedback === "dislike" ? (
                    <Icon
                      className="text-lg text-default-600"
                      icon="gravity-ui:thumbs-down-fill"
                    />
                  ) : (
                    <Icon
                      className="text-lg text-default-600"
                      icon="gravity-ui:thumbs-down"
                    />
                  )}
                </Button>
              </div>
            )}
            {attempts > 1 && !hasFailed && (
              <div className="flex w-full items-center justify-end">
                <button
                  onClick={() =>
                    onAttemptChange?.(currentAttempt > 1 ? currentAttempt - 1 : 1)
                  }
                >
                  <Icon
                    className="cursor-pointer text-default-400 hover:text-default-500"
                    icon="gravity-ui:circle-arrow-left"
                  />
                </button>
                <button
                  onClick={() =>
                    onAttemptChange?.(
                      currentAttempt < attempts ? currentAttempt + 1 : attempts,
                    )
                  }
                >
                  <Icon
                    className="cursor-pointer text-default-400 hover:text-default-500"
                    icon="gravity-ui:circle-arrow-right"
                  />
                </button>
                <p className="px-1 text-tiny font-medium text-default-500">
                  {currentAttempt}/{attempts}
                </p>
              </div>
            )}
          </div>
        </div>
        {/* {showFeedback && attempts > 1 && (
          <div className="flex items-center justify-between rounded-medium border-small border-default-100 px-4 py-3 shadow-small">
            <p className="text-small text-default-600">
              Was this response better or worse?
            </p>
            <div className="flex gap-1">
              <Tooltip content="Better">
                <Button
                  isIconOnly
                  radius="full"
                  size="sm"
                  variant="light"
                  onPress={() => handleAttemptFeedback("like")}
                >
                  {attemptFeedback === "like" ? (
                    <Icon
                      className="text-lg text-primary"
                      icon="gravity-ui:thumbs-up-fill"
                    />
                  ) : (
                    <Icon
                      className="text-lg text-default-600"
                      icon="gravity-ui:thumbs-up"
                    />
                  )}
                </Button>
              </Tooltip>
              <Tooltip content="Worse">
                <Button
                  isIconOnly
                  radius="full"
                  size="sm"
                  variant="light"
                  onPress={() => handleAttemptFeedback("dislike")}
                >
                  {attemptFeedback === "dislike" ? (
                    <Icon
                      className="text-lg text-default-600"
                      icon="gravity-ui:thumbs-down-fill"
                    />
                  ) : (
                    <Icon
                      className="text-lg text-default-600"
                      icon="gravity-ui:thumbs-down"
                    />
                  )}
                </Button>
              </Tooltip>
              <Tooltip content="Same">
                <Button
                  isIconOnly
                  radius="full"
                  size="sm"
                  variant="light"
                  onPress={() => handleAttemptFeedback("same")}
                >
                  {attemptFeedback === "same" ? (
                    <Icon
                      className="text-lg text-danger"
                      icon="gravity-ui:face-sad"
                    />
                  ) : (
                    <Icon
                      className="text-lg text-default-600"
                      icon="gravity-ui:face-sad"
                    />
                  )}
                </Button>
              </Tooltip>
            </div>
          </div>
        )} */}
      </div>
    );

    return (
      <div {...props} ref={ref} className={cn("flex gap-3 max-h-[600px]", className)}>
        {isUser ? (
          <>
            {userMessageContent}
            {avatarBadgeContent}
          </>
        ) : (
          <div className="flex flex-row gap-3">
            {avatarBadgeContent}
            <div className="gap-3 mr-10">
              {sourceResults && sourceResults.length > 0 && (
                <SourceSection title="Sources" items={sourceResults} />
              )}
              <Spacer x={2} />
              <div className="flex flex-row items-center justify-start gap-1 p-1 ">
                <Icon className="text-lg text-default-600" icon="mdi:idea" />
                <span className="text-slate-500">Answer:</span>
              </div>
              <div className="flex flex-col  pl-2">{aiMessageContent}</div>
            </div>
          </div>
        )}
      </div>
    );
  },
);

export default MessageCard;

MessageCard.displayName = "MessageCard";
