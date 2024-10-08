import {
  Order_By,
  Status_Enum,
  useSubExecuteResultsSubscription,
} from "@/graphql/generated/types";
import { TaskRunResult } from "@/restful/generated";
import { Icon } from "@iconify/react";
import { Button, Spacer, Tab, Tabs, Tooltip } from "@nextui-org/react";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

interface LibraryWorkflowRunningPaneProps {
  fileId: string;
  fileName: string;
  onNewFile?: () => void;
}

export default function LibraryWorkflowRunningPane({
  fileId,
  fileName,
  onNewFile,
}: LibraryWorkflowRunningPaneProps) {
  const t = useTranslations();
  const [executeId, setExecuteId] = useState<string | null>(null);
  const [results, setResults] = useState<{ [key: string]: any } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [expandedSteps, setExpandedSteps] = useState<{ [key: number]: boolean }>({});
  const [status, setStatus] = useState<Status_Enum | null>(null);

  const { data, loading, error } = useSubExecuteResultsSubscription({
    variables: {
      where: { file_id: { _eq: fileId }, id: { _eq: executeId } },
      limit: 1,
      order_by: { created_at: Order_By.Desc },
    },
    skip: !executeId,
  });

  // useEffect(() => {
  //   if (fileId && !loading) {
  //     handleRedoFile();
  //   }
  // }, [fileId]);

  useEffect(() => {
    if (data && data.execute_results && data.execute_results.length > 0) {
      setResults(data.execute_results[0].results);
      setErrorMessage(data.execute_results[0].error_message || null);
      setExecuteId(data.execute_results[0].id || null);
      setStatus(data.execute_results[0].status || null);
    }
  }, [data]);

  const toggleStep = (stepIndex: number) => {
    setExpandedSteps((prev) => ({
      ...prev,
      [stepIndex]: !prev[stepIndex],
    }));
  };

  const handleRedoFile = useCallback(async () => {
    setResults(null);
    try {
      const response = await fetch("/api/file/reprocess", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          file_id: fileId,
          mode: "workflow",
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to reprocess file");
      }
      const result: TaskRunResult = await response.json();
      setExecuteId(result.execute_id);
      toast.success(`File "${fileName}" is being reprocessed in ${result.execute_id}.`);
    } catch (error) {
      console.error("Error reprocessing file:", error);
      toast.error(`Failed to reprocess file "${fileName}". Please try again.`);
    }
  }, [fileId, fileName]);

  const handleNewFile = () => {
    onNewFile?.();
  };

  function renderButtons() {
    return (
      <div className="flex flex-row">
        <Tooltip content={t("New File")}>
          <Button
            color="primary"
            variant="bordered"
            size="sm"
            onClick={handleNewFile}
            startContent={<Icon icon="mdi:file-plus" fontSize={18} />}>
            {t("New File")}
          </Button>
        </Tooltip>
        <Spacer />
        <Tooltip content={loading ? `${t("Start")}...` : t("Start")}>
          <Button
            color="primary"
            variant="bordered"
            size="sm"
            onClick={handleRedoFile}
            isLoading={loading}
            startContent={<Icon icon="mdi:play" fontSize={20} />}>
            {t("Start")}
          </Button>
        </Tooltip>
      </div>
    );
  }

  const renderExecutionFlow = () => {
    if (
      !results ||
      !results.topological_order ||
      !Array.isArray(results.topological_order)
    ) {
      return <div>No execution flow available</div>;
    }

    const { topological_order, ...otherResults } = results;

    return (
      <div className="rounded-lg bg-gray-100 p-4">
        <h2 className="mb-4 text-lg font-bold">{t("Execution Flow")}</h2>
        <div className="space-y-4">
          {topological_order.map((step: string[], stepIndex: number) => (
            <div key={stepIndex} className="rounded bg-white p-4 shadow">
              <div
                className="mb-2 flex cursor-pointer items-center"
                onClick={() => toggleStep(stepIndex)}>
                <Icon
                  icon={
                    expandedSteps[stepIndex] ? "mdi:chevron-down" : "mdi:chevron-right"
                  }
                  className="mr-2"
                  width="24"
                  height="24"
                />
                <h3 className="text-lg font-medium">
                  {t("Step")} {stepIndex + 1}
                </h3>
              </div>
              {expandedSteps[stepIndex] && (
                <div className="custom-scrollbar overflow-x-auto">
                  <Tabs aria-label={`Step ${stepIndex + 1} nodes`}>
                    {step.map((node: string, nodeIndex: number) => (
                      <Tab
                        key={nodeIndex}
                        title={
                          <div className="flex items-center">
                            <Icon
                              icon="mdi:code-brackets"
                              className="mr-2"
                              width="20"
                              height="20"
                            />
                            <span>{node}</span>
                          </div>
                        }>
                        <div className="custom-scrollbar max-h-96 overflow-auto">
                          {otherResults[node] ? (
                            <pre className="whitespace-pre-wrap break-all bg-gray-50 p-2 text-sm">
                              {JSON.stringify(otherResults[node], null, 2)}
                            </pre>
                          ) : (
                            <p className="text-gray-500">
                              {t("No data available for this node")}
                            </p>
                          )}
                        </div>
                      </Tab>
                    ))}
                  </Tabs>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="max-h-full w-full overflow-auto p-4">
      <div className="mb-4 flex flex-row items-center justify-between">
        <h1 className="max-w-md overflow-hidden text-ellipsis text-nowrap text-xl font-bold">
          {t("Input file")}: {fileName}
        </h1>
        {renderButtons()}
      </div>

      {errorMessage && (
        <div
          className="relative mb-4 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700"
          role="alert">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline"> {errorMessage}</span>
        </div>
      )}
      {renderExecutionFlow()}
      {status == Status_Enum.Running ? (
        <div className="flex items-center justify-center p-8">
          <Icon icon="eos-icons:loading" className="mr-2 h-6 w-6 animate-spin" />
          <span className="text-lg font-medium">{t("Running")}...</span>
        </div>
      ) : null}
    </div>
  );
}
