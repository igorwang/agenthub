import FileIcon from "@/components/ui/file-icons";
import { FilesListQuery, Order_By, useFilesListQuery } from "@/graphql/generated/types";
import { Icon } from "@iconify/react";
import { Button, Tooltip } from "@nextui-org/react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

interface SessionFilesSidebarProps {
  sessionId: string;
}

export default function SessionFilesSidebar({ sessionId }: SessionFilesSidebarProps) {
  const t = useTranslations();
  const [isOpen, setIsOpen] = useState(false);
  const [files, setFiles] = useState<FilesListQuery["files"]>([]);

  const { data, loading, error, refetch } = useFilesListQuery({
    variables: {
      limit: 5,
      order_by: { created_at: Order_By.Desc },
      where: { session_id: { _eq: sessionId } },
    },
  });

  useEffect(() => {
    setFiles(data?.files || []);
  }, [data, isOpen]);

  const handleDelete = (fileId: string) => {
    // Implement delete logic here
    console.log(`Delete file with id: ${fileId}`);
    setFiles(files.filter((file) => file.id !== fileId));
  };

  if (files.length == 0) {
    return null;
  }

  return (
    <div
      className={`relative h-full border-l border-gray-200 transition-all duration-300 ${
        isOpen ? "w-64" : "w-0"
      }`}>
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

        {isOpen && (
          <div className="flex-grow overflow-y-auto">
            <h2 className="p-4 text-lg font-semibold">{t("Session Files")}</h2>
            {loading && <p className="p-4">{t("Loading")}..</p>}
            <ul className="space-y-2 p-4">
              {files.map((file) => (
                <li
                  key={file.id}
                  className="flex items-center justify-between rounded bg-white p-2 shadow">
                  <div className="flex min-w-0 flex-grow items-center space-x-2">
                    <div>
                      <FileIcon fileExtension={file.ext || "default"} size={20} />
                    </div>
                    <Tooltip content={file.name}>
                      <span className="truncate">{file.name}</span>
                    </Tooltip>
                  </div>
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
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
