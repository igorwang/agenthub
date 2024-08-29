import ChatTriggerNodeForm from "@/components/WorkflowForm/node-forms/chat-trigger-form";
import ChunkingNodeForm from "@/components/WorkflowForm/node-forms/chunkging-node-form";
import ConditionNodeForm from "@/components/WorkflowForm/node-forms/condition-node-form";
import HumanInLoopNodeForm from "@/components/WorkflowForm/node-forms/human-in-loop-form";
import IndexingNodeForm from "@/components/WorkflowForm/node-forms/indexing-node-form";
import InputNodeForm from "@/components/WorkflowForm/node-forms/input-node-form";
import LlmNodeForm from "@/components/WorkflowForm/node-forms/llm-node-form";
import LlmV1NodeForm from "@/components/WorkflowForm/node-forms/llm-v1-node-form";
import LoopLLMNodeForm from "@/components/WorkflowForm/node-forms/loop-llm-node-form";
import NewDocumentNodeForm from "@/components/WorkflowForm/node-forms/new-document-node-form";
import PreChatOutputNodeForm from "@/components/WorkflowForm/node-forms/pre-chat-output-node-form";
import SearchLibraryNodeForm from "@/components/WorkflowForm/node-forms/search-library-form";
import OutputParserNodeForm from "@/components/WorkflowForm/output-parser-form";

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

  // 如果某种节点类型没有对应的表单，可以设置为 null
  // ['someOtherNode', null],
]);
