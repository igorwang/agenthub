"use client";

import { cn } from "@/cn";
import { Icon } from "@iconify/react";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Tooltip,
} from "@nextui-org/react";
import { useCallback, useState } from "react";

import {
  Agent_Mode_Enum,
  Message_Role_Enum,
  useCreateMessageAndUpdateTopicHistoryMutation,
  useCreateNewTopicWithMessageMutation,
} from "@/graphql/generated/types";
import {
  selectSelectedChatId,
  selectSelectedSessionId,
  selectSession,
} from "@/lib/features/chatListSlice";
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

type PromptInputWithFaqProps = {
  agentMode?: Agent_Mode_Enum;
  isChating?: boolean;
  onChatingStatus?: (isChating: boolean, stauts: CHAT_STATUS_ENUM | null) => void;
};

export default function PromptInputWithFaq({
  agentMode,
  isChating: isChating,
  onChatingStatus,
}: PromptInputWithFaqProps) {
  const t = useTranslations();
  const router = useRouter();
  const pathname = usePathname();
  const dispatch: AppDispatch = useDispatch();
  const selectedChatId = useSelector(selectSelectedChatId);
  const selectedSessionId = useSelector(selectSelectedSessionId);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  // const [files, setFiles] = useState<UploadFileProps[]>([]);

  const [files, setFiles] = useState<ExtFile[]>([]);
  const [prompt, setPrompt] = useState<string>("");

  const [createMessageAndUpdateTopicHistoryMutation, { data, loading, error }] =
    useCreateMessageAndUpdateTopicHistoryMutation();

  const [createNewTopicWithMessageMutation] = useCreateNewTopicWithMessageMutation();
  const session = useSession();
  const user_id = session.data?.user?.id;
  const agent_id = selectedChatId;

  const openUploadModal = useCallback(async () => {
    if (!selectedSessionId) {
      try {
        const response = await createNewTopicWithMessageMutation({
          variables: {
            object: {
              title: prompt.slice(0, 15) || t("New Chat"),
              user_id: user_id,
              agent_id: agent_id,
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
  }, [selectedSessionId]);

  const closeUploadModal = () => {
    setIsUploadOpen(false);
  };

  const handleFileChange = (files: UploadFileType[]) => {
    console.log("handleFileChange", files);
  };

  const stopSendMessageHanlder = () => {
    onChatingStatus?.(false, CHAT_STATUS_ENUM.Interpret);
  };

  const sendMessageHanlder = async () => {
    onChatingStatus?.(true, null);
    if (!selectedSessionId) {
      try {
        const response = await createNewTopicWithMessageMutation({
          variables: {
            object: {
              title: prompt.slice(0, 15),
              user_id: user_id,
              agent_id: agent_id,
              messages: {
                data: [
                  {
                    content: prompt,
                    role: Message_Role_Enum.User,
                    attachments: [],
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
          router.push(`${pathname}?session_id=${newSessionId}&isNew=true`);
          onChatingStatus?.(true, null);
        }
      } catch (error) {
        console.error("Error adding topic:", error);
        toast.error("System error, please try later.", {
          position: "bottom-left",
        });
        onChatingStatus?.(false, null);
      }
    } else {
      createMessageAndUpdateTopicHistoryMutation({
        variables: {
          content: prompt,
          session_id: selectedSessionId,
          role: Message_Role_Enum.User,
          attachments: [],
        },
      });
    }
    setPrompt("");
    setFiles([]);
  };

  // const uploadFileListElement = files.map((item, index) => (
  //   <UploadFile
  //     key={index}
  //     file={item.file}
  //     fileName={item.fileName}
  //     isLoading={item.isLoading}
  //     className={item.className}
  //     url={item.url}
  //     removeFileHandler={removeFileHanlder}
  //   />
  // ));

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

  return (
    <div className="flex w-full max-w-full flex-col items-center px-2">
      <form className="flex w-full flex-col items-start rounded-medium bg-default-100 transition-colors hover:bg-default-200/70">
        {/* <ScrollShadow
          className="flex w-full flex-row flex-nowrap gap-2"
          orientation="horizontal">
          {uploadFileListElement}
        </ScrollShadow> */}
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
              {/* <Button
              size="sm"
              startContent={
                <Icon
                  className="text-default-500"
                  icon="solar:soundwave-linear"
                  width={18}
                />
              }
              variant="flat"
            >
              Voice
            </Button> */}
            </div>
            {/* <p className="py-1 text-tiny text-default-400">{prompt.length}/4000</p> */}
          </div>
        )}
      </form>
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
