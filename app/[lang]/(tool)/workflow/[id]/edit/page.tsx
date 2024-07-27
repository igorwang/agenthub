import { auth } from "@/auth";
import WorkflowForm from "@/components/WorkflowForm";
import {
  GetNodeTypeListDocument,
  GetNodeTypeListQuery,
  GetNodeTypeListQueryVariables,
} from "@/graphql/generated/types";
import { updateWorkflow } from "@/lib/actions/workflowActions";
import { fetchData } from "@/lib/apolloRequest";
import { notFound } from "next/navigation";

interface Props {
  params: {
    id: string;
  };
}

async function getWorkflow(id: string) {
  // 这里应该是实际的数据获取逻辑
  // 例如: return await db.workflow.findById(id);
  return { id, name: "Sample Workflow", description: "This is a sample workflow" };
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
  const nodeTypeList = await getNodeTypeListData();

  if (!workflow) {
    notFound();
  }

  const updateWorkflowWithId = updateWorkflow.bind(null, params.id);

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-4 text-2xl font-bold">Edit Workflow: {workflow.name}</h1>
      <WorkflowForm
        initialData={workflow}
        action={updateWorkflowWithId}
        nodeTypeList={nodeTypeList?.node_type || []}
      />
    </div>
  );
}
