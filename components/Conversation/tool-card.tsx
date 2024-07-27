import ToolResultTable, { RowType } from "@/components/Conversation/tool-result-table";
import { RunToolRequestSchema } from "@/restful/generated";
import { SchemaType } from "@/types/chatTypes";
import React, { useEffect, useState } from "react";

async function getData(body: RunToolRequestSchema) {
  const res = await fetch("/api/chat/tool/run", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

interface FeatureToolProps {
  messageId: string;
  agentId: string;
  toolId: number;
  schema: SchemaType;
  onLoadingChange?: (value: boolean) => void;
}
const FeatureTool: React.FC<FeatureToolProps> = ({
  messageId,
  agentId,
  toolId,
  schema,
  onLoadingChange,
}) => {
  const [data, setData] = useState<any>(null);
  const [rows, setRows] = useState<RowType[] | null>(null);
  // const [columns, setColumns] = useState<ColumnType[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await getData({
          message_id: messageId,
          agent_id: agentId,
          tool_id: toolId,
        });
        const parsedResults = result
          .map((item: string) => {
            try {
              return JSON.parse(item); // 尝试解析每个元素
            } catch (error) {
              console.error("Failed to parse item:", error);
              return null; // 解析失败的元素设为 null
            }
          })
          .filter((item: object | null) => item !== null); // 过滤掉解析失败的元素

        setData(parsedResults); // 将解析成功的结果传给 setData
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
        onLoadingChange?.(false);
      }
    };
    fetchData();
  }, [messageId, agentId, toolId]);

  useEffect(() => {
    if (data) {
      setRows(
        data.map((item: object, index: number) => ({ ...item, key: index.toString() })),
      );
    }
  }, [data]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const columns = Object.entries(schema.properties)
    .map(([key, value]) => ({
      key,
      label: value.title,
      order: value.order !== undefined ? value.order : Number.MAX_SAFE_INTEGER,
    }))
    .sort((a, b) => a.order - b.order)
    .map(({ key, label }) => ({ key, label }));

  return (
    <div className="flex w-full flex-grow-0 overflow-hidden">
      {/* <h1>Feature Tool Data</h1> */}
      {/* <pre className="overflow-hidden">{JSON.stringify(data, null, 2)}</pre> */}
      <ToolResultTable columns={columns} rows={rows || []}></ToolResultTable>
    </div>
  );
};

export default FeatureTool;
