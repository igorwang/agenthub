"use client";

import { useBlockEditor } from "@/components/SmartEditor/hooks/useBlockEditor";
import { EditorContent } from "@tiptap/react";

interface ApiDocProps {
  content: string | any;
}

export default function ApiDoc({ content }: ApiDocProps) {
  const editor = useBlockEditor({ editable: false, content: content });

  return (
    <div className="custom-scrollbar flex h-full w-full flex-col overflow-auto border-l-1">
      <EditorContent editor={editor} />
    </div>
  );
}
