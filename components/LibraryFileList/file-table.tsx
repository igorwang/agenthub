import { Status_Enum } from "@/graphql/generated/types";
import { Icon } from "@iconify/react";
import {
  Chip,
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
}

interface FileTableProps {
  files: FileDTO[];
  onView: (file: FileDTO) => void;
  onEdit: (file: FileDTO) => void;
  onDelete: (file: FileDTO) => void;
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
  "default" | "primary" | "secondary" | "success"
> = {
  [Status_Enum.Chunked]: "default",
  [Status_Enum.Extracted]: "primary",
  [Status_Enum.Indexed]: "secondary",
  [Status_Enum.Uploaded]: "success",
};

const FileTable: FC<FileTableProps> = ({ files, onView, onEdit, onDelete }) => {
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
          return <div>{file.name}</div>;
        case "size":
          return `${(file.size / 1024 / 1024).toFixed(2)} MB`;
        case "status":
          return (
            <Chip
              className="capitalize"
              color={statusColorMap[file.status]}
              size="sm"
              variant="flat">
              {file.status}
            </Chip>
          );
        case "updateTime":
          return new Date(file.updateTime).toLocaleString();
        case "actions":
          return (
            <div className="relative flex items-center gap-2">
              <Tooltip content="View">
                <span
                  className="cursor-pointer text-lg text-default-400 active:opacity-50"
                  onClick={() => onView(file)}>
                  <Icon icon={"lets-icons:view"} />
                </span>
              </Tooltip>
              <Tooltip content="Edit">
                <span
                  className="cursor-pointer text-lg text-default-400 active:opacity-50"
                  onClick={() => onEdit(file)}>
                  <Icon icon={"bx:edit"} />
                </span>
              </Tooltip>
              <Tooltip color="danger" content="Delete">
                <span
                  className="cursor-pointer text-lg text-danger active:opacity-50"
                  onClick={() => onDelete(file)}>
                  <Icon icon={"openmoji:delete"} />
                </span>
              </Tooltip>
            </div>
          );
        default:
          return file[columnKey as keyof FileDTO];
      }
    },
    [onView, onEdit, onDelete],
  );

  return (
    <Table
      aria-label="File table with custom cells"
      sortDescriptor={sortDescriptor}
      onSortChange={setSortDescriptor}>
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn
            key={column.uid}
            align={column.uid === "actions" ? "center" : "start"}
            allowsSorting={column.sortable}>
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody items={sortedFiles}>
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
