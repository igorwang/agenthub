import FileIcon from "@/components/ui/file-icons";
import {
  FilesListQuery,
  Status_Enum,
  useBatchDeleteFilesMutation,
} from "@/graphql/generated/types";
import { Icon } from "@iconify/react";
import { Button, Tooltip } from "@nextui-org/react";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

interface SessionFilesSidebarProps {
  sessionId: string;
  files: FilesListQuery["files"];
  onFilesChange: (files: FilesListQuery["files"]) => void;
}

export default function SessionFilesSidebar({
  sessionId,
  files,
  onFilesChange,
}: SessionFilesSidebarProps) {
  const t = useTranslations();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoadings] = useState(false);
  const [batchDeleteFilesMutation] = useBatchDeleteFilesMutation();

  useEffect(() => {
    setIsOpen(true);
  }, [files]);

  const handleDelete = (fileId: string) => {
    // Implement delete logic here
    console.log(`Delete file with id: ${fileId}`);
    onFilesChange(files.filter((file) => file.id !== fileId));
    // 实现删除文件的逻辑
    batchDeleteFilesMutation({
      variables: {
        where: { id: { _in: [fileId] } },
      },
    }).then(async (res) => {
      toast.success(
        `${t("Successfully deleted files")}: ${res.data?.delete_files?.returning.length || 0}`,
      );
    });
  };

  const handleRedoFile = useCallback(async (fileId: string) => {
    try {
      const response = await fetch("/api/file/reprocess", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          file_id: fileId,
        }),
      });

      if (!response.ok) {
        throw new Error(t("Failed to reprocess file"));
      }
      const result = await response.json();
      toast.success(t(`File is being reprocessed`));
    } catch (error) {
      console.error(t("Error reprocessing file"), error);
      toast.error(t(`Failed to reprocess file`));
    } finally {
    }
  }, []);
  if (files.length == 0) {
    return null;
  }

  return (
    <div
      className={`relative h-full border-l border-gray-200 transition-all duration-300 ${
        isOpen ? "w-64" : "w-0"
      } $`}>
      <div className="flex h-full flex-col">
        <Tooltip content={isOpen ? t("Close") : t("Session Files")}>
          <Button
            isIconOnly
            aria-label="Toggle file sidebar"
            className={`absolute ${
              isOpen
                ? "right-2 top-2 bg-transparent hover:bg-gray-100"
                : "-left-12 top-1/2 -translate-y-1/2 bg-gray-100 hover:bg-gray-200"
            } z-10 text-gray-700 transition-colors`}
            variant="flat"
            onClick={() => setIsOpen(!isOpen)}>
            <Icon
              icon={isOpen ? "heroicons:chevron-right" : "heroicons:document-text"}
              width="24"
              height="24"
            />
          </Button>
        </Tooltip>

        <div className="flex-grow overflow-y-auto">
          <h2 className="p-4 text-lg font-semibold">{t("Session Files")}</h2>
          {loading && <p className="p-4">{t("Loading")}..</p>}
          <ul className="space-y-2 p-4">
            {files.map((file) => (
              <li
                key={file.id}
                className={`flex items-center justify-between rounded bg-white p-2 shadow ${file.status === Status_Enum.Failed ? "border-1 border-red-300" : ""}`}>
                <div className="flex min-w-0 flex-grow items-center space-x-2">
                  <div>
                    {file.status == Status_Enum.Indexed ||
                    file.status == Status_Enum.Success ||
                    file.status == Status_Enum.Failed ? (
                      <FileIcon fileExtension={file.ext || "default"} size={20} />
                    ) : (
                      <Icon icon={"eos-icons:loading"} />
                    )}
                  </div>
                  <Tooltip content={file.name}>
                    <span className="truncate">{file.name}</span>
                  </Tooltip>
                </div>
                <div className="flex flex-row">
                  {file.status === Status_Enum.Failed && (
                    <Tooltip content={t("Reprocess")}>
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleRedoFile(file.id);
                        }}>
                        <Icon icon={"fad:redo"} width={18} height={18} />
                      </Button>
                    </Tooltip>
                  )}
                  <Tooltip content={t("Delete file")}>
                    <Button
                      isIconOnly
                      size="sm"
                      color="danger"
                      variant="light"
                      onClick={() => handleDelete(file.id)}
                      aria-label={`Delete ${file.name}`}>
                      <Icon icon="material-symbols:delete" width="18" height="18" />
                    </Button>
                  </Tooltip>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
