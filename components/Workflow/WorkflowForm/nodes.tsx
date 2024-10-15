import { Icon } from "@iconify/react";
import {
  Handle,
  Node,
  NodeProps,
  NodeTypes,
  Position,
  useUpdateNodeInternals,
} from "@xyflow/react";
import React, { memo, useEffect, useMemo } from "react";

type CustomNodeData = {
  label?: string;
};

type Condition = {
  name: string;
  expression: string;
  condition: string;
  value: string;
};

type ConditionNodeData = {
  label?: string;
  conditions?: Condition[];
  [key: string]: any;
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
        className={`rounded-md border ${borderColor} bg-white px-2 py-1 shadow-sm transition-colors duration-200`}>
        <div className="flex items-center">
          <div className="mr-1 flex h-6 w-6 items-center justify-center text-gray-500">
            <Icon icon={"ic:baseline-input"} fontSize={16} />
          </div>
          <div className="overflow-hidden">
            <div className="w-20 truncate text-xs font-medium text-gray-700">
              {data.label}
            </div>
          </div>
        </div>
        <Handle
          type="source"
          position={Position.Right}
          className="h-2 w-2 !border-2 !border-white !bg-gray-300"
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

export type ConditionNode = Node<ConditionNodeData, "conditionNode">;
export const ConditionNodeComponent: React.FC<NodeProps<ConditionNode>> = memo(
  ({ id, data, selected }) => {
    const updateNodeInternals = useUpdateNodeInternals();
    useEffect(() => {
      updateNodeInternals(id);
    }, [data, id, updateNodeInternals]);

    const borderColor = selected ? "border-blue-500" : "border-gray-200";

    // Calculate dynamic height based on number of conditions
    const nodeHeight = useMemo(() => {
      const baseHeight = 16; // Reduced base height
      const heightPerCondition = 16; // Slightly reduced height per condition
      const minConditions = 2; // Minimum number of conditions to show
      const conditionCount = Math.max(data.conditions?.length ?? 0, minConditions);
      return baseHeight + conditionCount * heightPerCondition;
    }, [data.conditions]);

    return (
      <div
        className={`rounded-md border ${borderColor} flex items-center justify-center bg-yellow-100 px-2 py-1 shadow-sm transition-colors duration-200`}
        style={{ height: `${nodeHeight}px` }}>
        <div className="flex items-center">
          <div className="mr-1 flex h-6 w-4 items-center justify-center text-yellow-500">
            <Icon icon="typcn:flow-switch" fontSize={14} />
          </div>
          <div className="overflow-hidden">
            <div className="w-20 truncate text-xs font-medium text-yellow-700">
              {data.label || "Condition"}
            </div>
            <div className="text-[10px] text-yellow-600">
              {data.conditions?.length ?? 0} condition
              {(data.conditions?.length ?? 0) !== 1 ? "s" : ""}
            </div>
          </div>
        </div>
        <Handle
          type="target"
          position={Position.Left}
          className="h-3 w-1 !border-1 !border-white !bg-slate-200"></Handle>
        {data.conditions?.map((cond, index) => (
          <Handle
            key={index}
            type="source"
            position={Position.Right}
            id={cond.name || `output-${index}`}
            className="h-2 w-2 !border-2 !border-white !bg-slate-200"
            style={{
              top: `${((index + 1) * 100) / ((data.conditions?.length ?? 0) + 1)}%`,
            }}>
            <div className="absolute left-full top-1/2 ml-1 -translate-y-1/2 whitespace-nowrap text-xs">
              {cond.name || `cond-${index}`}
            </div>
          </Handle>
        ))}
      </div>
    );
  },
);

export type ChatTriggerNode = Node<CustomNodeData, "chatTriggerNode">;
export const ChatTriggerNodeComponent: React.FC<NodeProps<ChatTriggerNode>> = memo(
  ({ data, selected }) => {
    const borderColor = selected ? "border-blue-500" : "border-gray-200";

    return (
      <div
        className={`rounded-md border ${borderColor} bg-white p-2 shadow-sm transition-colors duration-200`}>
        <div className="flex flex-col items-center">
          <div className="mb-1 flex h-8 w-8 items-center justify-center text-gray-500">
            <Icon icon="lets-icons:chat-plus-light" fontSize={20} />
          </div>
          <div className="overflow-hidden">
            <div className="w-16 truncate text-center text-xs font-medium text-gray-700">
              {data.label}
            </div>
          </div>
        </div>
        <Handle
          type="source"
          position={Position.Right}
          className="h-2 w-2 !border-1 !border-white !bg-slate-300"
        />
        {/* <Handle
          type="target"
          position={Position.Left}
          className="h-4 w-2 !border-1 !border-white !bg-slate-300"
        /> */}
      </div>
    );
  },
);

export type llmV1Node = Node<CustomNodeData, "llmV1Node">;
export const llmV1NodeComponent: React.FC<NodeProps<InputNode>> = memo(
  ({ data, selected }) => {
    const borderColor = selected ? "border-blue-500" : "border-gray-200";

    return (
      <div
        className={`rounded-md border ${borderColor} bg-white px-2 py-1 shadow-sm transition-colors duration-200`}>
        <div className="flex items-center">
          <div className="mr-1 flex h-6 w-6 items-center justify-center text-gray-500">
            <Icon icon="hugeicons:chat-bot" fontSize={16} />
          </div>
          <div>
            <div className="text-xs font-medium text-gray-700">{data.label}</div>
          </div>
        </div>
        <Handle
          type="target"
          position={Position.Left}
          className="-ml-0.5 h-2 w-0.5 !border-1 !border-white !bg-gray-300"
        />
        <Handle
          type="source"
          position={Position.Right}
          className="-mr-0.5 h-2 w-0.5 !border-1 !border-white !bg-gray-300"
        />
      </div>
    );
  },
);

export type QueryDocumentNode = Node<CustomNodeData, "queryDocumentNode">;
export const QueryDocumentNodeComponent: React.FC<NodeProps<QueryDocumentNode>> = memo(
  ({ data, selected }) => {
    const borderColor = selected ? "border-green-500" : "border-gray-200";

    return (
      <div
        className={`rounded-md border ${borderColor} bg-green-50 px-2 py-1 shadow-sm transition-colors duration-200`}>
        <div className="flex flex-col items-center">
          <div className="mb-0.5 flex h-6 w-6 items-center justify-center text-green-500">
            <Icon icon="icon-park-outline:find" fontSize={16} />
          </div>
          <div className="text-center text-[10px] font-medium text-green-700">
            {data.label}
          </div>
        </div>
        <Handle
          type="target"
          position={Position.Left}
          className="-ml-0.5 h-4 w-0.5 !border-1 !border-green-100 !bg-green-300"
        />
        <Handle
          type="source"
          position={Position.Right}
          className="-mr-0.5 h-4 w-0.5 !border-1 !border-green-100 !bg-green-300"
        />
      </div>
    );
  },
);

export type SearchLibraryNode = Node<CustomNodeData, "searchLibraryNode">;
export const SearchLibraryNodeComponent: React.FC<NodeProps<SearchLibraryNode>> = memo(
  ({ data, selected }) => {
    const borderColor = selected ? "border-purple-500" : "border-gray-200";

    return (
      <div
        className={`rounded-md border ${borderColor} bg-purple-50 px-2 py-1 shadow-sm transition-colors duration-200`}>
        <div className="flex flex-col items-center">
          <div className="mb-0.5 flex h-6 w-6 items-center justify-center text-purple-500">
            <Icon icon="et:search" fontSize={16} />
          </div>
          <div className="text-center text-[10px] font-medium text-purple-700">
            {data.label}
          </div>
        </div>
        <Handle
          type="target"
          position={Position.Left}
          className="-ml-0.5 h-4 w-0.5 !border-1 !border-purple-100 !bg-purple-300"
        />
        <Handle
          type="source"
          position={Position.Right}
          className="-mr-0.5 h-4 w-1 !border-1 !border-purple-100 !bg-purple-300"
        />
      </div>
    );
  },
);
export type searchMemoryNode = Node<CustomNodeData, "searchMemoryNode">;

export const SearchMemoryNodeComponent: React.FC<NodeProps<searchMemoryNode>> = memo(
  ({ data, selected }) => {
    const borderColor = selected ? "border-blue-500" : "border-gray-200";

    return (
      <div
        className={`rounded-md border ${borderColor} bg-green-50 px-2 py-1 shadow-sm transition-colors duration-200`}>
        <div className="flex flex-col items-center">
          <div className="mb-0.5 flex h-6 w-6 items-center justify-center text-green-300">
            <Icon icon="game-icons:brain-freeze" fontSize={16} />
          </div>
          <div className="text-center text-[10px] font-medium text-green-500">
            {data.label}
          </div>
        </div>
        <Handle
          type="target"
          position={Position.Left}
          className="-ml-0.5 h-4 w-0.5 !border-1 !border-purple-100 !bg-green-300"
        />
        <Handle
          type="source"
          position={Position.Right}
          className="-mr-0.5 h-4 w-1 !border-1 !border-purple-100 !bg-green-300"
        />
      </div>
    );
  },
);

export type PreChatOutputNode = Node<CustomNodeData, "preChatOutputNode">;

export const PreChatOutputNodeComponent: React.FC<NodeProps<PreChatOutputNode>> = memo(
  ({ data, selected }) => {
    const borderColor = selected ? "border-blue-500" : "border-gray-200";

    return (
      <div
        className={`rounded-md border ${borderColor} bg-blue-50 px-2 py-1 shadow-sm transition-colors duration-200`}>
        <div className="flex flex-col items-center">
          <div className="mb-0.5 flex h-6 w-6 items-center justify-center text-blue-500">
            <Icon icon="material-symbols:output" fontSize={16} />
          </div>
          <div className="overflow-hidden">
            <div className="w-24 truncate text-center text-xs font-medium text-gray-700">
              {data.label || "Pre-Chat"}
            </div>
          </div>
        </div>
        <Handle
          type="target"
          position={Position.Left}
          className="-ml-0.5 h-3 w-0.5 !border-1 !border-blue-100 !bg-blue-300"
        />
      </div>
    );
  },
);

export type LoopLLMNode = Node<CustomNodeData, "LoopLLMNode">;
export const LoopLLMNodeComponent: React.FC<NodeProps<LoopLLMNode>> = memo(
  ({ data, selected }) => {
    const borderColor = selected ? "border-blue-500" : "border-gray-200";

    return (
      <div
        className={`rounded-md border ${borderColor} bg-white px-2 py-1 shadow-sm transition-colors duration-200`}>
        <div className="flex items-center">
          <div className="mr-1 flex h-6 w-6 items-center justify-center text-gray-500">
            <Icon icon="fluent:bot-add-20-regular" fontSize={16} />
          </div>
          <div>
            <div className="text-xs font-medium text-gray-700">{data.label}</div>
          </div>
        </div>
        <Handle
          type="target"
          position={Position.Left}
          className="-ml-0.5 h-3 w-0.5 !border-1 !border-white !bg-gray-300"
        />
        <Handle
          type="source"
          position={Position.Right}
          className="-mr-0.5 h-2 w-0.5 !border-1 !border-white !bg-gray-300"
        />
      </div>
    );
  },
);

export type newDocumentNode = Node<CustomNodeData, "newDocumentNode">;
export const NewDocumentNodeComponent: React.FC<NodeProps<newDocumentNode>> = memo(
  ({ data, selected }) => {
    const borderColor = selected ? "border-blue-500" : "border-gray-200";

    return (
      <div
        className={`rounded-md border ${borderColor} bg-white p-2 shadow-sm transition-colors duration-200`}>
        <div className="flex flex-col items-center">
          <div className="mb-1 flex h-8 w-8 items-center justify-center text-gray-500">
            <Icon icon="fluent:document-add-16-regular" fontSize={20} />
          </div>
          <div className="overflow-hidden">
            <div className="w-16 truncate text-center text-xs font-medium text-gray-700">
              {data.label}
            </div>
          </div>
        </div>
        <Handle
          type="source"
          position={Position.Right}
          className="h-4 w-2 !border-1 !border-white !bg-slate-300"
        />
      </div>
    );
  },
);

export type newMultiModalNode = Node<CustomNodeData, "newMultiModalNode">;
export const NewMultiModalNodeComponent: React.FC<NodeProps<newMultiModalNode>> = memo(
  ({ data, selected }) => {
    const borderColor = selected ? "border-blue-500" : "border-gray-200";

    return (
      <div
        className={`rounded-md border ${borderColor} bg-white p-2 shadow-sm transition-colors duration-200`}>
        <div className="flex flex-col items-center">
          <div className="mb-1 flex h-8 w-8 items-center justify-center text-gray-500">
            <Icon icon="fluent-mdl2:media-add" fontSize={20} />
          </div>
          <div className="overflow-hidden">
            <div className="w-16 truncate text-center text-xs font-medium text-gray-700">
              {data.label}
            </div>
          </div>
        </div>
        <Handle
          type="source"
          position={Position.Right}
          className="h-2 w-2 !border-1 !border-white !bg-slate-300"
        />
      </div>
    );
  },
);

export type ChunkingNode = Node<CustomNodeData, "ChunkingNode">;
export const ChunkingNodeComponent: React.FC<NodeProps<ChunkingNode>> = memo(
  ({ data, selected }) => {
    const borderColor = selected ? "border-blue-500" : "border-gray-200";

    return (
      <div
        className={`rounded-md border ${borderColor} bg-white px-2 py-1 shadow-sm transition-colors duration-200`}>
        <div className="flex items-center">
          <div className="mr-1 flex h-6 w-6 items-center justify-center text-gray-500">
            <Icon icon="ic:baseline-horizontal-split" fontSize={16} />
          </div>
          <div>
            <div className="text-xs font-medium text-gray-700">{data.label}</div>
          </div>
        </div>
        <Handle
          type="target"
          position={Position.Left}
          className="-ml-0.5 h-3 w-0.5 !border-1 !border-white !bg-gray-300"
        />
        <Handle
          type="source"
          position={Position.Right}
          className="-mr-0.5 h-2 w-0.5 !border-1 !border-white !bg-gray-300"
        />
      </div>
    );
  },
);

export type IndexingNode = Node<CustomNodeData, "IndexingNode">;

export const IndexingNodeComponent: React.FC<NodeProps<PreChatOutputNode>> = memo(
  ({ data, selected }) => {
    const borderColor = selected ? "border-blue-500" : "border-gray-200";

    return (
      <div
        className={`rounded-md border ${borderColor} bg-blue-50 px-2 py-1 shadow-sm transition-colors duration-200`}>
        <div className="flex flex-col items-center">
          <div className="mb-0.5 flex h-6 w-6 items-center justify-center text-blue-500">
            <Icon icon="gravity-ui:database-fill" fontSize={16} />
          </div>
          <div className="overflow-hidden">
            <div className="w-24 truncate text-center text-xs font-medium text-gray-700">
              {data.label || "Pre-Chat"}
            </div>
          </div>
        </div>
        <Handle
          type="target"
          position={Position.Left}
          className="-ml-0.5 h-3 w-0.5 !border-1 !border-blue-100 !bg-blue-300"
        />
      </div>
    );
  },
);

export type HumanInLoopNode = Node<CustomNodeData, "HumanInLoopNode">;
export const HumanInLoopNodeComponent: React.FC<NodeProps<HumanInLoopNode>> = memo(
  ({ data, selected }) => {
    const borderColor = selected ? "border-blue-500" : "border-gray-200";

    return (
      <div
        className={`rounded-md border ${borderColor} bg-white px-2 py-1 shadow-sm transition-colors duration-200`}>
        <div className="flex flex-col items-center">
          <div className="mb-0.5 flex h-6 w-6 items-center justify-center">
            <Icon icon="mdi:account-question" fontSize={16} />
          </div>
          <div className="overflow-hidden">
            <div className="w-24 truncate text-center text-xs font-medium text-gray-700">
              {data.label || "Ask Question"}
            </div>
          </div>
        </div>
        <Handle
          type="target"
          position={Position.Left}
          className="-ml-0.5 h-3 w-0.5 !border-1 !border-white !bg-gray-300"
        />
      </div>
    );
  },
);

export type workflowInputNode = Node<CustomNodeData, "workflowInputNode">;
export const workflowInputNodeComponent: React.FC<NodeProps<workflowInputNode>> = memo(
  ({ data, selected }) => {
    const borderColor = selected ? "border-blue-500" : "border-gray-200";

    return (
      <div
        className={`rounded-md border ${borderColor} bg-white p-1 shadow-sm transition-colors duration-200`}>
        <div className="flex items-center">
          <div className="mr-1 flex h-6 w-6 items-center justify-center text-gray-500">
            <Icon icon="material-symbols-light:not-started-outline" fontSize={16} />
          </div>
          <div className="overflow-hidden">
            <div className="w-24 truncate text-xs font-medium text-gray-700">
              {data.label}
            </div>
          </div>
        </div>
        <Handle
          type="source"
          position={Position.Right}
          className="h-4 w-1 !border-1 !border-white !bg-slate-300"
        />
      </div>
    );
  },
);

export type AircraftNode = Node<CustomNodeData, "AircraftNode">;
export const AircraftNodeComponent: React.FC<NodeProps<AircraftNode>> = memo(
  ({ data, selected }) => {
    const borderColor = selected ? "border-blue-500" : "border-gray-200";

    return (
      <div
        className={`rounded-md border ${borderColor} bg-white px-2 py-1 shadow-sm transition-colors duration-200`}>
        <div className="flex items-center">
          <div className="mr-1 flex h-6 w-6 items-center justify-center text-gray-500">
            <Icon icon="mdi:canvas" fontSize={16} />
          </div>
          <div>
            <div className="text-xs font-medium text-gray-700">{data.label}</div>
          </div>
        </div>
        <Handle
          type="target"
          position={Position.Left}
          className="-ml-0.5 h-3 w-0.5 !border-1 !border-white !bg-gray-300"
        />
        <Handle
          type="source"
          position={Position.Right}
          className="-mr-0.5 h-2 w-0.5 !border-1 !border-white !bg-gray-300"
        />
      </div>
    );
  },
);

StartNodeComponent.displayName = "StartNodeComponent";
InputNodeComponent.displayName = "InputNodeComponent";
llmNodeComponent.displayName = "llmNodeComponent";
EndNodeComponent.displayName = "EndNodeComponent";
OutputParserNodeComponent.displayName = "outputParserNode";
ConditionNodeComponent.displayName = "ConditionNodeComponent";
ChatTriggerNodeComponent.displayName = "ChatTriggerNodeComponent";
llmV1NodeComponent.displayName = "llmV1NodeComponent";
SearchLibraryNodeComponent.displayName = "SearchLibraryNodeComponent";
PreChatOutputNodeComponent.displayName = "PreChatOutputNodeComponent";
LoopLLMNodeComponent.displayName = "LoopLLMNodeComponent";
NewDocumentNodeComponent.displayName = "NewDocumentNodeComponent";
ChunkingNodeComponent.displayName = "ChunkingNodeComponent";
IndexingNodeComponent.displayName = "IndexingNodeComponent";
HumanInLoopNodeComponent.displayName = "HumanInLoopNodeComponent";
NewMultiModalNodeComponent.displayName = "NewMultiModalNodeComponent";
SearchMemoryNodeComponent.displayName = "SearchMemoryNodeComponent";
workflowInputNodeComponent.displayName = "WorkflowInputNodeComponent";
QueryDocumentNodeComponent.displayName = "QueryDocumentNodeComponent";
AircraftNodeComponent.displayName = "AircraftNodeComponent";
export const nodeTypes: NodeTypes = {
  startNode: StartNodeComponent,
  inputNode: InputNodeComponent,
  llmNode: llmNodeComponent,
  endNode: EndNodeComponent,
  outputParserNode: OutputParserNodeComponent,
  conditionNode: ConditionNodeComponent,
  chatTriggerNode: ChatTriggerNodeComponent,
  llmV1Node: llmV1NodeComponent,
  searchLibraryNode: SearchLibraryNodeComponent,
  preChatOutputNode: PreChatOutputNodeComponent,
  loopLLMNode: LoopLLMNodeComponent,
  newDocumentNode: NewDocumentNodeComponent,
  chunkingNode: ChunkingNodeComponent,
  indexingNode: IndexingNodeComponent,
  humanInLoopNode: HumanInLoopNodeComponent,
  newMultiModalNode: NewMultiModalNodeComponent,
  searchMemoryNode: SearchMemoryNodeComponent,
  workflowInputNode: workflowInputNodeComponent,
  queryDocumentNode: QueryDocumentNodeComponent,
  aircraftNode: AircraftNodeComponent,
};
