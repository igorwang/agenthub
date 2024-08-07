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

import NodeDrawer from "@/components/WorkflowForm/node-drawer";
import { nodeFormComponents } from "@/components/WorkflowForm/node-forms";
import { nodeTypes } from "@/components/WorkflowForm/nodes";
import { NodeTypeFragmentFragment } from "@/graphql/generated/types";
import { alg, Graph } from "@dagrejs/graphlib";
import "@xyflow/react/dist/base.css";
import { v4 } from "uuid";

interface WorkflowPaneProps {
  flowId: string;
  initialNodes: Node[];
  initialEdges: Edge[];
  onWorkflowChange?: (nodes: Node[], edges: Edge[]) => void;
}

function Flow({
  flowId,
  initialNodes,
  initialEdges,
  onWorkflowChange,
}: WorkflowPaneProps) {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [prevSelectedNodes, setPrevSelectedNodes] = useState<Node[]>([]); // record the nodes before selected

  const [openDrawer, setOpenDrawer] = useState<boolean>(false);
  const { screenToFlowPosition } = useReactFlow();

  const graphRef = useRef<Graph>(new Graph({ directed: true }));

  useEffect(() => {
    onWorkflowChange?.(nodes, edges);
    const graph = new Graph({ directed: true });
    nodes.forEach((node) => graph.setNode(node.id, node));
    edges.forEach((edge) => graph.setEdge(edge.source, edge.target));
    graphRef.current = graph;
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

      const sortedNodes = alg.topsort(graph);
      const sortedPrevNodeIds = sortedNodes.filter((id) => prevNodeIds.has(id));
      const prevNodes = nodes.filter((node) =>
        sortedPrevNodeIds.some((id) => String(id) === String(node.id)),
      );

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
    },
    [setEdges],
  );

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
      if (!nodeTypeData || !nodeTypeData.type) {
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
          label: nodeTypeData.label,
          schema: nodeTypeData.schema,
          uiSchema: nodeTypeData.uiSchema,
          flow_id: flowId,
          node_type_id: nodeTypeData.id,
        },
      };
      setNodes((nds) => nds.concat(newNode));
      setSelectedNode(newNode);
      // setOpenDrawer(true);
    },
    [screenToFlowPosition, flowId],
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
    [screenToFlowPosition, nodes],
  );

  const onNodeClick: NodeMouseHandler = useCallback((event, node) => {}, []);

  const toggleDrawer = () => {
    setOpenDrawer((prevState) => !prevState);
  };

  const handleNodeChange = (data: { [key: string]: any }) => {
    const { id, ...nodeData } = data;

    setNodes((nds) =>
      nds.map((n) => {
        if (n.id === id) {
          // This is the update node
          return {
            ...n,
            data: {
              ...n.data,
              ...nodeData,
            },
          };
        }
        return n;
      }),
    );
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
