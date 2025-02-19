import { NodeTypeFragmentFragment } from "@/graphql/generated/types";
import { Icon } from "@iconify/react";
import { useTranslations } from "next-intl";
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

  const t = useTranslations();

  return (
    <aside className="h-full w-64 border-r border-gray-200 bg-gray-200 p-4 text-xs">
      <div className="mb-4 text-sm">{t("Drag nodes to the right pane")}.</div>
      <div className="grid grid-cols-2 gap-2">
        {nodeTypeList.map((item) => (
          <div
            key={item.id}
            className="flex h-16 cursor-move flex-col items-center justify-center gap-1 rounded border border-blue-500 p-1 text-center"
            onDragStart={(event) => onDragStart(event, item)}
            draggable>
            {/* <div className="mb-1 h-6 w-6"> */}
            <Icon icon={item.icon ? item.icon : "carbon:pcn-p-node"} fontSize={20} />
            {/* </div> */}
            <span className="max-w-full overflow-hidden text-ellipsis text-nowrap text-xs leading-tight">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default NodeTypeList;
