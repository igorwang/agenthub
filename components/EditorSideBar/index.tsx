import { cn } from "@/cn";
import { TableOfContents } from "@/components/TableOfContents";
import { Editor } from "@tiptap/react";
import { memo, useCallback } from "react";

export const EditorSideBar = memo(
  ({
    editor,
    isOpen,
    onClose,
  }: {
    editor: Editor;
    isOpen?: boolean;
    onClose: () => void;
  }) => {
    const handlePotentialClose = useCallback(() => {
      if (window.innerWidth < 1024) {
        onClose();
      }
    }, [onClose]);

    const windowClassName = cn(
      "absolute top-0 right-0 bg-white lg:bg-white/30 lg:backdrop-blur-xl h-full lg:h-auto lg:relative z-[999] w-0 duration-300 transition-all",
      "dark:bg-black lg:dark:bg-black/30",
      !isOpen && "border-l-transparent",
      isOpen && "w-64 border-r  border-r-neutral-200 dark:border-r-neutral-800",
    );

    return (
      <div className={windowClassName}>
        <div className="h-full w-full overflow-hidden">
          <div className="h-full w-full overflow-auto p-6">
            <TableOfContents onItemClick={handlePotentialClose} editor={editor} />
          </div>
        </div>
      </div>
    );
  },
);

EditorSideBar.displayName = "TableOfContentSidepanel";
