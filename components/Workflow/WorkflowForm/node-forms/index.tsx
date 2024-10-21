import ChatTriggerNodeForm from "@/components/Workflow/WorkflowForm/node-forms/chat-trigger-form";
import ChunkingNodeForm from "@/components/Workflow/WorkflowForm/node-forms/chunkging-node-form";
import ConditionNodeForm from "@/components/Workflow/WorkflowForm/node-forms/condition-node-form";
import DefaultNodeForm from "@/components/Workflow/WorkflowForm/node-forms/default-node-from";
import HumanInLoopNodeForm from "@/components/Workflow/WorkflowForm/node-forms/human-in-loop-form";
import IndexingNodeForm from "@/components/Workflow/WorkflowForm/node-forms/indexing-node-form";
import InputNodeForm from "@/components/Workflow/WorkflowForm/node-forms/input-node-form";
import LlmNodeForm from "@/components/Workflow/WorkflowForm/node-forms/llm-node-form";
import LlmV1NodeForm from "@/components/Workflow/WorkflowForm/node-forms/llm-v1-node-form";
import LoopLLMNodeForm from "@/components/Workflow/WorkflowForm/node-forms/loop-llm-node-form";
import NewDocumentNodeForm from "@/components/Workflow/WorkflowForm/node-forms/new-document-node-form";
import NewMultiModalNodeForm from "@/components/Workflow/WorkflowForm/node-forms/new-multi-modal-form";
import PreChatOutputNodeForm from "@/components/Workflow/WorkflowForm/node-forms/pre-chat-output-node-form";
import SearchLibraryNodeForm from "@/components/Workflow/WorkflowForm/node-forms/search-library-form";
import SearchMemoryNodeForm from "@/components/Workflow/WorkflowForm/node-forms/search-memory-form";
import WorkflowInputNodeForm from "@/components/Workflow/WorkflowForm/node-forms/workflow-input-node-form";
import OutputParserNodeForm from "@/components/Workflow/WorkflowForm/output-parser-form";

export const nodeFormComponents: Map<string, any | null> = new Map([
  // ['startNode', StartNodeForm],
  ["inputNode", InputNodeForm],
  ["llmNode", LlmNodeForm],
  ["outputParserNode", OutputParserNodeForm],
  ["conditionNode", ConditionNodeForm],
  ["chatTriggerNode", ChatTriggerNodeForm],
  ["llmV1Node", LlmV1NodeForm],
  ["searchLibraryNode", SearchLibraryNodeForm],
  ["preChatOutputNode", PreChatOutputNodeForm],
  ["loopLLMNode", LoopLLMNodeForm],
  ["newDocumentNode", NewDocumentNodeForm],
  ["chunkingNode", ChunkingNodeForm],
  ["indexingNode", IndexingNodeForm],
  ["humanInLoopNode", HumanInLoopNodeForm],
  ["newMultiModalNode", NewMultiModalNodeForm],
  ["searchMemoryNode", SearchMemoryNodeForm],
  ["workflowInputNode", WorkflowInputNodeForm],
  [
    "queryDocumentNode",
    (props) => <DefaultNodeForm {...props} title="Edit Query Document Node" />,
  ],
  ["aircraftNode", (props) => <DefaultNodeForm {...props} title="Edit Aircraft Node" />],
  [
    "httpRequestNode",
    (props) => <DefaultNodeForm {...props} title="Edit HttpRequest Node" />,
  ],
  // 如果某种节点类型没有对应的表单，可以设置为 null
  // ['someOtherNode', null],
]);
