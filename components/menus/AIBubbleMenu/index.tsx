"use client";
import { Icon } from "@iconify/react";
import { Button, Textarea } from "@nextui-org/react";
import { BubbleMenu, Editor } from "@tiptap/react";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState } from "react";

export type AIBubbleMenuProps = {
  editor: Editor;
  onAskAI?: (inputValue: string, selectedText: string, from: number, to: number) => void;
};

export const AIBubbleMenu = ({ editor, onAskAI }: AIBubbleMenuProps) => {
  const t = useTranslations("");
  // const commands = useTextMenuCommand(editor);
  // const states = useTextmenuStates(editor);
  const [inputValue, setInputValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isAskAI, setIsAskAI] = useState(false);

  useEffect(() => {
    const { from, to } = editor.state.selection;
    const nodes = editor.state.doc.nodesBetween(from, to, (node, pos) => {
      return true;
    });
  }, [editor.state.selection]);

  const handleInputFocus = useCallback(() => {
    const { from, to } = editor.state.selection;
    editor
      .chain()
      .setTextSelection({ from, to })
      .setHighlight({ color: "#E6F3FF" })
      .run();
  }, [editor]);

  const handleInputBlur = useCallback(() => {
    const { from, to } = editor.state.selection;
    editor.chain().focus().setTextSelection({ from, to }).unsetHighlight().run();
  }, [editor]);

  const handleAskAI = useCallback(
    (e: React.MouseEvent) => {
      setIsAskAI(true);
      const { from, to } = editor.state.selection;
      const selectedText = editor.state.doc.textBetween(from, to, " ");

      onAskAI?.(inputValue.trim(), selectedText, from, to);

      // editor.chain().deleteRange({
      //   from: thinkingNodePos,
      //   to: thinkingNodePos + thinkingTips.length + 1,
      // });

      // Simulate AI response (replace with actual AI call)
      // setTimeout(() => {
      //   // Remove thinking node and insert AI response

      //   editor
      //     .chain()
      //     .deleteRange({
      //       from: thinkingNodePos,
      //       to: thinkingNodePos + thinkingTips.length + 1,
      //     })
      //     .insertContentAt(thinkingNodePos, {
      //       type: "paragraph",
      //       content: [{ type: "text", text: "\n" }],
      //     })
      //     .focus()
      //     .run();

      //   setIsAskAI(false);
      //   setInputValue("");
      // }, 2000);

      setIsAskAI(false);
      setInputValue("");
    },
    [editor, inputValue, isAskAI, onAskAI, t],
  );

  // const restoreSelection = useCallback(() => {
  //   if (selectionRange) {
  //     editor.commands.setTextSelection({
  //       from: selectionRange.from,
  //       to: selectionRange.to,
  //     });
  //   }
  // }, [editor, selectionRange]);

  return (
    <BubbleMenu
      tippyOptions={{
        popperOptions: {
          placement: "top-start",
          modifiers: [
            {
              name: "preventOverflow",
              options: {
                boundary: "viewport",
                padding: 8,
              },
            },
            {
              name: "flip",
              options: {
                fallbackPlacements: ["bottom-start", "top-end", "bottom-end"],
              },
            },
          ],
        },
        maxWidth: "none", // 移除最大宽度限制
      }}
      editor={editor}
      pluginKey="textMenu"
      // shouldShow={states.shouldShow}
      // shouldShow={() => true}
      shouldShow={({ from, to }) => {
        // 默认显示
        if (from === to) {
          return false;
        }
        return true;
      }}
      updateDelay={300}>
      <div className="flex w-[400px] items-center overflow-hidden border border-gray-200 bg-white shadow-xl">
        <Textarea
          className="flex-grow"
          placeholder={`${t("Ask AI")}...`}
          size="sm"
          variant="flat"
          autoFocus
          minRows={1}
          maxRows={5}
          value={inputValue}
          onValueChange={setInputValue}
          ref={textareaRef}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          classNames={{
            input: "text-sm text-gray-700 py-2 px-3",
            inputWrapper: "bg-transparent data-[hover=true]:bg-gray-50 transition-colors",
            innerWrapper: "py-0",
          }}
        />
        <Button
          isIconOnly
          isDisabled={isAskAI || !inputValue.trim()}
          isLoading={isAskAI}
          variant="light"
          aria-label="Send"
          size="sm"
          className="z-40"
          onClick={handleAskAI}
          onMouseDown={(e) => e.stopPropagation()}>
          <Icon icon="mdi:send" className="text-gray-600" fontSize={24} />
        </Button>
      </div>
    </BubbleMenu>
  );
};
