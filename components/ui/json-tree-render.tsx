import { Icon } from "@iconify/react";
import { Card, CardBody, Tooltip } from "@nextui-org/react";
import React, { useMemo, useState } from "react";

interface TreeNode {
  key: string;
  title: string;
  value: any;
  path: string;
  type: "object" | "array" | "string" | "number" | "boolean" | "null";
  children?: TreeNode[];
}

interface JsonTreeRendererProps {
  jsonData: object;
  onDragStart?: (nodeData: TreeNode) => void;
}

const JsonTreeRenderer: React.FC<JsonTreeRendererProps> = ({ jsonData, onDragStart }) => {
  const [treeData] = useState<TreeNode[]>(
    useMemo(() => convertJsonToTreeData(jsonData), [jsonData]),
  );
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [expandedValues, setExpandedValues] = useState<Set<string>>(new Set());

  function convertJsonToTreeData(json: any, parentPath: string = ""): TreeNode[] {
    return Object.entries(json).map(([key, value]) => {
      const currentPath = parentPath ? `${parentPath}.${key}` : key;
      const type = Array.isArray(value)
        ? "array"
        : value === null
          ? "null"
          : typeof value;

      if (typeof value === "object" && value !== null) {
        return {
          key: currentPath,
          title: key,
          value: undefined,
          path: currentPath,
          type: type as "object" | "array",
          children: convertJsonToTreeData(value, currentPath),
        };
      }
      return {
        key: currentPath,
        title: key,
        value: value,
        path: currentPath,
        type: type as "string" | "number" | "boolean" | "null",
      };
    });
  }

  const handleDragStart = (event: React.DragEvent, nodeData: TreeNode) => {
    event.dataTransfer.setData("application/json", JSON.stringify(nodeData));
    onDragStart?.(nodeData);
  };

  const toggleNode = (nodePath: string) => {
    setExpandedNodes((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(nodePath)) {
        newSet.delete(nodePath);
      } else {
        newSet.add(nodePath);
      }
      return newSet;
    });
  };

  const toggleValue = (nodePath: string) => {
    setExpandedValues((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(nodePath)) {
        newSet.delete(nodePath);
      } else {
        newSet.add(nodePath);
      }
      return newSet;
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const renderValue = (node: TreeNode) => {
    if (node.value === undefined) return null;

    const stringValue = JSON.stringify(node.value);
    const isLongValue = stringValue.length > 50;
    const isExpanded = expandedValues.has(node.path);

    if (!isLongValue) {
      return <span className="text-gray-600 dark:text-gray-300">{stringValue}</span>;
    }
    return (
      <>
        <span className="text-gray-600 dark:text-gray-300">
          {isExpanded ? stringValue : stringValue.substring(0, 47) + "..."}
        </span>
        <button
          onClick={() => toggleValue(node.path)}
          className="ml-2 text-xs text-blue-500 hover:text-blue-700">
          {isExpanded ? "Show less" : "Show more"}
        </button>
      </>
    );
  };
  const renderTree = (nodes: TreeNode[]) => (
    <ul className="pl-4">
      {nodes.map((node) => (
        <li key={node.key} className="my-2">
          <div
            draggable
            onDragStart={(e) => handleDragStart(e, node)}
            className="flex cursor-move items-center rounded-md bg-gray-100 p-2 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700">
            {node.children && (
              <button
                onClick={() => toggleNode(node.path)}
                className="mr-2 focus:outline-none">
                <Icon
                  icon={
                    expandedNodes.has(node.path)
                      ? "mdi:chevron-down"
                      : "mdi:chevron-right"
                  }
                  className="h-4 w-4"
                />
              </button>
            )}
            <div className="flex-grow overflow-hidden">
              <span className="font-semibold text-blue-600 dark:text-blue-400">
                {node.title}
              </span>
              <span className="ml-2 text-xs text-gray-500">({node.type})</span>
              {node.value !== undefined && <>: {renderValue(node)}</>}
            </div>
            <Tooltip content="Copy path">
              <button
                onClick={() => copyToClipboard(node.path)}
                className="ml-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                <Icon icon="mdi:content-copy" className="h-4 w-4" />
              </button>
            </Tooltip>
          </div>
          {node.children && expandedNodes.has(node.path) && renderTree(node.children)}
        </li>
      ))}
    </ul>
  );

  return (
    <Card>
      <CardBody>
        <div className="max-h-[400px] overflow-auto">{renderTree(treeData)}</div>
      </CardBody>
    </Card>
  );
};

export default JsonTreeRenderer;
