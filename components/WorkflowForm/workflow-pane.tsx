"use client";

import {
  addEdge,
  Background,
  BackgroundVariant,
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
  type OnConnect,
} from "@xyflow/react";
import { useCallback, useRef, useState } from "react";

import NodeDrawer from "@/components/WorkflowForm/node-drawer";
import { nodeTypes } from "@/components/WorkflowForm/nodes";
import { NodeTypeFragmentFragment } from "@/graphql/generated/types";
import "@xyflow/react/dist/base.css";
import { v4 } from "uuid";

interface WorkflowPaneProps {
  flowId: string;
  initialNodes: Node[];
  initialEdges: Edge[];
}

function Flow({ flowId, initialNodes, initialEdges }: WorkflowPaneProps) {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  const [openDrawer, setOpenDrawer] = useState<boolean>(false);

  const { getIntersectingNodes } = useReactFlow();

  const { screenToFlowPosition } = useReactFlow();

  const onConnect = useCallback<OnConnect>(
    (params) => {
      setEdges((eds) => addEdge(params, eds));
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
        x: event.clientX - (reactFlowBounds?.left ?? 0),
        y: event.clientY - (reactFlowBounds?.top ?? 0),
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
          flow_id: flowId,
          node_type_id: nodeTypeData.id,
        },
      };
      setNodes((nds) => nds.concat(newNode));
      setSelectedNode(newNode);
      setOpenDrawer(true);
    },
    [screenToFlowPosition, nodes, setNodes],
  );

  const onNodeDoubleClick = useCallback<NodeMouseHandler>(
    (event, node) => {
      // Prevent the default browser behavior
      event.preventDefault();

      // Example: Update node data
      // setNodes((nds) =>
      //   nds.map((n) => {
      //     if (n.id === node.id) {
      //       // This is the double clicked node, update it
      //       return {
      //         ...n,
      //         data: {
      //           ...n.data,
      //           label: `${n.data.label} (Edited)`,
      //         },
      //       };
      //     }
      //     return n;
      //   }),
      // );
      // Example: You can also update edges if needed
      // setEdges((eds) => [...]);
      // Example: Use reactFlowInstance if needed

      const { x, y } = screenToFlowPosition({ x: event.clientX, y: event.clientY });
      console.log("Clicked position in flow coordinates:", { x, y });
      console.log("Node double-clicked:", node);
      setSelectedNode(node);
      setOpenDrawer(true);
      // You can add more logic here, such as opening a modal for editing the node
    },
    [setNodes, screenToFlowPosition],
  );

  const onNodeClick: NodeMouseHandler = useCallback(
    (event, node) => {
      console.log("onNodeClick");
      // setSelectedNode((prevNode) => (prevNode?.id === node.id ? null : node));
      // console.log(node);
    },
    [setNodes, selectedNode],
  );

  const toggleDrawer = () => {
    setOpenDrawer((prevState) => !prevState);
  };

  const handleNodeChange = (data: { [key: string]: any }) => {
    console.log("handleNodeChange", data);
    setNodes((nds) =>
      nds.map((n) => {
        if (n.id === data.id) {
          // This is the update node
          return {
            ...n,
            data: {
              ...n.data,
              ...data,
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
        {selectedNode && (
          <NodeDrawer
            node={selectedNode}
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
