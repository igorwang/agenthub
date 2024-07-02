"use client";
import { Icon } from "@iconify/react";
import { Button, Spacer, Textarea } from "@nextui-org/react";
import { useRef, useState } from "react";
// import { faSearchengin } from "@fortawesome/free-regular-svg-icons";
import { cn } from "@/cn";
import ExamplePanel from "@/components/AISearch/example-panel";
import { faSearchPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface SearchPanelProps {
  messages?: string[];
  query?: string;
}

export default function SearchPanel({ messages, query }: SearchPanelProps) {
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [showEmptyScreen, setShowEmptyScreen] = useState(false);
  const [placeholder, setPlaceholder] = useState("Ask a question...");

  const iconElement = (
    <FontAwesomeIcon icon={faSearchPlus} beatFade size="3x" className="max-w-[60px]" />
  );

  const handleSubmit = () => {};
  return (
    <div
      className={
        "fixed bottom-8 left-20 right-20 mx-auto flex h-screen max-w-full flex-col items-center justify-center"
      }>
      {iconElement}
      <Spacer y={4}></Spacer>
      <form onSubmit={handleSubmit} className="w-full max-w-2xl px-6">
        <div className="relative mb-10 flex w-full flex-col items-center justify-end">
          <Textarea
            ref={inputRef}
            name="query"
            rows={1}
            maxRows={5}
            variant="bordered"
            placeholder={placeholder}
            spellCheck={false}
            value={input}
            className="translate-y-1/2"
            classNames={{
              input: "placeholder:text-lg placeholder:translate-y-1/2",
            }}
            onChange={(e) => {
              setInput(e.target.value);
              setShowEmptyScreen(e.target.value.length === 0);
            }}
            onKeyDown={(e) => {
              // Enter should submit the form
              if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                // Prevent the default action to avoid adding a new line
                if (input.trim().length === 0) {
                  e.preventDefault();
                  return;
                }
                e.preventDefault();
                const textarea = e.target as HTMLTextAreaElement;
                textarea.form?.requestSubmit();
              }
            }}
            onFocus={() => {
              setShowEmptyScreen(true);
              setPlaceholder("");
            }}
            onBlur={() => {
              setShowEmptyScreen(false), setPlaceholder("Ask a question...");
            }}
            endContent={
              <Button
                isIconOnly
                variant="light"
                className="absolute right-2 top-1/2 -translate-y-1/2 transform"
                startContent={
                  <Icon
                    icon={"fluent:arrow-right-20-regular"}
                    width={24}
                    height={24}
                    className="text-slate-500"
                  />
                }></Button>
            }
          />
          {input && (
            <label className="ml-auto mt-10 flex pr-2 text-sm font-medium opacity-70 peer-disabled:cursor-not-allowed">
              <strong>Shift + Enter</strong>&nbsp;to add a new line
            </label>
          )}
        </div>
        <ExamplePanel
          submitMessage={(message) => {
            setInput(message);
          }}
          className={cn(showEmptyScreen ? "visible" : "invisible")}
        />
      </form>
    </div>
  );
}
