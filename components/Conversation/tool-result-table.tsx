import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  getKeyValue,
} from "@nextui-org/react";

// 定义列的数据类型
export type ColumnType = {
  key: string;
  label: string;
};

// 定义行的数据类型
export type RowType = {
  key: string;
  [key: string]: any; // 允许任意其他字段
};

interface ToolResultTableProps {
  columns: ColumnType[];
  rows: RowType[];
}

export default function ToolResultTable({ columns, rows }: ToolResultTableProps) {
  return (
    <Table aria-label="Example table with dynamic content">
      <TableHeader columns={columns}>
        {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
      </TableHeader>
      <TableBody items={rows}>
        {(item) => (
          <TableRow key={item.key}>
            {(columnKey) => <TableCell>{getKeyValue(item, columnKey)}</TableCell>}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
