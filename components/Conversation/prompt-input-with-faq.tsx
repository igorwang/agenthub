"use client";

import { cn } from "@/cn";
import { Icon } from "@iconify/react";
import { Button, ScrollShadow, Tooltip } from "@nextui-org/react";
import React, { useRef, useState } from "react";

import {
  UploadFile,
  UploadFileProps,
} from "@/components/Conversation/upload-file";
import {
  Message_Role_Enum,
  useCreateMessageAndUpdateTopicHistoryMutation,
} from "@/graphql/generated/types";
import {
  selectSelectedChatId,
  selectSelectedSessionId,
} from "@/lib/features/chatListSlice";
import { AppDispatch } from "@/lib/store";
import { useSession } from "next-auth/react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import PromptInput from "./prompt-input";

type PromptInputWithFaqProps = {
  isChating?: boolean;
  handleChatingStatus?: (stauts: boolean) => void;
};

export default function PromptInputWithFaq({
  isChating: isButtonDisabled,
  handleChatingStatus,
}: PromptInputWithFaqProps) {
  const dispatch: AppDispatch = useDispatch();

  const selectedChatId = useSelector(selectSelectedChatId);
  const selectedSessionId = useSelector(selectSelectedSessionId);

  const [files, setFiles] = useState<UploadFileProps[]>([]);
  const [prompt, setPrompt] = useState<string>("");

  const [createMessageAndUpdateTopicHistoryMutation, { data, loading, error }] =
    useCreateMessageAndUpdateTopicHistoryMutation();

  const session = useSession();
  const user_id = session.data?.user?.id;
  const agent_id = selectedChatId;

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

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
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

  const sendMessageHanlder = () => {
    handleChatingStatus && handleChatingStatus(true);
    if (!selectedSessionId) {
      toast.error("Please choose a topic to start the conversation.");
      return null;
    }
    const attachments = files.map((item) => ({
      // key: item.key,
      fileName: item.fileName,
      bucket: item.bucket,
      fileKey: item.fileKey,
    }));

    createMessageAndUpdateTopicHistoryMutation({
      variables: {
        content: prompt,
        session_id: selectedSessionId,
        role: Message_Role_Enum.User,
        attachments: attachments,
      },
    });
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

  return (
    <div className="flex flex-col w-full  p-2 gap-4 items-center max-w-full overflow-auto">
      {/* <ScrollShadow
        hideScrollBar
        className="flex flex-nowrap gap-2 max-w-full overflow-auto"
        orientation="horizontal"
      >
        <div className="flex gap-2">
          {ideas.map(({ title, description }, index) => (
            <Button
              key={index}
              className="flex h-14 flex-col items-start gap-0 w-full"
              variant="flat"
            >
              <p>{title}</p>
              <p className="text-default-500">{description}</p>
            </Button>
          ))}
        </div>
      </ScrollShadow> */}
      <form className="flex flex-col w-full items-start rounded-medium bg-default-100 transition-colors hover:bg-default-200/70">
        <ScrollShadow
          className="flex flex-row flex-nowrap gap-2 w-full"
          orientation="horizontal"
        >
          {uploadFileListElement}
        </ScrollShadow>
        <PromptInput
          classNames={{
            inputWrapper: "!bg-transparent shadow-none",
            innerWrapper: "relative",
            input: "pt-1 pl-2 pb-6 !pr-10 text-medium",
          }}
          placeholder="Send message to AI"
          endContent={
            <div className="flex items-end gap-2">
              <Tooltip showArrow content="Send message">
                <Button
                  isIconOnly
                  color={!prompt ? "default" : "primary"}
                  isDisabled={!prompt || isButtonDisabled}
                  radius="lg"
                  size="md"
                  variant="solid"
                  onClick={sendMessageHanlder}
                >
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
            </div>
          }
          minRows={3}
          radius="lg"
          value={prompt}
          variant="flat"
          onValueChange={setPrompt}
        />
        <div className="flex items-center justify-between  gap-2 overflow-scroll px-4 pb-4">
          <div className="flex gap-1 md:gap-3">
            <input
              type="file"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileChange}
            />
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
              onClick={handleFileButtonClick}
            >
              File
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
          <p className="py-1 text-tiny text-default-400">
            {prompt.length}/4000
          </p>
        </div>
      </form>
    </div>
  );
}
