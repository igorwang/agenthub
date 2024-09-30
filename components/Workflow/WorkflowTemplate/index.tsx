"use client";
import {
  useGetWorkflowTemplateListQuery,
  Workflow_Type_Enum,
  WorkflowTemplateFragmentFragment,
} from "@/graphql/generated/types";
import { Icon } from "@iconify/react";
import { Button, Pagination, Spinner, Tooltip } from "@nextui-org/react";
import { useTranslations } from "next-intl";
import { useState } from "react";

interface WorkflowTemplateProps {
  workflowType: Workflow_Type_Enum;
  onSelectWorkflowTemplate: (template: WorkflowTemplateFragmentFragment) => void;
}

function EmptyState() {
  const t = useTranslations();
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <Icon icon="mdi:folder-open-outline" className="mb-4 text-6xl text-gray-400" />
      <h3 className="mb-2 text-xl font-semibold">{t("No templates available")}</h3>
      <p className="text-sm text-gray-600">
        {t("There are no workflow templates for this type")}
      </p>
    </div>
  );
}

export default function WorkflowTemplate({
  workflowType,
  onSelectWorkflowTemplate,
}: WorkflowTemplateProps) {
  const t = useTranslations();
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  const { data, loading } = useGetWorkflowTemplateListQuery({
    variables: {
      where: { workflow_type: { _eq: workflowType } },
      offset: (page - 1) * itemsPerPage,
      limit: itemsPerPage,
    },
  });

  const templates = data?.workflow_template || [];
  const totalCount = data?.workflow_template_aggregate?.aggregate?.count || 0;

  if (loading) return <Spinner label={t("Loading")} color="primary" />;
  if (templates.length === 0) return <EmptyState />;

  return (
    <div className="space-y-4">
      <ul className="space-y-2">
        {templates.map((template) => (
          <li
            key={template.id}
            className="flex items-center justify-between rounded p-2 hover:bg-gray-100">
            <div className="flex items-center space-x-3">
              <Icon icon={template.icon} className="text-2xl" />
              <div>
                <h3 className="font-semibold">{template.name}</h3>
                <Tooltip content={template.description}>
                  <p className="max-w-md truncate text-sm text-gray-600">
                    {template.description}
                  </p>
                </Tooltip>
              </div>
            </div>
            <Button
              size="sm"
              color="primary"
              variant="flat"
              onPress={() => onSelectWorkflowTemplate(template)}>
              {t("Use Template")}
            </Button>
          </li>
        ))}
      </ul>
      <Pagination
        total={Math.ceil(totalCount / itemsPerPage)}
        page={page}
        onChange={setPage}
        className="flex justify-center"
      />
    </div>
  );
}
