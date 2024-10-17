"use client";

import { cn } from "@/cn";
import { Icon } from "@iconify/react";
import {
  Button,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Tooltip,
} from "@nextui-org/react";
import { useCallback, useState } from "react";

import WorkflowToolRunSelect from "@/components/Conversation/workflow-tool-run-select";
import {
  Agent_Mode_Enum,
  Message_Role_Enum,
  useCreateMessageAndUpdateTopicHistoryMutation,
  useCreateNewTopicWithMessageMutation,
  WorkflowFragmentFragment,
} from "@/graphql/generated/types";
import {
  selectIsChating,
  selectSelectedSessionId,
  selectSession,
  setChatStatus,
  setIsChating,
} from "@/lib/features/chatListSlice";
import { checkHasVisionFunction } from "@/lib/models/visionLLM";
import { AppDispatch } from "@/lib/store";
import { CHAT_STATUS_ENUM } from "@/types/chatTypes";
import { ExtFile } from "@dropzone-ui/react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import UploadZone, { UploadFileType } from "../UploadZone";
import PromptInput from "./prompt-input";

type PromptInputWithFaqV1Props = {
  agentId?: string;
  agentMode?: Agent_Mode_Enum;
  model?: string;
  workflowTools?: WorkflowFragmentFragment[];
  onRunWorkflowTool?: (tool: WorkflowFragmentFragment) => void;
};

