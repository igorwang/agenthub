import { JSONPath } from "jsonpath-plus";
import React, { useCallback, useEffect, useRef, useState } from "react";

interface JsonExpressionInputProps {
  defaultValue?: string;
  jsonData?: object;
  onSubmit: (expression: string) => void;
}

const JsonExpressionInput: React.FC<JsonExpressionInputProps> = ({
  defaultValue = "",
  jsonData = {},
  onSubmit,
}) => {
  const [expression, setExpression] = useState(defaultValue);
  const [parsedExpression, setParsedExpression] = useState("");

  const [isDragOver, setIsDragOver] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);

  const highlightSyntax = useCallback((text: string) => {
    const regex = /(\{\{.*?\}\})/g;
    return text.replace(regex, (match) => {
      return `<span class="relative inline-block whitespace-nowrap"><span class="invisible">${match}</span><span class="absolute left-0 bg-green-200 text-green-800 px-1 rounded">${match}</span></span>`;
    });
  }, []);

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setExpression(e.target.value);
  };

  const handleSubmit = () => {
    onSubmit(expression);
  };

  const syncScroll = () => {
    if (highlightRef.current && textareaRef.current) {
      highlightRef.current.scrollTop = textareaRef.current.scrollTop;
      highlightRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  };
  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    // 阻止默认行为以允许放置
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    // 阻止默认行为以允许放置
    event.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    // 尝试获取不同类型的数据
    const jsonData = event.dataTransfer.getData("application/json");

    console.log("JSON data:", jsonData);
    const path = JSON.parse(jsonData).path;
    if (path) {
      setExpression((prev) => `${prev} {{ ${path} }}`);
    }
    setIsDragOver(false);
  };

  useEffect(() => {
    if (highlightRef.current) {
      const html = highlightSyntax(expression);
      highlightRef.current.innerHTML = html + "\n";
    }
  }, [expression, highlightSyntax]);

  useEffect(() => {
    const parseExpression = (exp: string) => {
      return exp.replace(/\{\{\s*(.*?)\s*\}\}/g, (match, path) => {
        try {
          const value = JSONPath({ path: path.trim(), json: jsonData });
          if (Array.isArray(value) && value.length === 1) {
            return typeof value[0] === "object"
              ? JSON.stringify(value[0])
              : String(value[0]);
          }
          return typeof value === "object" ? JSON.stringify(value) : String(value);
        } catch (error) {
          console.error("Error parsing JSONPath:", error);
          return match;
        }
      });
    };

    setParsedExpression(parseExpression(expression));
  }, [expression, jsonData]);

  return (
    <div className="flex flex-col space-y-2 rounded-lg">
      <div
        className="relative"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}>
        <textarea
          ref={textareaRef}
          value={expression}
          onChange={handleInput}
          onScroll={syncScroll}
          className={`w-full resize-none overflow-auto whitespace-pre-wrap break-words border-1 bg-transparent p-2 font-mono text-transparent caret-black focus:outline-none ${
            isDragOver ? "border-blue-500" : ""
          }`}
          style={{
            WebkitTextFillColor: "transparent",
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1,
          }}
        />
        <div
          ref={highlightRef}
          className="pointer-events-none whitespace-pre-wrap break-words p-2 font-mono"
          aria-hidden="true"
          style={{
            position: "relative",
            zIndex: 0,
          }}
        />
      </div>
      {parsedExpression && (
        <div className="border-gray-200 px-2 py-1 text-sm text-gray-500">
          {parsedExpression}
        </div>
      )}
    </div>
  );
};

export default JsonExpressionInput;
