import { title } from "@/components/primitives";
import { auth } from "@/auth";
import ChatHub from "@/components/AgentHub";
import { Conversation } from "@/components/Conversation";
import { log } from "console";
export default async function ChatPage() {
  const session = await auth();

  console.log(session)

  const bot = {
    id: 1,
    name: "hello world",
    description: "hello world",
    avatar: "https://d2u8k2ocievbld.cloudfront.net/memojis/female/3.png",
  };

  return (
    <div className="flex flex-row h-full w-full">
      <ChatHub></ChatHub>
      <Conversation bot={bot}></Conversation>
    </div>
  );
}
