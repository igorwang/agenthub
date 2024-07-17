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
import React, { useState } from "react";
type SourceCardProps = {
  source: SourceType;
  index?: number;
  onFeedback?: (feedback: "like" | "dislike") => void;
  onSelectedSource?: (source: SourceType, selected: boolean) => void;
};

export const SourceCard = ({
  index = 1,
  source,
  onFeedback,
  onSelectedSource,
}: SourceCardProps) => {
  const [isFollowed, setIsFollowed] = useState(false);
  const [feedback, setFeedback] = useState<"like" | "dislike" | "same">();
  const [selected, setSelected] = useState<boolean>(false);

  const handleFeedback = React.useCallback(
    (liked: boolean) => {
      setFeedback(liked ? "like" : "dislike");
      onFeedback?.(liked ? "like" : "dislike");
    },
    [onFeedback],
  );

  const handleSelectSource = () => {
    onSelectedSource?.(source, !selected);
    setSelected((prev) => !prev);
  };

  const handleMoveToSource = () => {};
  const canSelectSource = source.sourceType == SOURCE_TYPE_ENUM.file;
  const hasSource = source?.url != null;
  return (
    <Card key={source.fileId} className="rounded-lg border-1 bg-card shadow-sm">
      <CardHeader className="justify-center px-1 py-0">
        <div className="flex flex-row items-center gap-1">
          {/* <SourceFileIcon size={20}></SourceFileIcon> */}
          <Icon className="text-md text-default-600" icon="mdi:tag-search-outline" />
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
        {/* {source.pages.length > 0 && (
          <div className="my-0 flex flex-row flex-nowrap items-center py-0">
            <small className="text-nowrap text-default-500"># Page</small>
            {source.pages.map((page, index) => (
              <Button
                key={index}
                isIconOnly
                variant="light"
                size="sm"
                className="my-0 h-[8px] p-0">
                <small className="text-default-600">{page}</small>
              </Button>
            ))}
          </div>
        )} */}
      </CardBody>
      <Divider></Divider>
      <CardFooter className="flex-nowrap justify-center py-0">
        <Tooltip
          content={
            canSelectSource
              ? "Select the source to next chat."
              : "This source cann't be selected"
          }>
          <Button
            isIconOnly
            radius="full"
            // size="sm"
            variant="light"
            disabled={!canSelectSource}
            onPress={handleSelectSource}
            className={clsx("h-[18px]", {
              visible: canSelectSource,
              hidden: !canSelectSource,
            })}>
            <Icon className="text-md text-default-600" icon="gravity-ui:chevrons-down" />{" "}
            {/* {selected ? (
              <Icon className="text-lg text-default-600" icon="gravity-ui:check" />
            ) : (
              <Icon
                className="text-md text-default-600"
                icon="gravity-ui:chevrons-down"
              />
            )} */}
          </Button>
        </Tooltip>
        <Tooltip content="Is good Source?">
          <Button
            isIconOnly
            radius="full"
            size="sm"
            variant="light"
            onPress={() => handleFeedback(true)}
            className="h-[18px]">
            {feedback === "like" ? (
              <Icon className="text-md text-primary" icon="gravity-ui:thumbs-up-fill" />
            ) : (
              <Icon className="text-md text-default-600" icon="gravity-ui:thumbs-up" />
            )}
          </Button>
        </Tooltip>
        <Tooltip content="View the details of the source.">
          <Link href={source.url} target="_blank">
            <Button
              isIconOnly
              radius="full"
              size="sm"
              variant="light"
              className={clsx("h-[18px]", {
                visible: hasSource,
                hidden: !hasSource,
              })}
              isDisabled={source.url == ""}
              onClick={handleMoveToSource}>
              <Icon className="text-md text-default-600" icon="gravity-ui:link" />
            </Button>
          </Link>
        </Tooltip>
      </CardFooter>
    </Card>
  );
};
