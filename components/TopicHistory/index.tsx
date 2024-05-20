"use client";
import { ChatList } from "@/components/AgentHub/chat-list";
import {
  DiscussionIcon,
  OcticonKebabHorizontalIcon,
  PlusIcon,
} from "@/components/ui/icons";
import { useGetTopicHistoriesQuery } from "@/graphql/generated/types";
import {
  selectSelectedChatId,
  selectSelectedSessionId,
  selectSession,
} from "@/lib/features/chatListSlice";
import { AppDispatch } from "@/lib/store";
import { Button, Listbox, ListboxItem, ScrollShadow } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

interface TopicHistoryProps {
  agent_id?: number;
}

export const TopicHistory: React.FC<TopicHistoryProps> = ({ agent_id }) => {
  const dispatch: AppDispatch = useDispatch();

  const selectedSessionId = useSelector(selectSelectedSessionId);

  // const [selectedColor, setSelectedColor] = React.useState<
  //   "default" | "primary" | "secondary" | "success" | "warning" | "danger"
  // >("default");

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

  const handleSelect = (sId: string) => {
    dispatch(selectSession(sId));
  };

  const historyItems = histories?.map((item) => {
    const moreButton = (
      <Button
        isIconOnly
        className="max-h-full absolute right-1 top-0.5 "
        variant="light"
        startContent={<OcticonKebabHorizontalIcon/>}
      ></Button>
    );
    return (
      <ListboxItem
        classNames={{ base: "flex py-2 px-4 bg-slate-100 h-full" }}
        className={
          selectedSessionId === item.id ? "bg-primary-100" : "bg-slate-100"
        }
        key={item.id}
        startContent={<DiscussionIcon className="hidden" />}
        endContent={moreButton}
        shouldHighlightOnFocus={true}
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
          hideSelectedIcon={true}
        >
          {historyItems}
        </Listbox>
      )}
    </div>
  );
};
