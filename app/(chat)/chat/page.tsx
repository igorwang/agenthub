import ChatHub from "@/components/AgentHub";
import { Conversation } from "@/components/Conversation";
import StoreProvider from "@/app/StoreProvider";

export default function ChatPage() {
  // const session = await auth()
  // console.log(session)
  const bot = {
    id: 1,
    name: "hello world",
    description: "hello world",
    avatar: "https://d2u8k2ocievbld.cloudfront.net/memojis/female/3.png",
  };

  return (
    <div className="flex flex-row h-full w-full">
      <StoreProvider>
        <ChatHub></ChatHub>
        <Conversation bot={bot}></Conversation>
      </StoreProvider>
    </div>
  );
}
