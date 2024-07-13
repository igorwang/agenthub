"use client";

import LibraryFile from "@/components/LibraryFile";
import { usePathname } from "next/navigation";

export default function LibraryPage() {
  const path = usePathname();
  const id = path.split("/")[path.split("/").length - 1];
  return <LibraryFile id={id} />;
}
