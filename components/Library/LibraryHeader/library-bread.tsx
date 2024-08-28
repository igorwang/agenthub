"use client";
import { BreadcrumbItem, Breadcrumbs } from "@nextui-org/react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

interface LibraryBreadcrumbsProps {
  libraryId: string;
}

export default function LibraryBreadcrumbs({ libraryId }: LibraryBreadcrumbsProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const t = useTranslations();

  let currentPage: "files" | "settings" | "workflow" | "file-detail";
  let filename = "";

  switch (true) {
    case pathname.endsWith("/settings"):
      currentPage = "settings";
      break;
    case pathname.endsWith("/workflow"):
      currentPage = "workflow";
      break;
    case pathname.includes("/chunk"):
      currentPage = "file-detail";
      filename = searchParams.get("filename") || "";
      break;
    default:
      currentPage = "files";
  }

  return (
    <Breadcrumbs
      separator="/"
      classNames={{
        list: "gap-2",
      }}
      itemClasses={{
        item: [
          "px-2 py-0.5 rounded-small",
          "border-1",
          "data-[current=true]:border-1 data-[current=true]:border-default-800 data-[current=true]:bg-foreground data-[current=true]:text-background",
          "transition-colors",
        ],
        separator: "px-2",
      }}>
      <BreadcrumbItem
        key="files"
        isCurrent={currentPage === "files" || currentPage === "file-detail"}>
        <Link href={`/library/${libraryId}`} className="hover:underline">
          {t("Files")}
        </Link>
        {currentPage === "file-detail" && (
          <span className="ml-1 max-w-sm overflow-hidden text-ellipsis">
            / {filename}
          </span>
        )}
      </BreadcrumbItem>
      <BreadcrumbItem key="settings" isCurrent={currentPage === "settings"}>
        <Link href={`/library/${libraryId}/settings`}>{t("Settings")}</Link>
      </BreadcrumbItem>
      <BreadcrumbItem key="workflow" isCurrent={currentPage === "workflow"}>
        <Link href={`/library/${libraryId}/workflow`}>{t("Workflow")}</Link>
      </BreadcrumbItem>
    </Breadcrumbs>
  );
}
