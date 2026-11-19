import { cn } from "@/lib/utils";

/** One-tap filters above a list; the first option usually shows everything. */
export function FilterChips({
  options,
  value,
  onChange,
  label = "Filter",
  counts,
}: {
  options: string[];
  value: number;
  onChange: (index: number) => void;
  label?: string;
  /** How many records each option shows, in the same order. */
  counts?: number[];
}) {
  return (
    <div
      aria-label={label}
      className="flex w-fit max-w-full min-w-0 gap-0.5 overflow-x-auto rounded-lg bg-fill p-0.5 [scrollbar-width:none]"
      role="group"
    >
      {options.map((option, index) => {
        const selected = value === index;
        const count = counts?.[index];
        return (
          <button
            aria-pressed={selected}
            className={cn(
              "inline-flex min-h-9 shrink-0 items-center gap-1.5 rounded-md px-2.5 text-small font-medium whitespace-nowrap transition-[background-color,color,box-shadow] duration-150 ease-kit focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring sm:min-h-6",
              selected
                ? "bg-card text-strong shadow-surface dark:bg-accent"
                : "text-soft hover:text-strong",
            )}
            key={option}
            onClick={() => onChange(index)}
            type="button"
          >
            {option}
            {count !== undefined ? (
              <span
                className={cn(
                  "text-caption tabular-nums",
                  "text-muted-foreground",
                )}
              >
                {count}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
