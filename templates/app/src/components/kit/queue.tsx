import { useEffect, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { KitIcon } from "./icons";
import { StatusPill } from "./status-pill";
import type { Tone } from "./tones";

export type QueueItem = {
  id: string;
  title: string;
  detail?: string;
  /** A short figure on the right, e.g. "$2,650". */
  meta?: ReactNode;
  status?: { tone: Tone; label: string };
  /** Where its draft stands; "none" when nothing was drafted. */
  state: "pending" | "approved" | "skipped" | "none";
};

const marker = {
  pending: "bg-brand ring-3 ring-brand-soft",
  approved: "bg-tone-green-soft text-tone-green",
  skipped: "bg-tone-gray-soft text-tone-gray",
  none: "",
};

/**
 * An inbox of things to review, one open at a time beside it. Pending items
 * carry the accent dot; decided ones a check, so progress shows at a glance.
 */
export function QueueList({
  items,
  selectedId,
  onSelect,
  caption,
}: {
  items: readonly QueueItem[];
  selectedId?: string;
  onSelect: (id: string) => void;
  caption: string;
}) {
  return (
    <ul
      aria-label={caption}
      className="divide-y overflow-hidden rounded-xl bg-card shadow-surface"
    >
      {items.map((item) => {
        const selected = item.id === selectedId;
        return (
          <li key={item.id}>
            <button
              aria-current={selected ? "true" : undefined}
              className={cn(
                "flex w-full min-w-0 items-start gap-3 px-4 py-3.5 text-left transition-colors duration-150 ease-kit hover:bg-row-hover focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring",
                selected &&
                  "bg-row-selected shadow-[inset_2px_0_0_var(--brand)] hover:bg-row-selected",
              )}
              data-record-open=""
              onClick={() => onSelect(item.id)}
              type="button"
            >
              <span className="mt-1 flex size-4 shrink-0 items-center justify-center">
                {item.state === "none" ? null : (
                  <span
                    className={cn(
                      "flex items-center justify-center rounded-full",
                      item.state === "pending" ? "size-2" : "size-4",
                      marker[item.state],
                    )}
                  >
                    {item.state === "pending" ? null : (
                      <KitIcon
                        className="size-2.5 motion-safe:animate-kit-enter"
                        name={item.state === "approved" ? "check" : "skip"}
                      />
                    )}
                  </span>
                )}
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-baseline justify-between gap-3">
                  <span
                    className={cn(
                      "truncate text-small font-medium",
                      item.state === "approved" || item.state === "skipped"
                        ? "text-muted-foreground"
                        : "text-foreground",
                    )}
                  >
                    {item.title}
                  </span>
                  {item.meta ? (
                    <span className="shrink-0 text-small tabular-nums">
                      {item.meta}
                    </span>
                  ) : null}
                </span>
                <span className="mt-0.5 flex items-center justify-between gap-3">
                  <span className="truncate text-caption text-muted-foreground">
                    {item.detail}
                  </span>
                  {item.status ? <StatusPill {...item.status} /> : null}
                </span>
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

/** "3 of 7 reviewed" with a thin bar. */
export function QueueProgress({
  done,
  total,
}: {
  done: number;
  total: number;
}) {
  const share = total ? done / total : 1;
  return (
    <div className="inline-flex h-7 items-center gap-2.5 rounded-md bg-card px-2.5 shadow-surface">
      <span className="text-caption font-medium text-muted-foreground tabular-nums">
        {done} of {total} reviewed
      </span>
      <span
        aria-hidden="true"
        className="h-1.5 w-16 overflow-hidden rounded-full bg-fill"
      >
        <span
          className="block h-full rounded-full bg-brand transition-[width] duration-300 ease-kit"
          style={{ width: `${share * 100}%` }}
        />
      </span>
    </div>
  );
}

/**
 * Keyboard review: j and k move through the queue, a approves the open item.
 * Ignored while typing in a field or with a modifier held.
 */
export function useQueueKeys({
  ids,
  selectedId,
  onSelect,
  onApprove,
}: {
  ids: readonly string[];
  selectedId?: string;
  onSelect: (id: string) => void;
  onApprove?: () => void;
}) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (
        event.metaKey ||
        event.ctrlKey ||
        event.altKey ||
        target?.closest("input, textarea, select, [contenteditable=true]")
      )
        return;
      const index = selectedId ? ids.indexOf(selectedId) : -1;
      if (event.key === "j") {
        const next = ids[Math.min(ids.length - 1, index + 1)];
        if (next) {
          event.preventDefault();
          onSelect(next);
        }
      } else if (event.key === "k") {
        const previous = ids[Math.max(0, index - 1)];
        if (previous) {
          event.preventDefault();
          onSelect(previous);
        }
      } else if (event.key === "a" && onApprove) {
        event.preventDefault();
        onApprove();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [ids, selectedId, onSelect, onApprove]);
}
