"use client";
import { InputSelectionPane } from "@/components/Workflow/WorkflowForm/input-select-pane";
import { nodeFormComponents } from "@/components/Workflow/WorkflowForm/node-forms";
import { OutputPane } from "@/components/Workflow/WorkflowForm/output-pane";
import { Node } from "@xyflow/react";
import Drawer from "react-modern-drawer";

import "react-modern-drawer/dist/index.css";

interface NodeDrawerProps {
  prevNodes?: Node[];
  node: Node | null;
  isOpen: boolean;
  workflowTestResult: { [key: string]: any };
  onToggleDrawer: () => void;
  onNodeChange?: (data: { [key: string]: any }) => void;
}

export default function NodeDrawer({
  prevNodes,
  node,
  isOpen,
  workflowTestResult,
  onToggleDrawer,
  onNodeChange,
}: NodeDrawerProps) {
  if (!node?.type) {
    return null;
  }

  const FormComponent = nodeFormComponents.get(node.type);
  if (FormComponent === undefined || FormComponent === null) {
    return null;
  }

  return (
    <Drawer
      open={isOpen}
      onClose={onToggleDrawer}
      direction="right"
      size={1200} // 设置抽屉宽度为 1024px
      className="flex h-full w-full flex-row"
      // className="!w-[1024px]" // 使用 !important 来覆盖默认样式
    >
      <div className="custom-scrollbar my-10 w-[384px] flex-shrink-0 overflow-auto px-2">
        <InputSelectionPane
          nodes={prevNodes || []}
          workflowTestResult={workflowTestResult}
        />
      </div>
      <div className="custom-scrollbar flex-1 overflow-auto">
        <FormComponent
          key={node.id}
          node={node}
          onNodeChange={onNodeChange}
          onToggleDrawer={onToggleDrawer}
          prevNodes={prevNodes}
          workflowTestResult={workflowTestResult}
        />
      </div>
      <div className="custom-scrollbar my-10 w-[384px] overflow-auto px-2">
        <OutputPane node={node} />
      </div>
    </Drawer>
  );
}
