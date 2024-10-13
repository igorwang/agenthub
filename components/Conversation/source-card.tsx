import { useConversationContext } from "@/components/Conversation";
import FileIcon from "@/components/ui/file-icons";
import { SOURCE_TYPE_ENUM, SourceType } from "@/types/chatTypes";
import { Icon } from "@iconify/react";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Link,
  Tooltip,
} from "@nextui-org/react";
import clsx from "clsx";
import React, { useEffect } from "react";

type SourceCardProps = {
  source: SourceType;
  index?: number;
  onFeedback?: (feedback: "like" | "dislike" | null) => void;
};

export const SourceCard = ({ index = 1, source, onFeedback }: SourceCardProps) => {
  const { selectedSources, handleSelectedSource } = useConversationContext();
  const [feedback, setFeedback] = React.useState<"like" | "dislike" | null>(null);

  const isSelected = selectedSources.some((item) => item.fileId === source.fileId);

  useEffect(() => {
    // This effect will run whenever selectedSources changes
    // You can add any additional logic here if needed
  }, [selectedSources]);

  const handleFeedback = (newFeedback: "like" | "dislike") => {
    setFeedback((prevFeedback) => {
      const updatedFeedback = prevFeedback === newFeedback ? null : newFeedback;
      onFeedback?.(updatedFeedback);
      return updatedFeedback;
    });
  };

  const handleSelectSource = () => {
    handleSelectedSource(source, !isSelected);
  };

  const canSelectSource = source.sourceType == SOURCE_TYPE_ENUM.file;
  const hasSource = source?.url != null;

  return (
    <Card
      key={source.fileId}
      className={clsx(
        "rounded-lg border-1 bg-card shadow-sm transition-all",
        isSelected ? "border-primary" : "border-default",
      )}>
      <CardHeader className="justify-between px-2 py-1">
        <div className="flex items-center gap-1">
          <FileIcon fileExtension={source.ext || "Unknown"} size={14} />
          <p className="text-xs font-semibold text-default-600">
            Source - {source.index || index}
          </p>
        </div>
      </CardHeader>
      <Divider />
      <Tooltip content={source.fileName} placement="top" className="break-words">
        <CardBody className="h-14 overflow-hidden px-3 py-2">
          <p className="line-clamp-2 text-xs text-default-500">{source.fileName}</p>
        </CardBody>
      </Tooltip>
      <Divider />
      <CardFooter className="h-6 justify-between px-1 py-0">
        <div className="flex gap-0.5">
          <Tooltip content={canSelectSource ? "Select source" : "Can't select"}>
            <Button
              isIconOnly
              size="sm"
              variant="light"
              disabled={!canSelectSource}
              onPress={handleSelectSource}
              className={clsx("min-w-unit-3 h-unit-3 p-0", {
                "opacity-50": !canSelectSource,
              })}>
              <Icon
                className={clsx(
                  "text-sm",
                  isSelected ? "text-primary" : "text-default-400",
                )}
                icon={isSelected ? "mdi:checkbox-marked" : "mdi:checkbox-blank-outline"}
              />
            </Button>
          </Tooltip>
          <Tooltip content={feedback === "like" ? "Remove feedback" : "Good source"}>
            <Button
              isIconOnly
              size="sm"
              variant="light"
              onPress={() => handleFeedback("like")}
              className="min-w-unit-4 h-unit-4">
              <Icon
                className={clsx(
                  "text-sm",
                  feedback === "like" ? "text-primary" : "text-default-400",
                )}
                icon={
                  feedback === "like"
                    ? "gravity-ui:thumbs-up-fill"
                    : "gravity-ui:thumbs-up"
                }
              />
            </Button>
          </Tooltip>
        </div>
        <Tooltip content="View source">
          {source.url ? (
            <Link href={source.url} target="_blank">
              <Button
                isIconOnly
                size="sm"
                variant="light"
                className="min-w-unit-4 h-unit-4">
                <Icon className="text-sm text-default-400" icon="gravity-ui:link" />
              </Button>
            </Link>
          ) : (
            <Button
              isIconOnly
              size="sm"
              variant="light"
              className="min-w-unit-4 h-unit-4"
              isDisabled>
              <Icon className="text-sm text-default-400" icon="gravity-ui:link" />
            </Button>
          )}
        </Tooltip>
      </CardFooter>
    </Card>
  );
};
