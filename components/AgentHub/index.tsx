"use client";
import React from "react";

import { Spacer } from "@nextui-org/react";
import SearchBar from "./searchbar";
import { ChatList, GroupedChatListDTO } from "./chat-list";
import {
  useGetAgentListByTypeQuery,
  GetAgentListByTypeDocument,
} from "@/graphql/generated/types";

export const chatListData: GroupedChatListDTO[] = [
  {
    id: 1,
    name: "",
    items: [
      {
        id: 1,
        name: "Tony Reichert",
        description: "Management",
        avatar: "https://api.dicebear.com/8.x/fun-emoji/svg?seed=Tigger",
      },
    ],
  },
  {
    id: 2,
    name: "默认分组",
    items: [
      {
        id: 2,
        name: "Zoey Lang",
        description: "Development",
        avatar: "https://d2u8k2ocievbld.cloudfront.net/memojis/female/1.png",
      },
      {
        id: 3,
        name: "Jane Fisher",
        description: "Sr. Dev",
        avatar: "https://d2u8k2ocievbld.cloudfront.net/memojis/female/2.png",
      },
      {
        id: 4,
        name: "William Howard",
        description: "C.M.",
        avatar: "https://d2u8k2ocievbld.cloudfront.net/memojis/male/2.png",
      },
      {
        id: 5,
        name: "Kristen Copper",
        description: "S. Manager",
        avatar: "https://d2u8k2ocievbld.cloudfront.net/memojis/female/3.png",
      },
    ],
  },
];

const ChatHub = () => {
  
  const { loading, error, data } = useGetAgentListByTypeQuery();

  return (
    <div className="hidden sm:flex h-full min-w-40  flex-col border-r-1">
      <div className="text-3xl font-semibold leading-7 text-default-foreground px-2 pt-4">
        AgentHub
      </div>
      <Spacer y={4} />
      <SearchBar></SearchBar>
      {/* <div className="flex flex-col"></div> */}
      <Spacer y={4} />
      <ChatList data={chatListData}></ChatList>
    </div>
  );
};

export default ChatHub;
