import {
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";

const SessionTableSkeleton = () => {
  return (
    <Table
      aria-label="Session table loading skeleton"
      classNames={{
        wrapper: "min-h-[200px]",
      }}>
      <TableHeader>
        {Array(5)
          .fill(null)
          .map((_, index) => (
            <TableColumn key={index} align="center">
              <Skeleton className="w-3/4 rounded-lg">
                <div className="h-3 w-3/4 rounded-lg bg-default-200"></div>
              </Skeleton>
            </TableColumn>
          ))}
      </TableHeader>
      <TableBody>
        {Array(5)
          .fill(null)
          .map((_, rowIndex) => (
            <TableRow key={rowIndex}>
              {Array(5)
                .fill(null)
                .map((_, cellIndex) => (
                  <TableCell key={cellIndex}>
                    <Skeleton className="w-full rounded-lg">
                      <div className="h-3 w-full rounded-lg bg-default-200"></div>
                    </Skeleton>
                  </TableCell>
                ))}
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
};

export default SessionTableSkeleton;
