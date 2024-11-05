import { mergeAttributes, Node, NodeViewProps } from "@tiptap/core";
import { NodeViewContent, NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react";
import React from "react";

// 定义节点属性的接口
interface TranslationNodeAttributes {
  pid: string;
  source: string;
  target: string;
}

interface TranslationNodeViewProps extends Omit<NodeViewProps, "node"> {
  node: NodeViewProps["node"] & {
    attrs: TranslationNodeAttributes;
  };
}

// React 组件
const TranslationNodeView: React.FC<TranslationNodeViewProps> = ({
  node,
  updateAttributes,
}) => {
  return (
    <NodeViewWrapper
      className="translation-block p-4 transition-colors hover:bg-gray-50"
      data-pid={node.attrs.pid}>
      <p className="mb-2 text-xs font-medium text-gray-500">
        <span>ID: </span>
        {node.attrs.pid}
      </p>
      <NodeViewContent />
      {/* <NodeViewContent /> */}
      {/* <div className="flex flex-col gap-4">
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <p className="paragraph text-sm leading-relaxed text-gray-700">
            {node.attrs.source}
          </p>
        </div>
        <div className="rounded-lg border border-blue-100 bg-blue-50/50 p-4 shadow-sm">
          <NodeViewContent className="paragraph text-sm leading-relaxed text-gray-800 outline-none">
            {node.attrs.target}
          </NodeViewContent>
        </div>
      </div> */}

      {/* <p contentEditable={false}>{node.attrs.source}</p> */}
      {/* <p contentEditable={true}>{node.attrs.target}</p> */}
    </NodeViewWrapper>
  );
};

// 扩展节点类型声明
declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    translationNode: {
      setTranslationNode: (attributes: TranslationNodeAttributes) => ReturnType;
      updateTranslation: (attributes: Partial<TranslationNodeAttributes>) => ReturnType;
    };
  }
}

// 自定义节点定义
export const TranslationNode = Node.create({
  name: "translationNode",

  group: "block",
  content: "block+",
  selectable: true,
  defining: true,
  draggable: true,

  addAttributes() {
    return {
      pid: {
        default: null as string | null,
      },
      source: {
        default: "",
      },
      target: {
        default: "",
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="translation-block"]',
        getAttrs: (element): TranslationNodeAttributes | null => {
          if (!(element instanceof HTMLElement)) {
            return null;
          }
          return {
            pid: element.getAttribute("data-pid") || "",
            source: element.querySelector(".source")?.textContent || "",
            target: element.querySelector(".target")?.textContent || "",
          };
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, { "data-type": "translation-block" }),
      ["p", { class: "source " }, HTMLAttributes.source],
      ["p", { class: "target" }, HTMLAttributes.target],
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(TranslationNodeView);
  },

  addCommands() {
    return {
      setTranslationNode:
        (attributes: TranslationNodeAttributes) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: attributes,
          });
        },

      updateTranslation:
        (attributes: Partial<TranslationNodeAttributes>) =>
        ({ commands }) => {
          return commands.updateAttributes(this.name, attributes);
        },
    };
  },
});

// // 使用示例
// const EditorComponent: React.FC = () => {
//   const editor = useEditor({
//     extensions: [StarterKit, TranslationNode],
//     content: {
//       type: "doc",
//       content: [
//         {
//           type: "translationNode",
//           attrs: {
//             pid: "001",
//             source: "Original content",
//             target: "Translated content",
//           },
//         },
//       ],
//     },
//   });

//   return (
//     <div>
//       <EditorContent editor={editor} />
//     </div>
//   );
// };
