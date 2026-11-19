import type { Key, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Avatar } from "./people";
import { StatusPill } from "./status-pill";
import { toneDot, type Tone } from "./tones";

export type BoardColumn<T> = {
  id: string;
  label: string;
  tone?: Tone;
  records: readonly T[];
};

/**
 * Work in stages: one column per stage with its count, compact cards in each.
 * Columns sit side by side and scroll sideways inside the board when they do
 * not fit; on phones the stages stack as one grouped list.
 */
export function BoardView<T>({
  columns,
  getRowKey,
  renderCard,
  caption,
  emptyLabel = "Nothing here",
}: {
  columns: readonly BoardColumn<T>[];
  getRowKey: (record: T) => Key;
  renderCard: (record: T) => ReactNode;
  caption: string;
  emptyLabel?: string;
}) {
  return (
    <div
      aria-label={caption}
      className="min-w-0 sm:-mx-6 sm:snap-x sm:snap-mandatory sm:scroll-px-6 sm:overflow-x-auto sm:px-6 sm:pb-3 sm:[scrollbar-width:thin]"
      role="region"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
        {columns.map((column) => (
          <section
            aria-label={`${column.label}, ${column.records.length}`}
            className="w-full shrink-0 snap-start rounded-3xl bg-tray p-1 sm:w-72 lg:min-w-64 lg:flex-1"
            key={column.id}
          >
            <header className="flex items-center gap-2 px-2 pt-1.5 pb-2.5">
              {column.tone ? (
                <span
                  aria-hidden="true"
                  className={cn("size-2 rounded-full", toneDot[column.tone])}
                />
              ) : null}
              <h3 className="truncate text-small font-medium text-strong">
                {column.label}
              </h3>
              <span className="ml-auto rounded-sm bg-fill px-1.5 text-caption font-medium text-muted-foreground tabular-nums shadow-surface">
                {column.records.length}
              </span>
            </header>
            {column.records.length ? (
              <ul className="grid gap-1.5">
                {column.records.map((record) => (
                  <li key={getRowKey(record)}>{renderCard(record)}</li>
                ))}
              </ul>
            ) : (
              <p className="rounded-xl border border-dashed border-input px-3 py-6 text-center text-caption text-muted-foreground">
                {emptyLabel}
              </p>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}

/** One record on a board: its name, a line of context, status and owner. */
export function BoardCard({
  title,
  detail,
  meta,
  status,
  person,
  waiting,
  selected,
  onOpen,
}: {
  title: string;
  detail?: string;
  /** A short figure or date shown at the bottom, e.g. "$12,400" or "Nov 21". */
  meta?: ReactNode;
  status?: { tone: Tone; label: string };
  /** Who owns it; shown as their avatar. */
  person?: string;
  /** Something is drafted and waiting for review. */
  waiting?: boolean;
  selected?: boolean;
  onOpen: () => void;
}) {
  return (
    <button
      aria-current={selected ? "true" : undefined}
      className="group block w-full rounded-xl bg-card p-3 text-left shadow-surface transition-[box-shadow,transform] duration-150 ease-kit hover:shadow-surface-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring aria-[current=true]:ring-2 aria-[current=true]:ring-brand motion-reduce:hover:translate-y-0"
      data-record-open=""
      onClick={onOpen}
      type="button"
    >
      <span className="flex items-start justify-between gap-2">
        <span className="min-w-0 text-small font-medium wrap-anywhere">
          {title}
        </span>
        {waiting ? (
          <span
            className="mt-1.5 size-2 shrink-0 rounded-full bg-brand ring-3 ring-brand-soft"
            title="Draft waiting for review"
          />
        ) : null}
      </span>
      {detail ? (
        <span className="mt-0.5 line-clamp-2 block text-caption text-muted-foreground">
          {detail}
        </span>
      ) : null}
      {status || meta || person ? (
        <span className="mt-3 flex items-center gap-2">
          {status ? <StatusPill {...status} /> : null}
          {meta ? (
            <span className="min-w-0 truncate text-caption text-muted-foreground tabular-nums">
              {meta}
            </span>
          ) : null}
          {person ? (
            <span className="ml-auto" title={person}>
              <Avatar name={person} size="sm" />
            </span>
          ) : null}
        </span>
      ) : null}
    </button>
  );
}
