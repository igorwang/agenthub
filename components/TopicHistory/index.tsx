"use client";
import { ChatList } from "@/components/AgentHub/chat-list";
import { DiscussionIcon, PlusIcon } from "@/components/ui/icons";
import { useGetTopicHistoriesQuery } from "@/graphql/generated/types";
import { selectSelectedChatId } from "@/lib/features/chatListSlice";
import { AppDispatch } from "@/lib/store";
import { Button, Listbox, ListboxItem, ScrollShadow } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Session } from "inspector";

interface TopicHistoryProps {
  agent_id?: number;
}

export const TopicHistory: React.FC<TopicHistoryProps> = ({ agent_id }) => {
  // const dispatch: AppDispatch = useDispatch();
  // const selectedChatId = useSelector(selectSelectedChatId);
  const { data: sessionData, status } = useSession();

  const user_id = sessionData?.user?.id;

  if (!status) {
    return <div></div>;
  }
  
  const { data, loading, error } = useGetTopicHistoriesQuery({
    variables: {
      agent_id: agent_id,
      user_id: user_id,
      //  limit: 100
    },
  });

  if (loading) {
    return <div>加载中...</div>;
  }

  const histories = data?.topic_history.map((item) => ({
    id: item.id,
    title: item.title,
    agent_id: item.agent_id,
  }));
  const defaultSelectedKey = data?.topic_history[0]?.id;

  const handleSelect = (sId: number) => {
    console.log(sId);
  };

  const historyItems = histories?.map((item) => {
    return (
      <ListboxItem
        key={item.id}
        className="flex py-2 px-4 bg-slate-100 h-full"
        startContent={<DiscussionIcon />}
        onClick={() => handleSelect(item.id)}
      >
        {item.title}
      </ListboxItem>
    );
  });
  return (
    <div className=" flex flex-col">
      {historyItems && (
        <Listbox
          aria-label="TopicHistory"
          selectionMode="single"
          className="h-full"
          defaultSelectedKeys={[defaultSelectedKey]}
        >
          {historyItems}
        </Listbox>
      )}
    </div>
  );
};
