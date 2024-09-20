import { cn } from "@/cn";
import { TableOfContents } from "@/components/TableOfContents";
import { Editor } from "@tiptap/react";
import { memo, useEffect, useRef } from "react";

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
    const sidebarRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          sidebarRef.current &&
          !sidebarRef.current.contains(event.target as Node) &&
          isOpen
        ) {
          onClose();
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [isOpen, onClose]);

    const windowClassName = cn(
      "bg-white/30 backdrop-blur-xl h-full fixed z-[999] duration-300 transition-all right-0",
      "dark:bg-black/30",
      !isOpen && "w-0",
      isOpen && "w-64 border-l border-l-neutral-200 dark:border-l-neutral-800",
    );

    return (
      <div className={windowClassName} ref={sidebarRef}>
        <div className="h-full w-full overflow-hidden">
          <div className="h-full w-full overflow-auto p-6">
            <TableOfContents editor={editor} />
          </div>
        </div>
      </div>
    );
  },
);

EditorSideBar.displayName = "EditorSideBar";
