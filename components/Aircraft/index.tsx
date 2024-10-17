"use client";
import { EditorSideBar } from "@/components/EditorSideBar";
import { ContentItemMenu } from "@/components/menus/ContentItemMenu";
import { TableColumnMenu } from "@/components/SmartEditor/extensions/Table/menus";
import TableRowMenu from "@/components/SmartEditor/extensions/Table/menus/TableRow";
import { useBlockEditor } from "@/components/SmartEditor/hooks/useBlockEditor";
import { useEditorSidebar } from "@/components/SmartEditor/hooks/useSideBar";
import {
  AircraftFragmentFragment,
  useGetAircraftByIdQuery,
} from "@/graphql/generated/types";
import {
  selectCurrentAircraftId,
  selectIsAircraftGenerating,
  selectMessagesContext,
  selectSelectedChatId,
  selectSelectedSessionId,
  setIsAircraftGenerating,
  setIsAircraftOpen,
  setIsChating,
} from "@/lib/features/chatListSlice";
import { DEFAULT_LLM_MODEL } from "@/lib/models";
import "@/styles/index.css";
import { Icon } from "@iconify/react";
import { HumanMessage, mapStoredMessagesToChatMessages } from "@langchain/core/messages";
import { Button, Tooltip } from "@nextui-org/react";
import { EditorContent } from "@tiptap/react";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

interface AircraftProps {
  // isOpen: boolean;
  editable?: boolean;
  // onClose: () => void;
}

export default function Aircraft({ editable = true }: AircraftProps) {
  const t = useTranslations();
  const menuContainerRef = useRef(null);
  const dispatch = useDispatch();
  const [aircraft, setAircraft] = useState<AircraftFragmentFragment | null>(null);
  const currentAircraftId = useSelector(selectCurrentAircraftId);
  const isAircraftGenerating = useSelector(selectIsAircraftGenerating);
  const chatId = useSelector(selectSelectedChatId);
  const sessionId = useSelector(selectSelectedSessionId);
  const messagesContext = useSelector(selectMessagesContext);
  const editor = useBlockEditor({
    content: aircraft?.content || "",
    editable,
    className:
      "prose prose-sm sm:prose lg:prose-lg xl:prose-2x lg:prose-lg min-h-[200px] pl-16 pr-2 ",
  });

  const rightSidebar = useEditorSidebar();

  const toggleSidebar = () => {
    rightSidebar.isOpen ? rightSidebar.close() : rightSidebar.open();
  };

  const { data, loading, refetch } = useGetAircraftByIdQuery({
    variables: { id: currentAircraftId },
    skip: !currentAircraftId,
  });

  useEffect(() => {
    if (data && data.aircraft_by_pk) {
      setAircraft(data.aircraft_by_pk);
      if (editor) {
        editor.commands.setContent(aircraft?.content || "");
      }
    }
  }, [data]);

  useEffect(() => {
    if (
      isAircraftGenerating &&
      currentAircraftId &&
      aircraft &&
      editor &&
      messagesContext
    ) {
      handleGenerateAnswer();
    }
  }, [isAircraftGenerating, currentAircraftId, aircraft, editor, messagesContext]);

  useEffect(() => {
    if (currentAircraftId) {
      refetch();
    }
  }, [currentAircraftId]);

  const handleGenerateAnswer = async () => {
    const controller = new AbortController(); // Create a new AbortController
    const signal = controller.signal; // Get the signal from the controller
    const historyMessages = mapStoredMessagesToChatMessages(messagesContext) || [];

    const chatMessages = [
      ...historyMessages,
      new HumanMessage({
        content: `You are writing a document based on the our conversation.
        Do not ask me any questions, just write the content.
        Return the content in tiptap markdown format. Do not use set header tag <html> or <body>.
        Example:
        Image: <img src="https://placehold.co/800x400" />
        Paragraph:<p>This is a paragraph.</p>
        Bold: <p><b>This is bold text.</b></p>
        Heading:<h1>This is a heading.</h1>
        List:<ul><li>This is a list item.</li></ul>
        Link:<a href="https://www.example.com">This is a link.</a>
        Code:<pre class="whitespace-pre-wrap"><code class="language-css">body { \n display: none;
}</code></pre>
        Quote:<blockquote>This is a quote.</blockquote>
        Horizontal Rule:<hr />
        LaTex: The Pythagorean theorem is <code><pre>$\\LaTeX$</pre></code>.
          `,
      }),
    ];

    let answer = aircraft?.content || "";

    try {
      const response = await fetch("/api/v1/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: DEFAULT_LLM_MODEL,
          messages: chatMessages.map((message) => message.toJSON()),
        }),
        signal: signal,
      });

      if (!response.body) {
        throw new Error("ReadableStream not supported by the browser.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      // Function to read the stream
      const readStream = async () => {
        const { done, value } = await reader.read();
        if (done) {
          dispatch(setIsAircraftGenerating(false));
          dispatch(setIsChating(false));
          editor?.commands.setContent(answer);
          return;
        }
        const chunk = decoder.decode(value, { stream: true });
        answer += chunk;
        editor?.commands.insertContent(chunk);
        await readStream();
      };
      await readStream();
    } catch (error) {
      console.error("Error while streaming:", error);
      return;
    } finally {
      dispatch(setIsAircraftGenerating(false));
      dispatch(setIsChating(false));
      editor?.commands.setContent(answer);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!editor) {
    return null;
  }
  const handleSave = () => {
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
      <div className="bg-popover sticky left-0 right-0 top-0 z-10 flex w-full flex-row items-center gap-2 border-b p-2">
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
        <div>{aircraft?.title}</div>

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
