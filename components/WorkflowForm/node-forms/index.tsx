import ChatTriggerNodeForm from "@/components/WorkflowForm/node-forms/chat-trigger-form";
import ConditionNodeForm from "@/components/WorkflowForm/node-forms/condition-node-form";
import InputNodeForm from "@/components/WorkflowForm/node-forms/input-node-form";
import LlmNodeForm from "@/components/WorkflowForm/node-forms/llm-node-form";
import OutputParserNodeForm from "@/components/WorkflowForm/output-parser-form";

export const nodeFormComponents: Map<string, any | null> = new Map([
  // ['startNode', StartNodeForm],
  ["inputNode", InputNodeForm],
  ["llmNode", LlmNodeForm],
  ["outputParserNode", OutputParserNodeForm],
  ["conditionNode", ConditionNodeForm],
  ["chatTriggerNode", ChatTriggerNodeForm],

  // 如果某种节点类型没有对应的表单，可以设置为 null
  // ['someOtherNode', null],
]);
