import type { ReactNode } from "react";
import { stagger } from "@/lib/utils";
import { AgentMark } from "./agent";
import { formatWhen } from "./format";
import { KitIcon } from "./icons";
import { Avatar } from "./people";

/** What an agent or Automation did on its last run, as it reported it. */
export function ActivityFeed({
  title,
  items,
}: {
  /** e.g. "Ran today at 8:00 AM". */
  title: string;
  items: { text: string; onOpen?: () => void }[];
}) {
  return (
    <section className="rounded-xl bg-card shadow-surface">
      <h2 className="flex items-center gap-2.5 border-b border-line px-4 py-3 text-small font-medium text-strong">
        <AgentMark />
        {title}
      </h2>
      <ol className="relative px-5 py-4 before:absolute before:top-6 before:bottom-6 before:left-[23px] before:w-px before:bg-line">
        {items.map(({ text, onOpen }, index) => (
          <li
            className="relative py-1.5 pl-6 text-small motion-safe:animate-kit-stagger"
            key={text}
            style={stagger(index)}
          >
            <span
              aria-hidden="true"
              className={
                onOpen
                  ? "absolute top-3 left-0 size-[7px] rounded-full bg-brand ring-3 ring-card"
                  : "absolute top-3 left-0 size-[7px] rounded-full bg-muted-foreground/35 ring-3 ring-card"
              }
            />
            {onOpen ? (
              <button
                className="group inline-flex items-start gap-1 rounded-sm text-left text-foreground transition-colors duration-150 hover:text-brand-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                onClick={onOpen}
                type="button"
              >
                {text}
                <KitIcon
                  name="chevronRight"
                  className="mt-0.5 size-3.5 text-muted-foreground transition-transform duration-150 ease-kit group-hover:translate-x-0.5 group-hover:text-brand-ink motion-reduce:transition-none"
                />
              </button>
            ) : (
              <span className="text-muted-foreground">{text}</span>
            )}
          </li>
        ))}
      </ol>
    </section>
  );
}

/**
 * What people and agents changed, newest first: what, before and after, who
 * and when. Give `onUndo` to changes that can be put back, so every change an
 * agent makes stays reversible.
 */
export function ChangeList({
  title = "Changes",
  items,
}: {
  title?: string;
  items: {
    what: string;
    /** e.g. "Fieldwork Labs · reminders weekly → on hold". */
    detail?: ReactNode;
    by: string;
    at: string;
    /** Draw the agent's mark instead of a person's avatar. */
    agent?: boolean;
    onOpen?: () => void;
    onUndo?: () => void;
  }[];
}) {
  return (
    <section className="rounded-xl bg-card shadow-surface">
      <h2 className="flex items-center gap-2 border-b border-line px-4 py-3 text-small font-medium text-strong">
        {title}
        <span className="ml-auto text-caption font-normal text-muted-foreground tabular-nums">
          {items.length}
        </span>
      </h2>
      <ul className="divide-y divide-line">
        {items.map(({ what, detail, by, at, agent, onOpen, onUndo }, index) => (
          <li
            className="flex items-center gap-3 px-4 py-2.5 text-small motion-safe:animate-kit-stagger"
            key={`${at}-${index}`}
            style={stagger(index)}
          >
            {agent ? (
              <span className="flex size-7 shrink-0 items-center justify-center rounded-lg shadow-surface">
                <AgentMark />
              </span>
            ) : (
              <Avatar name={by} size="lg" />
            )}
            <span className="min-w-0 flex-1">
              {onOpen ? (
                <button
                  className="rounded-sm text-left font-medium text-strong transition-colors duration-150 hover:text-brand-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                  onClick={onOpen}
                  type="button"
                >
                  {what}
                </button>
              ) : (
                <span className="font-medium text-strong">{what}</span>
              )}
              <span className="block truncate text-caption text-soft">
                {detail ?? by}
              </span>
            </span>
            <span className="shrink-0 text-caption text-muted-foreground tabular-nums max-sm:hidden">
              {formatWhen(at)}
            </span>
            {onUndo ? (
              <button
                className="inline-flex h-6 shrink-0 items-center gap-1 rounded-md bg-card px-2 text-caption font-medium text-strong shadow-surface transition-shadow duration-150 hover:shadow-surface-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring pointer-coarse:h-9"
                onClick={onUndo}
                type="button"
              >
                <KitIcon
                  name="undo"
                  className="size-3.5 text-muted-foreground"
                />
                Undo
              </button>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  );
}
