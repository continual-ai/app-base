import { cn } from "@/lib/utils";
import {
  formatFullDate,
  formatRelative,
  parseDelta,
  parseShortDate,
} from "./format";
import { KitIcon } from "./icons";

/** A day as "3 days ago" or "In 2 weeks", with the exact date on hover. */
export function RelativeDate({ value }: { value: string }) {
  const date = parseShortDate(value);
  if (!date) return <>{value}</>;
  return (
    <time
      className="underline decoration-current/20 decoration-dotted underline-offset-4"
      dateTime={date.toISOString().slice(0, 10)}
      title={formatFullDate(date)}
    >
      {formatRelative(date)}
    </time>
  );
}

/**
 * A signed change ("+12%", "-$400") with its direction. Say whether up is
 * good; leave `goodWhen` out when neither direction is plainly better.
 */
export function Delta({
  value,
  goodWhen,
  className,
}: {
  value: string;
  goodWhen?: "up" | "down";
  className?: string;
}) {
  const direction = parseDelta(value);
  if (!direction) return <span className={className}>{value}</span>;
  const tone =
    direction === "flat" || !goodWhen
      ? "text-muted-foreground"
      : direction === goodWhen
        ? "text-tone-green"
        : "text-tone-red";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 font-medium tabular-nums",
        tone,
        className,
      )}
    >
      {direction === "flat" ? null : (
        <KitIcon
          name={direction === "up" ? "arrowUp" : "arrowDown"}
          className="size-3.5"
        />
      )}
      {value.replace(/^[+\-−]\s?/, "")}
    </span>
  );
}

/** A tiny trend line for a tile: no axis, just the shape and the last point. */
export function Sparkline({
  values,
  className,
  color = "var(--brand)",
}: {
  values: number[];
  className?: string;
  color?: string;
}) {
  if (values.length < 2) return null;
  const width = 96;
  const height = 28;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const points = values.map((value, index) => [
    (index / (values.length - 1)) * (width - 4) + 2,
    height - 3 - ((value - min) / range) * (height - 6),
  ]);
  const line = points.map(([x, y]) => `${x},${y}`).join(" ");
  const [lastX, lastY] = points[points.length - 1];
  return (
    <svg
      aria-hidden="true"
      className={cn("h-7 w-24 overflow-visible", className)}
      viewBox={`0 0 ${width} ${height}`}
    >
      <polygon
        fill={color}
        fillOpacity={0.08}
        points={`2,${height} ${line} ${width - 2},${height}`}
      />
      <polyline
        fill="none"
        points={line}
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.75"
      />
      <circle cx={lastX} cy={lastY} fill={color} r="2.5" />
    </svg>
  );
}
