import ChatHub from "@/components/AgentHub";
import { Conversation } from "@/components/Conversation";
import StoreProvider from "@/app/StoreProvider";

export default function ChatPage() {
  return (
    <div className="flex flex-row h-full w-full">
      <StoreProvider>
        <ChatHub></ChatHub>
        <Conversation></Conversation>
      </StoreProvider>
    </div>
  );
}
