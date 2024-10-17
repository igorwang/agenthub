import FileIcon from "@/components/ui/file-icons";
import {
  FilesListQuery,
  Status_Enum,
  useBatchDeleteFilesMutation,
} from "@/graphql/generated/types";
import { selectSessionFiles } from "@/lib/features/chatListSlice";
import { Icon } from "@iconify/react";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Tooltip,
} from "@nextui-org/react";
import { useTranslations } from "next-intl";
import { useCallback, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";

interface SessionFilesHeaderProps {
  model: string;
  sessionId: string;
  // files: FilesListQuery["files"];
  onFilesChange: (files: FilesListQuery["files"]) => void;
}

export default function SessionFilesHeader({
  model,
  sessionId,
  // files,
  onFilesChange,
}: SessionFilesHeaderProps) {
  const t = useTranslations();
  const [batchDeleteFilesMutation] = useBatchDeleteFilesMutation();
  const [isExporting, setIsExporting] = useState(false);
  const files = useSelector(selectSessionFiles);

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

  const handleExportReviseVersion = useCallback(
    async (fileId: string) => {
      if (!model) {
        toast.error(t("Model not well settings"));
        return;
      }
      setIsExporting(true);
      // Implement export revise version logic here
      try {
        const response = await fetch("/api/chat/session/export_revise_document", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            file_id: fileId,
            session_id: sessionId,
            model,
          }),
        });
        if (!response.ok) {
          throw new Error(t("Failed to export revise version"));
        }
        const result = await response.json();

        if (result.url) {
          window.open(result.url, "_blank");
        }
        toast.success(t("Export revise version successfully"));
      } catch (error) {
        console.error(t("Error exporting revise version"), error);
      } finally {
        setIsExporting(false);
      }
    },
    [sessionId],
  );

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
            className={`group relative flex rounded border border-gray-200 bg-white p-1 shadow ${
              file.status === Status_Enum.Failed ? "border border-red-300" : ""
            }`}>
            <div className="relative flex items-center space-x-2">
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
              <div className="flex items-center">
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
                {file.ext === "docx" && (
                  <Dropdown>
                    <DropdownTrigger>
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        className="m h-unit-6"
                        isLoading={isExporting}
                        disabled={isExporting}>
                        <Icon icon="ic:round-more-vert" fontSize={12} />
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu>
                      <DropdownItem onClick={() => handleExportReviseVersion(file.id)}>
                        {t("Export Reivse Version")}
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                )}
              </div>
            </div>
            <Tooltip content={t("Delete file")}>
              <Button
                isIconOnly
                size="sm"
                variant="light"
                className="min-w-unit-6 h-unit-6 absolute -right-2 -top-2 opacity-0 group-hover:opacity-100"
                onClick={() => handleDelete(file.id)}
                aria-label={`Delete ${file.name}`}>
                <Icon icon="lucide:x" width="12" height="12" />
              </Button>
            </Tooltip>
          </li>
        ))}
      </ul>
    </div>
  );
}
