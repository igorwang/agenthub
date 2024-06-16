import StoreProvider from "@/app/StoreProvider";
import ChatHub from "@/components/AgentHub";

export default function AgentLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-row h-full w-full max-w-full">
      {/* <StoreProvider> */}
        <ChatHub></ChatHub>
        {children}
      {/* </StoreProvider> */}
    </div>
  );
}
