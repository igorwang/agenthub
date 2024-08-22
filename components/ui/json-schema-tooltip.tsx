import { Icon } from "@iconify/react";
import { Tooltip } from "@nextui-org/react";
import React from "react";

interface JsonSchemaTooltipProps {
  title: string;
  content: string;
  format?: string;
  iconSize?: number;
}

const JsonSchemaTooltip: React.FC<JsonSchemaTooltipProps> = ({
  title,
  content,
  format,
  iconSize = 24,
}) => {
  const tooltipContent = (
    <div className="custom-scrollbar max-h-[300px] max-w-xs overflow-y-auto">
      <h4 className="mb-2 font-bold">{title}</h4>
      <div className="whitespace-pre-wrap">{content}</div>
      {format && (
        <div className="mt-2">
          <h5 className="mb-1 font-semibold">Example:</h5>
          <pre className="custom-scrollbar overflow-auto rounded bg-gray-100 p-2 text-xs">
            {JSON.stringify(JSON.parse(format), null, 2)}
          </pre>
        </div>
      )}
    </div>
  );

  return (
    <Tooltip content={tooltipContent}>
      <span className="inline-flex cursor-help">
        <Icon icon="mdi:help-circle-outline" width={iconSize} height={iconSize} />
      </span>
    </Tooltip>
  );
};

export default JsonSchemaTooltip;
