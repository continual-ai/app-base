import {
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";
import { chartColor, type Tone } from "./tones";

/** A small chart's data: one label per point, oldest first. */
export type ChartData = {
  title: string;
  kind: "line" | "bars";
  format: "currency" | "count" | "percent";
  labels: string[];
  series: { label: string; tone: Tone; values: number[] }[];
};

/** A chart value as it reads on screen: "$48,200", "1,284" or "12%". */
export function formatChartValue(value: number, format: ChartData["format"]) {
  const number = value.toLocaleString("en-US", { maximumFractionDigits: 1 });
  return format === "currency"
    ? `$${number}`
    : format === "percent"
      ? `${number}%`
      : number;
}

/** A short axis value: "$4.8k", "1.2k" or "12%". */
function formatAxisValue(value: number, format: ChartData["format"]) {
  const short =
    Math.abs(value) >= 1000
      ? `${(value / 1000).toLocaleString("en-US", { maximumFractionDigits: 1 })}k`
      : value.toLocaleString("en-US", { maximumFractionDigits: 1 });
  return format === "currency"
    ? `$${short}`
    : format === "percent"
      ? `${short}%`
      : short;
}

/** Rounds the axis up to a readable top value: 1, 2, 2.5 or 5 times a power of ten. */
function ceiling(max: number) {
  if (max <= 0) return 1;
  const power = 10 ** Math.floor(Math.log10(max));
  const step = [1, 2, 2.5, 5, 10].find((factor) => factor * power >= max)!;
  return step * power;
}

/** A bar with rounded top corners, standing on the baseline. */
function barPath(x: number, y: number, width: number, base: number) {
  const r = Math.min(3, width / 2, Math.max(0, base - y));
  return `M${x},${base}V${y + r}Q${x},${y} ${x + r},${y}H${x + width - r}Q${x + width},${y} ${x + width},${y + r}V${base}Z`;
}

/**
 * A small trend chart: recessive grid, labeled axis, a legend, and a
 * crosshair with values on hover or with the arrow keys.
 */
export function TrendChart({
  chart,
  size = "default",
  headline,
}: {
  chart: ChartData;
  /** `hero` is taller, for a reporting App where the chart leads. */
  size?: "default" | "hero";
  /** The number the chart is about, e.g. the latest total and its change. */
  headline?: { value: string; label?: string; delta?: ReactNode };
}) {
  const frame = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [active, setActive] = useState<number | null>(null);
  const gradient = useId();

  useEffect(() => {
    const element = frame.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) =>
      setWidth(Math.round(entry.contentRect.width)),
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const height =
    width && width < 520
      ? size === "hero"
        ? 196
        : 168
      : size === "hero"
        ? 280
        : 208;
  const top = ceiling(
    Math.max(...chart.series.flatMap((series) => series.values)),
  );
  const ticks = [0, 0.5, 1].map((share) => top * share);
  const left =
    Math.max(
      ...ticks.map((tick) => formatAxisValue(tick, chart.format).length),
    ) *
      6.5 +
    10;
  const right = 6;
  const plotTop = 10;
  const bottom = 26;
  const plotWidth = Math.max(0, width - left - right);
  const plotHeight = height - plotTop - bottom;
  const base = plotTop + plotHeight;
  const y = (value: number) => plotTop + plotHeight * (1 - value / top);
  const count = chart.labels.length;
  const slot = count ? plotWidth / count : 0;
  const x = (index: number) => left + slot * index + slot / 2;
  const groupWidth = Math.min(slot * 0.62, 22 * chart.series.length);
  const gap = chart.series.length > 1 ? 2 : 0;
  const barWidth = Math.max(
    2,
    (groupWidth - gap * (chart.series.length - 1)) / chart.series.length,
  );
  /** Label every point when there is room, otherwise every few, always the last. */
  const every = Math.max(1, Math.ceil(56 / Math.max(slot, 1)));
  const single = chart.series.length === 1;
  const summary = chart.series
    .map(
      (series) =>
        `${series.label} ${series.values
          .map((value) => formatChartValue(value, chart.format))
          .join(", ")}`,
    )
    .join("; ");

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    const step = event.key === "ArrowLeft" ? -1 : 1;
    setActive((current) =>
      Math.min(count - 1, Math.max(0, (current ?? count) + step)),
    );
  };

  const tooltipLeft =
    active === null ? 0 : Math.min(Math.max(x(active), 80), width - 80);

  return (
    <figure className="rounded-xl bg-card p-4 shadow-surface sm:p-5">
      <figcaption className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
        <span className="min-w-0">
          <span className="block text-title font-semibold">{chart.title}</span>
          {headline ? (
            <span className="mt-2 flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
              <span className="text-metric font-semibold tabular-nums">
                {headline.value}
              </span>
              {headline.delta ? (
                <span className="text-small">{headline.delta}</span>
              ) : null}
              {headline.label ? (
                <span className="text-small text-muted-foreground">
                  {headline.label}
                </span>
              ) : null}
            </span>
          ) : null}
        </span>
        {single ? null : (
          <span className="flex flex-wrap gap-x-4 gap-y-1 text-caption text-muted-foreground">
            {chart.series.map((series) => (
              <span className="flex items-center gap-1.5" key={series.label}>
                <span
                  aria-hidden="true"
                  className={cn(
                    "shrink-0",
                    chart.kind === "line"
                      ? "h-0.5 w-3 rounded-full"
                      : "size-2 rounded-[2px]",
                  )}
                  style={{ backgroundColor: chartColor[series.tone] }}
                />
                {series.label}
              </span>
            ))}
          </span>
        )}
      </figcaption>
      <div className="relative mt-4" ref={frame} style={{ height }}>
        {width ? (
          <svg
            aria-label={`${chart.title}: ${summary}`}
            className="block overflow-visible rounded-md text-muted-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
            height={height}
            onBlur={() => setActive(null)}
            onKeyDown={onKeyDown}
            onPointerLeave={() => setActive(null)}
            role="img"
            tabIndex={0}
            width={width}
          >
            {single ? (
              <defs>
                <linearGradient id={gradient} x1="0" x2="0" y1="0" y2="1">
                  <stop
                    offset="0%"
                    stopColor={chartColor[chart.series[0].tone]}
                    stopOpacity="0.16"
                  />
                  <stop
                    offset="100%"
                    stopColor={chartColor[chart.series[0].tone]}
                    stopOpacity="0"
                  />
                </linearGradient>
              </defs>
            ) : null}
            {ticks.map((tick) => (
              <g key={tick}>
                <line
                  stroke={tick === 0 ? "currentColor" : "var(--chart-grid)"}
                  strokeOpacity={tick === 0 ? 0.25 : 1}
                  strokeDasharray={tick === 0 ? undefined : "2 3"}
                  x1={left}
                  x2={width - right}
                  y1={y(tick)}
                  y2={y(tick)}
                />
                <text
                  className="tabular-nums"
                  fill="currentColor"
                  fontSize="11"
                  textAnchor="end"
                  x={left - 10}
                  y={y(tick) + 4}
                >
                  {formatAxisValue(tick, chart.format)}
                </text>
              </g>
            ))}
            {chart.labels.map((label, index) =>
              index === count - 1 ||
              (index % every === 0 && count - 1 - index >= every) ? (
                <text
                  fill="currentColor"
                  fontSize="11"
                  fontWeight={active === index ? 600 : 400}
                  key={`${label}-${index}`}
                  textAnchor="middle"
                  x={x(index)}
                  y={height - 6}
                >
                  {label}
                </text>
              ) : null,
            )}
            {active !== null ? (
              chart.kind === "line" ? (
                <line
                  stroke="currentColor"
                  strokeOpacity="0.35"
                  x1={x(active)}
                  x2={x(active)}
                  y1={plotTop}
                  y2={base}
                />
              ) : (
                <rect
                  fill="currentColor"
                  fillOpacity="0.06"
                  height={plotHeight}
                  rx="4"
                  width={slot}
                  x={left + slot * active}
                  y={plotTop}
                />
              )
            ) : null}
            {chart.kind === "line"
              ? chart.series.map((series) => {
                  const points = series.values.map(
                    (value, index) => `${x(index)},${y(value)}`,
                  );
                  const last = series.values.length - 1;
                  return (
                    <g key={series.label}>
                      {single ? (
                        <path
                          d={`M${x(0)},${base}L${points.join("L")}L${x(last)},${base}Z`}
                          fill={`url(#${gradient})`}
                        />
                      ) : null}
                      <polyline
                        fill="none"
                        points={points.join(" ")}
                        stroke={chartColor[series.tone]}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                      />
                      {(active === null ? [last] : [active]).map((index) =>
                        series.values[index] === undefined ? null : (
                          <circle
                            cx={x(index)}
                            cy={y(series.values[index])}
                            fill={chartColor[series.tone]}
                            key={index}
                            r="4"
                            stroke="var(--card)"
                            strokeWidth="2"
                          />
                        ),
                      )}
                    </g>
                  );
                })
              : chart.labels.map((label, index) => (
                  <g key={`${label}-${index}`}>
                    {chart.series.map((series, seriesIndex) => {
                      const value = series.values[index] ?? 0;
                      const start =
                        x(index) -
                        groupWidth / 2 +
                        (barWidth + gap) * seriesIndex;
                      return (
                        <path
                          d={barPath(start, y(value), barWidth, base)}
                          fill={chartColor[series.tone]}
                          fillOpacity={
                            active === null || active === index ? 1 : 0.45
                          }
                          key={series.label}
                          className="transition-[fill-opacity] duration-150"
                        />
                      );
                    })}
                  </g>
                ))}
            {chart.labels.map((label, index) => (
              <rect
                fill="transparent"
                height={plotHeight + bottom}
                key={`hit-${label}-${index}`}
                onPointerEnter={() => setActive(index)}
                width={slot}
                x={left + slot * index}
                y={plotTop}
              />
            ))}
          </svg>
        ) : null}
        {active !== null && width ? (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-0 z-10 min-w-36 -translate-x-1/2 rounded-lg bg-popover px-3 py-2 text-caption shadow-raised"
            style={{ left: tooltipLeft }}
          >
            <p className="font-medium text-muted-foreground">
              {chart.labels[active]}
            </p>
            <ul className="mt-1 grid gap-0.5">
              {chart.series.map((series) => (
                <li className="flex items-center gap-2" key={series.label}>
                  <span
                    className="size-2 shrink-0 rounded-[2px]"
                    style={{ backgroundColor: chartColor[series.tone] }}
                  />
                  <span className="min-w-0 flex-1 truncate text-muted-foreground">
                    {series.label}
                  </span>
                  <span className="font-medium tabular-nums">
                    {formatChartValue(series.values[active] ?? 0, chart.format)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </figure>
  );
}
