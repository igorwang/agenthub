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
    <aside className="w-64 border-r border-gray-200 bg-gray-50 p-4 text-xs">
      <div className="mb-4 text-sm">Drag nodes to the right pane.</div>
      <div className="grid grid-cols-2 gap-2">
        {nodeTypeList.map((item) => (
          <div
            key={item.id}
            className="flex h-16 cursor-move flex-col items-center justify-center rounded border border-blue-500 p-1 text-center"
            onDragStart={(event) => onDragStart(event, item)}
            draggable>
            <div className="mb-1 h-6 w-6">{/* You can add an icon here if needed */}</div>
            <span className="text-xs leading-tight">{item.label}</span>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default NodeTypeList;
