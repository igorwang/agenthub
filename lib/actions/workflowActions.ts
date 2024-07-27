"use server";

import {
  CreateNewWorkflowDocument,
  CreateNewWorkflowMutationVariables,
  DeleteNodesAndEdgesDocument,
  DeleteNodesAndEdgesMutationVariables,
} from "@/graphql/generated/types";
import { performMutation } from "@/lib/apolloRequest";
import { Edge, Node } from "@xyflow/react";

export async function createNewWorkflow(formData: FormData) {
  // const session = await auth();
  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  let nodes: Node[] = [];
  let edges: Edge[] = [];

  try {
    const nodesJson = formData.get("nodes");
    if (typeof nodesJson === "string") {
      nodes = JSON.parse(nodesJson) as Node[];
    }
    const edgesJson = formData.get("edges");
    if (typeof edgesJson === "string") {
      edges = JSON.parse(edgesJson) as Edge[];
    }
  } catch (error) {
    console.error("Error parsing nodes or edges:", error);
    throw new Error("Invalid nodes or edges data");
  }
  if (!Array.isArray(nodes) || !Array.isArray(edges)) {
    throw new Error("Nodes and edges must be arrays");
  }

  const deleteVariables: DeleteNodesAndEdgesMutationVariables = {
    where: { flow_id: { _eq: id } },
    where1: { flow_id: { _eq: id } },
  };

  const insertVariables: CreateNewWorkflowMutationVariables = {
    object: {
      id: id,
      name: name,
      description: description,
      flow_nodes: {
        data: nodes.map((item) => ({
          id: item.id,
          node_type_id: item.data.node_type_id,
          data: item.data,
          position_x: item.position.x,
          position_y: item.position.y,
        })),
      },
      flow_edges: {
        data: edges.map((item) => ({
          id: item.id,
          source_id: item.source,
          target_id: item.target,
        })),
      },
    },
  };

  try {
    const deleteResult = await performMutation(
      DeleteNodesAndEdgesDocument,
      deleteVariables,
    );
    console.log("deleteResult", deleteResult);

    const insertResult = await performMutation(
      CreateNewWorkflowDocument,
      insertVariables,
    );
    console.log("insertResult", insertResult);
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error: "Failed to create workflow. Please try again later.",
    };
  }
  return { success: true };
}

export async function updateWorkflow(id: string, formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;

  // 这里应该是实际的数据库操作
  console.log("Updating workflow:", id, { name, description });

  // 在实际应用中，您会在这里与数据库交互
  // 例如: await db.workflow.update(id, { name, description });

  // revalidatePath('/workflow');
  return { success: true };
}
