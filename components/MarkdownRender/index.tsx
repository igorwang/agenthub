import "katex/dist/katex.min.css";
import React from "react";
import ReactMarkdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  const components = {
    p: ({ children }: any) => <p className="mb-4 break-words">{children}</p>,
    h1: ({ children }: any) => <h1 className="mb-4 text-2xl font-bold">{children}</h1>,
    h2: ({ children }: any) => <h2 className="mb-3 text-xl font-bold">{children}</h2>,
    h3: ({ children }: any) => <h3 className="mb-2 text-lg font-bold">{children}</h3>,
    ul: ({ children }: any) => <ul className="mb-4 list-disc pl-8">{children}</ul>,
    ol: ({ children }: any) => <ol className="mb-4 list-decimal pl-8">{children}</ol>,
    li: ({ children, ordered, index }: any) => (
      <li className="relative mb-2">
        {ordered && (
          <span className="absolute -left-7 w-6 pr-2 text-right">{index + 1}.</span>
        )}
        <span>{children}</span>
      </li>
    ),
    a: ({ href, children }: any) => (
      <a
        href={href}
        className="text-blue-600 hover:underline"
        target="_blank"
        rel="noopener noreferrer">
        {children}
      </a>
    ),
    img: ({ src, alt }: any) => (
      <img src={src} alt={alt} className="my-4 h-auto max-w-full" />
    ),
    blockquote: ({ children }: any) => (
      <blockquote className="my-4 break-words border-l-4 border-gray-300 pl-4 italic">
        {children}
      </blockquote>
    ),
    table: ({ children }: any) => (
      <div className="my-4 w-full overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300">
          {children}
        </table>
      </div>
    ),
    th: ({ children }: any) => (
      <th className="border border-gray-300 bg-gray-100 px-4 py-2">{children}</th>
    ),
    td: ({ children }: any) => (
      <td className="border border-gray-300 px-4 py-2">{children}</td>
    ),
  };

  return (
    <div className="markdown-content w-full max-w-full overflow-hidden">
      <ReactMarkdown
        remarkPlugins={[remarkMath, remarkGfm]}
        rehypePlugins={[rehypeKatex, rehypeRaw]}
        components={components}
        className="w-full max-w-full overflow-hidden">
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;
