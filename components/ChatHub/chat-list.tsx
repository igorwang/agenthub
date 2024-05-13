"use client";
import React, { useState } from "react";

import {
  Listbox,
  ListboxItem,
  Chip,
  ScrollShadow,
  Avatar,
  Selection,
  ListboxSection,
  ListboxSectionProps,
  Button,
} from "@nextui-org/react";
import {
  OcticonChevronDownIcon,
  OcticonChevronRightIcon,
  OcticonKebabHorizontalIcon,
  TagIcon,
} from "../ui/icons";

export type ChatDTO = {
  id: number;
  name: string;
  description: string;
  avatar: string;
};

export type GroupedChatListDTO = {
  id: number;
  name: string;
  items: ChatDTO[];
};

export type ChatListProps = {
  data: GroupedChatListDTO[]; // Array of grouped chat data
};

export const ChatList: React.FC<ChatListProps> = ({ data, ...props }) => {
  const [openStates, setOpenStates] = useState<Record<number, boolean>>(() => {
    const initialState: Record<number, boolean> = {};
    data.forEach((group) => {
      initialState[group.id] = true;
    });
    return initialState;
  });

  const toggleListbox = (id: number) => {
    setOpenStates((prevStates) => ({
      ...prevStates,
      [id]: !prevStates[id],
    }));
  };
  
  const chatListContent = data.map((group) => (
    <div className="flex flex-col" key={group.id}>
      {group.name && (
        <div className="flex flex-row justify-between px-2 py-2 items-center hover:bg-slate-200 bg-slate-100 h-12">
          <div className="text-sm text-nowrap text-ellipsis overflow-hidden">
            {group.name}
          </div>
          <div className="flex flex-row items-center">
            {/* <div className="flex gap-1 items-center"></div> */}
            <Button isIconOnly variant="light">
              <OcticonKebabHorizontalIcon />
            </Button>
            <Button
              isIconOnly
              variant="light"
              onClick={() => toggleListbox(group.id)}
            >
              {openStates[group.id] ? (
                <OcticonChevronDownIcon />
              ) : (
                <OcticonChevronRightIcon />
              )}
            </Button>
          </div>
        </div>
      )}
      {openStates[group.id] && (
        <Listbox
          key={group.id}
          classNames={{
            base: "max-w-xs",
            list: "max-h-[300px] overflow-scroll",
          }}
          label="Assigned to"
          selectionMode="single"
          //   onSelectionChange={setValues}
          variant="flat"
          hideSelectedIcon={true}
        >
          {group.items.map((item) => (
            <ListboxItem key={item.id} textValue={item.name}>
              <div className="flex gap-2 items-center">
                <Avatar
                  alt={item.name}
                  className="flex-shrink-0"
                  size="sm"
                  src={item.avatar}
                />
                <div className="flex flex-col">
                  <span className="text-small">{item.name}</span>
                  <span className="text-tiny text-default-400">
                    {item.description}
                  </span>
                </div>
              </div>
            </ListboxItem>
          ))}
        </Listbox>
      )}
    </div>
  ));

  return (
    <ScrollShadow className="-mr-2 h-full max-h-full py-2 pr-2 flex flex-col justify-between">
      <div>{chatListContent}</div>
    </ScrollShadow>
  );
};
