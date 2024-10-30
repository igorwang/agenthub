"use client";
import { EditorSideBar } from "@/components/EditorSideBar";
import { AIBubbleMenu } from "@/components/menus/AIBubbleMenu";
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
  selectIsAskAI,
  selectIsChating,
  selectMessagesContext,
  selectSelectedChatId,
  selectSelectedSessionId,
  setIsAircraftGenerating,
  setIsAircraftOpen,
  setIsAskAI,
  setIsChating,
} from "@/lib/features/chatListSlice";
import { DEFAULT_LLM_MODEL } from "@/lib/models";
import "@/styles/index.css";
import { Icon } from "@iconify/react";
import { HumanMessage, mapStoredMessagesToChatMessages } from "@langchain/core/messages";
import { Button, Tooltip } from "@nextui-org/react";
import { EditorContent } from "@tiptap/react";
import { formatDate } from "date-fns";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

const AI_WRITE_PROMPT = `
You are an expert in creating documents compatible with the TipTap rich text editor. 
Your task is to generate HTML content based on our conversation or the provided information. 
Follow these guidelines:
1. Content Generation:
  - Write the content directly without asking questions.
  - Ensure the content is relevant, well-structured, and coherent.
  - Do not start html tags
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
`;

interface AircraftProps {
  // isOpen: boolean;
  // aircraftId: string | null;
  editable?: boolean;
  model?: string;
  // onClose: () => void;
}

