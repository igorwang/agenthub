"use client";

import { Icon } from "@iconify/react";
import { Tooltip } from "@nextui-org/react";
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
type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

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
    immediatelyRender: false,
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

  const copyToClipboard = useCallback((text: string, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    navigator.clipboard
      .writeText(text)
      .then(() => {
        console.log("Copied to clipboard");
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  }, []);

  const parseExpression = useCallback(
    (content: string): void => {
      if (!content.includes("{{")) {
        setParsedExpression("");
        return;
      }

      const parsedContent = content.replace(/\{\{\s*(.*?)\s*\}\}/g, (match, expr) => {
        expr = expr.trim();
        try {
          if (expr.startsWith("_.")) {
            // Lodash-style operations
            const lodashMatch = expr.match(/^_\.(\w+)\((.*)\)$/);
            if (!lodashMatch) {
              throw new Error("Invalid Lodash-style expression");
            }
            const [operation, args] = lodashMatch.slice(1);
            const argList = args.split(",").map((arg: string) => arg.trim());

            switch (operation) {
              case "map":
                return handleMapOperation(argList, jsonData);
              case "zip":
                return handleZipOperation(argList, jsonData);
              default:
                throw new Error(`Unsupported operation: ${operation}`);
            }
          } else {
            const value = JSONPath({ path: expr, json: jsonData });
            if (Array.isArray(value) && value.length === 1) {
              return typeof value[0] === "object"
                ? JSON.stringify(value[0])
                : String(value[0]);
            }
            return typeof value === "object" ? JSON.stringify(value) : String(value);
          }
        } catch (error) {
          console.error("Error parsing expression:", error);
          return match;
        }
      });

      setParsedExpression(parsedContent);
    },
    [jsonData],
  );

  const handleMapOperation = (args: string[], data: Record<string, any>): string => {
    const [path, fields] = args;
    const items = JSONPath({ path, json: data }) as JsonValue[];

    if (fields.startsWith("'") && fields.endsWith("'")) {
      // Single field selection
      const field = fields.slice(1, -1);
      return JSON.stringify(
        items.map((item) => (item as Record<string, JsonValue>)[field]),
      );
    } else if (fields.startsWith("[") && fields.endsWith("]")) {
      // Multiple field selection
      const fieldList = fields
        .slice(1, -1)
        .split(",")
        .map((f) => f.trim().slice(1, -1));
      return JSON.stringify(
        items.map((item) => {
          const result: Record<string, JsonValue> = {};
          fieldList.forEach((field) => {
            const keys = field.split(".");
            let value: JsonValue = item;
            for (const key of keys) {
              value = (value as Record<string, JsonValue>)?.[key];
              if (value === undefined) break;
            }
            if (value !== undefined) {
              result[field] = value;
            }
          });
          return result;
        }),
      );
    }

    return JSON.stringify(items);
  };

  const handleZipOperation = (args: string[], data: Record<string, any>): string => {
    const arrays = args.map((arg) => JSONPath({ path: arg, json: data }) as JsonValue[]);
    const zipped = arrays[0].map((_, i) => {
      const obj: Record<string, JsonValue> = {};
      arrays.forEach((arr, j) => {
        Object.assign(obj, arr[i] as Record<string, JsonValue>);
      });
      return obj;
    });
    return JSON.stringify(zipped);
  };

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
      <div className="relative max-w-[400px]">
        {parsedExpression && (
          <div className="max-h-[300px] max-w-full overflow-auto">
            <div className="overflow-wrap-anywhere whitespace-pre-wrap break-words px-2 py-1 text-sm text-gray-500">
              {parsedExpression}
            </div>
          </div>
        )}
        {parsedExpression && (
          <Tooltip content="Copy path">
            <button
              onClick={(e) => copyToClipboard(parsedExpression, e)}
              className="absolute bottom-1 right-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
              <Icon icon="mdi:content-copy" className="h-4 w-4" />
            </button>
          </Tooltip>
        )}
      </div>
    </div>
  );
};

export default JsonExpressionInput;