export default function PromptInputWithFaqV1({
  agentId,
  agentMode,
  model,
  workflowTools = [],
  onRunWorkflowTool,
}: PromptInputWithFaqV1Props) {
  const t = useTranslations();
  const router = useRouter();
  const pathname = usePathname();
  const dispatch: AppDispatch = useDispatch();
  const selectedSessionId = useSelector(selectSelectedSessionId);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isImageUploadOpen, setIsImageUploadOpen] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  const isChating = useSelector(selectIsChating);

  const [files, setFiles] = useState<ExtFile[]>([]);
  const [prompt, setPrompt] = useState<string>("");
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const [createMessageAndUpdateTopicHistoryMutation, { data, loading, error }] =
    useCreateMessageAndUpdateTopicHistoryMutation();

  const [createNewTopicWithMessageMutation] = useCreateNewTopicWithMessageMutation();

  const session = useSession();
  const user_id = session.data?.user?.id;
  // const agent_id = selectedChatId;

  const hasVisionFunction = checkHasVisionFunction(model || "");

  const openUploadModal = useCallback(async () => {
    if (!selectedSessionId) {
      try {
        const response = await createNewTopicWithMessageMutation({
          variables: {
            object: {
              title: prompt.slice(0, 15) || t("New Chat"),
              user_id: user_id,
              agent_id: agentId,
            },
          },
        });
        const data = response.data;
        if (data?.insert_topic_history_one) {
          const newSessionId = data?.insert_topic_history_one?.id;
          dispatch(selectSession(newSessionId));
          router.push(`${pathname}?session_id=${newSessionId}&isNew=true`);
          setIsUploadOpen(true);
        }
      } catch (error) {
        console.error("Error adding topic:", error);
        toast.error(t("System error, please try later"), {
          position: "bottom-left",
        });
      }
    } else {
      setIsUploadOpen(true);
    }
  }, [
    agentId,
    createNewTopicWithMessageMutation,
    dispatch,
    pathname,
    prompt,
    router,
    selectedSessionId,
    t,
    user_id,
  ]);

  const closeUploadModal = () => {
    setIsUploadOpen(false);
  };

  const handleFileChange = (files: UploadFileType[]) => {
    setIsUploadOpen(false);
  };

  const handleImageChange = (files: UploadFileType[]) => {
    const imageUrls = files.map(
      (file) => `https://${process.env.MINIO_ENDPOINT}/public/${file.objectName}`,
    );
    setImageUrls(imageUrls);
    setIsImageUploadOpen(false);
  };

  const stopSendMessageHanlder = () => {
    dispatch(setIsChating(false));
    dispatch(setChatStatus(CHAT_STATUS_ENUM.Interpret));
  };

  const sendMessageHanlder = async () => {
    if (!selectedSessionId) {
      try {
        const response = await createNewTopicWithMessageMutation({
          variables: {
            object: {
              title: prompt.slice(0, 50),
              user_id: user_id,
              agent_id: agentId,
              messages: {
                data: [
                  {
                    content: prompt,
                    role: Message_Role_Enum.User,
                    attachments: [],
                    imageUrls: imageUrls,
                  },
                ],
              },
            },
          },
        });
        const data = response.data;
        if (data?.insert_topic_history_one) {
          const newSessionId = data?.insert_topic_history_one?.id;
          dispatch(selectSession(newSessionId));
          dispatch(setIsChating(true));
          dispatch(setChatStatus(CHAT_STATUS_ENUM.New));
          router.push(`${pathname}?session_id=${newSessionId}&`);
        }
      } catch (error) {
        console.error("Error adding topic:", error);
        toast.error("System error, please try later.", {
          position: "bottom-left",
        });
        dispatch(setIsChating(false));
        dispatch(setChatStatus(null));
      }
    } else {
      createMessageAndUpdateTopicHistoryMutation({
        variables: {
          content: prompt,
          session_id: selectedSessionId,
          role: Message_Role_Enum.User,
          attachments: [],
          imageUrls: imageUrls,
        },
      });
      dispatch(setIsChating(true));
      dispatch(setChatStatus(CHAT_STATUS_ENUM.New));
    }
    setPrompt("");
    setFiles([]);
    setImageUrls([]);
  };

  const sendButton = (
    <Tooltip showArrow content="Send message">
      <Button
        isIconOnly
        color={!prompt ? "default" : "primary"}
        isDisabled={!prompt || isChating}
        radius="lg"
        size="md"
        variant="solid"
        onClick={sendMessageHanlder}>
        <Icon
          className={cn(
            "[&>path]:stroke-[2px]",
            !prompt ? "text-default-600" : "text-primary-foreground",
          )}
          icon="solar:arrow-up-linear"
          width={20}
        />
      </Button>
    </Tooltip>
  );

  const stopButton = (
    <Tooltip showArrow content="Stop Chat">
      <Button
        isIconOnly
        color={"primary"}
        isDisabled={!isChating}
        radius="lg"
        size="md"
        variant="solid"
        onClick={stopSendMessageHanlder}>
        <Icon
          className={cn(
            "[&>path]:stroke-[2px]",
            !prompt ? "text-default-600" : "text-primary-foreground",
          )}
          icon="teenyicons:stop-solid"
          width={20}
        />
      </Button>
    </Tooltip>
  );

  const runWorkflowTool = (tool: WorkflowFragmentFragment) => {
    onRunWorkflowTool?.(tool);
    setIsPopoverOpen(false);
  };

  return (
    <div className="flex w-full max-w-full flex-col items-center px-2">
      <form className="flex w-full flex-col items-start rounded-medium bg-default-100 transition-colors hover:bg-default-200/70">
        {imageUrls.length > 0 && (
          <div className="flex flex-row gap-2 p-2">
            {imageUrls.map((url) => (
              <div key={url} className="relative">
                <Image
                  src={url}
                  alt="Uploaded Image"
                  className="h-20 w-20 rounded-md object-cover"
                />
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  className="absolute -right-1 -top-1 z-10"
                  onClick={() => setImageUrls(imageUrls.filter((i) => i !== url))}>
                  <Icon icon="mdi:close" width={16} />
                </Button>
              </div>
            ))}
          </div>
        )}
        <PromptInput
          classNames={{
            inputWrapper: "!bg-transparent shadow-none",
            innerWrapper: "relative",
            input: "pt-1 pl-2 pb-6 !pr-10 text-medium",
          }}
          placeholder={t("Send message to AI")}
          endContent={
            <div className="flex items-end gap-2">
              {isChating ? stopButton : sendButton}
            </div>
          }
          minRows={2}
          radius="lg"
          value={prompt}
          variant="flat"
          onValueChange={setPrompt}
        />

        {agentMode === Agent_Mode_Enum.Workflow && (
          <div className="flex items-center justify-between gap-2 px-4 pb-4">
            <div className="flex gap-1 md:gap-3">
              <Button
                size="sm"
                startContent={
                  <Icon
                    className="text-default-500"
                    icon="solar:paperclip-linear"
                    width={18}
                  />
                }
                variant="flat"
                onClick={openUploadModal}>
                {t("File")}
              </Button>
              {hasVisionFunction && (
                <Button
                  size="sm"
                  startContent={
                    <Icon
                      className="text-default-500"
                      icon="material-symbols:image-outline"
                      width={18}
                    />
                  }
                  variant="flat"
                  onClick={() => setIsImageUploadOpen(true)}>
                  {t("Image")}
                </Button>
              )}
              {workflowTools.length > 0 && (
                <Popover
                  placement="top"
                  isOpen={isPopoverOpen}
                  onOpenChange={setIsPopoverOpen}>
                  <PopoverTrigger>
                    <Button
                      size="sm"
                      startContent={
                        <Icon
                          className="text-default-500"
                          icon="carbon:application"
                          width={18}
                        />
                      }
                      variant="flat">
                      {t("Tools")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent>
                    <WorkflowToolRunSelect
                      workflowTools={workflowTools}
                      onRunWorkflowTool={runWorkflowTool}
                    />
                  </PopoverContent>
                </Popover>
              )}
            </div>
            {/* <p className="py-1 text-tiny text-default-400">{prompt.length}/4000</p> */}
          </div>
        )}
      </form>
      {isImageUploadOpen && (
        <Modal
          isOpen={isImageUploadOpen}
          onClose={() => setIsImageUploadOpen(false)}
          className="rounded-lg bg-white shadow-lg"
          size="2xl">
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1 border-b pb-4 text-2xl font-semibold text-gray-700">
                  {t("Upload Images")}
                </ModalHeader>
                <ModalBody className="py-6">
                  <UploadZone
                    isImageUpload={true}
                    acceptFileTypes=".png,.jpg,.jpeg"
                    onAfterUpload={handleImageChange}
                    maxNumberOfFile={5}
                  />
                </ModalBody>
              </>
            )}
          </ModalContent>
        </Modal>
      )}

      {isUploadOpen && selectedSessionId && (
        <Modal
          isOpen={isUploadOpen}
          onClose={closeUploadModal}
          className="rounded-lg bg-white shadow-lg"
          size="2xl">
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1 border-b pb-4 text-2xl font-semibold text-gray-700">
                  {t("Upload Files")}
                </ModalHeader>
                <ModalBody className="py-6">
                  <UploadZone
                    // knowledgeBaseId={knowledgeBaseId}
                    // onAfterUpload={handleAfterUploadFile}
                    sessionId={selectedSessionId}
                    onAfterUpload={handleFileChange}
                    maxNumberOfFile={5}
                    acceptFileTypes=".doc,.docx,.pdf,.ppt,.pptx,.xls,.xlsx,.txt,.json,.md"
                  />
                </ModalBody>
              </>
            )}
          </ModalContent>
        </Modal>
      )}
    </div>
  );
}
