import { SourceFileIcon } from "@/components/ui/icons";
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
    <Card className="basis-1/2 bg-gray-200 pr-1 shadow-sm sm:basis-1/4">
      <CardHeader className="justify-between px-1 py-0">
        <div className="flex flex-row">
          <div className="flex flex-col items-start justify-center">
            <h4 className="line-clamp-2 text-sm">
              <Tooltip classNames={{ base: "max-w-[300px]" }} content={source.fileName}>
                {source.fileName}
              </Tooltip>
            </h4>
          </div>
        </div>
      </CardHeader>
      <CardBody className="p-0 text-small text-default-400">
        <p className="line-clamp-1">
          {source.contents && source.contents.length > 0 ? source.contents[0] : ""}
        </p>
        <Divider className="my-1"></Divider>
        {source.pages.length > 0 && (
          <div className="flex flex-row flex-wrap items-center gap-1 px-1">
            <span className="text-sm text-default-400"># Page</span>
            {source.pages.map((page) => (
              <Button
                isIconOnly
                radius="full"
                variant="bordered"
                size="sm"
                className="m-0 h-[20px] w-[20px] p-0"
              >
                {page}
              </Button>
            ))}
          </div>
        )}
      </CardBody>
      <CardFooter className="flex-wrap justify-between gap-1 px-1 py-0">
        <div className="flex flex-row items-center gap-1">
          <SourceFileIcon size={20}></SourceFileIcon>
          <p className="text-nowrap text-small font-semibold text-default-400">
            Source - {index}
          </p>
        </div>
        <div className="flex flex-row justify-self-end">
          <Tooltip content="Select the source to next chat.">
            <Button
              isIconOnly
              radius="full"
              size="sm"
              variant="light"
              onPress={handleSelectSource}
              className="h-[18px]"
            >
              {selected ? (
                <Icon className="text-lg text-default-600" icon="gravity-ui:check" />
              ) : (
                <Icon
                  className="text-lg text-default-600"
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
              className="h-[18px]"
            >
              {feedback === "like" ? (
                <Icon className="text-lg text-primary" icon="gravity-ui:thumbs-up-fill" />
              ) : (
                <Icon className="text-lg text-default-600" icon="gravity-ui:thumbs-up" />
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
              <Icon className="text-lg text-default-600" icon="gravity-ui:link" />
            </Button>
          </Tooltip>
        </div>
      </CardFooter>
    </Card>
  );
};
