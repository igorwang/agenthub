import {
  DefaultFileIcon,
  DeleteIcon,
  DocumentIcon,
  VideoIcon,
} from "@/components/ui/icons";
import { CircularProgress, Image } from "@nextui-org/react";
import clsx from "clsx";
import React from "react";

export type UploadFileProps = React.HTMLAttributes<HTMLDivElement> & {
  key: number;
  file?: File;
  url?: string;
  bucket?: string;
  fileKey?: string;
  isLoading?: boolean;
  fileName?: string;
  className?: string;
  removeFileHandler?: (key: number) => void; // 使其成为可选属性
};

export const UploadFile = React.forwardRef<HTMLDivElement, UploadFileProps>(
  (
    { key = 0, className = "", fileName = "", url, isLoading = false, removeFileHandler },
    ref,
  ) => {
    const extension = fileName.split(".").pop()?.toLowerCase();

    const isImage = (extension: string) => {
      const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "webp"];
      return imageExtensions.includes(extension.toLowerCase());
    };

    const showImage = extension && isImage(extension) && url;

    const getIconElement = (fileName: string) => {
      switch (extension) {
        case "jpg":
        case "jpeg":
        case "png":
          return url && !isLoading ? (
            <Image width={100} src={url} />
          ) : (
            <DefaultFileIcon />
          );
        case "pdf":
          return <DocumentIcon />;
        case "doc":
        case "docx":
          return <DocumentIcon />;
        case "xls":
        case "xlsx":
          return <DocumentIcon />;
        case "mp4":
        case "avi":
        case "mov":
          return <VideoIcon />;
        default:
          return <DefaultFileIcon />;
      }
    };
    const iconElement: React.ReactNode = isLoading ? (
      <CircularProgress aria-label="Loading.." size="sm" />
    ) : (
      getIconElement(fileName)
    );

    return (
      <div
        className={clsx(
          "group relative ml-2 mt-2 flex max-w-48 flex-none items-center justify-start rounded-md bg-white p-2",
          className,
        )}
      >
        {removeFileHandler && (
          <DeleteIcon
            className="absolute right-0 top-0 m-1 hidden size-4 -translate-y-1/2 translate-x-1/2 transform rounded-full border border-gray-400 hover:cursor-pointer hover:border-gray-600 group-hover:block"
            onClick={() => removeFileHandler(key)}
          />
        )}
        {iconElement}
        {fileName && !showImage && (
          <span className="ml-2 flex max-w-full flex-1 overflow-auto text-ellipsis text-nowrap">
            {fileName}
          </span>
        )}
      </div>
    );
  },
);
