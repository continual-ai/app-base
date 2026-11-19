import { cn } from "@/lib/utils";
import { initials } from "./format";

/** Soft avatar tints; a name always gets the same one. */
const tints = [
  "bg-[oklch(0.93_0.04_265)] text-[oklch(0.42_0.12_265)] dark:bg-[oklch(0.34_0.07_265)] dark:text-[oklch(0.88_0.06_265)]",
  "bg-[oklch(0.93_0.045_215)] text-[oklch(0.42_0.09_215)] dark:bg-[oklch(0.34_0.06_215)] dark:text-[oklch(0.88_0.06_215)]",
  "bg-[oklch(0.93_0.05_165)] text-[oklch(0.42_0.09_165)] dark:bg-[oklch(0.34_0.06_165)] dark:text-[oklch(0.88_0.07_165)]",
  "bg-[oklch(0.94_0.06_85)] text-[oklch(0.45_0.1_70)] dark:bg-[oklch(0.36_0.06_80)] dark:text-[oklch(0.9_0.08_85)]",
  "bg-[oklch(0.93_0.05_40)] text-[oklch(0.45_0.13_40)] dark:bg-[oklch(0.35_0.07_40)] dark:text-[oklch(0.88_0.07_40)]",
  "bg-[oklch(0.93_0.045_350)] text-[oklch(0.45_0.13_350)] dark:bg-[oklch(0.35_0.07_350)] dark:text-[oklch(0.88_0.07_350)]",
  "bg-[oklch(0.93_0.045_300)] text-[oklch(0.44_0.13_300)] dark:bg-[oklch(0.35_0.07_300)] dark:text-[oklch(0.88_0.07_300)]",
];

function tintOf(name: string) {
  let hash = 0;
  for (const char of name) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return tints[hash % tints.length];
}

const sizes = {
  sm: "size-5 text-micro",
  md: "size-6 text-micro",
  lg: "size-8 text-caption",
};

/** A person as their initials on a soft tint picked from their name. */
export function Avatar({
  name,
  size = "md",
  className,
}: {
  name: string;
  size?: keyof typeof sizes;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full font-semibold tracking-wide ring-2 ring-card",
        sizes[size],
        tintOf(name),
        className,
      )}
    >
      {initials(name)}
    </span>
  );
}

/** A person's avatar and name, for owner, preparer or assignee cells. */
export function Person({ name }: { name: string }) {
  return (
    <span className="inline-flex min-w-0 items-center gap-2">
      <Avatar name={name} size="sm" />
      <span className="truncate">{name}</span>
    </span>
  );
}

/** Whether a value reads as a person's name: two or three capitalized words. */
export function looksLikePerson(value: string) {
  return /^[A-Z][a-z'’-]+( [A-Z][a-z'’.-]+){1,2}$/.test(value.trim());
}
