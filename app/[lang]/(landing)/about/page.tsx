export default function AboutPage() {
  const bot = {
    id: 1,
    name: "hello world",
    description: "hello world",
    avatar: "https://d2u8k2ocievbld.cloudfront.net/memojis/female/3.png",
  };
  return (
    <div className="flex h-screen flex-row">
      <div className="mr-4 flex h-full w-80 flex-col bg-red-400">left</div>
      <div className="flex flex-grow flex-col overflow-hidden"></div>
    </div>
  );
}
