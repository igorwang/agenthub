"use client";
import { format, parseISO } from "date-fns";

import { Icon } from "@iconify/react";
import { Button } from "@nextui-org/react";
import React from "react";

import { cn } from "@/cn";
import { selectedLibrariesType } from "@/components/Library/LibraryCart";
import { LibraryCardType } from "@/types/chatTypes";
import { useTranslations } from "next-intl";

export type LibraryListItemColor = {
  name: string;
  hex: string;
};

export type LibraryListItemProps = Omit<React.HTMLAttributes<HTMLDivElement>, "id"> & {
  isPopular?: boolean;
  removeWrapper?: boolean;
  library?: LibraryCardType;
  selectedLibraries?: selectedLibrariesType[];
  onAddLibrary?: (libraryId: string) => void;
  onRemoveLibrary?: (libraryId: string) => void;
};

const LibraryListItem = React.forwardRef<HTMLDivElement, LibraryListItemProps>(
  (
    {
      isPopular,
      removeWrapper,
      library,
      className,
      onAddLibrary,
      onRemoveLibrary,
      selectedLibraries,
      ...props
    },
    ref,
  ) => {
    const t = useTranslations("");
    const [isStarred, setIsStarred] = React.useState(false);

    const isSelected = selectedLibraries?.some((item) => item.libraryId === library?.id);

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
        {/* <Button
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
        </Button> */}
        <div className="relative flex h-48 max-h-full w-full flex-col items-start justify-start overflow-hidden rounded-medium bg-content2">
          <div className="flex w-full flex-col gap-2 px-4 pt-6">
            <div className="flex w-full flex-row items-center gap-2">
              <Icon
                icon={"ion:library-sharp"}
                className="flex-shrink-0 text-3xl text-blue-500"
              />
              <h3
                className="truncate text-xl font-semibold tracking-tight text-default-800"
                title={library?.name}>
                {library?.name}
              </h3>
            </div>
            <p className="custom-scrollbar max-h-20 overflow-y-auto text-small text-default-500">
              {library?.description || t("No description")}
            </p>
            {library?.updatedAt && (
              <span className="absolute bottom-2 right-2 z-20 text-tiny font-semibold text-default-400">
                {formattedDate}
              </span>
            )}
          </div>
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
            {isSelected ? (
              <Button
                fullWidth
                className="font-medium"
                color="danger"
                radius="lg"
                onClick={() => {
                  library && onRemoveLibrary?.(library?.id);
                }}
                variant={isPopular ? "flat" : "solid"}>
                {t("Remove From Agent")}
              </Button>
            ) : (
              <Button
                fullWidth
                className="font-medium"
                color="primary"
                radius="lg"
                onClick={() => {
                  library && onAddLibrary?.(library?.id);
                }}
                variant={isPopular ? "flat" : "solid"}>
                {t("Add to Agent")}
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  },
);

LibraryListItem.displayName = "ProductListItem";

export default LibraryListItem;
