import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { LoadingSpinner } from "@/shared/components/common/LoadingSpinner";
import { cn } from "@/shared/lib/utils";

export interface ColumnDef<T> {
  header: string;
  accessorKey?: keyof T & string;
  cell?: (row: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  emptyState?: React.ReactNode;
  loading?: boolean;
  striped?: boolean;
  className?: string;
}

export function DataTable<T>({
  columns,
  data,
  emptyState,
  loading = false,
  striped = false,
  className,
}: DataTableProps<T>) {
  if (loading) {
    return (
      <div className="flex min-h-[200px] items-center justify-center">
        <LoadingSpinner label="Loading data..." />
      </div>
    );
  }

  if (data.length === 0 && emptyState) {
    return <>{emptyState}</>;
  }

  return (
    <Table className={className}>
      <TableHeader>
        <TableRow>
          {columns.map((col) => (
            <TableHead key={col.header} className={col.className}>
              {col.header}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((row, i) => (
          <TableRow
            key={i}
            className={cn(striped && i % 2 === 1 && "bg-muted/30")}
          >
            {columns.map((col) => (
              <TableCell key={col.header} className={col.className}>
                {col.cell
                  ? col.cell(row)
                  : col.accessorKey
                    ? String(row[col.accessorKey] ?? "")
                    : null}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
