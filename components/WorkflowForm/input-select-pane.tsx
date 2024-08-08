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
import React, { useEffect, useState } from "react";

interface NodeData {
  type?: string;
  label?: string;
  outputSchema?: any;
  [key: string]: any;
}

interface InputSelectionPaneProps {
  nodes: Node<NodeData>[];
}

export const InputSelectionPane: React.FC<InputSelectionPaneProps> = ({ nodes }) => {
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
          label="Select Input Node"
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

        {nodes.length > 0 && selectedNode && (
          <div className="flex h-full flex-col items-center justify-center">
            {/* <h3 className="text-md font-medium">
              {getNodeLabel(selectedNode, nodes.indexOf(selectedNode))}
            </h3> */}
            {selectedNode.data.outputSchema ? (
              <pre className="mt-2 overflow-x-auto p-2 text-sm">
                {/* {JSON.stringify(selectedNode.data.outputSchema, null, 2)} */}
                <JsonTreeRenderer
                  jsonData={{
                    [selectedNode.data.label || "Unamed Node"]:
                      selectedNode.data.outputSchema,
                  }}
                  // defaultPath={selectedNode.data.label}
                />
              </pre>
            ) : (
              <p className="mt-2 text-gray-500">No input data yet</p>
            )}
          </div>
        )}
        {nodes.length === 0 && <p className="text-gray-500">No nodes available</p>}
      </CardBody>
    </Card>
  );
};
