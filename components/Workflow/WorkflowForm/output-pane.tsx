import JsonTreeRenderer from "@/components/ui/json-tree-render";
import { Card, CardBody, CardHeader, Divider } from "@nextui-org/react";
import { Node } from "@xyflow/react";
import React, { useEffect, useState } from "react";

interface NodeData {
  type?: string;
  label?: string;
  outputSchema?: any;
  [key: string]: any;
}

interface OutputPaneProps {
  node: Node<NodeData>;
}

export const OutputPane: React.FC<OutputPaneProps> = ({ node }) => {
  const [JSONSchemaFaker, setJSONSchemaFaker] = useState<any>(null);
  const [fakeData, setFakeData] = useState<any>(null);

  useEffect(() => {
    import("json-schema-faker").then((module) => {
      setJSONSchemaFaker(module.JSONSchemaFaker);
    });
  }, []);

  useEffect(() => {
    if (JSONSchemaFaker && node) {
      generateFakeData(node).then((data) => setFakeData(data));
    }
  }, [JSONSchemaFaker, node]);

  const generateFakeData = async (node: Node<NodeData>) => {
    if (!JSONSchemaFaker) {
      return null;
    }

    if (!node || typeof node !== "object" || !node.data) {
      console.warn("Invalid node structure encountered");
      return null;
    }

    const { outputSchema } = node.data;
    const schema = outputSchema || {};

    JSONSchemaFaker.option({
      alwaysFakeOptionals: true,
      optionalsProbability: 1.0,
      useDefaultValue: false,
      minItems: 1,
      maxItems: 5,
      ignoreMissingRefs: true,
      failOnInvalidFormat: false,
      maxLength: 4096,
      minLength: 1,
      useExamplesValue: false,
      random: () => 0.5,
    });

    if (schema && Object.keys(schema).length > 0) {
      try {
        return await JSONSchemaFaker.resolve(schema);
      } catch (error) {
        console.error(`Error generating fake data:`, error);
        return null;
      }
    } else {
      return null;
    }
  };

  return (
    <Card className="h-full w-full max-w-md">
      <CardHeader className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Output</h2>
      </CardHeader>
      <Divider />
      <CardBody>
        <p className="mb-4 text-sm text-gray-600">
          The data shown below simulates the output of {node.data.label || "this Node"}.
        </p>

        {node && fakeData ? (
          <div className="flex h-full flex-col items-center justify-center">
            <pre className="mt-2 max-w-full p-2 text-sm">
              <JsonTreeRenderer
                jsonData={{
                  [node.data.label || "Unnamed Node"]: fakeData,
                }}
              />
            </pre>
          </div>
        ) : (
          <p className="mt-2 text-gray-500">No valid output data</p>
        )}
      </CardBody>
    </Card>
  );
};
