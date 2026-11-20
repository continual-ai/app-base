import type { Key, MouseEvent, ReactNode } from "react";
import { HoverCard } from "radix-ui";
import { cn, stagger } from "@/lib/utils";
import { EmptyState, Skeleton } from "./states";

export type RecordColumn<T> = {
  id: string;
  header: string;
  cell: (record: T) => ReactNode;
  /** Right-align figures so they line up. */
  align?: "start" | "end";
  /**
   * Where the column goes on phones. By default the first column is the
   * row's title, the last sits beside it (usually the status), and the rest
   * show as small labeled values underneath.
   */
  phone?: "title" | "aside" | "meta" | "hidden";
};

/** Two or three labeled values per line on phones, so they never crowd. */
const metaColumns: Record<number, string> = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  4: "grid-cols-2",
};

function phonePlaces<T>(columns: readonly RecordColumn<T>[]) {
  return columns.map(
    (column, index) =>
      column.phone ??
      (index === 0 ? "title" : index === columns.length - 1 ? "aside" : "meta"),
  );
}

/** A click anywhere on a row opens it, unless it landed on another control. */
function openRow(event: MouseEvent<HTMLElement>) {
  const target = event.target as HTMLElement;
  if (target.closest("button, a, input, textarea, select, label")) return;
  event.currentTarget
    .querySelector<HTMLButtonElement>("[data-record-open]")
    ?.click();
}

/**
 * The primary list: a table on wide screens and compact rows on phones. Put
 * `RecordName` in the first column so the whole row opens the record and
 * shows as selected.
 */
