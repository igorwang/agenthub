"use client";
import { TopicHistory } from "@/components/TopicHistory";
import { TopicFolderIcon, BookIcon, PlusIcon } from "@/components/ui/icons";
import { selectSelectedChatId } from "@/lib/features/chatListSlice";
import { AppDispatch } from "@/lib/store";
import { Button, ScrollShadow, Tab, Tabs } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  AddNewTopicMutationMutation,
  useAddNewTopicMutationMutation,
} from "../../graphql/generated/types";

export const FunctionTab = () => {
  const dispatch: AppDispatch = useDispatch();
  const selectedChatId = useSelector(selectSelectedChatId);
  const session = useSession();

  const user_id = session.data?.user?.id;
  const agent_id = selectedChatId;

  const [addNewTopicMutation, { data, loading, error }] =
    useAddNewTopicMutationMutation();

  const handleAddTopic = async ({ agent_id, user_id }: AddTopicParams) => {
    console.log("handleAddTopic");

    try {
      const { data, errors } = await addNewTopicMutation({
        variables: {
          title: "新的话题",
          user_id: user_id,
          agent_id: agent_id,
        },
      });
      if (errors) {
        console.error(errors);
      } else {
        console.log(data);
      }
    } catch (error) {
      console.error("Error adding topic:", error);
    }
  };

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
            onClick={() => handleAddTopic({ agent_id, user_id })}
            disabled={!user_id}
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
