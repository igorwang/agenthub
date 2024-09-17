import { Extension, useEditor } from "@tiptap/react";

import { CodeBlock } from "@/components/SmartEditor/extensions/CodeBlock";
import FontSize from "@/components/SmartEditor/extensions/FontSize";
import { TableOfContentsNode } from "@/components/SmartEditor/extensions/TableOfContentsNode";
import "@/styles/index.css";
import TableOfContents from "@tiptap-pro/extension-table-of-contents";
import Bold from "@tiptap/extension-bold";
import Code from "@tiptap/extension-code";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import Italic from "@tiptap/extension-italic";
import Link from "@tiptap/extension-link";
import Strike from "@tiptap/extension-strike";
import TextAlign from "@tiptap/extension-text-align";
import TextStyle from "@tiptap/extension-text-style";
import Underline from "@tiptap/extension-underline";
import UniqueID from "@tiptap/extension-unique-id";
import StarterKit from "@tiptap/starter-kit";
export { TableOfContents } from "@tiptap-pro/extension-table-of-contents";
TableOfContentsNode;
const content = {
  type: "doc",
  content: [
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "Hi there," }],
    },
    // {
    //   type: "imageBlock",
    //   attrs: {
    //     src: "/placeholder-image.jpg",
    //     width: "100%",
    //     align: "center",
    //   },
    // },
    {
      type: "paragraph",
      content: [
        { type: "text", text: "this is a basic " },
        { type: "text", text: "basic", marks: [{ type: "italic" }] },
        { type: "text", text: " example of " },
        { type: "text", text: "Tiptap", marks: [{ type: "bold" }] },
        {
          type: "text",
          text: ". Sure, there are all kind of basic text styles you'd probably expect from a text editor. But wait until you see the lists:",
        },
      ],
    },
    {
      type: "orderedList",
      content: [
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "That's a different list, actually it's an ordered list.",
                },
              ],
            },
          ],
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [{ type: "text", text: "It also has three list items." }],
            },
          ],
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [{ type: "text", text: "And all of them are numbered." }],
            },
          ],
        },
      ],
    },
    {
      type: "bulletList",
      content: [
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [{ type: "text", text: "That's a bullet list with one …" }],
            },
          ],
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [{ type: "text", text: "… or two list items." }],
            },
          ],
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "Isn't that great? And all of that is editable. But wait, there's more. Let's try a code block:",
        },
      ],
    },
    {
      type: "codeBlock",
      attrs: { language: "css" },
      content: [{ type: "text", text: "body {\n  display: none;\n}" }],
    },
    {
      type: "blockquote",
      content: [
        {
          type: "paragraph",
          content: [
            { type: "text", text: "Wow, that's amazing. Good work, boy! 👏" },
            { type: "hardBreak" },
            { type: "text", text: "— Mom" },
          ],
        },
      ],
    },
    {
      type: "codeBlock",
      attrs: { language: "javascript" },
      content: [
        {
          type: "text",
          text: 'for (var i=1; i <= 20; i++)\n{\n  if (i % 15 == 0)\n    console.log("FizzBuzz");\n  else if (i % 3 == 0)\n    console.log("Fizz");\n  else if (i % 5 == 0)\n    console.log("Buzz");\n  else\n    console.log(i);\n}',
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "Press Command/Ctrl + Enter to leave the fenced code block and continue typing in boring paragraphs.",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "I know, I know, this is impressive. It's only the tip of the iceberg though. Give it a try and click a little bit around. Don't forget to check the other examples too.",
        },
      ],
    },
  ],
};

export const useBlockEditor = ({ editable = true }: { editable?: boolean }) => {
  const editor = useEditor({
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl min-h-[200px] p-1 focus:outline-none",
      },
    },
    extensions: [
      StarterKit.configure({
        codeBlock: false,
      }) as Extension,
      TableOfContents,
      TableOfContentsNode,
      CodeBlock,
      Bold,
      Strike,
      Italic,
      Underline,
      Code,
      Highlight.configure({
        multicolor: true,
      }),
      Link,
      FontSize,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Color.configure({
        types: ["textStyle"],
      }),
      UniqueID.configure({
        types: ["heading", "paragraph"],
      }),
      TextStyle,
    ],
    editable: editable,
    autofocus: true,
    onCreate: (ctx) => {
      console.log(ctx);
      if (ctx.editor.isEmpty) {
        ctx.editor.commands.setContent(content);
        ctx.editor.commands.focus("start", { scrollIntoView: true });
      }
    },
  });

  editor?.on("contentError", (e) => {
    console.log(e);
  });

  return editor;
};
