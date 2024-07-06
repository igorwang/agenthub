"use client";

import "katex/dist/katex.min.css";
import React from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import { default as gfm, default as remarkGfm } from "remark-gfm";
import remarkMath from "remark-math";

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  const components = {
    // 为 code 标签提供自定义渲染器
    code({ node, inline, className, children, ...props }: any) {
      const match = /language-(\w+)/.exec(className || "");
      return !inline && match ? (
        <SyntaxHighlighter
          style={materialDark}
          language={match[1]}
          PreTag="div"
          {...props}>
          {String(children).replace(/\n$/, "")}
        </SyntaxHighlighter>
      ) : (
        <code className="w-full max-w-full flex-1 overflow-auto" {...props}>
          {children}
        </code>
      );
    },
  };

  return (
    <ReactMarkdown
      children={content}
      remarkPlugins={[remarkMath, remarkGfm, gfm]}
      rehypePlugins={[rehypeKatex, rehypeRaw]}
      components={components} // 使用自定义渲染器
    />
  );
};

export default MarkdownRenderer;
