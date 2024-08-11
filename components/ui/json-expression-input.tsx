import { JSONPath } from "jsonpath-plus";
import React, { useCallback, useEffect, useRef, useState } from "react";

interface JsonExpressionInputProps {
  defaultValue?: string;
  jsonData?: object;
  // onSubmit: (expression: string) => void;
  // 新添加的属性
  id?: string;
  value?: string;
  isRequired?: boolean;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  autoFocus?: boolean;
  placeholder?: string;
  className?: string;
  onChange?: (value: string) => void;
  onBlur?: (id: string, e: React.FocusEvent<HTMLTextAreaElement>) => void;
  onFocus?: (id: string, e: React.FocusEvent<HTMLTextAreaElement>) => void;
}

const JsonExpressionInput: React.FC<JsonExpressionInputProps> = ({
  defaultValue = "",
  jsonData = {},
  // onSubmit,
  // 新添加的属性
  id,
  value,
  isRequired = false,
  isDisabled = false,
  isReadOnly = false,
  autoFocus = false,
  placeholder,
  className = "",
  onChange,
  onBlur,
  onFocus,
}) => {
  const [expression, setExpression] = useState(value || defaultValue);
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
    const newValue = e.target.value;
    setExpression(newValue);
    onChange && onChange(newValue);
  };

  // const handleSubmit = () => {
  //   onSubmit(expression);
  // };

  const syncScroll = () => {
    if (highlightRef.current && textareaRef.current) {
      highlightRef.current.scrollTop = textareaRef.current.scrollTop;
      highlightRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const jsonData = event.dataTransfer.getData("application/json");
    const path = JSON.parse(jsonData).path;
    if (path) {
      const newExpression = `${expression} {{ ${path} }}`;
      setExpression(newExpression);
      onChange && onChange(newExpression);
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
      if (!exp.includes("{{")) return "";
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
    <div className={`flex flex-col space-y-2 rounded-lg ${className}`}>
      <div
        className="relative"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}>
        <textarea
          id={id}
          ref={textareaRef}
          value={expression}
          onChange={handleInput}
          onScroll={syncScroll}
          required={isRequired}
          disabled={isDisabled}
          readOnly={isReadOnly}
          autoFocus={autoFocus}
          placeholder={placeholder}
          onBlur={(e) => onBlur && onBlur(id || "", e)}
          onFocus={(e) => onFocus && onFocus(id || "", e)}
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
