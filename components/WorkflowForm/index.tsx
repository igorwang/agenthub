"use client";

import NodeTypeList from "@/components/WorkflowForm/node-type-list";
import WorkflowPane from "@/components/WorkflowForm/workflow-pane";
import {
  FlowEdgeFragmentFragment,
  FlowNodeFragmentFragment,
  NodeTypeFragmentFragment,
} from "@/graphql/generated/types";
import { Button, Input } from "@nextui-org/react";
import { Edge, Node } from "@xyflow/react";
import "@xyflow/react/dist/base.css";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";

interface WorkflowFormProps {
  initialData: {
    id: string;
    name: string;
    description: string;
    nodes?: FlowNodeFragmentFragment[];
    edges?: FlowEdgeFragmentFragment[];
  };
  nodeTypeList: NodeTypeFragmentFragment[];
  action: (formData: FormData) => Promise<{ success: boolean }>;
}

type FormValues = {
  id: string;
  name: string;
  description: string;
  nodes?: Node[];
  edges?: Edge[];
};

export default function WorkflowForm({
  initialData,
  action,
  nodeTypeList,
}: WorkflowFormProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const flowId = initialData.id;

  const initialNodes = initialData?.nodes
    ? initialData.nodes.map((item) => ({
        id: item.id,
        position: { x: item.position_x, y: item.position_y },
        type: item.node_type.type,
        data: { ...item.data },
      }))
    : [];

  const initialEdges = initialData?.edges
    ? initialData.edges.map((item) => ({
        id: item.id,
        source: item.source_id,
        target: item.target_id,
      }))
    : [];

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm<FormValues>({
    defaultValues: {
      id: flowId,
      name: initialData?.name || "",
      description: initialData?.description || "",
      nodes: initialNodes,
      edges: initialEdges,
    },
  });
  const onSubmit: SubmitHandler<FormValues> = async (data, event) => {
    event?.preventDefault();
    const formData = new FormData();

    formData.append("id", data.id);
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("nodes", JSON.stringify(data.nodes));
    formData.append("edges", JSON.stringify(data.edges));

    const result = await action(formData);
    if (result.success) {
    } else {
      toast.error("Create error");
    }

    if (result.success) {
      toast.success("Save workflow success");
      // router.push(`/workflow/${flowId}/edit`);
    }
  };

  const handleWorkflowChange = (nodes: Node[], edges: Edge[]) => {
    setValue("nodes", nodes);
    setValue("edges", edges);
  };

  return (
    <div className="flex flex-col gap-4">
      <Controller
        name={"name"}
        control={control}
        rules={{ required: "name  is required" }}
        render={({ field }) => (
          <div className="max-w-1/2 w-[300px]">
            {isEditing ? (
              <Input
                autoFocus
                {...field}
                onBlur={(e) => {
                  field.onBlur();
                  setIsEditing(false);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault(); // 防止表单提交
                    field.onBlur(); // 触发 react-hook-form 的 onBlur
                    setIsEditing(false);
                  }
                }}
              />
            ) : (
              <div
                className="min-h-[40px] cursor-pointer rounded border p-2 hover:bg-gray-100"
                onClick={() => setIsEditing(true)}>
                {field.value}
              </div>
            )}
          </div>
        )}
      />
      {errors.name && (
        <p className="mt-1 text-sm text-red-500">{errors.name.message as string}</p>
      )}

      <div className="flex w-full flex-row gap-2">
        <NodeTypeList nodeTypeList={nodeTypeList} />
        <div className="z-20 min-h-[600px] w-full border bg-white">
          <WorkflowPane
            flowId={flowId}
            initialEdges={initialEdges}
            initialNodes={initialNodes}
            onWorkflowChange={handleWorkflowChange}></WorkflowPane>
        </div>
      </div>

      <form className="flex justify-end" onSubmit={handleSubmit(onSubmit)}>
        <Button type="submit" color="primary" className="">
          {"Save Workflow"}
        </Button>
      </form>
      {/* <div className="flex flex-row">
        <div className="w-1/2">
          <JsonTreeRenderer jsonData={defaultDocumentSchemaExample}></JsonTreeRenderer>
        </div>
        <div className="w-full">
          <JsonExpressionInput
            onSubmit={() => {}}
            jsonData={defaultDocumentSchemaExample}></JsonExpressionInput>
        </div>
      </div> */}
    </div>
  );
}
