import { auth } from "@/auth";
import WorkflowForm from "@/components/WorkflowForm";
import {
  GetNodeTypeListDocument,
  GetNodeTypeListQuery,
  GetNodeTypeListQueryVariables,
} from "@/graphql/generated/types";
import { createNewWorkflow } from "@/lib/actions/workflowActions";
import { fetchData } from "@/lib/apolloRequest";

async function getNodeTypeListData() {
  const session = await auth();
  if (!session?.user) return null;

  const variables: GetNodeTypeListQueryVariables = {};

  return await fetchData<GetNodeTypeListQuery, GetNodeTypeListQueryVariables>(
    GetNodeTypeListDocument,
    variables,
  );
}

export default async function NewWorkflowPage() {
  const nodeTypeList = await getNodeTypeListData();
  console.log("nodeTypeList", nodeTypeList);
  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-4 text-2xl font-bold">Create New Workflow</h1>
      <WorkflowForm
        action={createNewWorkflow}
        nodeTypeList={nodeTypeList?.node_type || []}
      />
    </div>
  );
}