export default function Aircraft({
  editable = true,
  model = DEFAULT_LLM_MODEL,
}: AircraftProps) {
  const aircraftId = useSelector(selectCurrentAircraftId);
  const t = useTranslations();
  const editorContentRef = useRef<HTMLDivElement>(null);
  const menuContainerRef = useRef(null);
  const dispatch = useDispatch();
  const [aircraft, setAircraft] = useState<AircraftFragmentFragment | null>(null);
  const isAircraftGenerating = useSelector(selectIsAircraftGenerating);
  const isAskAI = useSelector(selectIsAskAI);
  const chatId = useSelector(selectSelectedChatId);
  const sessionId = useSelector(selectSelectedSessionId);
  const isChating = useSelector(selectIsChating);
  const messagesContext = useSelector(selectMessagesContext);
  const [userScrolling, setUserScrolling] = useState(false);
  const [previousContent, setPreviousContent] = useState("");
  const [isExporting, setIsExporting] = useState(false);
  const [controller, setController] = useState<AbortController | null>(null);
  const [isContinueGenerating, setIsContinueGenerating] = useState(false);
  const session = useSession();

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
    variables: { id: aircraftId },
    skip: !aircraftId,
  });

  useEffect(() => {
    return () => {
      controller?.abort();
    };
  }, [controller]);

  useEffect(() => {
    if (!isChating) {
      controller?.abort();
      setController(null);
    }
  }, [isChating]);

  useEffect(() => {
    if (!isAskAI) {
      controller?.abort();
      setController(null);
    }
  }, [isAskAI]);

  useEffect(() => {
    if (data && data.aircraft_by_pk) {
      const currentContent = editor?.getText();
      setAircraft(data.aircraft_by_pk);
      editor?.commands.setContent(data.aircraft_by_pk.content || "");
      if (currentContent !== data.aircraft_by_pk.content) {
        setPreviousContent(currentContent || "");
      }
    }
  }, [data, editor]);

  useEffect(() => {
    if (
      isAircraftGenerating &&
      aircraftId === aircraft?.id &&
      editor &&
      messagesContext
    ) {
      const currentContent = editor.getText();
      editor.commands.setContent("");
      editor.commands.focus("start");
      handleGenerateAnswer(currentContent);
    }
  }, [isAircraftGenerating, editor, messagesContext, aircraftId, aircraft]);

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

  const handleUpdateAircraft = useCallback(
    async (content: string) => {
      if (aircraft?.id) {
        const response = await updateAircraftMutation({
          variables: { pk_columns: { id: aircraft.id }, _set: { content } },
        });
        if (response.data?.update_aircraft_by_pk) {
          setAircraft(response.data?.update_aircraft_by_pk);
        }
      }
    },
    [aircraft, updateAircraftMutation],
  );

  const handleGenerateAnswer = async (currentContent?: string) => {
    const controller = new AbortController(); // Create a new AbortController
    setController(controller);
    const signal = controller.signal; // Get the signal from the controller
    const historyMessages = mapStoredMessagesToChatMessages(messagesContext) || [];

    const chatMessages = [
      ...historyMessages,
      new HumanMessage({
        content: `The previous aircraft content is: ${previousContent}`,
      }),
      new HumanMessage({
        content: `${AI_WRITE_PROMPT}\nWrite based on the following instructions: ${aircraft?.commentary}
      Return only the requested content without explanation，or follow-ups.
      The response must:
      Contain only the exact requested content/document
      Remove all interaction elements (greetings, questions, clarifications)
      Remove commentary and explanations
      Maintain full accuracy and completion
      Focus solely on document delivery

        `,
      }),
    ];

    let answer = "";

    try {
      const response = await fetch("/api/v1/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
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

          handleUpdateAircraft(answer);
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

  const handleAskAI = useCallback(
    async (inputValue: string, selectedText: string, from: number, to: number) => {
      const controller = new AbortController(); // Create a new AbortController
      const signal = controller.signal;
      setController(controller);
      const historyMessages = mapStoredMessagesToChatMessages(messagesContext) || [];

      const currentContent = editor?.getText() || "";
      const chatMessages = [
        ...historyMessages,

        new HumanMessage({
          content: `The current aircraft content is: ${currentContent}`,
        }),
        new HumanMessage({
          content: `The user selected text is: ${selectedText}`,
        }),
        new HumanMessage({
          content: `Update user content based on the following instructions: ${inputValue}, 
        Return only the requested content without explanation, HTML tags, or follow-ups.
        The response must:

        Contain only the exact requested content/document
        Remove all interaction elements (greetings, questions, clarifications)
        Remove commentary and explanations
        Keep formatting only if part of requested content
        Maintain full accuracy and completion
        Focus solely on document delivery

        The response will deliver only the essential requested content with no additional interaction or explanation.
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
            model,
            messages: chatMessages.map((message) => message.toJSON()),
          }),
          signal: signal,
        });

        if (!response.body) {
          throw new Error("ReadableStream not supported by the browser.");
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        editor
          ?.chain()
          .insertContentAt(to, {
            type: "paragraph",
            content: [{ type: "text", text: "\n" }],
          })
          .focus()
          .run();

        let insertPos = to + "\n".length + 1;

        const readStream = async () => {
          const { done, value } = await reader.read();
          if (done) {
            editor
              ?.chain()
              .setTextSelection({ from: from, to: to })
              .focus()
              .setStrike()
              .run();
            const content = editor?.getHTML();
            handleUpdateAircraft(content || "");
            return;
          }
          const chunk = decoder.decode(value, { stream: true });
          answer += chunk;
          try {
            editor?.chain().insertContentAt(insertPos, chunk).focus().run();
            insertPos += chunk.length;
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
        dispatch(setIsAskAI(false));
      }
    },
    [messagesContext, editor],
  );

  const handleContinueGenerating = useCallback(async () => {
    setIsContinueGenerating(true);
    const controller = new AbortController(); // Create a new AbortController
    const signal = controller.signal;
    setController(controller);
    const historyMessages = mapStoredMessagesToChatMessages(messagesContext) || [];

    const currentContent = editor?.getText() || "";
    const chatMessages = [
      ...historyMessages,
      new HumanMessage({
        content: `The current aircraft content is: ${currentContent}`,
      }),
      new HumanMessage({
        content: `Update user content based on the following instructions: Continue generation and keep the same style, 
        Return only the requested content without explanation, HTML tags, or follow-ups.
        The response must:

        Contain only the exact requested content/document
        Remove all interaction elements (greetings, questions, clarifications)
        Remove commentary and explanations
        Keep formatting only if part of requested content
        Maintain full accuracy and completion
        Focus solely on document delivery

        The response will deliver only the essential requested content with no additional interaction or explanation.
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
          model,
          messages: chatMessages.map((message) => message.toJSON()),
        }),
        signal: signal,
      });

      if (!response.body) {
        throw new Error("ReadableStream not supported by the browser.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      editor
        ?.chain()
        .insertContentAt(editor.state.doc.content.size, {
          type: "paragraph",
          content: [],
        })
        .focus()
        .run();

      const readStream = async () => {
        const { done, value } = await reader.read();
        if (done) {
          setIsContinueGenerating(false);
          handleUpdateAircraft(answer);
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
      dispatch(setIsChating(false));
    }
  }, [messagesContext, editor]);

  const handleSave = () => {
    console.log("The HTML is:", editor?.getJSON());
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(editor?.getText() || "");
  };

  const handleDownload = async () => {
    setIsExporting(true);

    const fileName = `${aircraft?.title || "Untitled"}-${formatDate(new Date(), "yyyy-MM-dd-HH")}.html`;
    const objectName = `/aircraft/${fileName}`;
    const body = {
      bucket: "tmp",
      objectName,
      contentType: "text/html",
      metadata: {
        fileName,
        creatorId: session.data?.user?.id || "",
      },
    };
    // step 1: upload to s3
    try {
      const response = await fetch("/api/file/presigned_url/v1", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        toast.error("System error, failed to export file");
        return;
      }
      const { presignedPutUrl } = await response.json();

      const uploadResponse = await fetch(presignedPutUrl, {
        method: "PUT",
        body: editor?.getHTML() || "",
        headers: {
          "Content-Type": "text/html",
        },
      });

      if (!uploadResponse.ok) {
        toast.error("System error, failed to export file");
        return;
      }

      const exportResponse = await fetch("/api/chat/aircraft/export", {
        method: "POST",
        body: JSON.stringify({ object_name: objectName }),
      });
      if (!exportResponse.ok) {
        toast.error("System error, failed to export file");
        return;
      }
      const { url } = await exportResponse.json();
      window.open(url, "_blank");
      setIsExporting(false);
    } catch (error) {
      console.error("error:", error);
      toast.error("Error uploading data");
    } finally {
      setIsExporting(false);
    }
  };

  if (loading || !editor) {
    return (
      <div className="flex h-full w-full items-center justify-center rounded-lg border border-gray-200">
        <div className="flex flex-col items-center">
          <div className="mb-2 h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
          <span className="text-sm text-gray-600">{t("Loading")}...</span>
        </div>
      </div>
    );
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
            isLoading={isExporting}
            isDisabled={isExporting}
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
        className="custom-scrollbar relative flex h-full flex-row overflow-auto"
        ref={menuContainerRef}>
        <div
          className="custom-scrollbar relative flex h-full flex-1 flex-col overflow-auto rounded p-2"
          ref={editorContentRef}>
          <ContentItemMenu editor={editor} />
          <TableRowMenu editor={editor} appendTo={menuContainerRef} />
          <TableColumnMenu editor={editor} appendTo={menuContainerRef} />
          <EditorContent editor={editor} />
          <AIBubbleMenu editor={editor} onAskAI={handleAskAI} />
        </div>
        <EditorSideBar
          isOpen={rightSidebar.isOpen}
          onClose={rightSidebar.close}
          editor={editor}
        />
      </div>
      {!isAircraftGenerating && !isAskAI && aircraft?.content && (
        <div className="sticky -bottom-2 flex items-center justify-center bg-background">
          <Button
            isLoading={isContinueGenerating}
            isDisabled={isContinueGenerating || isAircraftGenerating}
            onClick={() => handleContinueGenerating()}
            variant="light"
            className="flex items-center gap-2 text-sm text-blue-600 hover:bg-gray-100">
            <Icon icon="lucide:plus-circle" className="h-4 w-4" />
            {t("Continue generation")}
          </Button>
        </div>
      )}
    </div>
  );
}
