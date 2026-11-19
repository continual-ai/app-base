import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { KitIcon } from "./icons";

/**
 * An agent is always this mark: a ring around a dot, in the agent's color.
 * While it works, an arc turns around the dot. People are avatars, never this
 * mark, and agents are never sparkles or robots.
 */
export function AgentMark({
  color = "var(--chart-2)",
  working = false,
  className,
}: {
  color?: string;
  working?: boolean;
  className?: string;
}) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      className={cn("size-4 shrink-0", className)}
      style={{ color }}
    >
      <circle
        cx="8"
        cy="8"
        r="6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        opacity={working ? 0.3 : 1}
      />
      {working ? (
        <circle
          cx="8"
          cy="8"
          r="6"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeDasharray="9 29"
          className="origin-center motion-safe:animate-spin [animation-duration:1.4s]"
        />
      ) : null}
      <circle cx="8" cy="8" r="2.4" fill="currentColor" />
    </svg>
  );
}

export type TrailStep = {
  label: ReactNode;
  /** A time, a count or a badge at the end of the line. */
  aside?: ReactNode;
  /** done, working now, waiting on a person, or not started. */
  state: "done" | "working" | "waiting" | "todo";
  /** Findings under the step, one per line. */
  details?: ReactNode[];
};

/**
 * The steps an agent works through for one goal, as one quiet line: done
 * steps checked, the one it is on turning, a step that needs a person ringed
 * in amber and dashed.
 */
export function AgentTrail({
  title,
  agent,
  steps,
  className,
}: {
  title: ReactNode;
  /** The agent's name, with its mark. */
  agent?: { name: string; color?: string };
  steps: TrailStep[];
  className?: string;
}) {
  const done = steps.filter((step) => step.state === "done").length;
  return (
    <section
      className={cn(
        "rounded-xl bg-card px-4 pt-3 pb-2.5 shadow-surface",
        className,
      )}
    >
      <header className="mb-1.5 flex min-w-0 items-center gap-2">
        <h3 className="min-w-0 truncate text-small font-medium text-strong">
          {title}
        </h3>
        {agent ? (
          <span className="inline-flex h-5 shrink-0 items-center gap-1.5 rounded-sm bg-fill px-1.5 text-caption font-medium text-soft">
            <AgentMark color={agent.color} className="size-3.5" />
            {agent.name}
          </span>
        ) : null}
        <span className="ml-auto shrink-0 text-caption text-muted-foreground tabular-nums">
          {done}/{steps.length}
        </span>
      </header>
      <ol className="relative">
        {steps.map((step, index) => (
          <li
            key={index}
            className="relative grid grid-cols-[1.25rem_minmax(0,1fr)] gap-x-2.5"
          >
            {index < steps.length - 1 ? (
              <span
                aria-hidden="true"
                className={cn(
                  "absolute top-6 bottom-0 left-[9px] w-px",
                  step.state === "done" ? "bg-brand" : "bg-input",
                )}
              />
            ) : null}
            <span className="relative z-10 mt-1.5 flex size-[18px] items-center justify-center">
              {step.state === "done" ? (
                <span className="flex size-[18px] items-center justify-center rounded-full bg-brand text-brand-foreground">
                  <KitIcon name="check" className="size-3" />
                </span>
              ) : step.state === "working" ? (
                <AgentMark
                  working
                  color="var(--brand)"
                  className="size-[18px]"
                />
              ) : step.state === "waiting" ? (
                <span className="size-[18px] rounded-full border-[1.5px] border-dashed border-tone-amber-dot bg-card" />
              ) : (
                <span className="size-[18px] rounded-full border-[1.5px] border-input bg-card" />
              )}
            </span>
            <div className="min-w-0 py-1.5">
              <div className="flex min-w-0 items-start gap-3">
                <span
                  className={cn(
                    "min-w-0 flex-1 wrap-anywhere",
                    step.state === "todo"
                      ? "text-muted-foreground"
                      : step.state === "waiting"
                        ? "font-medium text-strong"
                        : "text-foreground",
                  )}
                >
                  {step.label}
                </span>
                {step.aside ? (
                  <span className="shrink-0 text-caption text-muted-foreground tabular-nums">
                    {step.aside}
                  </span>
                ) : null}
              </div>
              {step.details?.length ? (
                <ul className="mt-1 grid gap-0.5">
                  {step.details.map((detail, i) => (
                    <li
                      key={i}
                      className="flex min-w-0 gap-2 text-caption text-soft"
                    >
                      <span
                        aria-hidden="true"
                        className="mt-1.5 size-1 shrink-0 rounded-full bg-brand/60"
                      />
                      <span className="min-w-0 wrap-anywhere">{detail}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
