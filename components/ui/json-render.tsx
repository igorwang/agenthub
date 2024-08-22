import { Button, Card, Tooltip } from "@nextui-org/react";
import React, { useState } from "react";

interface JsonRendererProps {
  data: any;
  maxLines?: number;
  maxWidth?: string;
}

const JsonRenderer: React.FC<JsonRendererProps> = ({
  data,
  maxLines = 3,
  maxWidth = "100%",
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatJson = (json: any): string => {
    return JSON.stringify(json, null, 2);
  };

  const truncateJson = (json: string): string => {
    const lines = json.split("\n");
    if (lines.length > maxLines && !isExpanded) {
      return lines.slice(0, maxLines).join("\n") + "\n...";
    }
    return json;
  };

  const renderJsonContent = () => {
    const formattedJson = formatJson(data);
    const displayedJson = truncateJson(formattedJson);

    return displayedJson.split("\n").map((line, index) => (
      <div
        key={index}
        className="overflow-hidden text-ellipsis whitespace-nowrap"
        style={{ paddingLeft: `${line.search(/\S/) * 0.5}rem` }}>
        {line}
      </div>
    ));
  };

  return (
    <Card className="overflow-hidden" style={{ maxWidth }}>
      <div className="p-2">
        <div className={`overflow-x-auto ${isExpanded ? "max-h-96" : ""}`}>
          <pre className="font-mono text-sm">{renderJsonContent()}</pre>
        </div>
        {JSON.stringify(data, null, 2).split("\n").length > maxLines && (
          <Tooltip content={isExpanded ? "Collapse" : "Expand"}>
            <Button
              variant="light"
              size="sm"
              onPress={() => setIsExpanded(!isExpanded)}
              className="mt-2">
              {isExpanded ? "Show Less" : "Show More"}
            </Button>
          </Tooltip>
        )}
      </div>
    </Card>
  );
};

export default JsonRenderer;
