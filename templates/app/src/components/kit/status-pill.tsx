import { cn } from "@/lib/utils";
import { toneClass, toneDot, type Tone } from "./tones";

/** A record's status: a short label with its tone's dot, so color never carries it alone. */
export function StatusPill({ tone, label }: { tone: Tone; label: string }) {
  return (
    <span
      className={cn(
        "inline-flex h-5 shrink-0 items-center gap-1.5 rounded-sm px-1.5 text-caption font-medium whitespace-nowrap",
        toneClass[tone],
      )}
    >
      <span
        aria-hidden="true"
        className={cn("size-1.5 shrink-0 rounded-full", toneDot[tone])}
      />
      {label}
    </span>
  );
}
