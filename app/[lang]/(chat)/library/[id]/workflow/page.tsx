import { auth } from "@/auth";
import WorkflowForm from "@/components/WorkflowForm";
import {
  GetNodeTypeListDocument,
  GetNodeTypeListQuery,
  GetNodeTypeListQueryVariables,
  KnowledgeBaseDetailDocument,
  KnowledgeBaseDetailQuery,
  KnowledgeBaseDetailQueryVariables,
} from "@/graphql/generated/types";
import { bindWorkflowToLibrary } from "@/lib/actions/workflowActions";
import { fetchData } from "@/lib/apolloRequest";
import { v4 } from "uuid";

async function fetchLibraryData(id: string) {
  const session = await auth();
  if (!session?.user) return null;

  const variables: KnowledgeBaseDetailQueryVariables = {
    id: id,
  };

  return await fetchData<KnowledgeBaseDetailQuery, KnowledgeBaseDetailQueryVariables>(
    KnowledgeBaseDetailDocument,
    variables,
  );
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

export default async function LibraryWorkflowPage({
  params,
}: {
  params: { id: string };
}) {
  const library = await fetchLibraryData(params.id);
  const nodeTypeList = await getNodeTypeListData();
  const workflow = library?.knowledge_base_by_pk?.workflow;
  const initialData = {
    id: workflow?.id || v4(), //workflow id
    name: workflow?.name || "New Workflow",
    description: workflow?.description || "New Workflow",
    nodes: workflow?.flow_nodes,
    edges: workflow?.flow_edges,
  };

  const bindWorkflowToLibraryWithId = bindWorkflowToLibrary.bind(null, params.id);

  return (
    <div className="mx-auto h-full w-full min-w-[600px] px-20">
      <WorkflowForm
        initialData={initialData}
        action={bindWorkflowToLibraryWithId}
        nodeTypeList={nodeTypeList?.node_type || []}
      />
    </div>
  );
}
