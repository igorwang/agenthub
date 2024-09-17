"use client";

import { EditorContent } from "@tiptap/react";

import { ContentItemMenu } from "@/components/menus/ContentItemMenu";
import { useBlockEditor } from "@/components/SmartEditor/hooks/useBlockEditor";
import { useEditorSidebar } from "@/components/SmartEditor/hooks/useSideBar";

import "@/styles/index.css";
import { Icon } from "@iconify/react";
import { Button } from "@nextui-org/react";

interface SmartEditorProps {
  editable?: boolean;
}

function SmartEditor({ editable = true }: SmartEditorProps) {
  const editor = useBlockEditor({ editable });
  const rightSidebar = useEditorSidebar();

  if (!editor) {
    return null;
  }
  return (
    <div className="flex h-full flex-row">
      <div className="custom-scrollbar relative flex h-full flex-1 flex-col overflow-auto rounded border border-gray-300">
        <div className="sticky top-0 z-10 flex flex-row bg-white">
          <Button
            isIconOnly
            size="sm"
            onClick={() => editor.chain().focus().setBold().run()}
            className={editor.isActive("bold") ? "is-active" : ""}>
            <Icon icon="mdi:bold" />
          </Button>
          <Button
            // isIconOnly
            onClick={() => editor.chain().focus().setBold().run()}
            // className="w-4 max-w-4"
            // style={{ width: "20px" }}
            className="h-4 w-4 min-w-6">
            1
          </Button>
        </div>
        <ContentItemMenu editor={editor} />
        <EditorContent editor={editor} />
      </div>
      {/* <EditorSideBar
        isOpen={rightSidebar.isOpen}
        onClose={rightSidebar.close}
        editor={editor}
      /> */}
    </div>
  );
}

export default SmartEditor;
