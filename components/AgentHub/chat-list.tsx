"use client";
import React, { useEffect, useId, useState } from "react";

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
  Tooltip,
} from "@nextui-org/react";
import {
  OcticonChevronDownIcon,
  OcticonChevronRightIcon,
  OcticonKebabHorizontalIcon,
  TagIcon,
} from "../ui/icons";

import { GroupedChatListDTO } from "@/types/chatTypes";
import { AppDispatch } from "../../lib/store";
import { useDispatch, useSelector } from "react-redux";
import {
  selectChat,
  selectChatList,
  selectSelectedChatId,
  setChatList,
} from "@/lib/features/chatListSlice";
import { useGetAgentListByTypeQuery } from "@/graphql/generated/types";
import { group } from "console";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export const ChatList: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const chatList = useSelector(selectChatList);
  const selectedChatId = useSelector(selectSelectedChatId);
  const router = useRouter();

  const { data: sessionData, status } = useSession();
  const userId = sessionData?.user?.id;

  const { data, loading, error } = useGetAgentListByTypeQuery({
    variables: {
      user_id: userId,
    },
    skip: !userId,
  });

  useEffect(() => {
    if (data) {
      const groupedChatList: GroupedChatListDTO[] = data.agent_type.map(
        (group) => ({
          id: group.id,
          name: group.name,
          agents: group.agents.map((agent) => ({
            id: agent.id,
            name: agent.name,
            description: agent.description,
            avatar: agent.avatar,
          })),
        })
      );
      const defaultSelectedChatId = data.agent_type[0].agents[0].id;
      if (defaultSelectedChatId) {
        dispatch(selectChat(defaultSelectedChatId));
        router.push(`/chat/${defaultSelectedChatId}`);
      }

      dispatch(setChatList(groupedChatList));
      // Initialize open states
      const initialOpenStates: Record<string, boolean> = {};
      groupedChatList.forEach((group) => {
        initialOpenStates[group.id] = true;
      });
      setOpenStates(initialOpenStates);
    }
  }, [data, dispatch]);

  const [openStates, setOpenStates] = useState<Record<number, boolean>>(() => {
    const initialState: Record<number, boolean> = {};
    chatList.forEach((group) => {
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

  const handleSelectChat = (selectId: string) => {
    dispatch(selectChat(selectId));
    router.push(`/chat/{selectId}`);
  };

  const chatListContent = chatList.map((group) => (
    <div className="flex flex-col" key={group.id}>
      {group.name && group.name != "system" && (
        <div className="flex flex-row justify-between px-2 py-2 items-center hover:bg-slate-200 bg-slate-100 h-12">
          <div className="text-sm text-nowrap text-ellipsis overflow-hidden">
            {group.name}
          </div>
          <div className="flex flex-row items-center">
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
          {group.agents.map((item) => (
            <ListboxItem
              key={item.id}
              textValue={item.name}
              onClick={() => handleSelectChat(item.id)}
            >
              <div className="flex gap-2 items-center">
                <Avatar
                  alt={item.name}
                  className="flex-shrink-0"
                  size="sm"
                  src={
                    item.avatar ||
                    "https://api.dicebear.com/8.x/fun-emoji/svg?seed=Tigger"
                  }
                />
                <div className="flex flex-col">
                  <span className="text-small">{item.name}</span>
                  {/* <Tooltip content={item.description}> */}
                  <span className="text-tiny text-default-400 text-nowrap max-w-[120px] truncate">
                    {item.description}
                  </span>
                  {/* </Tooltip> */}
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
