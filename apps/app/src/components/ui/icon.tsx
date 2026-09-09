import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

const paths = {
  search: "m21 21-4.3-4.3 M19 11a8 8 0 1 1-16 0 8 8 0 0 1 16 0",
  plus: "M12 5v14 M5 12h14",
  close: "m6 6 12 12 M6 18 18 6",
  check: "m5 12 4 4L19 6",
  arrowRight: "M5 12h14 m-6-6 6 6-6 6",
  chevronDown: "m6 9 6 6 6-6",
  star: "m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9Z",
  mapPin:
    "M20 10c0 6-8 11-8 11S4 16 4 10a8 8 0 1 1 16 0 M15 10a3 3 0 1 1-6 0 3 3 0 0 1 6 0",
} as const;

/** Decorative icons; label the containing button/link when it has no text. */
export function Icon({
  name,
  className,
  ...props
}: Omit<ComponentProps<"svg">, "children"> & { name: keyof typeof paths }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={cn("size-4 shrink-0", className)}
      {...props}
    >
      <path d={paths[name]} />
    </svg>
  );
}
