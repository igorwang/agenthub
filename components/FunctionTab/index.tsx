"use client";
import { TopicHistory } from "@/components/TopicHistory";
import { TopicFolderIcon, BookIcon, PlusIcon } from "@/components/ui/icons";
import { Button, ScrollShadow, Tab, Tabs } from "@nextui-org/react";
import React from "react";

export const FunctionTab = () => {
  return (
    <div className="flex flex-col w-full  items-center pt-2">
      <Tabs aria-label="Options" variant="light" className="flex flex-col">
        <Tab
          key="topic"
          className="w-full flex flex-col h-full overflow-auto"
          title={
            <div className="flex items-center space-x-2">
              {/* <TopicFolderIcon className="hidden"/> */}
              <span>历史话题</span>
            </div>
          }
        >
          <Button
            className="flex w-full bg-slate-100 "
            endContent={<PlusIcon />}
          >
            新增话题
          </Button>
          <ScrollShadow className="flex flex-grow flex-col gap-6 pb-8 max-h-full ">
            <TopicHistory></TopicHistory>
          </ScrollShadow>
        </Tab>
        <Tab
          key="book"
          title={
            <div className="flex items-center space-x-2">
              {/* <BookIcon /> */}
              <span>知识库</span>
            </div>
          }
        />
        <Tab
          key="setting"
          title={
            <div className="flex items-center space-x-2">
              {/* <TopicFolderIcon /> */}
              <span>设置</span>
            </div>
          }
        />
      </Tabs>
    </div>
  );
};
