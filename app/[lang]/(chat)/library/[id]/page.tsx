"use client";

import LibraryFile from "@/components/LibraryFile";
import { usePathname } from "next/navigation";

export default function LibraryPage() {
  const path = usePathname();
  const id = path.split("/")[path.split("/").length - 1];
  return (
    <div className="mx-auto flex h-full w-full items-center px-10 py-10">
      <LibraryFile id={id} />
    </div>
  );
}
