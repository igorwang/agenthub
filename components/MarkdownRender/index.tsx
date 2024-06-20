import "katex/dist/katex.min.css";
import React from "react";
import ReactMarkdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import gfm from "remark-gfm";
import remarkMath from "remark-math";

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => (
  <ReactMarkdown
    children={content}
    remarkPlugins={[remarkMath, gfm]}
    rehypePlugins={[rehypeKatex]}
  />
);

export default MarkdownRenderer;
