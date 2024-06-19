import ChatHub from "@/components/AgentHub";
import SideBar from "@/components/Sidebar";

export default function AgentLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-full w-full max-w-full">
      <div className="flex flex-row h-full">
        <SideBar />
        {/* <div className="flex flex-row max-w-full overflow-auto"> */}
        <ChatHub></ChatHub>
        {children}
        {/* </div> */}
      </div>
    </div>
  );
}
