import { NodeTypeFragmentFragment } from "@/graphql/generated/types";
import React from "react";
export type NodeType = "input" | "default" | "output";

interface NodeTypeListProps {
  nodeTypeList: NodeTypeFragmentFragment[];
}
const NodeTypeList: React.FC<NodeTypeListProps> = ({ nodeTypeList }) => {
  const onDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    nodeType: NodeTypeFragmentFragment,
  ) => {
    event.dataTransfer.setData("application/json", JSON.stringify(nodeType));
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <aside className="border-r border-gray-200 bg-gray-50 p-4 text-sm">
      <div className="mb-4">You can drag these nodes to the pane on the right.</div>
      {nodeTypeList.map((item) => (
        <div
          key={item.id}
          className="mb-2 flex cursor-move items-center justify-center rounded border border-blue-500 p-2"
          onDragStart={(event) => onDragStart(event, item)}
          draggable>
          {item.label}
        </div>
      ))}
    </aside>
  );
};

export default NodeTypeList;
