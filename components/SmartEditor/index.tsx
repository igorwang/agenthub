"use client";

import { EditorContent } from "@tiptap/react";

import { ContentItemMenu } from "@/components/menus/ContentItemMenu";
import { useBlockEditor } from "@/components/SmartEditor/hooks/useBlockEditor";
import { useEditorSidebar } from "@/components/SmartEditor/hooks/useSideBar";

import TextMenu from "@/components/menus/TextMenu";
import "@/styles/index.css";

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
        <div className="sticky top-0 z-10 flex flex-row justify-center bg-white py-1">
          <TextMenu editor={editor} />
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
