"use client";

import { Extension } from "@tiptap/core";
import { Plugin, PluginKey } from "@tiptap/pm/state";
import { Decoration, DecorationSet } from "@tiptap/pm/view";
import { EditorContent, Editor as ReactEditor, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { JSONPath } from "jsonpath-plus";
import React, { useCallback, useEffect, useState } from "react";

interface JsonExpressionInputProps {
  defaultValue?: string;
  jsonData?: object;
  id?: string;
  value?: string;
  isRequired?: boolean;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  autoFocus?: boolean;
  placeholder?: string;
  className?: string;
  onChange?: (value: string) => void;
  onBlur?: (id: string, e: React.FocusEvent<HTMLDivElement>) => void;
  onFocus?: (id: string, e: React.FocusEvent<HTMLDivElement>) => void;
}

const highlightPlugin = new PluginKey("highlight");

const JsonExpression = Extension.create({
  name: "jsonExpression",
  immediatelyRender: false,
  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: highlightPlugin,
        props: {
          decorations(state) {
            const decorations: Decoration[] = [];
            const doc = state.doc;

            doc.descendants((node, pos) => {
              if (node.isText) {
                const text = node.text || "";
                let match;
                const regex = /\{\{(.*?)\}\}/g;

                while ((match = regex.exec(text)) !== null) {
                  const start = pos + match.index;
                  const end = start + match[0].length;
                  decorations.push(
                    Decoration.inline(start, end, {
                      class: "bg-green-200 rounded px-1",
                    }),
                  );
                }
              }
            });

            return DecorationSet.create(doc, decorations);
          },

          handlePaste: (view, event) => {
            const text = event.clipboardData?.getData("text/plain");
            if (text && /\{\{.*?\}\}/.test(text)) {
              view.dispatch(view.state.tr.insertText(text));
              return true;
            }
            return false;
          },
        },
      }),
    ];
  },
});

const JsonExpressionInput: React.FC<JsonExpressionInputProps> = ({
  defaultValue = "",
  jsonData = {},
  id,
  value,
  isRequired = false,
  isDisabled = false,
  isReadOnly = false,
  autoFocus = false,
  placeholder = "Enter JSON expression",
  className = "",
  onChange,
  onBlur,
  onFocus,
}) => {
  const [parsedExpression, setParsedExpression] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);

  const editor = useEditor({
    extensions: [StarterKit, JsonExpression],
    content: value || defaultValue,
    editable: !isDisabled && !isReadOnly,
    autofocus: autoFocus,
    editorProps: {
      attributes: {
        class: `w-full resize-none overflow-auto whitespace-pre-wrap break-words border border-gray-300 rounded p-2 font-mono focus:outline-none focus:border-blue-500 ${className} ${
          isDragOver ? "border-blue-500" : ""
        }`,
        style: "min-height: 40px;",
      },
    },
    onUpdate: ({ editor }) => {
      const content = editor.getText();
      onChange && onChange(content);
      parseExpression(content);
    },
  });

  useEffect(() => {
    if (editor && (isDisabled !== undefined || isReadOnly !== undefined)) {
      editor.setEditable(!isDisabled && !isReadOnly);
    }
  }, [editor, isDisabled, isReadOnly]);

  useEffect(() => {
    if (editor && value !== undefined && value !== editor.getText()) {
      editor.commands.setContent(value);
    }
  }, [editor, value]);

  const parseExpression = useCallback(
    (content: string) => {
      if (!content.includes("{{")) {
        setParsedExpression("");
        return;
      }

      const parsedContent = content.replace(/\{\{\s*(.*?)\s*\}\}/g, (match, path) => {
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

      setParsedExpression(parsedContent);
    },
    [jsonData],
  );

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();
      setIsDragOver(false);
      const jsonData = event.dataTransfer.getData("application/json");
      try {
        const path = JSON.parse(jsonData).path;
        if (path && editor) {
          editor.commands.insertContent(`{{ ${path} }}`);
        }
      } catch (error) {
        console.error("Error parsing dropped JSON data:", error);
      }
    },
    [editor],
  );

  if (!editor) {
    return null;
  }

  return (
    <div className="flex w-full flex-col space-y-2 rounded-lg">
      <div onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>
        <div
          onBlur={(e) => onBlur && onBlur(id || "", e)}
          onFocus={(e) => onFocus && onFocus(id || "", e)}>
          <EditorContent editor={editor as ReactEditor} />
        </div>
      </div>
      <div className="max-w-[400px]">
        {parsedExpression && (
          <div className="max-w-full overflow-hidden">
            <div className="overflow-x-auto">
              <div className="inline-block min-w-full">
                <div className="overflow-wrap-anywhere whitespace-pre-wrap break-words px-2 py-1 text-sm text-gray-500">
                  {parsedExpression}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JsonExpressionInput;
