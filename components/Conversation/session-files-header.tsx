import FileIcon from "@/components/ui/file-icons";
import {
  FilesListQuery,
  Status_Enum,
  useBatchDeleteFilesMutation,
} from "@/graphql/generated/types";
import { Icon } from "@iconify/react";
import { Button, Tooltip } from "@nextui-org/react";
import { useTranslations } from "next-intl";
import { useCallback } from "react";
import { toast } from "sonner";

interface SessionFilesHeaderProps {
  sessionId: string;
  files: FilesListQuery["files"];
  onFilesChange: (files: FilesListQuery["files"]) => void;
}

export default function SessionFilesHeader({
  sessionId,
  files,
  onFilesChange,
}: SessionFilesHeaderProps) {
  const t = useTranslations();
  const [batchDeleteFilesMutation] = useBatchDeleteFilesMutation();

  const handleDelete = (fileId: string) => {
    // Implement delete logic here
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

  if (files.length === 0) {
    return null;
  }

  return (
    <div className="max-h-20">
      <ul className="flex space-x-2 p-2">
        {files.map((file) => (
          <li
            key={file.id}
            className={`rounded border border-gray-200 bg-white p-1 shadow ${
              file.status === Status_Enum.Failed ? "border border-red-300" : ""
            }`}>
            <div className="flex items-center space-x-2">
              <div className="h-6 w-6">
                {file.status === Status_Enum.Indexed ||
                file.status === Status_Enum.Success ||
                file.status === Status_Enum.Failed ? (
                  <FileIcon fileExtension={file.ext || "default"} size={18} />
                ) : (
                  <Icon icon="eos-icons:loading" fontSize={18} />
                )}
              </div>
              <Tooltip content={file.name}>
                <span className="max-w-[80px] truncate text-xs">{file.name}</span>
              </Tooltip>
              <div className="flex space-x-1">
                {file.status === Status_Enum.Failed && (
                  <Tooltip content={t("Reprocess")}>
                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      className="min-w-unit-6 h-unit-6"
                      onClick={() => handleRedoFile(file.id)}>
                      <Icon icon="fad:redo" width={14} height={14} />
                    </Button>
                  </Tooltip>
                )}
                <Tooltip content={t("Delete file")}>
                  <Button
                    isIconOnly
                    size="sm"
                    variant="light"
                    className="min-w-unit-8 h-unit-8 hover:text-gray-600"
                    onClick={() => handleDelete(file.id)}
                    aria-label={`Delete ${file.name}`}>
                    <Icon icon="lucide:x" width="12" height="12" />
                  </Button>
                </Tooltip>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
