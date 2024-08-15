import { auth } from "@/auth";
import AgentSettings from "@/components/AgentSettings";
import {
  GetAgentByIdDocument,
  GetAgentByIdQuery,
  GetAgentByIdQueryVariables,
  GetNodeTypeListDocument,
  GetNodeTypeListQuery,
  GetNodeTypeListQueryVariables,
} from "@/graphql/generated/types";
import { bindWorkflowToAgent } from "@/lib/actions/workflowActions";
import { fetchData } from "@/lib/apolloRequest";
import { v4 } from "uuid";

async function fetchAgentData(id: string) {
  const session = await auth();
  if (!session?.user) return null;

  const variables: GetAgentByIdQueryVariables = {
    id: id,
  };

  return await fetchData<GetAgentByIdQuery, GetAgentByIdQueryVariables>(
    GetAgentByIdDocument,
    variables,
  );
}

async function getNodeTypeListData() {
  const session = await auth();
  if (!session?.user) return null;

  const variables: GetNodeTypeListQueryVariables = {
    where: { visible: { _eq: true } },
  };

  return await fetchData<GetNodeTypeListQuery, GetNodeTypeListQueryVariables>(
    GetNodeTypeListDocument,
    variables,
  );
}

export default async function AgentSettingsPage({ params }: { params: { id: string } }) {
  const agent = await fetchAgentData(params.id);
  const nodeTypeList = await getNodeTypeListData();
  const workflow = agent?.agent_by_pk?.workflow;
  const initialData = {
    id: workflow?.id || v4(), //workflow id
    name: workflow?.name || "New Workflow",
    description: workflow?.description || "New Workflow",
    nodes: workflow?.flow_nodes,
    edges: workflow?.flow_edges,
  };

  const bindWorkflowToAgentWithId = bindWorkflowToAgent.bind(null, params.id);

  return (
    <div className="h-full w-full">
      <AgentSettings
        initialData={initialData}
        action={bindWorkflowToAgentWithId}
        nodeTypeList={nodeTypeList?.node_type || []}></AgentSettings>
    </div>
  );
}
