import { SourceType } from "@/types/chatTypes";
import { Icon } from "@iconify/react";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Tooltip,
} from "@nextui-org/react";
import React, { useState } from "react";
type SourceCardProps = {
  source: SourceType;
  index?: number;
  onFeedback?: (feedback: "like" | "dislike") => void;
};

export const SourceCard = ({ index = 1, source, onFeedback }: SourceCardProps) => {
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
    setSelected((prev) => !prev);
  };

  return (
    <Card
      key={source.fileId}
      className="bg-card w-1/2 min-w-[120px] max-w-[260px] rounded-lg border-1 shadow-sm md:w-1/4">
      <CardHeader className="justify-center px-1 py-0">
        <div className="flex flex-row items-center gap-1">
          {/* <SourceFileIcon size={20}></SourceFileIcon> */}
          <Icon className="text-md text-default-600" icon="mdi:tag-search-outline" />
          <p className="text-nowrap text-small font-semibold text-default-400">
            Source - {index}
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
        {source.pages.length > 0 && (
          <div className="my-0 flex flex-row flex-nowrap items-center py-0">
            <small className="text-nowrap text-default-500"># Page</small>
            {source.pages.map((page, index) => (
              <Button
                key={index}
                isIconOnly
                variant="light"
                size="sm"
                className="my-0 h-[10px] w-[5px] p-0">
                <small className="text-default-600">{page}</small>
              </Button>
            ))}
          </div>
        )}
      </CardBody>
      <Divider></Divider>
      <CardFooter className="flex-wrap justify-between gap-1 px-1 py-0">
        <Tooltip content="Select the source to next chat.">
          <Button
            isIconOnly
            radius="full"
            // size="sm"
            variant="light"
            onPress={handleSelectSource}
            className="h-[18px]">
            {selected ? (
              <Icon className="text-lg text-default-600" icon="gravity-ui:check" />
            ) : (
              <Icon
                className="text-md text-default-600"
                icon="gravity-ui:chevrons-down"
              />
            )}
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
          <Button
            isIconOnly
            radius="full"
            size="sm"
            variant="light"
            className="h-[18px]"
            //   onPress={handleSelectSource}
          >
            <Icon className="text-md text-default-600" icon="gravity-ui:link" />
          </Button>
        </Tooltip>
      </CardFooter>
    </Card>
  );
};
