"use client";
import { TopicHistory } from "@/components/TopicHistory";
import { TopicFolderIcon, BookIcon } from "@/components/ui/icons";
import { Tab, Tabs } from "@nextui-org/react";
import React from "react";

export const FunctionTab = () => {
  return (
    <div className="flex sticky w-full flex-col items-center pt-2">
      <Tabs aria-label="Options" variant="light">
        <Tab
          key="topic"
          className="w-full"
          title={
            <div className="flex items-center space-x-2">
              {/* <TopicFolderIcon className="hidden"/> */}
              <span>历史话题</span>
            </div>
          }
        >
          <TopicHistory></TopicHistory>
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
