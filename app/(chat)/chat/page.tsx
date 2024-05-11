import { title } from "@/components/primitives";
import { auth } from "@/auth";

export default async function ChatPage() {
  const session = await auth();

  return (
    <div>
      <h1 className={title()}>Chat</h1>
    </div>
  );
}
