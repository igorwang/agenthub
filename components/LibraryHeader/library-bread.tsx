"use client";
import { BreadcrumbItem, Breadcrumbs } from "@nextui-org/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface LibraryBreadcrumbsProps {
  libraryId: string;
}

export default function LibraryBreadcrumbs({ libraryId }: LibraryBreadcrumbsProps) {
  const pathname = usePathname();
  const isSettingsPage = pathname.endsWith("/settings");

  return (
    <Breadcrumbs
      hideSeparator
      classNames={{
        list: "gap-2",
      }}
      itemClasses={{
        item: [
          "px-2 py-0.5 border-small border-default-400 rounded-small",
          "data-[current=true]:border-default-800 data-[current=true]:bg-foreground data-[current=true]:text-background transition-colors",
        ],
      }}>
      <BreadcrumbItem key="files" isCurrent={!isSettingsPage}>
        <Link href={`/discover/${libraryId}`}>Files</Link>
      </BreadcrumbItem>
      <BreadcrumbItem key="settings" isCurrent={isSettingsPage}>
        <Link href={`/discover/${libraryId}/settings`}>Settings</Link>
      </BreadcrumbItem>
    </Breadcrumbs>
  );
}
