"use client";
import { format, parseISO } from "date-fns";

import { Icon } from "@iconify/react";
import { Button } from "@nextui-org/react";
import React from "react";

import { cn } from "@/cn";
import { LibraryCardType } from "@/types/chatTypes";

export type LibraryListItemColor = {
  name: string;
  hex: string;
};

export type LibraryListItemProps = Omit<React.HTMLAttributes<HTMLDivElement>, "id"> & {
  isPopular?: boolean;
  removeWrapper?: boolean;
  library?: LibraryCardType;
};

const LibraryListItem = React.forwardRef<HTMLDivElement, LibraryListItemProps>(
  ({ isPopular, removeWrapper, library, className, ...props }, ref) => {
    const [isStarred, setIsStarred] = React.useState(false);
    // const hasColors = availableColors && availableColors?.length > 0;
    console.log("library", library?.updatedAt, typeof library?.updatedAt);
    // const formattedDate = format(updatedAt, 'MMMM dd, yyyy');

    const formattedDate = library?.updatedAt
      ? format(parseISO(library.updatedAt), "MMMM dd, yyyy")
      : "";
    return (
      <div
        ref={ref}
        className={cn(
          "relative flex w-64 max-w-full flex-none scroll-ml-6 flex-col gap-3 rounded-large bg-content1 p-4 shadow-medium",
          {
            "rounded-none bg-transparent shadow-none": removeWrapper,
          },
          className,
        )}
        {...props}>
        {library?.isNew ? (
          <span className="absolute left-7 top-7 z-20 text-tiny font-semibold text-default-400">
            NEW{" "}
          </span>
        ) : null}
        <Button
          isIconOnly
          className={cn("absolute right-6 top-6 z-20", {
            hidden: isPopular,
          })}
          radius="full"
          size="sm"
          variant="flat"
          onPress={() => setIsStarred(!isStarred)}>
          <Icon
            className={cn("text-default-500", {
              "text-warning": isStarred,
            })}
            icon="solar:star-bold"
            width={16}
          />
        </Button>
        <div
          className={cn(
            "relative flex h-48 max-h-full w-full flex-col items-start justify-start overflow-visible rounded-medium bg-content2",
            // {
            //   "h-full justify-between": isPopular,
            // },
          )}>
          <div
            className={cn("flex flex-col gap-2 px-4 pt-6", {
              // hidden: !isPopular,
            })}>
            <div className="flex flex-row items-center gap-2">
              <Icon icon={"ion:library-sharp"} fontSize={30} color="blue"></Icon>
              <h3 className="text-xl font-semibold tracking-tight text-default-800">
                {library?.name}
              </h3>
            </div>
            <p className="... max-h-20 overflow-auto text-ellipsis text-small text-default-500">
              {library?.description || "No description"}
            </p>

            {library?.updatedAt ? (
              <span className="absolute bottom-2 right-2 z-20 text-tiny font-semibold text-default-400">
                {/* {format(library?.updatedAt, "MMMM dd, yyyy")} */}
                {/* {format library?.updatedAt}{" "} */}
                {formattedDate}
              </span>
            ) : null}
          </div>
          {/* <Image
            removeWrapper
            alt={name}
            className={cn(
              "z-0 h-full max-h-full w-full max-w-[80%] overflow-visible object-contain object-center hover:scale-110",
              {
                "flex h-56 w-56 items-center": isPopular,
                "mb-2": hasColors,
              },
            )}
            src={imageSrc}
          /> */}
        </div>
        <div className="flex flex-col gap-3 px-1">
          <div className="flex gap-2">
            {/* {isPopular ? (
              <Button
                fullWidth
                className="bg-default-300/20 font-medium text-default-700"
                radius="lg"
                variant="flat">
                Save{" "}
              </Button>
            ) : null} */}
            <Button
              fullWidth
              className="font-medium"
              color="primary"
              radius="lg"
              variant={isPopular ? "flat" : "solid"}>
              Add to Agent{" "}
            </Button>
          </div>
        </div>
      </div>
    );
  },
);

LibraryListItem.displayName = "ProductListItem";

export default LibraryListItem;
