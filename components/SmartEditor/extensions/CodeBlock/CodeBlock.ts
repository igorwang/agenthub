import { CodeBlockLowlight } from "@tiptap/extension-code-block-lowlight";
import "highlight.js/styles/atom-one-dark.css";
import { all, createLowlight } from "lowlight";
const lowlight = createLowlight(all);

export const CodeBlock = CodeBlockLowlight.configure({
  lowlight,
  defaultLanguage: "javascript",
  languageClassPrefix: "language-",
  HTMLAttributes: {
    class: "whitespace-pre-wrap",
  },
});
