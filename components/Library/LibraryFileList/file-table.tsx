import { Status_Enum } from "@/graphql/generated/types";
import { Icon } from "@iconify/react";
import {
  Chip,
  Pagination,
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
  maxWidth?: string;
  reprocessingFiles: Set<string>;
}

const columns = [
  { name: "Name", uid: "name", sortable: true },
  { name: "Size", uid: "size", sortable: true },
  { name: "Status", uid: "status" },
  { name: "Update Time", uid: "updateTime", sortable: true },
  { name: "Action", uid: "actions" },
];

const statusColorMap: Record<
  Status_Enum,
  "default" | "primary" | "secondary" | "success" | "danger"
> = {
  [Status_Enum.Uploaded]: "default",
  [Status_Enum.Chunked]: "primary",
  [Status_Enum.Extracted]: "secondary",
  [Status_Enum.Indexed]: "success",
  [Status_Enum.Failed]: "danger",
};

const FileTable: FC<FileTableProps> = ({
  files,
  page,
  pages,
  onView,
  onRedo,
  onDelete,
  onPage,
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
          return (
            <div className="text-center">{`${(file.size / 1024 / 1024).toFixed(2)} MB`}</div>
          );
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
            <div className="flex items-center justify-center gap-2">
              <Tooltip content="View">
                <span
                  className="cursor-pointer text-lg text-default-400 active:opacity-50"
                  onClick={() => onView(file)}>
                  <Icon icon="lets-icons:view" />
                </span>
              </Tooltip>
              <Tooltip
                content={
                  reprocessingFiles.has(file.id) ? "Reprocessing..." : "Reprocess"
                }>
                <span
                  className={`cursor-pointer text-lg ${
                    reprocessingFiles.has(file.id)
                      ? "text-default-300"
                      : "text-default-400"
                  } ${reprocessingFiles.has(file.id) ? "" : "active:opacity-50"}`}
                  onClick={() => !reprocessingFiles.has(file.id) && onRedo(file)}>
                  <Icon
                    icon={
                      reprocessingFiles.has(file.id) ? "eos-icons:loading" : "fad:redo"
                    }
                  />
                </span>
              </Tooltip>
              <Tooltip color="danger" content="Delete">
                <span
                  className="cursor-pointer text-lg text-danger active:opacity-50"
                  onClick={() => onDelete(file)}>
                  <Icon icon="openmoji:delete" />
                </span>
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
      <TableBody items={sortedFiles} emptyContent={"No files found"}>
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
