import CustomForm from "@/components/ui/nextui-form";
import { Divider } from "@nextui-org/react";
import { Node } from "@xyflow/react";

interface NodeData {
  [key: string]: any;
}

interface ConditionNodeFormProps {
  node: Node<NodeData>;
  onNodeChange?: (data: { [key: string]: any }) => void;
  onToggleDrawer?: () => void;
}

// type FormValues = {
//   id: string;
//   label: string;
//   inputSchemaData: object | null;
//   output_schema: object | null;
// };

export default function ConditionNodeForm({
  node,
  onNodeChange,
  onToggleDrawer,
}: ConditionNodeFormProps) {
  const nodeData = node.data || {};
  console.log("nodeData", nodeData);

  const onSubmit = (data: any) => {
    onNodeChange?.(data);
    onToggleDrawer?.();
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="text-2xl font-bold">Edit Condition Node</div>
      <Divider />
      {/* <form onSubmit={handleSubmit(onSubmit)}> */}
      <CustomForm
        schema={nodeData.schema}
        uiSchema={nodeData.uiSchema}
        onSubmit={(formData) => {
          console.log("formData", formData);
        }}
        onClose={() => {
          console.log("CustomForm close");
        }}
      />
    </div>
  );
}
