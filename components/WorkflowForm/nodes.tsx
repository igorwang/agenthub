import { Icon } from "@iconify/react";
import { Handle, Node, NodeProps, NodeTypes, Position } from "@xyflow/react";
import React, { memo } from "react";

type CustomNodeData = {
  label?: string;
};

export type StartNode = Node<CustomNodeData, "startNode">;
export const StartNodeComponent: React.FC<NodeProps<StartNode>> = memo(({ data }) => {
  return (
    <div className="rounded-md border-2 border-stone-400 bg-white px-4 py-2 shadow-md">
      <div className="flex items-center">
        {/* <div className="mr-2 flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-white">
          ⚡
        </div> */}
        <div>
          <div className="text-lg font-bold">{data.label}</div>
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} className="w-16 !bg-teal-500" />
    </div>
  );
});

export type InputNode = Node<CustomNodeData, "inputNode">;
export const InputNodeComponent: React.FC<NodeProps<InputNode>> = memo(
  ({ data, selected }) => {
    const borderColor = selected ? "border-blue-500" : "border-gray-200";

    return (
      <div
        className={`rounded-md border ${borderColor} bg-white px-4 py-2 shadow-sm transition-colors duration-200`}>
        <div className="flex items-center">
          <div className="mr-2 flex h-8 w-8 items-center justify-center text-gray-500">
            <Icon icon={"ic:baseline-input"} fontSize={24} />
          </div>
          <div>
            <div className="text-sm font-medium text-gray-700">{data.label}</div>
          </div>
        </div>
        <Handle
          type="source"
          position={Position.Right}
          className="h-3 w-3 !border-2 !border-white !bg-gray-300"
        />
      </div>
    );
  },
);

export type llmNode = Node<CustomNodeData, "llmNode">;
export const llmNodeComponent: React.FC<NodeProps<InputNode>> = memo(
  ({ data, selected }) => {
    const borderColor = selected ? "border-blue-500" : "border-gray-200";

    return (
      <div
        className={`rounded-md border ${borderColor} bg-white px-4 py-2 shadow-sm transition-colors duration-200`}>
        <div className="flex items-center">
          <div className="mr-2 flex h-12 w-8 items-center justify-center text-gray-500">
            <Icon icon={"hugeicons:chat-bot"} fontSize={24} />
          </div>
          <div>
            <div className="text-sm font-medium text-gray-700">{data.label}</div>
          </div>
        </div>
        <Handle
          type="target"
          position={Position.Left}
          className="h-4 w-1 !border-1 !border-white !bg-gray-300"
        />
        <Handle
          type="source"
          position={Position.Right}
          className="h-3 w-3 !border-2 !border-white !bg-gray-300"
        />
      </div>
    );
  },
);

export type endNode = Node<CustomNodeData, "endNode">;
export const EndNodeComponent: React.FC<NodeProps<endNode>> = memo(
  ({ data, selected }) => {
    const borderColor = selected ? "border-blue-500" : "border-gray-200";

    return (
      <div
        className={`rounded-md border ${borderColor} bg-slate-100 px-4 py-2 shadow-sm transition-colors duration-200`}>
        <div className="flex items-center">
          <div className="mr-2 flex h-6 w-4 items-center justify-center text-slate-300">
            <Icon icon="mdi:stop-circle" fontSize={24} />
          </div>
          <div>
            <div className="text-sm font-medium text-slate-700">
              {data.label || "End"}
            </div>
          </div>
        </div>
        <Handle
          type="target"
          position={Position.Left}
          className="h-4 w-1 !border-1 !border-white !bg-red-300"
        />
      </div>
    );
  },
);

// export const EndNode: React.FC<NodeProps> = memo(({ data }) => {
//   return (
//     <div className="rounded-md border-2 border-stone-400 bg-white px-4 py-2 shadow-md">
//       <div className="flex items-center">
//         <div className="mr-2 flex h-8 w-8 items-center justify-center rounded-full bg-gray-300">
//           ●
//         </div>
//         <div>
//           <div className="text-lg font-bold">{"End"}</div>
//         </div>
//       </div>
//       <Handle type="target" position={Position.Top} className="w-16 !bg-teal-500" />
//     </div>
//   );
// });

export type outputParserNode = Node<CustomNodeData, "outputParserNode">;
export const OutputParserNodeComponent: React.FC<NodeProps<outputParserNode>> = memo(
  ({ data, selected }) => {
    const borderColor = selected ? "border-blue-500" : "border-gray-200";
    return (
      <div
        className={`rounded-md border ${borderColor} bg-purple-100 px-4 py-2 shadow-sm transition-colors duration-200`}>
        <div className="flex items-center">
          <div className="mr-1 flex h-12 w-6 items-center justify-center text-purple-500">
            <Icon icon="mdi:code-json" fontSize={24} />
          </div>
          <div>
            <div className="text-sm font-medium text-purple-700">
              {data.label || "Output Parser"}
            </div>
          </div>
        </div>
        <Handle
          type="target"
          position={Position.Left}
          className="h-4 w-1 !border-1 !border-white !bg-purple-300"
        />
        <Handle
          type="source"
          position={Position.Right}
          className="h-3 w-3 !border-2 !border-white !bg-purple-300"
        />
      </div>
    );
  },
);

export const nodeTypes: NodeTypes = {
  startNode: StartNodeComponent,
  inputNode: InputNodeComponent,
  llmNode: llmNodeComponent,
  endNode: EndNodeComponent,
  outputParserNode: OutputParserNodeComponent,
};
