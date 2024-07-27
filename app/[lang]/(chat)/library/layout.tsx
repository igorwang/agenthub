import LibrarySideBarContainer from "@/components/LibrarySideBar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Library",
  description: "Library...",
};

export default function LibraryLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-full w-full max-w-full">
      <div className="flex h-full w-full max-w-full flex-row">
        <LibrarySideBarContainer />
        {children}
      </div>
    </div>
  );
}
