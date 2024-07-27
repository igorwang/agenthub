import { auth } from "@/auth";
import { Spinner } from "@nextui-org/react";

export default async function LibraryPage() {
  const session = await auth();
  if (!session?.user) return null;

  return (
    <div className="flex h-full w-full flex-row items-center justify-center">
      <Spinner>Loading...</Spinner>
    </div>
  );
}
