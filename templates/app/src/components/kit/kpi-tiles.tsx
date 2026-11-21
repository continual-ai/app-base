import { cn } from "@/lib/utils";
import { KitIcon } from "./icons";
import { Skeleton } from "./states";
import type { Tone } from "./tones";
import { Sparkline } from "./values";

/** Up to three tiles share a row; four make a 2 by 2 grid on phones. */
const columns: Record<number, string> = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-2 sm:grid-cols-4",
};

const trendText: Record<Tone, string> = {
  red: "bg-tone-red-soft text-tone-red",
  amber: "bg-tone-amber-soft text-tone-amber",
  green: "bg-tone-green-soft text-tone-green",
  blue: "bg-tone-blue-soft text-tone-blue",
  gray: "bg-tone-gray-soft text-tone-gray",
};

export type KpiTile = {
  label: string;
  value: string;
  note?: string;
  /** Which way the number moved; the note says by how much. */
  trend?: "up" | "down";
  /** Color the trend only when its direction is plainly good or bad. */
  tone?: Tone;
  /** Recent values, oldest first, drawn as a sparkline. */
  spark?: number[];
};

/**
 * The few numbers that matter most, each with a short note, on one surface.
 * Keep it to two to four. `stacked` lists them in one column beside a hero
 * chart on wide screens. Pass `loading` for placeholders while they load.
 */
export function KpiTiles({
  items,
  loading = false,
  stacked = false,
}: {
  items: KpiTile[];
  loading?: boolean;
  stacked?: boolean;
}) {
  return (
    <dl
      aria-busy={loading || undefined}
      className={cn(
        "grid gap-3",
        columns[items.length] ??
          "grid-cols-[repeat(auto-fit,minmax(9rem,1fr))]",
        stacked && "xl:grid-cols-1",
      )}
    >
      {items.map(({ label, value, note, trend, tone = "gray", spark }) => (
        <div
          className="flex min-w-0 flex-col rounded-xl bg-card px-4 py-3.5 shadow-surface"
          key={label}
        >
          <dt className="truncate text-small text-soft">{label}</dt>
          {loading ? (
            <dd className="mt-2">
              <Skeleton className="h-7 w-20" />
              <Skeleton className="mt-2 hidden h-3 w-28 sm:block" />
            </dd>
          ) : (
            <>
              <dd className="mt-1 flex min-w-0 items-end justify-between gap-3 sm:mt-1.5">
                <span className="truncate text-display font-medium text-strong tabular-nums">
                  {value}
                </span>
                {spark ? (
                  <Sparkline
                    className="mb-1 hidden shrink-0 sm:block"
                    values={spark}
                  />
                ) : null}
              </dd>
              {note ? (
                <dd className="mt-1.5 hidden min-w-0 items-center gap-1.5 text-caption text-muted-foreground sm:flex">
                  {trend ? (
                    <span
                      className={cn(
                        "inline-flex h-4.5 items-center rounded-xs px-1",
                        trendText[tone],
                      )}
                    >
                      <KitIcon
                        name={trend === "up" ? "arrowUp" : "arrowDown"}
                        className="size-3"
                      />
                    </span>
                  ) : null}
                  <span className="truncate">{note}</span>
                </dd>
              ) : null}
            </>
          )}
        </div>
      ))}
    </dl>
  );
}
