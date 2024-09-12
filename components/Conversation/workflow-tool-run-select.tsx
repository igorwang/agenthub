import { WorkflowFragmentFragment } from "@/graphql/generated/types";
import { Icon } from "@iconify/react";
import { Listbox, ListboxItem, ScrollShadow } from "@nextui-org/react";

interface WorkflowToolRunSelectProps {
  workflowTools: WorkflowFragmentFragment[];
  className?: string;
  onRunWorkflowTool?: (tool: WorkflowFragmentFragment) => void;
}

function WorkflowToolRunSelect({
  workflowTools,
  className,
  onRunWorkflowTool,
}: WorkflowToolRunSelectProps) {
  return (
    <div
      className={`w-full max-w-[260px] rounded-small border-default-200 px-1 py-2 dark:border-default-100 ${className}`}>
      <ScrollShadow className="custom-scrollbar max-h-[200px]">
        <Listbox aria-label="Workflow Tools" variant="flat">
          {workflowTools.map((tool) => (
            <ListboxItem
              key={tool.id}
              textValue={tool.name}
              classNames={{
                description: "max-w-[180px] overflow-hidden truncate text-ellipsis",
              }}
              onClick={() => {
                onRunWorkflowTool?.(tool);
              }}
              description={tool.description}
              startContent={
                <Icon
                  icon={tool.icon ? tool.icon : "fluent:toolbox-24-regular"}
                  fontSize={20}
                />
              }>
              <div
                className="max-w-[180px] overflow-hidden text-ellipsis"
                title={tool.name}>
                {tool.name}
              </div>
            </ListboxItem>
          ))}
        </Listbox>
      </ScrollShadow>
    </div>
  );
}

export default WorkflowToolRunSelect;
