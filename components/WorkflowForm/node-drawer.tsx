"use client";
import ConditionNodeForm from "@/components/WorkflowForm/condition-node-form";
import { InputSelectionPane } from "@/components/WorkflowForm/input-select-pane";
import LlmNodeForm from "@/components/WorkflowForm/llm-node-form";
import OutputParserNodeForm from "@/components/WorkflowForm/output-parser-form";
import { Node } from "@xyflow/react";
import Drawer from "react-modern-drawer";

import "react-modern-drawer/dist/index.css";

interface NodeDrawerProps {
  prevNodes?: Node[];
  node: Node | null;
  isOpen: boolean;
  onToggleDrawer: () => void;
  onNodeChange?: (data: { [key: string]: any }) => void;
}

const formComponents: Map<string, any | null> = new Map([
  // ['startNode', StartNodeForm],
  // ['inputNode', InputNodeForm],
  ["llmNode", LlmNodeForm],
  ["outputParserNode", OutputParserNodeForm],
  ["conditionNode", ConditionNodeForm],
  // 如果某种节点类型没有对应的表单，可以设置为 null
  // ['someOtherNode', null],
]);

export default function NodeDrawer({
  prevNodes,
  node,
  isOpen,
  onToggleDrawer,
  onNodeChange,
}: NodeDrawerProps) {
  if (!node?.type) {
    return null;
  }

  const FormComponent = formComponents.get(node.type);
  if (FormComponent === undefined) {
    // 如果没有找到对应的表单，关闭抽屉
    onToggleDrawer();
    return null;
  }
  if (FormComponent === null) {
    // 如果明确设置为 null，也关闭抽屉
    onToggleDrawer();
    return null;
  }

  // const renderForm = () => {
  //   return <FormComponent node={node} />;
  // };

  return (
    // <div className="">
    <Drawer
      open={isOpen}
      onClose={onToggleDrawer}
      direction="right"
      className="z-20 flex h-full min-w-[800px] flex-row overflow-auto">
      <div className="my-10 w-1/2 px-2">
        <InputSelectionPane nodes={prevNodes || []} />
      </div>
      <div className="w-1/2">
        <FormComponent
          key={node.id}
          node={node}
          onNodeChange={onNodeChange}
          onToggleDrawer={onToggleDrawer}
        />
      </div>
    </Drawer>
    // </div>
  );
}
