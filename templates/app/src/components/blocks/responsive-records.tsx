import type { Key, ReactNode } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export type RecordColumn<T> = {
  id: string;
  header: string;
  cell: (record: T) => ReactNode;
};

/** Put the identifying column first; keep primary lists compact on phones. */
export function ResponsiveRecords<T>({
  records,
  columns,
  getRowKey,
  caption,
  emptyMessage = "No records yet.",
}: {
  records: readonly T[];
  columns: readonly RecordColumn<T>[];
  getRowKey: (record: T) => Key;
  caption: string;
  emptyMessage?: string;
}) {
  if (records.length === 0)
    return <p className="p-4 text-sm text-muted-foreground">{emptyMessage}</p>;
  return (
    <div className="w-full min-w-0">
      <div className="hidden min-w-0 md:block">
        <Table aria-label={caption}>
          <TableCaption className="sr-only">{caption}</TableCaption>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.id}>{column.header}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {records.map((record) => (
              <TableRow key={getRowKey(record)}>
                {columns.map((column) => (
                  <TableCell key={column.id} className="wrap-anywhere">
                    {column.cell(record)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <ul
        aria-label={caption}
        className="min-w-0 divide-y rounded-lg border md:hidden"
      >
        {records.map((record) => (
          <li key={getRowKey(record)} className="min-w-0 p-4">
            <dl className="grid min-w-0 gap-2 text-sm">
              {columns.map((column, index) => (
                <div
                  key={column.id}
                  className="grid min-w-0 grid-cols-[minmax(0,1fr)_minmax(0,2fr)] gap-3"
                >
                  <dt className="min-w-0 wrap-anywhere text-muted-foreground">
                    {column.header}
                  </dt>
                  <dd
                    className={
                      index === 0
                        ? "min-w-0 wrap-anywhere font-medium"
                        : "min-w-0 wrap-anywhere"
                    }
                  >
                    {column.cell(record)}
                  </dd>
                </div>
              ))}
            </dl>
          </li>
        ))}
      </ul>
    </div>
  );
}
