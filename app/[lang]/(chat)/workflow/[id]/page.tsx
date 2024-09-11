import { auth } from "@/auth";
import WorkflowForm from "@/components/Workflow/WorkflowForm";
import ReturnToWorkflow from "@/components/Workflow/WorkflowList/return-to-workflow";
import {
  GetNodeTypeListDocument,
  GetNodeTypeListQuery,
  GetNodeTypeListQueryVariables,
  GetWorkflowByIdDocument,
  GetWorkflowByIdQuery,
  GetWorkflowByIdQueryVariables,
  Workflow_Type_Enum,
} from "@/graphql/generated/types";
import { updateWorkflow } from "@/lib/actions/workflowActions";
import { fetchData } from "@/lib/apolloRequest";
import { Spinner } from "@nextui-org/react";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";

async function getWorkflow(id: string) {
  const variables: GetWorkflowByIdQueryVariables = {
    id: id,
  };
  const data = await fetchData<GetWorkflowByIdQuery, GetWorkflowByIdQueryVariables>(
    GetWorkflowByIdDocument,
    variables,
  );
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

export default async function WorkflowDetailPage({ params }: { params: { id: string } }) {
  const t = await getTranslations();
  return (
    <Suspense
      fallback={
        <div className="flex h-full items-center justify-center">
          <Spinner>{t("Loading")}...</Spinner>
        </div>
      }>
      <div className="relative">
        <div className="mb-6 p-2">
          <ReturnToWorkflow />
        </div>
        <WorkflowContent id={params.id} />
      </div>
    </Suspense>
  );
}

async function WorkflowContent({ id }: { id: string }) {
  const workflow = await getWorkflow(id);
  const nodeTypeList = await getNodeTypeListData();
  const initialData = {
    id: workflow.workflow_by_pk?.id,
    name: workflow.workflow_by_pk?.name || "",
    description: workflow.workflow_by_pk?.description || "",
    workflow_type: workflow.workflow_by_pk?.workflow_type || null,
    nodes: workflow.workflow_by_pk?.flow_nodes,
    edges: workflow.workflow_by_pk?.flow_edges,
  };
  return (
    <div className="container mx-auto p-6 px-4 py-8">
      <WorkflowForm
        workflowType={Workflow_Type_Enum.Tool}
        initialData={initialData}
        action={updateWorkflow}
        nodeTypeList={nodeTypeList?.node_type || []}
      />
    </div>
  );
}
