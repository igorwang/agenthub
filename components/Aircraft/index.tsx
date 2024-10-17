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
  useUpdateAircraftByIdMutation,
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
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

interface AircraftProps {
  // isOpen: boolean;
  editable?: boolean;
  // onClose: () => void;
}

export default function Aircraft({ editable = true }: AircraftProps) {
  const t = useTranslations();
  const editorContentRef = useRef<HTMLDivElement>(null);
  const menuContainerRef = useRef(null);
  const dispatch = useDispatch();
  const [aircraft, setAircraft] = useState<AircraftFragmentFragment | null>(null);
  const currentAircraftId = useSelector(selectCurrentAircraftId);
  const isAircraftGenerating = useSelector(selectIsAircraftGenerating);
  const chatId = useSelector(selectSelectedChatId);
  const sessionId = useSelector(selectSelectedSessionId);
  const messagesContext = useSelector(selectMessagesContext);
  const [isChanging, setIsChanging] = useState(false);
  const [userScrolling, setUserScrolling] = useState(false);

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
  const [updateAircraftMutation] = useUpdateAircraftByIdMutation();
  const { data, loading, refetch } = useGetAircraftByIdQuery({
    variables: { id: currentAircraftId },
    skip: !currentAircraftId,
  });
  useEffect(() => {
    if (data && data.aircraft_by_pk) {
      setAircraft(data.aircraft_by_pk);
    }
  }, [data]);

  useEffect(() => {
    if (aircraft && aircraft.content) {
      editor?.commands.setContent(aircraft.content);
    }
  }, [aircraft]);

  useEffect(() => {
    if (
      isAircraftGenerating &&
      currentAircraftId &&
      aircraft &&
      editor &&
      messagesContext
    ) {
      editor.commands.setContent("");
      editor.commands.focus("start");
      handleGenerateAnswer();
    }
  }, [isAircraftGenerating, currentAircraftId, aircraft, editor, messagesContext]);

  useEffect(() => {
    setIsChanging(true);
    editor?.commands.setContent("");
    if (currentAircraftId) {
      refetch();
    }
    setIsChanging(false);
  }, [currentAircraftId]);

  if (isChanging) {
    return <div>Loading...</div>;
  }

  const handleGenerateAnswer = async () => {
    const controller = new AbortController(); // Create a new AbortController
    const signal = controller.signal; // Get the signal from the controller
    const historyMessages = mapStoredMessagesToChatMessages(messagesContext) || [];

    const chatMessages = [
      ...historyMessages,
      new HumanMessage({
        content: `You are an expert in creating documents compatible with the TipTap rich text editor. 
        Your task is to generate HTML content based on our conversation or the provided information. 
        Follow these guidelines:
            1. Content Generation:
              - Write the content directly without asking questions.
              - Ensure the content is relevant, well-structured, and coherent.
            2. Format:
              - Use TipTap-compatible HTML format.
              - Do not include <html> or <body> tags.

            3. Structure and Formatting:
              - Use appropriate HTML tags for content structure:
                - <h1>, <h2>, <h3> for headings
                - <p> for paragraphs
                - <ul> and <li> for unordered lists
                - <ol> and <li> for ordered lists
                - <strong> for bold text
                - <em> for italic text
                - <a href="..."> for links
                - <blockquote> for quotations
                - <code> for inline code
                - <pre><code> for code blocks
              - Properly nest all tags.

            4. Special Content:
              - Images: Use <img src="..." alt="..."> tags. Ensure proper attribution if necessary.
              - Quotes: Enclose in <blockquote> tags.
              - Code: Use <code> for inline code and <pre><code> for code blocks.
              - Mathematics: Represent LaTeX formulas as text within <code> tags. Note that TipTap doesn't render LaTeX natively.

            5. Accessibility:
              - Include descriptive alt text for images.
              - Use semantic HTML to enhance accessibility.

            6. Additional Notes:
              - If including content that requires special rendering (e.g., LaTeX, complex diagrams), add a note about potential rendering limitations in TipTap.
              - Ensure all links are properly formatted and, if possible, include relevant target attributes.

            Generate the content maintaining a balance between informativeness and readability. The output should be directly usable in a TipTap editor environment.
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
          if (aircraft?.id) {
            const response = await updateAircraftMutation({
              variables: { pk_columns: { id: aircraft.id }, _set: { content: answer } },
            });
            if (response.data?.update_aircraft_by_pk) {
              setAircraft(response.data?.update_aircraft_by_pk);
            }
          }
          editor?.commands.setContent(answer);
          return;
        }
        const chunk = decoder.decode(value, { stream: true });
        answer += chunk;
        try {
          editor?.commands.insertContent(chunk);
        } catch (error) {
          console.error("Error while inserting content:", error);
        }
        await readStream();
      };
      await readStream();
    } catch (error) {
      console.error("Error while streaming:", error);
      return;
    } finally {
      dispatch(setIsAircraftGenerating(false));
      dispatch(setIsChating(false));
    }
  };

  const handleSave = () => {
    console.log("The HTML is:", editor?.getJSON());
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(editor?.getText() || "");
  };

  const handleDownload = () => {
    const blob = new Blob([editor?.getHTML() || ""], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "download.html";
    a.click();
  };

  const scrollToBottom = useCallback(() => {
    if (editorContentRef.current && !userScrolling) {
      editorContentRef.current.scrollTop = editorContentRef.current.scrollHeight;
    }
  }, [userScrolling]);

  useEffect(() => {
    const handleScroll = () => {
      if (editorContentRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = editorContentRef.current;
        const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10;
        setUserScrolling(!isAtBottom);
      }
    };

    const editorContent = editorContentRef.current;
    if (editorContent) {
      editorContent.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (editorContent) {
        editorContent.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  useEffect(() => {
    if (isAircraftGenerating) {
      const interval = setInterval(scrollToBottom, 100);
      return () => clearInterval(interval);
    }
  }, [isAircraftGenerating, scrollToBottom]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!editor) {
    return null;
  }
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
        <div
          className="custom-scrollbar relative flex h-full flex-1 flex-col overflow-auto rounded p-2"
          ref={editorContentRef}>
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
