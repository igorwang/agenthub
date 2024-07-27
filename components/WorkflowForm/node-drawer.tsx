"use client";
import LlmNodeForm from "@/components/WorkflowForm/llm-node-form";
import { Node } from "@xyflow/react";
import Drawer from "react-modern-drawer";

import "react-modern-drawer/dist/index.css";

interface NodeDrawerProps {
  node: Node | null;
  isOpen: boolean;
  onToggleDrawer: () => void;
  onNodeChange?: (data: { [key: string]: any }) => void;
}

const formComponents: Map<string, any | null> = new Map([
  // ['startNode', StartNodeForm],
  // ['inputNode', InputNodeForm],
  ["llmNode", LlmNodeForm],
  // 如果某种节点类型没有对应的表单，可以设置为 null
  // ['someOtherNode', null],
]);

export default function NodeDrawer({
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
      className="z-20 h-full min-w-[400px] overflow-auto">
      <FormComponent key={node.id} node={node} onNodeChange={onNodeChange} />
    </Drawer>
    // </div>
  );
}
