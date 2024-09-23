import { Status_Enum } from "@/graphql/generated/types";
import { Icon } from "@iconify/react";
import {
  Button,
  Chip,
  Pagination,
  Selection,
  SortDescriptor,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
} from "@nextui-org/react";
import React, { FC, useCallback, useMemo } from "react";
import { useTranslations } from "use-intl";

export interface FileDTO {
  id: string;
  name: string;
  size: number;
  status: Status_Enum;
  updateTime: string;
  errorMessage: string;
}

interface FileTableProps {
  files: FileDTO[];
  page: number;
  pages: number;
  onView: (file: FileDTO) => void;
  onRedo: (file: FileDTO) => void;
  onDelete: (file: FileDTO) => void;
  onPage: (page: number) => void;
  onFileListSelectedChange: (fileIds: string[]) => void;
  maxWidth?: string;
  reprocessingFiles: Set<string>;
}

const statusColorMap: Record<
  Status_Enum,
  "default" | "primary" | "secondary" | "success" | "danger" | "warning"
> = {
  [Status_Enum.Uploaded]: "default",
  [Status_Enum.Chunked]: "primary",
  [Status_Enum.Extracted]: "secondary",
  [Status_Enum.Indexed]: "success",
  [Status_Enum.Failed]: "danger",
  [Status_Enum.Running]: "secondary",
  [Status_Enum.Success]: "success",
  [Status_Enum.Processing]: "warning",
};

const FileTable: FC<FileTableProps> = ({
  files,
  page,
  pages,
  onView,
  onRedo,
  onDelete,
  onPage,
  onFileListSelectedChange,
  maxWidth = "1280px",
  reprocessingFiles,
}) => {
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: "updateTime",
    direction: "descending",
  });

  const sortedFiles = useMemo(() => {
    return [...files].sort((a, b) => {
      const first = a[sortDescriptor.column as keyof FileDTO];
      const second = b[sortDescriptor.column as keyof FileDTO];
      const cmp = first < second ? -1 : first > second ? 1 : 0;
      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [files, sortDescriptor]);

  const t = useTranslations();

  const handleSelectionChange = useCallback(
    (keys: Selection) => {
      let fileIds: string[];

      if (keys === "all") {
        fileIds = files.map((file) => file.id);
      } else if (keys instanceof Set) {
        fileIds = Array.from(keys).map((key) => key.toString());
      } else {
        console.error("Unexpected keys type:", keys);
        fileIds = [];
      }
      onFileListSelectedChange(fileIds);
    },
    [files, onFileListSelectedChange],
  );

  const columns = [
    { name: t("Name"), uid: "name", sortable: true },
    { name: t("Size"), uid: "size", sortable: true },
    { name: t("Status"), uid: "status" },
    { name: t("Update Time"), uid: "updateTime", sortable: true },
    { name: t("Action"), uid: "actions" },
  ];
  const renderCell = useCallback(
    (file: FileDTO, columnKey: React.Key) => {
      switch (columnKey) {
        case "name":
          return (
            <div className="max-w-[200px] truncate text-center" title={file.name}>
              {file.name}
            </div>
          );
        case "size":
          const sizeInKB = file.size / 1024;
          if (sizeInKB < 1024) {
            return <div className="text-center">{`${sizeInKB.toFixed(2)} KB`}</div>;
          } else {
            const sizeInMB = sizeInKB / 1024;
            return <div className="text-center">{`${sizeInMB.toFixed(2)} MB`}</div>;
          }
        case "status":
          return (
            <div className="flex justify-center">
              <Tooltip
                classNames={{
                  base: "max-w-xs",
                  content: "break-words text-sm",
                }}
                content={
                  file.status === Status_Enum.Failed ? file.errorMessage : file.status
                }
                color={file.status === Status_Enum.Failed ? "danger" : "default"}>
                <Chip
                  className="capitalize"
                  color={statusColorMap[file.status]}
                  size="sm"
                  variant="flat">
                  {file.status}
                </Chip>
              </Tooltip>
            </div>
          );
        case "updateTime":
          return (
            <div
              className="max-w-[150px] truncate text-center"
              title={new Date(file.updateTime).toLocaleString()}>
              {new Date(file.updateTime).toLocaleString()}
            </div>
          );
        case "actions":
          return (
            <div className="flex items-center justify-center gap-1">
              <Tooltip content="Copy">
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    navigator.clipboard.writeText(`${file.name}(${file.id})`);
                  }}>
                  <Icon icon="lets-icons:copy" className="text-lg" />
                </Button>
              </Tooltip>
              <Tooltip content="View">
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onView(file);
                  }}>
                  <Icon icon="lets-icons:view" className="text-lg" />
                </Button>
              </Tooltip>
              <Tooltip
                content={
                  reprocessingFiles.has(file.id)
                    ? `${t("Reprocessing")}...`
                    : t("Reprocess")
                }>
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  isDisabled={reprocessingFiles.has(file.id)}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (!reprocessingFiles.has(file.id)) onRedo(file);
                  }}>
                  <Icon
                    icon={
                      reprocessingFiles.has(file.id) ? "eos-icons:loading" : "fad:redo"
                    }
                    className="text-lg"
                  />
                </Button>
              </Tooltip>
              <Tooltip color="danger" content="Delete">
                <Button
                  isIconOnly
                  size="sm"
                  color="danger"
                  variant="light"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onDelete(file);
                  }}>
                  <Icon icon="openmoji:delete" className="text-lg" />
                </Button>
              </Tooltip>
            </div>
          );
        default:
          return <div className="text-center">{file[columnKey as keyof FileDTO]}</div>;
      }
    },
    [onView, onRedo, onDelete, reprocessingFiles],
  );

  return (
    <Table
      aria-label="File table with custom cells"
      sortDescriptor={sortDescriptor}
      onSortChange={setSortDescriptor}
      selectionMode="multiple"
      onSelectionChange={handleSelectionChange}
      classNames={{
        base: `max-w-[${maxWidth}]`,
      }}
      bottomContent={
        <div className="flex w-full justify-center">
          <Pagination
            isCompact
            showControls
            showShadow
            color="secondary"
            page={page}
            total={pages}
            onChange={(page) => onPage(page)}
          />
        </div>
      }>
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn key={column.uid} align="center" allowsSorting={column.sortable}>
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody items={sortedFiles} emptyContent={t("No files found")}>
        {(file) => (
          <TableRow key={file.id}>
            {(columnKey) => <TableCell>{renderCell(file, columnKey)}</TableCell>}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default FileTable;
