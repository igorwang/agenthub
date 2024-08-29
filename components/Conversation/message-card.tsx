"use client";
import React, { ReactNode, useCallback, useMemo, useState } from "react";

import { cn } from "@/cn";
import { SourceSection } from "@/components/Conversation/source-section";
import FeatureTool from "@/components/Conversation/tool-card";
import { UploadFileProps } from "@/components/Conversation/upload-file";
import MarkdownRenderer from "@/components/MarkdownRender";
import { MessageSkeleton } from "@/components/ui/message-skeleton";
import {
  Message_Role_Enum,
  Message_Status_Enum,
  Message_Type_Enum,
  useUpdateMessageByIdMutation,
} from "@/graphql/generated/types";
import {
  CHAT_STATUS_ENUM,
  SchemaType,
  SOURCE_TYPE_ENUM,
  SourceType,
  ToolType,
} from "@/types/chatTypes";
import { Icon } from "@iconify/react";
import { Badge, Button, Link, Spacer, Spinner } from "@nextui-org/react";
import { useClipboard } from "@nextui-org/use-clipboard";
import clsx from "clsx";
import { toast } from "sonner";
import { useTranslations } from "use-intl";
import { v4 } from "uuid";
import { useConversationContext } from ".";
import HumanInLoopForm from "./human-input-form";

export type MessageCardProps = React.HTMLAttributes<HTMLDivElement> & {
  avatar?: ReactNode;
  showFeedback?: boolean;
  isUser?: boolean;
  message?: React.ReactNode;
  files?: UploadFileProps[];
  sourceResults?: SourceType[];
  currentAttempt?: number;
  status?: string | null | Message_Status_Enum;
  attempts?: number;
  messageClassName?: string;
  maxWidth?: number;
  isChating?: boolean;
  chatStatus?: CHAT_STATUS_ENUM | null;
  tools?: ToolType[] | null;
  agentId?: string;
  messageId: string;
  messageType?: Message_Type_Enum | null;
  schema?: { [key: string]: any };
  sessionId?: string;
  onAttemptChange?: (attempt: number) => void;
  onMessageCopy?: (content: string | string[]) => void;
  onFeedback?: (feedback: "like" | "dislike") => void;
  onAttemptFeedback?: (feedback: "like" | "dislike" | "same") => void;
  onSelectedSource?: (source: SourceType, selected: boolean) => void;
};

