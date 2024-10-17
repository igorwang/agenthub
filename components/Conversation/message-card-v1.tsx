import React, { ReactNode, useCallback, useMemo, useState } from "react";

import { cn } from "@/cn";
import { SourceSection } from "@/components/Conversation/source-section";
import FeatureTool from "@/components/Conversation/tool-card";
import MarkdownRenderer from "@/components/MarkdownRender";
import { PromptTemplateType } from "@/components/PromptFrom";
import { MessageSkeleton } from "@/components/ui/message-skeleton";
import {
  AircraftFragmentFragment,
  Message_Role_Enum,
  Message_Status_Enum,
  Message_Type_Enum,
  useUpdateMessageByIdMutation,
} from "@/graphql/generated/types";
import {
  selectChatSessionContext,
  selectChatStatus,
  selectCurrentAircraftId,
  selectIsAircraftGenerating,
  selectSelectedSessionId,
  setCurrentAircraftId,
  setIsAircraftOpen,
} from "@/lib/features/chatListSlice";
import { AppDispatch } from "@/lib/store";
import {
  CHAT_STATUS_ENUM,
  MessageType,
  SchemaType,
  SOURCE_TYPE_ENUM,
  ToolType,
} from "@/types/chatTypes";
import { Icon } from "@iconify/react";
import {
  Badge,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Image,
  Link,
  Spacer,
  Spinner,
} from "@nextui-org/react";
import { useClipboard } from "@nextui-org/use-clipboard";
import clsx from "clsx";
import { useSession } from "next-auth/react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { useTranslations } from "use-intl";
import { v4 } from "uuid";
import { useConversationContext } from ".";
import HumanInLoopForm from "./human-input-form";

export type MessageCardProps = React.HTMLAttributes<HTMLDivElement> & {
  message: MessageType;
  chatingMessageId?: string | null;
  workflow_id?: string;
  avatar?: ReactNode;
  showFeedback?: boolean;
  currentAttempt?: number;
  attempts?: number;
  messageClassName?: string;
  maxWidth?: number;
  tools?: ToolType[] | null;
  agentId?: string;
  promptTemplates: PromptTemplateType[];
};

