import { auth } from "@/auth";
import AgentSettings from "@/components/AgentSettings";
import {
  GetAgentByIdDocument,
  GetAgentByIdQuery,
  GetAgentByIdQueryVariables,
  GetNodeTypeListDocument,
  GetNodeTypeListQuery,
  GetNodeTypeListQueryVariables,
  Node_Use_Type_Enum,
  Workflow_Type_Enum,
} from "@/graphql/generated/types";
import { bindWorkflowToAgent } from "@/lib/actions/workflowActions";
import { fetchData } from "@/lib/apolloRequest";
import { getTranslations } from "next-intl/server";
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
    limit: 100,
    where: {
      _and: [
        {
          visible: { _eq: true },
          node_use_type: { _in: [Node_Use_Type_Enum.Default, Node_Use_Type_Enum.Agent] },
        },
      ],
    },
  };

  return await fetchData<GetNodeTypeListQuery, GetNodeTypeListQueryVariables>(
    GetNodeTypeListDocument,
    variables,
  );
}

export default async function AgentSettingsPage({ params }: { params: { id: string } }) {
  const t = await getTranslations();
  const agent = await fetchAgentData(params.id);
  const session = await auth();
  const nodeTypeList = await getNodeTypeListData();
  const workflow = agent?.agent_by_pk?.workflow;
  const initialData = {
    id: workflow?.id || v4(), //workflow id
    name: workflow?.name || t("New Workflow"),
    description: workflow?.description || t("New Workflow"),
    workflow_type: Workflow_Type_Enum.Agent,
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
