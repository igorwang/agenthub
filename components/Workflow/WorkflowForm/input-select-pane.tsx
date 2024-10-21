import JsonTreeRenderer from "@/components/ui/json-tree-render";
import {
  Card,
  CardBody,
  CardHeader,
  Divider,
  Select,
  Selection,
  SelectItem,
} from "@nextui-org/react";
import { Node } from "@xyflow/react";
import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";

interface NodeData {
  type?: string;
  label?: string;
  outputSchema?: any;
  [key: string]: any;
}

interface InputSelectionPaneProps {
  nodes: Node<NodeData>[];
  workflowTestResult: { [key: string]: any };
}

export const InputSelectionPane: React.FC<InputSelectionPaneProps> = ({
  nodes,
  workflowTestResult,
}) => {
  const t = useTranslations();
  const [selectedNode, setSelectedNode] = useState<Node<NodeData> | null>(null);

  useEffect(() => {
    if (nodes.length > 0) {
      setSelectedNode(nodes[nodes.length - 1]);
    }
  }, [nodes]);

  const handleSelectionChange = (keys: Selection) => {
    const selectedKey = Array.from(keys)[0] as string;
    const newSelectedNode = nodes.find((node) => node.id === selectedKey);
    if (newSelectedNode) {
      setSelectedNode(newSelectedNode);
    }
  };

  const getNodeLabel = (node: Node<NodeData>, index: number) => {
    const baseLabel = node.data.label || node.data.type || `Node ${node.id}`;
    return `${baseLabel} (${nodes.length - index} nodes back)`;
  };

  return (
    <Card className="h-full w-full max-w-md">
      <CardHeader className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Input</h2>
      </CardHeader>
      <Divider />
      <CardBody>
        <Select
          label={t("Select Input Node")}
          className="mb-4"
          selectedKeys={selectedNode ? new Set([selectedNode.id]) : new Set()}
          onSelectionChange={handleSelectionChange}>
          {nodes.map((node, index) => (
            <SelectItem
              key={node.id}
              textValue={node.data.label || node.data.type || `Node ${node.id}`}>
              {getNodeLabel(node, index)}
            </SelectItem>
          ))}
        </Select>

        {nodes.length > 0 && (
          <p className="mb-4 text-sm text-gray-600">
            {t("InputTips", {
              defaultValue: `Please select the input data for the current node. Each node can use the
            output of preceding nodes as input. The data shown below simulates the output
            from preceding nodes for your reference and selection.`,
            })}
          </p>
        )}

        {nodes.length > 0 && selectedNode && (
          <div className="flex h-full flex-col items-center justify-center">
            {workflowTestResult[selectedNode?.data.label ?? ""] ? (
              <pre className="mt-2 max-w-full p-2 text-sm">
                <JsonTreeRenderer
                  jsonData={{
                    [selectedNode.data.label || "Unnamed Node"]:
                      workflowTestResult[selectedNode?.data.label ?? ""] ?? {},
                  }}
                />
              </pre>
            ) : (
              <p className="mt-2 text-gray-500">
                {t("No input data yet", {
                  defaultValue: "No input data yet",
                })}
              </p>
            )}
          </div>
        )}
        {nodes.length === 0 && (
          <p className="text-gray-500">
            {t("No nodes available", {
              defaultValue: "No nodes available",
            })}
          </p>
        )}
      </CardBody>
    </Card>
  );
};
