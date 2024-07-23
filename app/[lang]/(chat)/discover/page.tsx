import { auth } from "@/auth";

export default async function LibraryPage() {
  const session = await auth();
  if (!session?.user) return null;

  return (
    <div className="flex h-full w-full flex-row">
      <div>Library</div>
    </div>
  );
}