const MessageCardV1 = React.forwardRef<HTMLDivElement, MessageCardProps>(
  (
    {
      avatar,
      message,
      chatingMessageId,
      showFeedback,
      attempts = 1,
      currentAttempt = 1,
      tools,
      agentId,
      workflow_id,
      className,
      messageClassName,
      maxWidth,
      promptTemplates,
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
    const isChating = useSelector(selectChatStatus);
    const chatStatus = useSelector(selectChatStatus);
    const selectedSessionId = useSelector(selectSelectedSessionId);
    const chatSessionContext = useSelector(selectChatSessionContext);
    const isUser = message.role === Message_Role_Enum.User;
    const session = useSession();
    const currentAircraftId = useSelector(selectCurrentAircraftId);
    const isAircraftGenerating = useSelector(selectIsAircraftGenerating);
    const { handleSetChatStatus, handleCreateNewMessage } = useConversationContext();
    const [updateMessageByIdMutation] = useUpdateMessageByIdMutation();
    const dispatch: AppDispatch = useDispatch();
    const failedMessageClassName =
      message.status === Message_Status_Enum.Failed
        ? "bg-danger-100/50 border border-danger-100 text-foreground"
        : "";

    const failedMessage = (
      <p>
        Something went wrong, if the issue persists please contact us through our help
        center at&nbsp;
        <Link href="support@techower.com" size="sm">
          support@techower.com
        </Link>
      </p>
    );

    const hasFailed = message.status === Message_Status_Enum.Failed;

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

      // onMessageCopy?.(valueToCopy);
    }, [copy, message]);

    const handleFeedback = React.useCallback((liked: boolean) => {
      setFeedback(liked ? "like" : "dislike");

      // onFeedback?.(liked ? "like" : "dislike");
    }, []);

    const handleAttemptFeedback = React.useCallback(
      (feedback: "like" | "dislike" | "same") => {
        setAttemptFeedback(feedback);

        // onAttemptFeedback?.(feedback);
      },
      [],
    );

    const handleExportDocument = React.useCallback(async () => {
      try {
        const response = await fetch("/api/chat/message/export_document", {
          method: "POST",
          body: JSON.stringify({ message_id: message.id }),
        });
        const data = await response.json();
        if (data.url) {
          window.open(data.url, "_blank");
        } else {
          toast.error(t("Failed to export document"));
        }
      } catch (error) {
        console.error("Error exporting document", error);
        toast.error(t("Failed to export document"));
      }
    }, [message, t]);

    const featureToolComponent = useMemo(() => {
      if (tool?.id && agentId) {
        return (
          <FeatureTool
            messageId={message.id}
            agentId={agentId}
            toolId={tool?.id}
            schema={tool?.output_schema as SchemaType}
            onLoadingChange={(value) => setIsToolRuning(value)}
          />
        );
      }
      return null;
    }, [tool, agentId, message.id]);

    const getTipString = (status: CHAT_STATUS_ENUM | null) => {
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
      try {
        updateMessageByIdMutation({
          variables: {
            pk_columns: { id: message.id },
            _set: { status: Message_Status_Enum.Success },
          },
        });
      } catch (error) {
        console.error("GraphQL errors:", error);
        toast(t("Submit Error"));
        return null;
      }
      const newId = v4();
      handleCreateNewMessage?.({
        id: newId,
        query: "",
        content: JSON.stringify(formData),
        session_id: session.data?.user?.id || "",
        role: Message_Role_Enum.User,
        status: Message_Status_Enum.Success,
        message_type: Message_Type_Enum.Json,
        schema: message.schema,
      });
      handleSetChatStatus(true, CHAT_STATUS_ENUM.New);
    };

    const toggleCollapse = () => setIsCollapsed(!isCollapsed);

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

    const librarySources =
      chatingMessageId === message.id
        ? chatSessionContext?.sources?.filter(
            (item) => item.sourceType == SOURCE_TYPE_ENUM.file,
          )
        : message.sources?.filter((item) => item.sourceType == SOURCE_TYPE_ENUM.file);

    const webSources =
      chatingMessageId === message.id
        ? chatSessionContext?.sources?.filter(
            (item) => item.sourceType == SOURCE_TYPE_ENUM.webpage,
          )
        : message.sources?.filter((item) => item.sourceType == SOURCE_TYPE_ENUM.webpage);

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
    if (
      isUser &&
      message?.toString() &&
      message.messageType &&
      message.messageType === Message_Type_Enum.Json
    ) {
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

    const cleanSchema = removeDescSchema(message.schema || {});

    const handleAircraftClick = async (aircraft: AircraftFragmentFragment) => {
      dispatch(setCurrentAircraftId(aircraft.id));
      dispatch(setIsAircraftOpen(true));
    };

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
            message.messageType &&
            message.messageType === Message_Type_Enum.Json &&
            jsonContent ? (
              <HumanInLoopForm
                schema={cleanSchema || {}}
                formData={jsonContent}
                disabled={true}
              />
            ) : (
              message.message || ""
            )}
          </div>
          {message.imageUrls && message.imageUrls.length > 0 && (
            <div className="flex flex-wrap justify-end gap-2 p-2">
              {message.imageUrls.map((url) => (
                <Image
                  key={url}
                  src={url}
                  alt="Uploaded Image"
                  onClick={() => {
                    const modal = document.createElement("div");
                    modal.style.position = "fixed";
                    modal.style.top = "0";
                    modal.style.left = "0";
                    modal.style.width = "100%";
                    modal.style.height = "100%";
                    modal.style.backgroundColor = "rgba(0,0,0,0.8)";
                    modal.style.display = "flex";
                    modal.style.justifyContent = "center";
                    modal.style.alignItems = "center";
                    modal.style.zIndex = "9999";

                    const img = document.createElement("img");
                    img.src = url;
                    img.style.maxWidth = "90%";
                    img.style.maxHeight = "90%";
                    img.style.objectFit = "contain";

                    modal.appendChild(img);
                    document.body.appendChild(modal);

                    modal.onclick = () => {
                      document.body.removeChild(modal);
                    };
                  }}
                  className="h-20 w-20 cursor-pointer rounded-md object-cover"
                />
              ))}
            </div>
          )}
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
              {librarySources && librarySources.length > 0 && (
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
              {isChating &&
                chatingMessageId === message.id &&
                message.message?.length === 0 && (
                  <div className="flex items-center space-x-2 text-slate-500">
                    <span>{t("Thinking")}</span>
                    <span className="animate-pulse">.</span>
                    <span className="animation-delay-200 animate-pulse">.</span>
                    <span className="animation-delay-400 animate-pulse">.</span>
                  </div>
                )}
              <div className={clsx("flex flex-col overflow-hidden p-1")}>
                <MarkdownRenderer content={message.message || ""}></MarkdownRenderer>
              </div>
              {message.aircraft && message.aircraft.length > 0 && (
                <div>
                  {message.aircraft.map((item) => (
                    <div
                      key={item.id}
                      className={`flex w-full select-none items-center rounded-xl py-2 pl-2 hover:cursor-pointer hover:bg-white dark:hover:bg-white/5 md:w-max ${currentAircraftId === item.id ? "border-2 border-blue-500" : "border-500 border-2"}`}>
                      <div
                        className={`flex flex-row items-center gap-2`}
                        onClick={() => handleAircraftClick(item)}>
                        {isAircraftGenerating && currentAircraftId === item.id ? (
                          <Spinner size="sm" />
                        ) : (
                          <Icon icon="file-icons:docz" fontSize={24} color="#6366f1" />
                        )}
                        <div className="flex flex-col">
                          <div className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            {item.title}
                          </div>
                          <div className="truncate text-xs text-slate-500 dark:text-slate-400">
                            {item.description}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-row items-center justify-between pt-1">
            {librarySources && librarySources.length > 0 && toolsContent}
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
                <Dropdown>
                  <DropdownTrigger>
                    <Button isIconOnly radius="full" size="sm" variant="light">
                      <Icon
                        className="text-lg text-default-600"
                        icon="mdi:dots-vertical"
                      />
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu aria-label="Message actions">
                    <DropdownItem
                      key="export"
                      onClick={() => handleExportDocument()}
                      startContent={<Icon icon="gravity-ui:file-export" />}>
                      {t("Export Document")}
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </div>
            )}
          </div>
        </div>
        {message.status === Message_Status_Enum.Waiting &&
          message.messageType === Message_Type_Enum.Json &&
          message.schema && (
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
                  schema={message.schema}
                  onClose={handleClose}
                  onSubmit={handleSubmit}
                />
              )}
            </div>
          )}
      </div>
    );

    if (chatingMessageId === message.id && chatSessionContext === null) {
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

export default MessageCardV1;

MessageCardV1.displayName = "MessageCardV1";
function dispatch(arg0: any) {
  throw new Error("Function not implemented.");
}