const MessageCard = React.forwardRef<HTMLDivElement, MessageCardProps>(
  (
    {
      avatar,
      isChating,
      messageId,
      chatStatus,
      message,
      showFeedback,
      attempts = 1,
      currentAttempt = 1,
      isUser,
      status,
      files,
      sourceResults,
      tools,
      agentId,
      className,
      messageClassName,
      maxWidth,
      messageType,
      schema,
      sessionId,
      onMessageCopy,
      onAttemptChange,
      onFeedback,
      onAttemptFeedback,
      onSelectedSource,
      ...props
    },
    ref,
  ) => {
    const t = useTranslations();
    const [feedback, setFeedback] = React.useState<"like" | "dislike">();
    const [isToolRuning, setIsToolRuning] = React.useState<boolean>(false);
    const [tool, setTool] = React.useState<ToolType | null>();
    const [attemptFeedback, setAttemptFeedback] = React.useState<
      "like" | "dislike" | "same"
    >();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [widthClassname, setWidthClassname] = React.useState<string>("max-w-full");
    const messageRef = React.useRef<HTMLDivElement>(null);
    const { copied, copy } = useClipboard();

    const { handleSetChatStatus, handleCreateNewMessage } = useConversationContext();
    const [updateMessageByIdMutation] = useUpdateMessageByIdMutation();

    const failedMessageClassName =
      status === Message_Status_Enum.Failed
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

    const hasFailed = status === Message_Status_Enum.Failed;

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

    const featureToolComponent = useMemo(() => {
      if (tool?.id && agentId) {
        return (
          <FeatureTool
            messageId={messageId}
            agentId={agentId}
            toolId={tool?.id}
            schema={tool?.output_schema as SchemaType}
            onLoadingChange={(value) => setIsToolRuning(value)}
          />
        );
      }
      return null;
    }, [tool, agentId, messageId]);

    const getTipString = (status: CHAT_STATUS_ENUM) => {
      switch (status) {
        case CHAT_STATUS_ENUM.Analyzing:
          return `${t("Analyzing question")}...`;
        case CHAT_STATUS_ENUM.Searching:
          return `${t("Searching relevant information")}...`;
        case CHAT_STATUS_ENUM.Generating:
          return `${t("Organizing the response")}...`;
        default:
          return `${t("Think")}...`;
      }
    };

    const handleClose = useCallback(() => {
      setIsCollapsed(true);
    }, []);

    const handleSubmit = (formData: any) => {
      console.log("formData", formData);
      console.log("messageId", messageId);
      console.log("schema", schema);
      console.log("sessionId", sessionId);

      try {
        updateMessageByIdMutation({
          variables: {
            pk_columns: { id: messageId },
            _set: { status: Message_Status_Enum.Success },
          },
        });
      } catch (error) {
        console.error("GraphQL errors:", error);
        toast(t("Submit Error"));
        return null;
      }
      const newId = v4();
      console.log("newId", newId);
      handleCreateNewMessage?.({
        id: newId,
        query: "",
        content: JSON.stringify(formData),
        session_id: sessionId || "",
        role: Message_Role_Enum.User,
        status: Message_Status_Enum.Success,
        message_type: Message_Type_Enum.Json,
        schema: schema,
      });
      handleSetChatStatus(true, CHAT_STATUS_ENUM.New);
    };

    const toggleCollapse = () => setIsCollapsed(!isCollapsed);

    if (chatStatus != null && chatStatus != CHAT_STATUS_ENUM.Generating) {
      return (
        <div className="flex w-full flex-row">
          {avatar}
          <Spacer x={4}></Spacer>
          <div className="mr-10 flex w-full flex-col items-start gap-1">
            <div className="flex flex-row items-center justify-center gap-1">
              <Spinner size="md"></Spinner>
              <h4 className="text-slate-400">{getTipString(chatStatus)}</h4>
            </div>
            <MessageSkeleton />
          </div>
        </div>
      );
    }

    const handleRunTool = (newTool: ToolType) => {
      if (!tool) {
        setIsToolRuning(true);
        setTool(newTool);
      } else {
        setTool(null);
      }
    };

    const avatarBadgeContent = (
      <Badge
        isOneChar
        color="danger"
        content={
          <Icon className="text-background" icon="gravity-ui:circle-exclamation-fill" />
        }
        placement="bottom-right"
        isInvisible={!hasFailed}
        shape="circle">
        {avatar}
      </Badge>
    );

    const librarySources = sourceResults?.filter(
      (item) => item.sourceType == SOURCE_TYPE_ENUM.file,
    );

    const webSources = sourceResults?.filter(
      (item) => item.sourceType == SOURCE_TYPE_ENUM.webpage,
    );

    const toolsContent = (
      <div className="flex flex-grow-0">
        {tools?.map((item) => (
          <Button
            isLoading={isToolRuning}
            className="flex-grow-0"
            variant="bordered"
            key={item.id}
            onClick={() => handleRunTool(item)}
            startContent={<Icon icon={"octicon:tools-24"} fontSize={20} />}>
            Run {item.name}
          </Button>
        ))}
      </div>
    );

    let jsonContent: { [key: string]: any } = {};
    if (isUser && message?.toString() && messageType === Message_Type_Enum.Json) {
      try {
        jsonContent = JSON.parse(message.toString());
      } catch (error) {
        console.error("Error parsing JSON content:", error);
        jsonContent = {};
      }
    }

    const removeDescSchema = (schema: { [key: string]: any }): { [key: string]: any } => {
      if (typeof schema !== "object" || schema === null) {
        return schema;
      }

      if (Array.isArray(schema)) {
        return schema.map(removeDescSchema);
      }

      const newSchema: { [key: string]: any } = { ...schema };
      delete newSchema.description;

      for (const key in newSchema) {
        if (Object.prototype.hasOwnProperty.call(newSchema, key)) {
          if (typeof newSchema[key] === "object" && newSchema[key] !== null) {
            newSchema[key] = removeDescSchema(newSchema[key]);
          }
        }
      }

      return newSchema;
    };

    const cleanSchema = removeDescSchema(schema || {});

    const userMessageContent = (
      <div className="w-8/10 ml-14 flex flex-grow flex-col gap-2">
        <div
          className={cn(
            "relative w-full rounded-medium px-4 py-2 text-default-800",
            messageClassName,
          )}>
          <div ref={messageRef} className={"flex justify-end px-1 text-medium"}>
            {isUser &&
            message?.toString() &&
            messageType === Message_Type_Enum.Json &&
            jsonContent ? (
              <HumanInLoopForm
                schema={cleanSchema || {}}
                formData={jsonContent}
                disabled={true}
              />
            ) : (
              message
            )}
          </div>
        </div>
      </div>
    );

    const aiMessageContent = (
      <div className="mr-14 flex max-w-full flex-grow flex-col gap-4">
        <div
          className={cn(
            "relative w-full rounded-medium bg-content2 px-4 py-1 text-default-600",
            failedMessageClassName,
            messageClassName,
          )}>
          <div ref={messageRef} className={"min-h-8 px-1 text-medium"}>
            <div className="mr-10 gap-3">
              {sourceResults && sourceResults.length > 0 && (
                <SourceSection
                  title={t("library Sources")}
                  items={librarySources || []}
                />
              )}
              <Spacer x={2} />
              {webSources && webSources.length > 0 && (
                <SourceSection
                  title={t("Web Sources")}
                  items={webSources || []}></SourceSection>
              )}
              <Spacer x={2} />
              <div className="flex flex-row items-center justify-start gap-1 p-1">
                <Icon className="text-lg text-default-600" icon="hugeicons:idea-01" />
                <span className="text-slate-500">{t("Answer")}:</span>
              </div>
              <div className={clsx("flex max-w-full flex-col overflow-hidden p-1")}>
                <MarkdownRenderer content={message?.toString() || ""}></MarkdownRenderer>
              </div>
            </div>
          </div>

          <div className="flex flex-row items-center justify-between pt-1">
            {sourceResults && sourceResults.length > 1 && toolsContent}
            {showFeedback && !hasFailed && (
              <div className="flex">
                <Button
                  isIconOnly
                  radius="full"
                  size="sm"
                  variant="light"
                  onPress={handleCopy}>
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
                  onPress={() => handleFeedback(true)}>
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
                  onPress={() => handleFeedback(false)}>
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
            {/* {attempts > 1 && !hasFailed && (
              <div className="flex w-full items-center justify-end">
                <button
                  onClick={() =>
                    onAttemptChange?.(currentAttempt > 1 ? currentAttempt - 1 : 1)
                  }>
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
                  }>
                  <Icon
                    className="cursor-pointer text-default-400 hover:text-default-500"
                    icon="gravity-ui:circle-arrow-right"
                  />
                </button>
                <p className="px-1 text-tiny font-medium text-default-500">
                  {currentAttempt}/{attempts}
                </p>
              </div>
            )} */}
          </div>
        </div>
        {status === Message_Status_Enum.Waiting &&
          messageType === Message_Type_Enum.Json &&
          schema && (
            <div className="relative mx-8 rounded-lg bg-blue-100 p-4 shadow-sm">
              <Button
                isIconOnly
                size="sm"
                variant="light"
                className="absolute right-1 top-0 z-10"
                onClick={toggleCollapse}>
                <Icon
                  icon={isCollapsed ? "mdi:chevron-down" : "mdi:chevron-up"}
                  width="24"
                  height="24"
                />
              </Button>
              {!isCollapsed && (
                <HumanInLoopForm
                  schema={schema}
                  onClose={handleClose}
                  onSubmit={handleSubmit}
                />
              )}
            </div>
          )}
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
      <div {...props} ref={ref} className={cn("flex w-full max-w-7xl", className)}>
        {isUser ? (
          <div className="flex w-full flex-row">
            <div className="flex-grow">{userMessageContent}</div>
            <div className="ml-3 w-10 flex-shrink-0">{avatarBadgeContent}</div>
          </div>
        ) : (
          <div className="flex w-full flex-row">
            <div className="mr-3 w-10 flex-shrink-0">{avatarBadgeContent}</div>
            <div className="relative flex flex-grow flex-col gap-2">
              {aiMessageContent}
              {tool?.id && featureToolComponent}
            </div>
          </div>
        )}
      </div>
    );
  },
);

export default MessageCard;

MessageCard.displayName = "MessageCard";
