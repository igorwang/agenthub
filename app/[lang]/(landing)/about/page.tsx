import { Conversation } from "@/components/Conversation";
import { title } from "@/components/primitives";

export default function AboutPage() {
  const bot = {
    id: 1,
    name: "hello world",
    description: "hello world",
    avatar: "https://d2u8k2ocievbld.cloudfront.net/memojis/female/3.png",
  };
  return (
    <div className="flex flex-row h-screen">
    <div className="flex flex-col bg-red-400 mr-4 w-80 h-full">left</div>
    <div className="flex flex-col flex-grow overflow-hidden">
      <Conversation bot={bot} />
    </div>
  </div>
  );
}
