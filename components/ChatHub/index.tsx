import React from "react";

import { Spacer } from "@nextui-org/react";
import SearchBar from "./searchbar";
import { ChatList, GroupedChatListDTO } from "./chat-list";

export const chatListData: GroupedChatListDTO[] = [
  {
    id: 1,
    name: "",
    items: [
      {
        id: 1,
        name: "Tony Reichert",
        description: "Management",
        avatar: "https://d2u8k2ocievbld.cloudfront.net/memojis/male/1.png",
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
  }
];

const ChatHub = () => {
  return (
    <div className="h-dvh w-64 flex flex-col">
      <div className="text-3xl font-semibold leading-7 text-default-foreground px-2 pt-4">
        ChatHub
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
