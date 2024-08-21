"use client";

import NodeTypeList from "@/components/WorkflowForm/node-type-list";
import WorkflowPane from "@/components/WorkflowForm/workflow-pane";
import {
  FlowEdgeFragmentFragment,
  FlowNodeFragmentFragment,
  NodeTypeFragmentFragment,
} from "@/graphql/generated/types";
import { Button, Input, Spacer } from "@nextui-org/react";
import { Edge, Node } from "@xyflow/react";
import "@xyflow/react/dist/base.css";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
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
  nodes: Node[];
  edges: Edge[];
};

export default function WorkflowForm({
  initialData,
  action,
  nodeTypeList,
}: WorkflowFormProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const flowId = initialData.id;

  const initialNodes = useMemo(
    () =>
      initialData?.nodes?.map((item) => ({
        id: item.id,
        position: { x: item.position_x, y: item.position_y },
        type: item.node_type.type,
        data: { ...item.data },
      })) || [],
    [initialData?.nodes],
  );

  const initialEdges = useMemo(
    () =>
      initialData?.edges?.map((item) => ({
        id: item.id,
        source: item.source_id,
        target: item.target_id,
        sourceHandle: item.sourceHandle,
      })) || [],
    [initialData?.edges],
  );

  const { control, handleSubmit, setValue, watch } = useForm<FormValues>({
    defaultValues: {
      id: flowId,
      name: initialData?.name || "",
      description: initialData?.description || "",
      nodes: initialNodes,
      edges: initialEdges,
    },
  });
  const currentNodes = watch("nodes");
  const currentEdges = watch("edges");

  const onSubmit: SubmitHandler<FormValues> = useCallback(
    async (data) => {
      const formData = new FormData();
      formData.append("id", data.id);
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("nodes", JSON.stringify(data.nodes));
      formData.append("edges", JSON.stringify(data.edges));

      const result = await action(formData);
      if (result.success) {
        toast.success("Save workflow success");
        setHasUnsavedChanges(false);
      } else {
        toast.error("Create error");
      }
    },
    [action],
  );

  const handleWorkflowChange = useCallback(
    (newNodes: Node[], newEdges: Edge[]) => {
      console.log("Workflow changed:", { newNodes, newEdges });
      const hasNodeChanges = JSON.stringify(newNodes) !== JSON.stringify(currentNodes);
      const hasEdgeChanges = JSON.stringify(newEdges) !== JSON.stringify(currentEdges);

      if (hasNodeChanges) {
        setValue("nodes", newNodes);
      }
      if (hasEdgeChanges) {
        setValue("edges", newEdges);
      }
    },
    [setValue, currentNodes, currentEdges],
  );

  const handleRunWorkflow = useCallback(() => {
    if (hasUnsavedChanges) {
      toast.warning("Please save your changes before running the workflow");
    } else {
      toast.info("Running workflow...");
    }
  }, [hasUnsavedChanges]);

  return (
    <div className="relative flex flex-col gap-4">
      <Controller
        name="name"
        control={control}
        rules={{ required: "name is required" }}
        render={({ field }) => (
          <div className="max-w-1/2 w-[300px]">
            {isEditing ? (
              <Input
                autoFocus
                {...field}
                onBlur={() => setIsEditing(false)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
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

      <div className="flex w-full flex-row gap-2">
        <NodeTypeList nodeTypeList={nodeTypeList} />
        <div className="z-20 min-h-[600px] w-full border bg-white">
          <WorkflowPane
            flowId={flowId}
            initialEdges={initialEdges}
            initialNodes={initialNodes}
            onWorkflowChange={handleWorkflowChange}
            onEditStatusChange={() => setHasUnsavedChanges(true)}
          />
        </div>
      </div>

      <form className="flex justify-end" onSubmit={handleSubmit(onSubmit)}>
        <Button color="secondary" onClick={handleRunWorkflow} className="mr-2">
          Run Workflow Test
        </Button>
        <Spacer />
        <Button type="submit" color="primary">
          Save Workflow
        </Button>
      </form>

      {hasUnsavedChanges && (
        <p className="absolute bottom-0 left-0 text-sm text-yellow-600">
          You have unsaved changes.
        </p>
      )}
    </div>
  );
}
