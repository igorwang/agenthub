"use client";
import { DiscussionIcon, PlusIcon } from "@/components/ui/icons";
import { Button, Listbox, ListboxItem } from "@nextui-org/react";
import React from "react";

export const TopicHistory = () => {
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
  ];

  const handleSelect = (sId: number) => {
    console.log(sId);
  };

  const historyItems = histories.map((item) => {
    return (
      <ListboxItem
        key={item.id}
        className="flex py-2 px-4 bg-slate-100"
        startContent={<DiscussionIcon></DiscussionIcon>}
        onClick={() => handleSelect(item.id)}
      >
        {item.title}
      </ListboxItem>
    );
  });
  return (
    <div>
      <Button className="w-full bg-slate-100 " endContent={<PlusIcon />}>
        新增话题
      </Button>
      <Listbox
        aria-label="TopicHistory"
        selectionMode="single"
        className="flex flex-col w-full"
      >
        {historyItems}
      </Listbox>
    </div>
  );
  // return <div></div>
};
