"use client";

import { WorkflowFragmentFragment } from "@/graphql/generated/types";
import { Icon } from "@iconify/react";
import {
  Button,
  Pagination,
  SortDescriptor,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
} from "@nextui-org/react";
import { useTranslations } from "next-intl";
import { FC, useCallback, useMemo, useState } from "react";

interface WorkflowTableProps {
  agentId: string;
  workflows: WorkflowFragmentFragment[];
  page: number;
  pages: number;
  onPage: (page: number) => void;
  onBind: (workflowId: string) => void;
  onUnbind: (id: number) => void;
}

const WorkflowTable: FC<WorkflowTableProps> = ({
  agentId,
  workflows,
  page,
  pages,
  onPage,
  onBind,
  onUnbind,
}) => {
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "updateTime",
    direction: "descending",
  });

  const sortedWorkflows = useMemo(() => {
    return [...workflows].sort((a, b) => {
      const first = a[sortDescriptor.column as keyof WorkflowFragmentFragment];
      const second = b[sortDescriptor.column as keyof WorkflowFragmentFragment];
      const cmp = first < second ? -1 : first > second ? 1 : 0;
      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [workflows, sortDescriptor]);

  const t = useTranslations();
  const columns = [
    { name: t("Name"), uid: "name", sortable: true, width: "25%" },
    { name: t("Description"), uid: "description", sortable: true, width: "35%" },
    { name: t("Update At"), uid: "updated_at", sortable: true, width: "25%" },
    { name: t("Action"), uid: "actions", width: "15%" },
  ];

  const renderCell = useCallback(
    (workflow: WorkflowFragmentFragment, columnKey: React.Key) => {
      switch (columnKey) {
        case "name":
          return (
            <div className="truncate text-left" title={workflow.name}>
              {workflow.name}
            </div>
          );
        case "description":
          return (
            <div
              className="max-w-[300px] truncate text-left"
              title={workflow.description}>
              {workflow.description}
            </div>
          );
        case "updated_at":
          return (
            <div
              className="truncate text-left"
              title={new Date(workflow.updated_at).toLocaleString()}>
              {new Date(workflow.updated_at).toLocaleString()}
            </div>
          );
        case "actions":
          const isSelected = workflow.r_agent_workflows.some(
            (agentWorkflow) => agentWorkflow.agent_id === agentId,
          );
          return isSelected ? (
            <div className="flex items-center justify-center gap-1">
              <Tooltip content="UnBind">
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  color="danger"
                  onClick={(e) => {
                    e.stopPropagation();
                    const id = workflow.r_agent_workflows.find(
                      (agentWorkflow) => agentWorkflow.agent_id === agentId,
                    )?.id;
                    if (id) {
                      onUnbind(id);
                    }
                  }}>
                  <Icon icon="mdi:link-off" className="text-lg" />
                </Button>
              </Tooltip>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-1">
              <Tooltip content="Bind">
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  onClick={(e) => {
                    e.stopPropagation();
                    onBind(workflow.id);
                  }}>
                  <Icon icon="mdi:link" className="text-lg" />
                </Button>
              </Tooltip>
            </div>
          );
      }
    },
    [agentId, onBind, onUnbind],
  );

  return (
    <Table
      aria-label="Workflow table"
      sortDescriptor={sortDescriptor}
      onSortChange={setSortDescriptor}
      className="max-w-full"
      bottomContent={
        <div className="flex w-full justify-center">
          <Pagination
            isCompact
            showControls
            showShadow
            color="secondary"
            page={page}
            total={pages}
            onChange={(page) => onPage(page)}
          />
        </div>
      }>
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn
            key={column.uid}
            align={column.uid === "actions" ? "center" : "start"}
            allowsSorting={column.sortable}
            // width={column.width}
            className="bg-gray-100 text-sm font-semibold">
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody items={sortedWorkflows} emptyContent={t("No workflows found")}>
        {(workflow) => (
          <TableRow key={workflow.id} className="hover:bg-gray-50">
            {(columnKey) => (
              <TableCell className="py-2">{renderCell(workflow, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

WorkflowTable.displayName = "WorkflowTable";
export default WorkflowTable;
