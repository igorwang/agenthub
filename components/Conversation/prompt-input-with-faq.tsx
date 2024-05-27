"use client";

import React, { useRef, useState } from "react";
import { Button, Tooltip, ScrollShadow, Input } from "@nextui-org/react";
import { Icon } from "@iconify/react";
import { cn } from "@/cn";

import PromptInput from "./prompt-input";

export default function PromptInputWithFaq() {
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

  const [file, setFile] = useState<File | null>(null);
  const [prompt, setPrompt] = useState<string>("");

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log("Selected file:", file.name);
      try {
        const res = await fetch(
          `/api/file/presigned_url?fileName=${file.name}&fileType=${file.type}&location=chat`
        );
        const { url } = await res.json();
        console.log(url);
      } catch (error) {
        console.error("Error:", error);
      }
      // 在这里可以进一步处理文件，例如上传到服务器
      // 执行上传流程
    }
  };

  return (
    <div className="flex flex-col gap-4 p-2 items-center">
      <ScrollShadow
        hideScrollBar
        className="flex flex-nowrap gap-2 overflow-auto w-0 h-0 lg:h-full lg:w-auto md:max-w-screen-lg "
        orientation="horizontal"
      >
        <div className="flex gap-2">
          {ideas.map(({ title, description }, index) => (
            <Button
              key={index}
              className="flex h-14 flex-col items-start gap-0 over"
              variant="flat"
            >
              <p>{title}</p>
              <p className="text-default-500">{description}</p>
            </Button>
          ))}
        </div>
      </ScrollShadow>
      {/* <div className="overflow-hidden text-nowrap text-ellipsis whitespace-nowrap border border-blue-500 p-2">
  Create a blog post about NextUI Create a blog post about NextUI Create a blog post about NextUI Create a blog post about NextUI Create a blog post about NextUI Create a blog post about NextUI Create a blog post about NextUI Create a blog post about NextUI Create a blog post about NextUI Create a blog post about NextUI
</div> */}
      <form className="flex flex-col w-full items-start rounded-medium bg-default-100 transition-colors hover:bg-default-200/70">
        <PromptInput
          classNames={{
            inputWrapper: "!bg-transparent shadow-none",
            innerWrapper: "relative",
            input: "pt-1 pl-2 pb-6 !pr-10 text-medium",
          }}
          endContent={
            <div className="flex items-end gap-2">
              <Tooltip showArrow content="Send message">
                <Button
                  isIconOnly
                  color={!prompt ? "default" : "primary"}
                  isDisabled={!prompt}
                  radius="lg"
                  size="sm"
                  variant="solid"
                >
                  <Icon
                    className={cn(
                      "[&>path]:stroke-[2px]",
                      !prompt ? "text-default-600" : "text-primary-foreground"
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
        <div className="flex  items-center justify-between  gap-2 overflow-scroll px-4 pb-4">
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
              文件
            </Button>
            <Button
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
              语音
            </Button>

            {/* <Button
              size="sm"
              startContent={
                <Icon
                  className="text-default-500"
                  icon="solar:notes-linear"
                  width={18}
                />
              }
              variant="flat"
            >
              Templates
            </Button> */}
          </div>
          <p className="py-1 text-tiny text-default-400">
            {prompt.length}/2000
          </p>
        </div>
      </form>
    </div>
  );
}
