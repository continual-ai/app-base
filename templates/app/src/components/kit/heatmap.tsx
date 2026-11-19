import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** How strongly a cell is shaded: none, then four steps from mild to severe. `held` is striped. */
export type HeatLevel = 0 | 1 | 2 | 3 | 4 | "held";

const levelClass: Record<string, string> = {
  0: "bg-muted text-faint",
  1: "bg-tone-amber-soft text-tone-amber",
  2: "bg-tone-amber-dot/25 text-tone-amber",
  3: "bg-tone-red-dot/25 text-tone-red",
  4: "bg-tone-red-dot/45 text-strong",
  held: "bg-[repeating-linear-gradient(135deg,var(--fill)_0_3px,transparent_3px_6px)] text-muted-foreground shadow-[inset_0_0_0_0.5px_var(--line)]",
};

export type HeatRow = {
  label: ReactNode;
  /** One cell per column: what it says and how strong it is. */
  cells: { text: string; level: HeatLevel }[];
};

/**
 * One value per row per period, shaded by how bad it is, so the eye finds
 * what is getting worse. For "days late by client by week" and the like.
 * Give a `legend` that names each step.
 */
export function Heatmap({
  title,
  columns,
  rows,
  legend,
  className,
}: {
  title: ReactNode;
  /** Column labels, oldest first. */
  columns: string[];
  rows: HeatRow[];
  /** Labels for levels 1 to 4, and optionally for held cells. */
  legend?: { levels: [string, string, string, string]; held?: string };
  className?: string;
}) {
  const grid = {
    gridTemplateColumns: `minmax(6rem, 9rem) repeat(${columns.length}, minmax(2.25rem, 1fr))`,
  };
  return (
    <section className={cn("rounded-xl bg-card shadow-surface", className)}>
      <h2 className="flex min-h-11 flex-wrap items-center gap-x-4 gap-y-1 border-b border-line px-4 py-2 text-small font-medium text-strong">
        {title}
        {legend ? (
          <span className="ml-auto flex flex-wrap items-center gap-3 text-caption font-normal text-muted-foreground">
            {legend.levels.map((label, index) => (
              <span className="flex items-center gap-1.5" key={label}>
                <span
                  aria-hidden="true"
                  className={cn("size-2.5 rounded-xs", levelClass[index + 1])}
                />
                {label}
              </span>
            ))}
            {legend.held ? (
              <span className="flex items-center gap-1.5">
                <span
                  aria-hidden="true"
                  className={cn("size-2.5 rounded-xs", levelClass.held)}
                />
                {legend.held}
              </span>
            ) : null}
          </span>
        ) : null}
      </h2>
      <div className="overflow-x-auto px-4 pt-3 pb-3.5">
        <div
          className="grid min-w-max items-center gap-[3px]"
          role="table"
          style={grid}
        >
          {rows.map((row, rowIndex) => (
            <div className="contents" key={rowIndex} role="row">
              <span
                className="min-w-0 truncate pr-2 text-small text-foreground"
                role="rowheader"
              >
                {row.label}
              </span>
              {row.cells.map((cell, index) => (
                <span
                  className={cn(
                    "flex h-7 items-center justify-center rounded-sm text-caption font-medium tabular-nums",
                    levelClass[cell.level],
                  )}
                  key={index}
                  role="cell"
                >
                  {cell.text}
                </span>
              ))}
            </div>
          ))}
          <div className="contents" role="row">
            <span />
            {columns.map((column) => (
              <span
                className="pt-1 text-center text-caption text-muted-foreground"
                key={column}
                role="columnheader"
              >
                {column}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
