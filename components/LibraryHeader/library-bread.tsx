"use client";
import { BreadcrumbItem, Breadcrumbs } from "@nextui-org/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface LibraryBreadcrumbsProps {
  libraryId: string;
}

export default function LibraryBreadcrumbs({ libraryId }: LibraryBreadcrumbsProps) {
  const pathname = usePathname();
  let currentPage: "files" | "settings" | "workflow";

  switch (true) {
    case pathname.endsWith("/settings"):
      currentPage = "settings";
      break;
    case pathname.endsWith("/workflow"):
      currentPage = "workflow";
      break;
    default:
      currentPage = "files";
  }
  return (
    <Breadcrumbs
      hideSeparator
      disableAnimation
      classNames={{
        list: "gap-2",
      }}
      itemClasses={{
        item: [
          "px-2 py-0.5 rounded-small",
          "border-1", // 默认无边框
          "data-[current=true]:border-small data-[current=true]:border-default-800 data-[current=true]:bg-foreground data-[current=true]:text-background",
          "transition-colors",
        ],
      }}>
      <BreadcrumbItem key="files" isCurrent={currentPage === "files"}>
        <Link href={`/discover/${libraryId}`}>Files</Link>
      </BreadcrumbItem>
      <BreadcrumbItem key="settings" isCurrent={currentPage === "settings"}>
        <Link href={`/discover/${libraryId}/settings`}>Settings</Link>
      </BreadcrumbItem>
      <BreadcrumbItem key="workflow" isCurrent={currentPage === "workflow"}>
        <Link href={`/discover/${libraryId}/workflow`}>Workflow</Link>
      </BreadcrumbItem>
    </Breadcrumbs>
  );
}
