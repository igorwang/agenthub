"use client";
import { selectIsAskAI, setIsAskAI } from "@/lib/features/chatListSlice";
import { Icon } from "@iconify/react";
import { Button, Textarea } from "@nextui-org/react";
import { BubbleMenu, Editor } from "@tiptap/react";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export type AIBubbleMenuProps = {
  editor: Editor;
  onAskAI?: (inputValue: string, selectedText: string, from: number, to: number) => void;
};

export const AIBubbleMenu = ({ editor, onAskAI }: AIBubbleMenuProps) => {
  const t = useTranslations("");
  const dispatch = useDispatch();
  const [inputValue, setInputValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isAskAI = useSelector(selectIsAskAI);

  useEffect(() => {
    const { from, to } = editor.state.selection;
    const selectedText = editor.state.doc.textBetween(from, to, " ");
    console.log("selectedText:", selectedText, from, to);
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
      dispatch(setIsAskAI(true));
      const { from, to } = editor.state.selection;
      const selectedText = editor.state.doc.textBetween(from, to, " ");
      onAskAI?.(inputValue.trim(), selectedText, from, to);

      setInputValue("");
    },
    [editor, inputValue, isAskAI, onAskAI, t],
  );

  return (
    <BubbleMenu editor={editor} pluginKey="textMenu" updateDelay={200}>
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
          endContent={
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
              <Icon
                icon={isAskAI ? "mdi:loading" : "mdi:send"}
                className="text-gray-600"
                fontSize={24}
              />
            </Button>
          }
        />
      </div>
    </BubbleMenu>
  );
};
