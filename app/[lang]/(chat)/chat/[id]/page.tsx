import { Conversation } from "@/components/Conversation";

export default function ChatPage() {
  return (
    <div className="flex flex-row overflow-auto">
      <Conversation></Conversation>
    </div>
  );
}
