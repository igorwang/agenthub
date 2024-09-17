"use client";

import { EditorContent } from "@tiptap/react";

import { ContentItemMenu } from "@/components/menus/ContentItemMenu";
import { useBlockEditor } from "@/components/SmartEditor/hooks/useBlockEditor";
import { useEditorSidebar } from "@/components/SmartEditor/hooks/useSideBar";

import { EditorSideBar } from "@/components/EditorSideBar";
import TextMenu from "@/components/menus/TextMenu";
import "@/styles/index.css";
import { Icon } from "@iconify/react";
import { Button } from "@nextui-org/react";

interface SmartEditorProps {
  editable?: boolean;
}

function SmartEditor({ editable = true }: SmartEditorProps) {
  const editor = useBlockEditor({ editable });
  const rightSidebar = useEditorSidebar();

  const toggleSidebar = () => {
    rightSidebar.isOpen ? rightSidebar.close() : rightSidebar.open();
  };

  if (!editor) {
    return null;
  }
  return (
    <div className="flex h-full flex-row">
      <div className="custom-scrollbar relative flex h-full flex-1 flex-col overflow-auto rounded border border-gray-300">
        <div className="sticky top-0 z-10 flex flex-row items-center justify-between border-b border-gray-200 bg-white px-4 py-2">
          <TextMenu editor={editor} />
          <Button
            isIconOnly
            onClick={toggleSidebar}
            variant="light"
            className="ml-2 transition-colors duration-200 hover:bg-gray-100"
            aria-label={rightSidebar.isOpen ? "Close sidebar" : "Open sidebar"}>
            <Icon
              icon={rightSidebar.isOpen ? "lucide:chevron-right" : "lucide:chevron-left"}
              className="h-5 w-5 text-gray-600"
            />
          </Button>
        </div>
        <ContentItemMenu editor={editor} />

        <EditorContent editor={editor} />
      </div>
      <EditorSideBar
        isOpen={rightSidebar.isOpen}
        onClose={rightSidebar.close}
        editor={editor}
      />
    </div>
  );
}

export default SmartEditor;
