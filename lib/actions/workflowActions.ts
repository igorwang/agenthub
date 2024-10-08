"use server";

import { auth } from "@/auth";
import {
  CreateNewWorkflowDocument,
  CreateNewWorkflowMutationVariables,
  DeleteFlowEdgeDocument,
  DeleteFlowEdgeMutationVariables,
  DeleteFlowNodeDocument,
  DeleteFlowNodeMutationVariables,
  DeleteNodesAndEdgesDocument,
  DeleteNodesAndEdgesMutationVariables,
  DeleteWorkflowByIdDocument,
  DeleteWorkflowByIdMutationVariables,
  InsertFlowEdgeDocument,
  InsertFlowEdgeMutationVariables,
  InsertFlowNodeDocument,
  InsertFlowNodeMutationVariables,
  UpdateAgentDocument,
  UpdateAgentMutationVariables,
  UpdateKnowledgeBaseDocument,
  UpdateKnowledgeBaseMutationVariables,
  UpdateWorkflowByIdDocument,
  UpdateWorkflowByIdMutationVariables,
  Workflow_Type_Enum,
} from "@/graphql/generated/types";
import { performMutation } from "@/lib/apolloRequest";
import { Edge, Node } from "@xyflow/react";

export async function createNewWorkflow(formData: FormData) {
  const session = await auth();
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
      creator_id: session?.user?.id,
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

    const insertResult = await performMutation(
      CreateNewWorkflowDocument,
      insertVariables,
    );
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error: "Failed to create workflow. Please try again later.",
    };
  }
  return { success: true };
}

export async function updateWorkflow(formData: FormData) {
  const session = await auth();
  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const workflow_type = formData.get("workflow_type") as Workflow_Type_Enum;

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

  const deleteVariables: DeleteWorkflowByIdMutationVariables = {
    id: id,
  };

  const insertVariables: CreateNewWorkflowMutationVariables = {
    object: {
      id: id,
      name: name,
      description: description,
      creator_id: session?.user?.id,
      workflow_type: workflow_type,
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
          sourceHandle: item.sourceHandle,
        })),
      },
    },
  };

  try {
    const deleteResult = await performMutation(
      DeleteWorkflowByIdDocument,
      deleteVariables,
    );

    const insertResult = await performMutation(
      CreateNewWorkflowDocument,
      insertVariables,
    );
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error: "Failed to create workflow. Please try again later.",
    };
  }
  return { success: true };
}

export async function updateWorkflowById(formData: FormData) {
  const session = await auth();
  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const workflow_type = formData.get("workflow_type") as Workflow_Type_Enum;

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

  const flow_nodes = nodes.map((item) => ({
    id: item.id,
    flow_id: id,
    node_type_id: item.data.node_type_id,
    data: item.data,
    position_x: item.position.x,
    position_y: item.position.y,
  }));

  const insertFlowNodeVariables: InsertFlowNodeMutationVariables = {
    objects: flow_nodes,
  };

  const flow_edges = edges.map((item) => ({
    id: item.id,
    flow_id: id,
    source_id: item.source,
    target_id: item.target,
    sourceHandle: item.sourceHandle,
  }));

  const insertFlowEdgeVariables: InsertFlowEdgeMutationVariables = {
    objects: flow_edges,
  };

  const deleteFlowNodeVariables: DeleteFlowNodeMutationVariables = {
    where: { id: { _in: flow_nodes.map((item) => item.id) } },
  };

  const deleteFlowEdgeVariables: DeleteFlowEdgeMutationVariables = {
    where: { id: { _in: flow_edges.map((item) => item.id) } },
  };

  const updateVariables: UpdateWorkflowByIdMutationVariables = {
    id: id,
    _set: {
      name: name,
      description: description,
      creator_id: session?.user?.id,
      workflow_type: workflow_type,
    },
  };

  try {
    // First, delete existing nodes and edges
    const deleteFlowEdgeResult = await performMutation(
      DeleteFlowEdgeDocument,
      deleteFlowEdgeVariables,
    );

    const deleteFlowNodeResult = await performMutation(
      DeleteFlowNodeDocument,
      deleteFlowNodeVariables,
    );

    // Then, update the workflow
    const updateResult = await performMutation(
      UpdateWorkflowByIdDocument,
      updateVariables,
    );

    // Finally, insert new nodes and edges
    const insertFlowNodeResult = await performMutation(
      InsertFlowNodeDocument,
      insertFlowNodeVariables,
    );

    const insertFlowEdgeResult = await performMutation(
      InsertFlowEdgeDocument,
      insertFlowEdgeVariables,
    );
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error: "Failed to update workflow. Please try again later.",
    };
  }

  return { success: true };
}

export async function bindWorkflowToLibrary(id: string, formData: FormData) {
  try {
    const flowId = formData.get("id") as string;
    const createRepsonse = await updateWorkflow(formData);

    const updateVariables: UpdateKnowledgeBaseMutationVariables = {
      _set: { workflow_id: flowId },
      pk_columns: { id: id },
    };

    const updateResponse = await performMutation(
      UpdateKnowledgeBaseDocument,
      updateVariables,
    );
  } catch (error) {
    console.error("Error bind workflow to library", error);
    throw new Error("Error bind workflow to library");
  }

  return { success: true };
}

export async function bindWorkflowToAgent(id: string, formData: FormData) {
  try {
    const flowId = formData.get("id") as string;
    const createRepsonse = await updateWorkflow(formData);

    const updateVariables: UpdateAgentMutationVariables = {
      _set: { workflow_id: flowId },
      pk_columns: { id: id },
    };

    const updateResponse = await performMutation(UpdateAgentDocument, updateVariables);
  } catch (error) {
    console.error("Error bind workflow to agent", error);
    throw new Error("Error bind workflow to agent");
  }

  return { success: true };
}
