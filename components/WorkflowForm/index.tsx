"use client";

import NodeTypeList from "@/components/WorkflowForm/node-type-list";
import WorkflowPane from "@/components/WorkflowForm/workflow-pane";
import {
  FlowEdgeFragmentFragment,
  FlowNodeFragmentFragment,
  NodeTypeFragmentFragment,
} from "@/graphql/generated/types";
import { Button } from "@nextui-org/react";
import { Edge, Node } from "@xyflow/react";
import "@xyflow/react/dist/base.css";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { v4 } from "uuid";

interface WorkflowFormProps {
  initialData?: {
    id?: string;
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
  // const [nodes, setNodes] = useState(FlowNodeFragmentFragmentDoc);
  // const [edges, setEdges] = useState(Flow_Edge_Update_Column);

  const router = useRouter();
  const flowId = initialData?.id || v4();
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

    console.log("onSubmit", data);

    const formData = new FormData();
    formData.append("id", data.id);
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("nodes", JSON.stringify(data.nodes));
    formData.append("edges", JSON.stringify(data.edges));

    const result = await action(formData);
    console.log("result");
    if (result.success) {
    } else {
      console.log("result");
      toast.error("Create error");
    }

    // if (result.success) {
    //   router.push("/workflow");
    // }
  };

  const handleWorkflowChange = (nodes: Node[], edges: Edge[]) => {
    console.log("handleWorkflowChange");
    setValue("nodes", nodes);
    setValue("edges", edges);
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* <div>
          <label htmlFor="name">Name:</label>
          <input id="name" {...register("name", { required: "Name is required" })} />
          {errors.name && <span>{errors.name.message}</span>}
        </div>
        <div>
          <label htmlFor="description">Description:</label>
          <textarea id="description" {...register("description")} />
        </div> */}
        <Button type="submit">
          {initialData ? "Update Workflow" : "Create Workflow"}
        </Button>
      </form>
      <NodeTypeList nodeTypeList={nodeTypeList} />
      <div className="h-[400px] w-full">
        <WorkflowPane
          flowId={flowId}
          initialEdges={initialEdges}
          initialNodes={initialNodes}
          onWorkflowChange={handleWorkflowChange}></WorkflowPane>
      </div>
    </div>
  );
}
