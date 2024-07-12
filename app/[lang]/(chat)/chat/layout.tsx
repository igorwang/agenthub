export default function AgentLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-full w-full max-w-full">
      <div className="flex h-full flex-row">{children}</div>
    </div>
  );
}
