import { auth } from "@/auth";
import WorkflowForm from "@/components/WorkflowForm";
import {
  GetNodeTypeListDocument,
  GetNodeTypeListQuery,
  GetNodeTypeListQueryVariables,
} from "@/graphql/generated/types";
import { createNewWorkflow } from "@/lib/actions/workflowActions";
import { fetchData } from "@/lib/apolloRequest";
import { v4 } from "uuid";

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
  const flowId = v4();
  return (
    <div className="container mx-auto p-4">
      <WorkflowForm
        initialData={{ id: flowId, name: "new flow", description: "" }}
        action={createNewWorkflow}
        nodeTypeList={nodeTypeList?.node_type || []}
      />
    </div>
  );
}
