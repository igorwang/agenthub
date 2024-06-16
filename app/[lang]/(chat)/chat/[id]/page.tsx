import ChatHub from "@/components/AgentHub";
import { Conversation } from "@/components/Conversation";
import StoreProvider from "@/app/StoreProvider";
import PromptInputWithFaq from "@/components/Conversation/prompt-input-with-faq";

export default function ChatPage() {
  return (
    <div className="flex flex-row overflow-auto">
      <Conversation></Conversation>
    </div>
  );
}
