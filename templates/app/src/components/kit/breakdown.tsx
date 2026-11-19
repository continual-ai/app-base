import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type BreakdownPart = {
  label: string;
  value: number;
  /** How the value reads, e.g. "$12,750". */
  display: string;
  /** A CSS color, e.g. "var(--chart-2)". `hatched` draws it striped, for parts on hold. */
  color: string;
  hatched?: boolean;
};

/**
 * How a total splits: one stacked bar, then each part with its share and
 * amount. For "what's owed by age" or "where the time went". Keep it to
 * five parts or fewer.
 */
export function Breakdown({
  title,
  total,
  parts,
  className,
}: {
  title: ReactNode;
  /** The total as it reads, e.g. "$19,500". */
  total?: string;
  parts: BreakdownPart[];
  className?: string;
}) {
  const sum = parts.reduce((all, part) => all + part.value, 0) || 1;
  const fill = (part: BreakdownPart) =>
    part.hatched
      ? `repeating-linear-gradient(135deg, ${part.color} 0 3px, var(--fill) 3px 6px)`
      : part.color;
  return (
    <section className={cn("rounded-xl bg-card shadow-surface", className)}>
      <h2 className="flex min-h-11 items-center gap-2 border-b border-line px-4 text-small font-medium text-strong">
        {title}
        {total ? <span className="ml-auto tabular-nums">{total}</span> : null}
      </h2>
      <div className="px-4 pt-3.5 pb-1">
        <div aria-hidden="true" className="flex h-2.5 gap-0.5">
          {parts.map((part) => (
            <span
              className="h-full rounded-xs first:rounded-l-full last:rounded-r-full"
              key={part.label}
              style={{
                width: `${(part.value / sum) * 100}%`,
                background: fill(part),
              }}
            />
          ))}
        </div>
      </div>
      <ul className="px-4 pb-2">
        {parts.map((part) => (
          <li
            className="flex h-8 items-center gap-2 border-t border-line text-small first:border-0"
            key={part.label}
          >
            <span
              aria-hidden="true"
              className="size-2 shrink-0 rounded-xs"
              style={{ background: fill(part) }}
            />
            <span className="min-w-0 flex-1 truncate text-soft">
              {part.label}
            </span>
            <span className="w-10 text-right text-caption text-muted-foreground tabular-nums">
              {Math.round((part.value / sum) * 100)}%
            </span>
            <span className="w-20 text-right font-medium text-strong tabular-nums">
              {part.display}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
