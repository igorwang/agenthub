import ChatHub from "@/components/AgentHub";

export default function AgentLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-full w-full max-w-full">
      <div className="flex h-full flex-row">
        <ChatHub />
        {children}
      </div>
    </div>
  );
}
