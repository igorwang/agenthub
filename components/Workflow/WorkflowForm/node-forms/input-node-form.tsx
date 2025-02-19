import CustomForm from "@/components/ui/nextui-form";
import { Divider } from "@nextui-org/react";
import { Node } from "@xyflow/react";

interface NodeData {
  [key: string]: any;
}

interface InputNodeFormProps {
  node: Node<NodeData>;
  workflowTestResult?: { [key: string]: any };
  onNodeChange?: (data: { [key: string]: any }) => void;
  onToggleDrawer?: () => void;
}

export default function InputNodeForm({
  node,
  workflowTestResult,
  onNodeChange,
  onToggleDrawer,
}: InputNodeFormProps) {
  const nodeData = node.data || {};

  const onSubmit = (data: any) => {
    onNodeChange?.(data);
    onToggleDrawer?.();
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="text-2xl font-bold">Edit Input Node</div>
      <Divider />
      <CustomForm
        schema={nodeData.schema}
        uiSchema={nodeData.uiSchema || {}}
        workflowTestResult={workflowTestResult}
        formData={nodeData}
        onSubmit={(formData) => {
          onSubmit?.({ ...formData, id: node.id });
        }}
        onClose={() => {
          onToggleDrawer?.();
        }}
      />
    </div>
  );
}