export function RecordsTable<T>({
  records,
  columns,
  getRowKey,
  caption,
  emptyMessage = "Nothing here right now.",
  emptyDescription,
  emptyAction,
  loading = false,
}: {
  records: readonly T[];
  columns: readonly RecordColumn<T>[];
  getRowKey: (record: T) => Key;
  caption: string;
  /** The empty state's title, e.g. "No invoices need a reminder". */
  emptyMessage?: string;
  emptyDescription?: string;
  /** The one action that helps, e.g. a Button that clears the filter. */
  emptyAction?: ReactNode;
  /** Show placeholder rows while records load. */
  loading?: boolean;
}) {
  const places = phonePlaces(columns);
  const placed = (place: string) =>
    columns.filter((_, index) => places[index] === place);

  if (!loading && records.length === 0)
    return (
      <div className="rounded-xl bg-card shadow-surface">
        <EmptyState
          action={emptyAction}
          description={emptyDescription}
          title={emptyMessage}
        />
      </div>
    );

  const placeholders = Array.from({ length: 5 }, (_, index) => index);

  return (
    <div
      aria-busy={loading || undefined}
      className="min-w-0 overflow-hidden rounded-xl bg-card shadow-surface"
    >
      <div className="hidden min-w-0 overflow-x-auto md:block">
        <table className="w-full border-collapse text-small">
          <caption className="sr-only">{caption}</caption>
          <thead>
            <tr className="border-b border-line">
              {columns.map((column) => (
                <th
                  className={cn(
                    "h-8 px-3 text-caption font-normal whitespace-nowrap text-muted-foreground first:pl-4 last:pr-4",
                    column.align === "end" ? "text-right" : "text-left",
                  )}
                  key={column.id}
                  scope="col"
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading
              ? placeholders.map((row) => (
                  <tr className="border-b border-line last:border-0" key={row}>
                    {columns.map((column, index) => (
                      <td
                        className="px-3 py-3.5 first:pl-5 last:pr-5"
                        key={column.id}
                      >
                        <Skeleton
                          className={cn(
                            "h-3.5",
                            index === 0 ? "w-36" : "w-16",
                            column.align === "end" && "ml-auto",
                          )}
                        />
                      </td>
                    ))}
                  </tr>
                ))
              : records.map((record, index) => (
                  <tr
                    className="group/row cursor-pointer border-b border-line transition-colors duration-150 ease-kit last:border-0 hover:bg-row-hover has-[[aria-current=true]]:bg-row-selected motion-safe:animate-kit-stagger"
                    key={getRowKey(record)}
                    style={stagger(index)}
                    onClick={openRow}
                  >
                    {columns.map((column) => (
                      <td
                        className={cn(
                          "h-11 px-3 py-2 align-middle wrap-anywhere text-foreground first:pl-4 first:transition-shadow last:pr-4 first:group-has-[[aria-current=true]]/row:shadow-[inset_2px_0_0_var(--brand)]",
                          column.align === "end" && "text-right tabular-nums",
                        )}
                        key={column.id}
                      >
                        {column.cell(record)}
                      </td>
                    ))}
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      <ul aria-label={caption} className="min-w-0 divide-y md:hidden">
        {loading
          ? placeholders.map((row) => (
              <li className="grid gap-2.5 px-4 py-4" key={row}>
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-56" />
              </li>
            ))
          : records.map((record, index) => (
              <li
                className="min-w-0 cursor-pointer px-4 py-3.5 transition-colors duration-150 ease-kit active:bg-row-hover has-[[aria-current=true]]:bg-row-selected has-[[aria-current=true]]:shadow-[inset_2px_0_0_var(--brand)] motion-safe:animate-kit-stagger"
                key={getRowKey(record)}
                style={stagger(index)}
                onClick={openRow}
              >
                <div className="flex min-w-0 items-start justify-between gap-3">
                  <div className="min-w-0 flex-1 text-small">
                    {placed("title").map((column) => (
                      <div className="min-w-0" key={column.id}>
                        {column.cell(record)}
                      </div>
                    ))}
                  </div>
                  {placed("aside").map((column) => (
                    <div className="shrink-0" key={column.id}>
                      {column.cell(record)}
                    </div>
                  ))}
                </div>
                {placed("meta").length ? (
                  <dl
                    className={cn(
                      "mt-2.5 grid gap-x-4 gap-y-2",
                      metaColumns[placed("meta").length] ?? "grid-cols-3",
                    )}
                  >
                    {placed("meta").map((column) => (
                      <div className="min-w-0" key={column.id}>
                        <dt className="truncate text-caption text-muted-foreground">
                          {column.header}
                        </dt>
                        <dd className="text-small wrap-anywhere tabular-nums">
                          {column.cell(record)}
                        </dd>
                      </div>
                    ))}
                  </dl>
                ) : null}
              </li>
            ))}
      </ul>
    </div>
  );
}

/** A record's name and second line, as the button that opens it. */
export function RecordName({
  name,
  detail,
  selected,
  onOpen,
  preview,
}: {
  name: string;
  detail?: string;
  selected?: boolean;
  onOpen: () => void;
  /** A few key fields, shown in a card when the pointer rests on the name. */
  preview?: [label: string, value: ReactNode][];
}) {
  const button = (
    <button
      aria-current={selected ? "true" : undefined}
      className="block w-full min-w-0 rounded-sm text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
      data-record-open=""
      onClick={onOpen}
      type="button"
    >
      <span className="block text-small font-medium text-strong wrap-anywhere">
        {name}
      </span>
      {detail ? (
        <span className="mt-0.5 block text-caption text-muted-foreground wrap-anywhere">
          {detail}
        </span>
      ) : null}
    </button>
  );
  if (!preview?.length) return button;
  return (
    <HoverCard.Root closeDelay={80} openDelay={450}>
      <HoverCard.Trigger asChild>{button}</HoverCard.Trigger>
      <HoverCard.Portal>
        <HoverCard.Content
          align="start"
          className="z-40 w-80 rounded-xl bg-popover p-4 text-popover-foreground shadow-raised motion-safe:animate-kit-enter"
          side="bottom"
          sideOffset={8}
        >
          <p className="text-small font-medium text-strong">{name}</p>
          {detail ? (
            <p className="text-caption text-muted-foreground">{detail}</p>
          ) : null}
          <dl className="mt-3 grid gap-1.5 text-caption">
            {preview.map(([label, value]) => (
              <div
                className="grid grid-cols-[5.5rem_minmax(0,1fr)] gap-2"
                key={label}
              >
                <dt className="text-muted-foreground">{label}</dt>
                <dd className="wrap-anywhere">{value}</dd>
              </div>
            ))}
          </dl>
        </HoverCard.Content>
      </HoverCard.Portal>
    </HoverCard.Root>
  );
}
