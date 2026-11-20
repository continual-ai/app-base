import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

const paths = {
  records: "M9 6h11 M9 12h11 M9 18h11 M4.5 6h.01 M4.5 12h.01 M4.5 18h.01",
  inbox:
    "M21.5 12.5h-5.25l-1.5 2.5h-5.5l-1.5-2.5H2.5 M5.6 5.1 2.5 12.5v5a2 2 0 0 0 2 2h15a2 2 0 0 0 2-2v-5l-3.1-7.4a1.5 1.5 0 0 0-1.4-.9H7a1.5 1.5 0 0 0-1.4.9z",
  activity: "M21.5 12h-3.6l-2.7 7.5L8.8 4.5 6.1 12H2.5",
  agent:
    "M12 3.5v2.5 M7 9.5h10a3 3 0 0 1 3 3v3.5a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3v-3.5a3 3 0 0 1 3-3z M9.5 13.5v1.5 M14.5 13.5v1.5 M2 14.5h2 M20 14.5h2",
  check: "m5 12.5 4.5 4.5L19 7.5",
  arrowUp: "M12 19V5 m-6 6 6-6 6 6",
  arrowDown: "M12 5v14 m6-6-6 6-6-6",
  arrowRight: "M5 12h14 m-6-6 6 6-6 6",
  chevronRight: "m9.5 6 6 6-6 6",
  clock: "M12 7v5l3 2 M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0",
  sparkle:
    "M12 3.5 13.9 9a1.6 1.6 0 0 0 1.1 1.1l5.5 1.9-5.5 1.9a1.6 1.6 0 0 0-1.1 1.1L12 20.5 10.1 15a1.6 1.6 0 0 0-1.1-1.1L3.5 12 9 10.1A1.6 1.6 0 0 0 10.1 9z",
  search: "m20.5 20.5-4.2-4.2 M18 11a7 7 0 1 1-14 0 7 7 0 0 1 14 0",
  empty:
    "M3 13.5h4.5l1.5 2.5h6l1.5-2.5H21 M3 13.5V18a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-4.5 M3 13.5 5.5 7h13l2.5 6.5 M9.5 3.5l.75 1.5 M14.5 3.5l-.75 1.5 M12 2.5v2",
  edit: "M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16z M13.5 6.5l4 4",
  skip: "M6 6l12 12 M18 6 6 18",
  home: "M4 10.5 12 4l8 6.5V19a1.5 1.5 0 0 1-1.5 1.5H15v-6H9v6H5.5A1.5 1.5 0 0 1 4 19z",
  people:
    "M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z M3 20c.7-3 2.9-4.8 6-4.8s5.3 1.8 6 4.8 M16 4.5a3.2 3.2 0 0 1 0 6 M17.8 15.4c1.6.6 2.6 2.1 3 4.6",
  rules:
    "M4 7h9 M18 7h2 M4 17h3 M12 17h8 M15.5 9.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z M9.5 19.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z",
  settings:
    "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M12 2.5v2.5 M12 19v2.5 M5.3 5.3l1.8 1.8 M16.9 16.9l1.8 1.8 M2.5 12H5 M19 12h2.5 M5.3 18.7l1.8-1.8 M16.9 7.1l1.8-1.8",
  menu: "M4 7h16 M4 12h16 M4 17h16",
  close: "M6 6l12 12 M18 6 6 18",
  undo: "M8 5 4 9l4 4 M4.5 9H14a5.5 5.5 0 0 1 0 11h-3",
  pause: "M9 5v14 M15 5v14",
  play: "M7 4.5v15l12-7.5z",
  mail: "M4.5 5.5h15a1.5 1.5 0 0 1 1.5 1.5v10a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 17V7a1.5 1.5 0 0 1 1.5-1.5z m-.8 1 8.3 6.5 8.3-6.5",
  more: "M5.5 12h.01 M12 12h.01 M18.5 12h.01",
  calendar:
    "M5 5.5h14A1.5 1.5 0 0 1 20.5 7v12a1.5 1.5 0 0 1-1.5 1.5H5A1.5 1.5 0 0 1 3.5 19V7A1.5 1.5 0 0 1 5 5.5z M3.5 10h17 M8 3.5v4 M16 3.5v4",
  bolt: "M13 2.5 5 13.5h6l-1 8 8-11h-6z",
  sun: "M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0 M12 2.5v2 M12 19.5v2 M2.5 12h2 M19.5 12h2 M5.3 5.3l1.4 1.4 M17.3 17.3l1.4 1.4 M5.3 18.7l1.4-1.4 M17.3 6.7l1.4-1.4",
  moon: "M20.5 14.5A8.5 8.5 0 1 1 9.5 3.5a6.5 6.5 0 0 0 11 11z",
  auto: "M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0 M12 3v18 M12 7.5h4.5 M12 12h5.5 M12 16.5h4.5",
  warning: "M12 4 21.5 20h-19z M12 10v4 M12 17v.01",
  file: "M6 3h8l4 4v14H6z M14 3v4h4 M9 12h6 M9 16h6",
  download: "M12 4v11 m-4.5-4.5L12 15l4.5-4.5 M5 20h14",
  plus: "M12 5v14 M5 12h14",
  filter: "M4 7h16 M7 12h10 M10 17h4",
  link: "M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1 M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1",
  quote:
    "M5 15c0-4.5 1.6-7.3 5-8.5 M14 15c0-4.5 1.6-7.3 5-8.5 M7.5 17.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z M16.5 17.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z",
} as const;

export type KitIconName = keyof typeof paths;

/** Decorative icons for views and states; label the control that holds one. */
export function KitIcon({
  name,
  className,
  ...props
}: Omit<ComponentProps<"svg">, "children"> & { name: KitIconName }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
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
