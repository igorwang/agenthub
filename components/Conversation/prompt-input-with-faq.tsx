"use client";

import { cn } from "@/cn";
import { Icon } from "@iconify/react";
import { Button, Tooltip } from "@nextui-org/react";
import React, { useRef, useState } from "react";

import { UploadFile, UploadFileProps } from "@/components/Conversation/upload-file";
import {
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
import { CHAT_STATUS_ENUM, SourceType } from "@/types/chatTypes";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import PromptInput from "./prompt-input";

// TODO 默认推荐 与用户的聊天内容相关的推荐
const ideas = [
  {
    title: "Create a blog post about NextUI ",
    description: "explain it in simple terms",
  },
  {
    title: "Give me 10 ideas for my next blog post",
    description: "include only the best ideas",
  },
  {
    title: "Compare NextUI with other UI libraries",
    description: "be as objective as possible",
  },
  {
    title: "Write a text message to my friend",
    description: "be polite and friendly",
  },
  {
    title: "Write a text message to my friend",
    description: "be polite and friendly",
  },
  {
    title: "Write a text message to my friend",
    description: "be polite and friendly",
  },
  {
    title: "Write a text message to my friend",
    description: "be polite and friendly",
  },
];

type PromptInputWithFaqProps = {
  isChating?: boolean;
  onChatingStatus?: (isChating: boolean, stauts: CHAT_STATUS_ENUM | null) => void;
  onSelectedSource?: (source: SourceType, selected: boolean) => void;
  selectedSources?: SourceType[];
};

export default function PromptInputWithFaq({
  isChating: isChating,
  onChatingStatus,
  onSelectedSource,
  selectedSources,
}: PromptInputWithFaqProps) {
  const t = useTranslations();
  const router = useRouter();
  const pathname = usePathname();
  const dispatch: AppDispatch = useDispatch();
  const selectedChatId = useSelector(selectSelectedChatId);
  const selectedSessionId = useSelector(selectSelectedSessionId);

  const [files, setFiles] = useState<UploadFileProps[]>([]);
  const [prompt, setPrompt] = useState<string>("");

  const [createMessageAndUpdateTopicHistoryMutation, { data, loading, error }] =
    useCreateMessageAndUpdateTopicHistoryMutation();

  const [createNewTopicWithMessageMutation] = useCreateNewTopicWithMessageMutation();
  const session = useSession();
  const user_id = session.data?.user?.id;
  const agent_id = selectedChatId;

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // useEffect(() => {
  //   console.log("isFollowUp", isFollowUp);
  //   if (isFollowUp) {
  //     setPrompt((prev) => `/FollowUp ${prev}`);
  //   } else {
  //     setPrompt((prev) => prev.replace("/FollowUp", ""));
  //   }
  // }, [isFollowUp]);

  const handleFileButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      try {
        const res = await fetch(
          `/api/file/presigned_url?fileName=${file.name}&fileType=${file.type}&location=chat`,
        );
        const { url, bucket, fileKey, previewUrl } = await res.json();

        const newFileKey = files.length + 1;
        const newFile: UploadFileProps = {
          key: newFileKey,
          file: file,
          fileName: file.name,
          isLoading: true,
          url: previewUrl,
          bucket: bucket,
          fileKey: fileKey,
        };
        setFiles((prevFiles) => [...prevFiles, newFile]);

        const uploadResponse = await fetch(url, {
          method: "PUT",
          body: file,
          headers: {
            "Content-Type": file.type,
          },
        });

        if (!uploadResponse.ok) {
          throw new Error("Failed to upload file");
        }

        setFiles((prevFiles) =>
          prevFiles.map((file) =>
            file.key === newFileKey ? { ...file, isLoading: false } : file,
          ),
        );
      } catch (error) {
        console.error("Error:", error);
      }
    }
    event.target.value = "";
  };

  const removeFileHanlder = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const stopSendMessageHanlder = () => {
    onChatingStatus?.(false, CHAT_STATUS_ENUM.Interpret);
  };

  const sendMessageHanlder = async () => {
    onChatingStatus?.(true, null);
    const attachments = files.map((item) => ({
      // key: item.key,
      fileName: item.fileName,
      bucket: item.bucket,
      fileKey: item.fileKey,
    }));
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
                    attachments: attachments,
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
          attachments: attachments,
        },
      });
    }
    setPrompt("");
    setFiles([]);
  };

  const uploadFileListElement = files.map((item, index) => (
    <UploadFile
      key={index}
      file={item.file}
      fileName={item.fileName}
      isLoading={item.isLoading}
      className={item.className}
      url={item.url}
      removeFileHandler={removeFileHanlder}
    />
  ));

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
        <div className="flex items-center justify-between gap-2 px-4 pb-4">
          <div className="flex gap-1 md:gap-3">
            <input
              type="file"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileChange}
            />
            {/* <Switch
              isSelected={isFollowUp}
              onValueChange={(value) => {
                dispatch(setIsFollowUp(value));
              }}>
              Follow-up
            </Switch> */}
            {/* <Button
              size="sm"
              startContent={
                <Icon
                  className="text-default-500"
                  icon="solar:paperclip-linear"
                  width={18}
                />
              }
              variant="flat"
              onClick={handleFileButtonClick}>
              File
            </Button> */}
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
      </form>
    </div>
  );
}
