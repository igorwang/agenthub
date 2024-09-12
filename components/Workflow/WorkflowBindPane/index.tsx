"use client";

import WorkflowTable from "@/components/Workflow/WorkflowBindPane/workflow-table";
import {
  Order_By,
  useAddWorflowToAgentMutation,
  useGetWorkflowListQuery,
  useRemoveWorkflowFromAgentMutation,
  Workflow_Type_Enum,
  WorkflowFragmentFragment,
} from "@/graphql/generated/types";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface WorkflowBindPaneProps {
  agentId: string;
}

function WorkflowBindPane({ agentId }: WorkflowBindPaneProps) {
  const session = useSession();
  const [page, setPage] = useState(1);

  const [workflowList, setWorkflowList] = useState<WorkflowFragmentFragment[]>([]);
  const [addWorflowToAgent, { loading: addWorflowToAgentLoading }] =
    useAddWorflowToAgentMutation();
  const [removeWorkflowFromAgent, { loading: removeWorkflowFromAgentLoading }] =
    useRemoveWorkflowFromAgentMutation();
  const { data, loading, refetch } = useGetWorkflowListQuery({
    variables: {
      where: {
        creator_id: {
          _eq: session?.data?.user?.id,
        },
        workflow_type: {
          _eq: Workflow_Type_Enum.Tool,
        },
      },
      limit: 10,
      offset: (page - 1) * 10,
      order_by: {
        updated_at: Order_By.Desc,
      },
    },
  });
  const pages = Math.ceil((data?.workflow_aggregate.aggregate?.count || 0) / 10);

  const handleBind = async (workflowId: string) => {
    const res = await addWorflowToAgent({
      variables: {
        object: {
          agent_id: agentId,
          workflow_id: workflowId,
        },
      },
    });
    if (res.data?.insert_r_agent_workflow_one) {
      refetch();
      toast.success("Workflow bind successfully");
    }
  };

  const handleUnbind = async (id: number) => {
    const res = await removeWorkflowFromAgent({
      variables: {
        id: id,
      },
    });
    if (res.data?.delete_r_agent_workflow_by_pk) {
      refetch();
      toast.success("Workflow unbind successfully");
    }
  };

  useEffect(() => {
    if (data) {
      setWorkflowList(data.workflow);
    }
  }, [data]);

  return (
    <WorkflowTable
      workflows={workflowList}
      page={page}
      onPage={setPage}
      agentId={agentId}
      pages={pages}
      onBind={handleBind}
      onUnbind={handleUnbind}
    />
  );
}

export default WorkflowBindPane;
