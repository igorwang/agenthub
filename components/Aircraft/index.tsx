"use client";
import { EditorSideBar } from "@/components/EditorSideBar";
import { ContentItemMenu } from "@/components/menus/ContentItemMenu";
import { TableColumnMenu } from "@/components/SmartEditor/extensions/Table/menus";
import TableRowMenu from "@/components/SmartEditor/extensions/Table/menus/TableRow";
import { useBlockEditor } from "@/components/SmartEditor/hooks/useBlockEditor";
import { useEditorSidebar } from "@/components/SmartEditor/hooks/useSideBar";
import { setIsAircraftOpen } from "@/lib/features/chatListSlice";
import "@/styles/index.css";
import { Icon } from "@iconify/react";
import { Button, Tooltip } from "@nextui-org/react";
import { EditorContent } from "@tiptap/react";
import { useTranslations } from "next-intl";
import { useRef } from "react";
import { useDispatch } from "react-redux";

interface AircraftProps {
  // isOpen: boolean;
  editable?: boolean;
  // onClose: () => void;
}

export default function Aircraft({ editable = true }: AircraftProps) {
  const t = useTranslations();
  const menuContainerRef = useRef(null);
  const dispatch = useDispatch();

  const editor = useBlockEditor({
    // content: "<h1>Hello</h1>",
    editable,
    className:
      "prose prose-sm sm:prose lg:prose-lg xl:prose-2x lg:prose-lg min-h-[200px] pl-16 pr-2 ",
  });

  const rightSidebar = useEditorSidebar();

  const toggleSidebar = () => {
    rightSidebar.isOpen ? rightSidebar.close() : rightSidebar.open();
  };

  if (!editor) {
    return null;
  }
  const handleSave = () => {
    console.log("The HTML is:", editor.getHTML());
    editor.commands.setContent(
      ` 
       <img src="https://placehold.co/800x400" />
      <p>This isn’t code.</p>
      <Hello>1111</Hello>
      <p><b>bold</b></p>
       <p><Hello>bold</Hello></p>
      <p>
        Did you know that $3 * 3 = 9$? Isn't that crazy? Also Pythagoras' theorem is $a^2 + b^2 = c^2$.<br />
        Also the square root of 2 is $\\sqrt{2}$. If you want to know more about $\\LaTeX$ visit <a href="https://katex.org/docs/supported.html" target="_blank">katex.org</a>.
      </p>

        <pre class="whitespace-pre-wrap"><code class="language-css">body { \n display: none;
}</code></pre>
<pre class="whitespace-pre-wrap"><code class="language-css">
# Title 1
## Title 2
### Title 3
</code></pre>
      <code>
        <pre>$\\LaTeX$</pre>
      </code>

<img src="https://placehold.co/800x400/6A00F5/white" />
`,
    );

    console.log("The HTML is:", editor.getJSON());
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(editor.getText());
  };

  const handleDownload = () => {
    const blob = new Blob([editor.getHTML()], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "download.html";
    a.click();
  };

  return (
    <div className="bg-popover absolute left-0 top-0 flex h-full w-full flex-col shadow-2xl md:relative md:rounded-bl-3xl md:rounded-tl-3xl md:border-y md:border-l">
      <div className="bg-popover sticky left-0 right-0 top-0 z-10 flex w-full flex-row items-center justify-between border-b p-2">
        <Tooltip content="Close sidebar">
          <Button
            isIconOnly
            variant="light"
            className="text-default-500"
            onClick={() => dispatch(setIsAircraftOpen(false))}
            aria-label="Close sidebar">
            <Icon icon="lucide:chevrons-right" width={20} height={20} />
          </Button>
        </Tooltip>

        {/* <Button isIconOnly onClick={handleSave}>
          <Icon icon="lucide:save" width={20} height={20} />
        </Button> */}
        {/* <TextMenu editor={editor} /> */}
      </div>
      <div className="flex flex-row justify-end">
        <Tooltip content={t("Copy")}>
          <Button
            isIconOnly
            onClick={handleCopy}
            variant="light"
            className="transition-colors duration-200 hover:bg-gray-100">
            <Icon icon="lucide:copy" className="h-5 w-5 text-gray-600" />
          </Button>
        </Tooltip>
        <Tooltip content={t("Download")}>
          <Button
            isIconOnly
            onClick={handleDownload}
            variant="light"
            className="transition-colors duration-200 hover:bg-gray-100">
            <Icon icon="lucide:download" className="h-5 w-5 text-gray-600" />
          </Button>
        </Tooltip>
        <Tooltip content={t("Table of contents")}>
          <Button
            isIconOnly
            onClick={toggleSidebar}
            variant="light"
            className="transition-colors duration-200 hover:bg-gray-100">
            <Icon
              icon={rightSidebar.isOpen ? "lucide:chevron-right" : "lucide:chevron-left"}
              className="h-5 w-5 text-gray-600"
            />
          </Button>
        </Tooltip>
      </div>
      <div
        className="custom-scrollbar flex h-full flex-row overflow-auto"
        ref={menuContainerRef}>
        <div className="custom-scrollbar relative flex h-full flex-1 flex-col overflow-auto rounded p-2">
          <ContentItemMenu editor={editor} />
          <TableRowMenu editor={editor} appendTo={menuContainerRef} />
          <TableColumnMenu editor={editor} appendTo={menuContainerRef} />
          <EditorContent editor={editor} />
        </div>
        <EditorSideBar
          isOpen={rightSidebar.isOpen}
          onClose={rightSidebar.close}
          editor={editor}
        />
      </div>
    </div>
  );
}
