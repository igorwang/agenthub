import { Order_By, useSubExecuteResultsSubscription } from "@/graphql/generated/types";
import { ChatFlowResponseSchema } from "@/restful/generated";
import { Icon } from "@iconify/react";
import { Tab, Tabs } from "@nextui-org/react";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

const AgentWorkflowResultsPane: React.FC<{ data: ChatFlowResponseSchema }> = ({
  data,
}) => {
  const [expandedSteps, setExpandedSteps] = useState<boolean[]>([]);

  const toggleStep = useCallback((stepIndex: number) => {
    setExpandedSteps((prev) => {
      const newExpanded = [...prev];
      newExpanded[stepIndex] = !newExpanded[stepIndex];
      return newExpanded;
    });
  }, []);

  const { topological_order, error_message: errorMessage } = data;
  const otherResults = data as { [key: string]: unknown };

  const {
    data: subscriptionData,
    loading,
    error,
  } = useSubExecuteResultsSubscription({
    variables: { order_by: { created_at: Order_By.Desc } },
  });

  useEffect(() => {
    if (error) {
      toast.error("Error in subscription: " + error.message);
    }
  }, [error]);

  if (!topological_order) {
    return <div>No execution flow data available.</div>;
  }

  return (
    <div className="space-y-4">
      {errorMessage && (
        <div
          className="relative mb-4 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700"
          role="alert">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline"> {errorMessage}</span>
        </div>
      )}

      <div className="rounded-lg bg-gray-100 p-4">
        <h2 className="mb-4 text-lg font-bold">Execution Flow</h2>
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
                <h3 className="text-lg font-medium">Step {stepIndex + 1}</h3>
              </div>
              {expandedSteps[stepIndex] && (
                <div className="overflow-x-auto">
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
                        <div className="max-h-96 overflow-auto">
                          {otherResults[node] ? (
                            <pre className="whitespace-pre-wrap break-all bg-gray-50 p-2 text-sm">
                              {JSON.stringify(otherResults[node], null, 2)}
                            </pre>
                          ) : (
                            <p className="text-gray-500">
                              No data available for this node
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
    </div>
  );
};

export default AgentWorkflowResultsPane;
