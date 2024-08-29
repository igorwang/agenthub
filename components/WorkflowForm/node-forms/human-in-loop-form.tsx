import CustomForm from "@/components/ui/nextui-form";
import { Divider } from "@nextui-org/react";
import { Node } from "@xyflow/react";
import { useTranslations } from "next-intl";

interface NodeData {
  [key: string]: any;
}

interface HumanInLoopNodeFormProps {
  node: Node<NodeData>;
  prevNodes?: Node[];
  workflowTestResult?: { [key: string]: any };
  onNodeChange?: (data: { [key: string]: any }) => void;
  onToggleDrawer?: () => void;
}

export default function HumanInLoopNodeForm({
  node,
  prevNodes,
  workflowTestResult,
  onNodeChange,
  onToggleDrawer,
}: HumanInLoopNodeFormProps) {
  const nodeData = node.data || {};
  const t = useTranslations();

  const onSubmit = (data: any) => {
    onNodeChange?.(data);
    onToggleDrawer?.();
  };
  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="text-2xl font-bold">{t("Edit HumanInLoop Node")}</div>
      <Divider />
      <CustomForm
        schema={nodeData.schema}
        uiSchema={nodeData.uiSchema}
        formData={nodeData}
        onSubmit={(formData) => {
          onSubmit?.({ ...formData, id: node.id });
        }}
        onClose={() => {
          onToggleDrawer?.();
        }}
        prevNodes={prevNodes}
        workflowTestResult={workflowTestResult}
      />
    </div>
  );
}
