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
        "ounded-lg border-1 bg-card shadow-sm transition-all",
        isSelected ? "border-primary" : "border-default",
      )}>
      <CardHeader className="justify-center px-1 py-0">
        <div className="flex flex-row items-center gap-1">
          <FileIcon fileExtension={source.ext || "Unknown"} size={20} />
          <p className="text-nowrap text-small font-semibold text-default-400">
            Source - {source.index || index}
          </p>
        </div>
      </CardHeader>
      <Divider />
      <CardBody className="flex flex-col justify-between p-0 text-small text-default-400">
        <h4 className="line-clamp-2 text-sm">
          <Tooltip classNames={{ base: "max-w-[300px]" }} content={source.fileName}>
            {source.fileName}
          </Tooltip>
        </h4>
      </CardBody>
      <Divider />
      <CardFooter className="flex-nowrap justify-center gap-1 py-0">
        <Tooltip
          content={
            canSelectSource
              ? "Select the source for next chat"
              : "This source can't be selected"
          }>
          <Button
            isIconOnly
            radius="full"
            size="sm"
            variant="light"
            disabled={!canSelectSource}
            onPress={handleSelectSource}
            className={clsx("h-[18px] min-w-[18px]", {
              visible: canSelectSource,
              hidden: !canSelectSource,
            })}>
            <Icon
              className={clsx(
                "text-sm",
                isSelected ? "text-primary" : "text-default-600",
              )}
              icon={isSelected ? "mdi:checkbox-marked" : "mdi:checkbox-blank-outline"}
            />
          </Button>
        </Tooltip>
        <Tooltip
          content={feedback === "like" ? "Remove feedback" : "This is a good source"}>
          <Button
            isIconOnly
            radius="full"
            size="sm"
            variant="light"
            onPress={() => handleFeedback("like")}
            className="h-[18px] min-w-[18px]">
            <Icon
              className={clsx(
                "text-sm",
                feedback === "like" ? "text-primary" : "text-default-600",
              )}
              icon={
                feedback === "like" ? "gravity-ui:thumbs-up-fill" : "gravity-ui:thumbs-up"
              }
            />
          </Button>
        </Tooltip>
        <Tooltip content="View the details of the source">
          <Link href={source.url} target="_blank">
            <Button
              isIconOnly
              radius="full"
              size="sm"
              variant="light"
              className={clsx("h-[18px] min-w-[18px]", {
                visible: hasSource,
                hidden: !hasSource,
              })}
              isDisabled={source.url == ""}
              onClick={() => {}}>
              <Icon className="text-sm text-default-600" icon="gravity-ui:link" />
            </Button>
          </Link>
        </Tooltip>
      </CardFooter>
    </Card>
  );
};
