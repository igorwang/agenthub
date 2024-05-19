import { ChatList } from "@/components/AgentHub/chat-list";
import { DiscussionIcon, PlusIcon } from "@/components/ui/icons";
import { Button, Listbox, ListboxItem, ScrollShadow } from "@nextui-org/react";
import React from "react";

interface TopicHistoryProps {
  agent_id?: number;
}

export const TopicHistory: React.FC<TopicHistoryProps> = ({ agent_id }) => {
  const histories = [
    {
      id: 1,
      agent_id: 1,
      title:
        "我是一个标题我是一个标题我是一个标题我是一个标题我是一个标题我是一个标题我是一个标题我是一个标题",
    },
    {
      id: 2,
      agent_id: 1,
      title: "我是一个标题",
    },
    {
      id: 3,
      agent_id: 1,
      title: "我是一个标题",
    },
    {
      id: 4,
      agent_id: 1,
      title: "我是一个标题",
    },
    {
      id: 5,
      agent_id: 1,
      title: "我是一个标题1111111",
    },
  ];

  const handleSelect = (sId: number) => {
    console.log(sId);
  };

  const historyItems = histories.map((item) => {
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
      <Listbox
        aria-label="TopicHistory"
        selectionMode="single"
        className="h-full"
      >
        {historyItems}
      </Listbox>
    </div>
  );
  // return <div></div>
};
