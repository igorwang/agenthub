import { auth } from "@/auth";
import WorkflowForm from "@/components/WorkflowForm";
import {
  GetNodeTypeListDocument,
  GetNodeTypeListQuery,
  GetNodeTypeListQueryVariables,
  GetWorkflowByIdDocument,
  GetWorkflowByIdQuery,
  GetWorkflowByIdQueryVariables,
} from "@/graphql/generated/types";
import { updateWorkflow } from "@/lib/actions/workflowActions";
import { fetchData } from "@/lib/apolloRequest";

interface Props {
  params: {
    id: string;
  };
}

async function getWorkflow(id: string) {
  const variables: GetWorkflowByIdQueryVariables = {
    id: id,
  };
  const data = await fetchData<GetWorkflowByIdQuery, GetWorkflowByIdQueryVariables>(
    GetWorkflowByIdDocument,
    variables,
  );
  console.log("getWorkflow", data);
  return data;
}

async function getNodeTypeListData() {
  const session = await auth();
  if (!session?.user) return null;

  const variables: GetNodeTypeListQueryVariables = {};

  return await fetchData<GetNodeTypeListQuery, GetNodeTypeListQueryVariables>(
    GetNodeTypeListDocument,
    variables,
  );
}

export default async function EditWorkflowPage({ params }: Props) {
  const workflow = await getWorkflow(params.id);
  // if (!workflow) {
  //   notFound();
  // }
  const nodeTypeList = await getNodeTypeListData();
  const initialData = {
    id: workflow.workflow_by_pk?.id,
    name: workflow.workflow_by_pk?.name || "",
    description: workflow.workflow_by_pk?.description || "",
    nodes: workflow.workflow_by_pk?.flow_nodes,
    edges: workflow.workflow_by_pk?.flow_edges,
  };
  console.log(initialData);

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-4 text-2xl font-bold">
        Edit Workflow: {workflow.workflow_by_pk?.name}
      </h1>
      <WorkflowForm
        initialData={initialData}
        action={updateWorkflow}
        nodeTypeList={nodeTypeList?.node_type || []}
      />
    </div>
  );
}
