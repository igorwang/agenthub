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
  const columnWidth = `${100 / columns.length}%`;

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full table-fixed border-collapse border border-gray-300 bg-white">
        <thead>
          <tr className="bg-gray-100">
            {columns.map((column) => (
              <th
                key={column.key}
                className="border-b px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider text-gray-700"
                style={{ width: columnWidth }}>
                <div className="break-words">{column.label}</div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex} className={rowIndex % 2 === 0 ? "bg-gray-50" : "bg-white"}>
              {columns.map((column) => (
                <td
                  key={`${rowIndex}-${column.key}`}
                  className="px-4 py-4 text-sm text-gray-900"
                  style={{ width: columnWidth }}>
                  <div className="max-h-[120px] min-h-[80px] overflow-y-auto break-words">
                    {row[column.key]}
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
