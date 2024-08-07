"use client";
import { InputSelectionPane } from "@/components/WorkflowForm/input-select-pane";
import { nodeFormComponents } from "@/components/WorkflowForm/node-forms";
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

  const FormComponent = nodeFormComponents.get(node.type);
  if (FormComponent === undefined || FormComponent === null) {
    return null;
  }

  return (
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
  );
}
