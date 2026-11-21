import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * A gray tray behind a card that holds a decision: an approval, a draft, a
 * step that waits on someone. The label above the card says where it came
 * from, e.g. "Collector · drafted at 08:02".
 */
export function Tray({
  label,
  children,
  className,
}: {
  label?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("rounded-3xl bg-tray p-1", className)}>
      {label ? (
        <div className="flex min-w-0 items-center gap-1.5 px-2.5 pt-1.5 pb-2 text-caption text-muted-foreground">
          {label}
        </div>
      ) : null}
      {children}
    </div>
  );
}

/** A keyboard key, shown beside the action it triggers. Hidden on touch screens. */
export function Kbd({
  children,
  onPrimary = false,
  className,
}: {
  children: ReactNode;
  /** On a dark primary button. */
  onPrimary?: boolean;
  className?: string;
}) {
  return (
    <kbd
      aria-hidden="true"
      className={cn(
        "inline-grid h-4.5 min-w-4.5 place-items-center rounded-xs px-1 font-mono text-micro font-medium pointer-coarse:hidden",
        onPrimary
          ? "bg-primary-foreground/15 text-primary-foreground/75"
          : "bg-kbd text-muted-foreground",
        className,
      )}
    >
      {children}
    </kbd>
  );
}
