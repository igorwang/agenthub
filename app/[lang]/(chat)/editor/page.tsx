"use client";
import OfficeEditor from "@/components/OfficeEditor";
import { useBlockEditor } from "@/components/SmartEditor/hooks/useBlockEditor";
import { useTranslations } from "next-intl";

export default function EditorPage() {
  const t = useTranslations("");

  const editor = useBlockEditor({
    content: `<div data-type="translation-block" data-pid="001">
        <p>paragraph 001</p>
        <p class="source">Original content</p>
        <p class="target">Translated content</p>
      </div>`,
    // content: {
    //   type: "doc",
    // content: [
    //   {
    //     type: "translationNode",
    //     attrs: {
    //       pid: "001",
    //       source: "Original content",
    //       target: "Translated content",
    //     },
    //   },
    // ],
    // },
  });

  return (
    <div className="mx-auto flex h-full w-full max-w-7xl flex-col">
      {/* <PdfViewer pdfUrl="https://arxiv.org/pdf/2203.11115" /> */}
      {/* <div className="mt-4">
        <EditorContent editor={editor} />
      </div>
      <Button
        onClick={() => {
          console.log(editor?.getHTML());
        }}>
        Get HTML
      </Button> */}
      <OfficeEditor />
    </div>
  );
}
