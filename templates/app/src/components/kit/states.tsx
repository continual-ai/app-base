import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { KitIcon, type KitIconName } from "./icons";

/**
 * What a list or view shows when it has nothing: what is missing, why, and
 * the one action that helps (clear a filter, connect a source, add a record).
 */
export function EmptyState({
  title,
  description,
  icon = "empty",
  action,
  className,
}: {
  title: string;
  description?: string;
  icon?: KitIconName;
  /** Usually one Button. */
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center px-6 py-12 text-center motion-safe:animate-kit-enter",
        className,
      )}
    >
      <span className="flex size-10 items-center justify-center rounded-xl bg-card text-muted-foreground shadow-surface">
        <KitIcon name={icon} className="size-5" />
      </span>
      <p className="mt-4 text-title font-medium text-strong">{title}</p>
      {description ? (
        <p className="mt-1 max-w-sm text-small text-muted-foreground">
          {description}
        </p>
      ) : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}

/** A placeholder block while data loads; size it like what it stands in for. */
export function Skeleton({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "block rounded-md bg-muted motion-safe:animate-kit-shimmer",
        className,
      )}
    />
  );
}

/** Section heading inside a page: a title, an optional line under it, and actions on the right. */
export function SectionHeader({
  title,
  description,
  actions,
  as: Heading = "h2",
}: {
  title: string;
  description?: ReactNode;
  actions?: ReactNode;
  as?: "h2" | "h3";
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-2">
      <div className="min-w-0">
        <Heading className="text-title font-medium text-strong">
          {title}
        </Heading>
        {description ? (
          <p className="mt-0.5 text-small text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>
      {actions ? (
        <div className="flex shrink-0 items-center gap-2">{actions}</div>
      ) : null}
    </div>
  );
}

/** The top of a view: its name large, one line on what it is for, and actions or a status on the right. */
export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
      <div className="min-w-0">
        <h2 className="text-display font-medium text-strong">{title}</h2>
        {description ? (
          <p className="mt-1 max-w-2xl text-body text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>
      {actions ? (
        <div className="flex shrink-0 items-center gap-2">{actions}</div>
      ) : null}
    </div>
  );
}
