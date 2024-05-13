import { title } from "@/components/primitives";
import { auth } from "@/auth";
import ChatHub from "@/components/ChatHub";

export default async function ChatPage() {
  const session = await auth();

  return (
    <div className="flex flex-row">
      <ChatHub></ChatHub>
      <div className="bg-yellow-100 w-full flex-grow">Chat UI</div>
    </div>
  );
}
