"use client";

import {
  addEdge,
  Background,
  BackgroundVariant,
  Connection,
  Controls,
  MiniMap,
  NodeMouseHandler,
  ReactFlow,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
  useReactFlow,
  type Edge,
  type Node,
} from "@xyflow/react";
import { useCallback, useEffect, useRef, useState } from "react";

import NodeDrawer from "@/components/Workflow/WorkflowForm/node-drawer";
import { nodeFormComponents } from "@/components/Workflow/WorkflowForm/node-forms";
import { nodeTypes } from "@/components/Workflow/WorkflowForm/nodes";
import { NodeTypeFragmentFragment } from "@/graphql/generated/types";
import { alg, Graph } from "@dagrejs/graphlib";
import "@xyflow/react/dist/base.css";

import { v4 } from "uuid";

interface WorkflowPaneProps {
  flowId: string;
  initialNodes: Node[];
  initialEdges: Edge[];
  onWorkflowChange?: (nodes: Node[], edges: Edge[]) => void;
  onEditStatusChange?: () => void;
}

function Flow({
  flowId,
  initialNodes,
  initialEdges,
  onWorkflowChange,
  onEditStatusChange,
}: WorkflowPaneProps) {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [workflowTestResult, setWorkflowTestResult] = useState<{ [key: string]: any }>(
    {},
  );
  const [JSONSchemaFaker, setJSONSchemaFaker] = useState<any>(null);

  const [prevSelectedNodes, setPrevSelectedNodes] = useState<Node[]>([]); // record the nodes before selected

  const [openDrawer, setOpenDrawer] = useState<boolean>(false);
  const { screenToFlowPosition } = useReactFlow();

  const graphRef = useRef<Graph>(new Graph({ directed: true }));

  useEffect(() => {
    import("json-schema-faker").then((module) => {
      setJSONSchemaFaker(module.JSONSchemaFaker);
    });
  }, []);

  const generateFakeData = async (nodes: Node[] | undefined) => {
    if (!JSONSchemaFaker) {
      return {};
    }

    JSONSchemaFaker.option({
      useDefaultValue: true,
      minItems: 1,
      maxItems: 3,
      ignoreMissingRefs: true,
      failOnInvalidFormat: false,
      maxLength: 20,
      minLength: 1,
      useExamplesValue: true,
    });

    if (!nodes || !Array.isArray(nodes) || nodes.length === 0) {
      console.warn("No valid nodes provided for generating fake data");
      return {};
    }

    const newWorkflowTestResult = await nodes.reduce(
      async (accPromise, node) => {
        const acc = await accPromise;

        if (!node || typeof node !== "object" || !node.data) {
          console.warn("Invalid node structure encountered");
          return acc;
        }

        const { label, outputSchema } = node.data;

        if (!label || typeof label !== "string") {
          console.warn("Node is missing a valid label");
          return acc;
        }

        const schema = outputSchema || {};

        if (schema && Object.keys(schema).length > 0) {
          try {
            acc[label] = await JSONSchemaFaker.resolve(schema);
          } catch (error) {
            console.error(`Error generating fake data for ${label}:`, error);
            acc[label] = {};
          }
        } else {
          acc[label] = {};
        }

        return acc;
      },
      Promise.resolve({} as { [key: string]: any }),
    );

    return newWorkflowTestResult;
  };

  useEffect(() => {
    onWorkflowChange?.(nodes, edges);
    const graph = new Graph({ directed: true });
    nodes.forEach((node) => graph.setNode(node.id, node));
    edges.forEach((edge) => graph.setEdge(edge.source, edge.target));
    graphRef.current = graph;

    const updateFakeData = async () => {
      const newWorkflowTestResult = await generateFakeData(nodes);
      setWorkflowTestResult(newWorkflowTestResult);
    };

    updateFakeData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodes, edges, onWorkflowChange]);

  const findPrevNodes = useCallback(
    (nodeId: string) => {
      const graph = graphRef.current;
      const prevNodeIds = new Set<string>();

      function dfs(currentId: string) {
        graph.predecessors(currentId)?.forEach((predId) => {
          if (!prevNodeIds.has(predId)) {
            prevNodeIds.add(predId);
            dfs(predId);
          }
        });
      }
      dfs(nodeId);

      // Get a topologically sorted list of all nodes
      const sortedNodes = alg.topsort(graph);

      // Filter the sorted nodes to include only the predecessors
      const sortedPrevNodes = sortedNodes.filter((id) => prevNodeIds.has(id));

      // Map the sorted node IDs back to their full node objects
      const prevNodes = sortedPrevNodes
        .map((id) => nodes.find((node) => String(node.id) === String(id)))
        .filter((node): node is Node => node !== undefined);

      return prevNodes;
    },
    [nodes],
  );

  const onConnect = useCallback(
    (params: Connection) => {
      setEdges((eds) => {
        const newEdge: Edge = {
          ...params,
          id: `${v4()}`, // 使用 UUID 生成唯一 ID
          // 您可以在这里添加其他边的属性
          type: "default", // 或其他您想要的边类型
        };
        return addEdge(newEdge, eds);
      });
      onEditStatusChange?.();
    },
    [setEdges],
  );

  const generateRandomLetters = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    return Array(6)
      .fill(0)
      .map(() => chars.charAt(Math.floor(Math.random() * chars.length)))
      .join("");
  };

  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();
      // const type = event.dataTransfer.getData("application/reactflow");

      const nodeTypeJson = event.dataTransfer.getData("application/json");
      let nodeTypeData: NodeTypeFragmentFragment | null = null;
      try {
        nodeTypeData = JSON.parse(nodeTypeJson) as NodeTypeFragmentFragment;
        // console.log("Node Type Data:", nodeTypeData);
      } catch (error) {
        // toast.error("Error parsing JSON data");
        return null;
      }

      if (!nodeTypeData || !nodeTypeData.type || !nodeTypeData.type.endsWith("Node")) {
        return;
      }

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNodeId = v4();
      const newNode: Node = {
        // init new flow node
        id: newNodeId,
        type: nodeTypeData.type,
        position,
        data: {
          label: `${nodeTypeData.label}-${generateRandomLetters()}`,
          schema: nodeTypeData.schema,
          uiSchema: nodeTypeData.uiSchema,
          flow_id: flowId,
          node_type_id: nodeTypeData.id,
          outputSchema: nodeTypeData.default_data?.outputSchema || {},
        },
      };
      setNodes((nds) => nds.concat(newNode));
      setSelectedNode(newNode);
      onEditStatusChange?.();
      // setOpenDrawer(true);
    },
    [screenToFlowPosition, flowId, setNodes],
  );

  const onNodeDoubleClick = useCallback<NodeMouseHandler>(
    (event, node) => {
      // Prevent the default browser behavior
      event.preventDefault();

      const { x, y } = screenToFlowPosition({ x: event.clientX, y: event.clientY });
      setSelectedNode(node);

      const prevNodes = findPrevNodes(node.id);
      setPrevSelectedNodes(prevNodes);

      const hasFormComponent = nodeFormComponents.has(node.type || "");

      if (hasFormComponent) {
        setOpenDrawer(true);
      }
    },
    [screenToFlowPosition, findPrevNodes],
  );

  const onNodeClick: NodeMouseHandler = useCallback((event, node) => {}, []);

  const toggleDrawer = () => {
    setOpenDrawer((prevState) => !prevState);
  };

  const handleNodeChange = (data: { [key: string]: any }) => {
    console.log("handleNodeChange", data);
    const { id, ...nodeData } = data;
    const label = nodeData.label;

    const existingLabels = new Set(
      nodes.filter((n) => n.id !== id).map((n) => n.data.label),
    );

    const newLabel = existingLabels.has(label)
      ? `${label}-${generateRandomLetters()}`
      : label;

    setNodes((nds) =>
      nds.map((n) => {
        if (n.id === id) {
          // This is the update node
          return {
            ...n,
            data: {
              ...n.data,
              ...nodeData,
              label: newLabel,
            },
          };
        }
        return n;
      }),
    );
    onEditStatusChange?.();
  };

  return (
    <div ref={reactFlowWrapper} style={{ width: "100%", height: "100%" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onNodeClick={onNodeClick}
        onNodeDoubleClick={onNodeDoubleClick}
        fitView>
        <Controls />
        <MiniMap />
        <Background variant={BackgroundVariant.Dots} gap={16} size={1} />
        {openDrawer && (
          <NodeDrawer
            node={selectedNode}
            prevNodes={prevSelectedNodes}
            isOpen={openDrawer}
            workflowTestResult={workflowTestResult}
            onToggleDrawer={toggleDrawer}
            onNodeChange={handleNodeChange}
          />
        )}
      </ReactFlow>
    </div>
  );
}

export default function WorkflowPane(props: WorkflowPaneProps) {
  return (
    <ReactFlowProvider>
      <Flow {...props} />
    </ReactFlowProvider>
  );
}
