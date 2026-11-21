import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { StatusPill } from "./status-pill";
import type { Tone } from "./tones";

export type AutonomyLevel = { label: string; detail: string };

/**
 * How much an agent does alone: a few levels on one track, the chosen one
 * marked. Each level says where the agent stops and asks. A radio group, so
 * arrow keys move between levels.
 */
export function AutonomyDial({
  label,
  levels,
  value,
  onChange,
  className,
}: {
  /** e.g. "How much Collector does alone". */
  label: string;
  levels: AutonomyLevel[];
  value: number;
  onChange: (index: number) => void;
  className?: string;
}) {
  const share = levels.length > 1 ? (value / (levels.length - 1)) * 100 : 0;
  return (
    <fieldset className={cn("min-w-0", className)}>
      <legend className="text-small font-medium text-strong">{label}</legend>
      <div
        aria-hidden="true"
        className="relative mx-2 mt-5 mb-1 h-1.5 rounded-full bg-fill"
      >
        <span
          className="absolute inset-y-0 left-0 rounded-full bg-brand transition-[width] duration-220 ease-kit"
          style={{ width: `${share}%` }}
        />
        {levels.map((level, index) => (
          <span
            className={cn(
              "absolute top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-card shadow-surface",
              index === value &&
                "ring-2 ring-brand ring-offset-2 ring-offset-card",
            )}
            key={level.label}
            style={{
              left: `${(index / Math.max(1, levels.length - 1)) * 100}%`,
            }}
          />
        ))}
      </div>
      <div
        className="mt-3 grid gap-2"
        role="radiogroup"
        aria-label={label}
        style={{
          gridTemplateColumns: `repeat(${levels.length}, minmax(0, 1fr))`,
        }}
      >
        {levels.map((level, index) => (
          <button
            aria-checked={index === value}
            className={cn(
              "min-w-0 rounded-md p-1 focus-visible:outline-2 focus-visible:outline-ring",
              index === 0
                ? "text-left"
                : index === levels.length - 1
                  ? "text-right"
                  : "text-center",
            )}
            key={level.label}
            onClick={() => onChange(index)}
            onKeyDown={(event) => {
              if (event.key === "ArrowRight" || event.key === "ArrowDown")
                onChange(Math.min(levels.length - 1, value + 1));
              if (event.key === "ArrowLeft" || event.key === "ArrowUp")
                onChange(Math.max(0, value - 1));
            }}
            role="radio"
            tabIndex={index === value ? 0 : -1}
            type="button"
          >
            <span
              className={cn(
                "block text-small font-medium",
                index === value ? "text-brand-ink" : "text-strong",
              )}
            >
              {level.label}
            </span>
            <span className="block text-caption text-muted-foreground">
              {level.detail}
            </span>
          </button>
        ))}
      </div>
    </fieldset>
  );
}

export type Step = {
  /** When it happens, e.g. "Day 14". */
  when: string;
  what: ReactNode;
  /** What the agent does at this step, e.g. "Asks you". */
  mode: { label: string; tone: Tone };
  /** A step that is switched off reads quieter. */
  off?: boolean;
};

/** An ordered ladder of steps, such as how reminders escalate. */
export function StepList({
  title,
  steps,
  action,
  className,
}: {
  title: ReactNode;
  steps: Step[];
  action?: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("rounded-xl bg-card shadow-surface", className)}>
      <h2 className="flex min-h-11 items-center gap-2 border-b border-line px-4 text-small font-medium text-strong">
        {title}
        {action ? <span className="ml-auto">{action}</span> : null}
      </h2>
      <ol>
        {steps.map((step, index) => (
          <li
            className="flex min-w-0 items-center gap-3 border-t border-line px-4 py-2.5 first:border-0"
            key={index}
          >
            <span className="w-16 shrink-0 font-mono text-caption whitespace-nowrap text-muted-foreground">
              {step.when}
            </span>
            <span
              className={cn(
                "flex size-5 shrink-0 items-center justify-center rounded-full text-micro font-semibold",
                step.off
                  ? "bg-fill text-muted-foreground"
                  : "bg-brand text-brand-foreground",
              )}
            >
              {index + 1}
            </span>
            <span
              className={cn(
                "min-w-0 flex-1",
                step.off ? "text-muted-foreground" : "text-strong",
              )}
            >
              {step.what}
            </span>
            <StatusPill label={step.mode.label} tone={step.mode.tone} />
          </li>
        ))}
      </ol>
    </section>
  );
}
