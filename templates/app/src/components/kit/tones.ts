/** Status tones. Pick one per status; the colors come from src/styles/tokens.css. */
export type Tone = "red" | "amber" | "green" | "blue" | "gray";

/** Soft background with readable text, for pills and badges. */
export const toneClass: Record<Tone, string> = {
  red: "bg-tone-red-soft text-tone-red",
  amber: "bg-tone-amber-soft text-tone-amber",
  green: "bg-tone-green-soft text-tone-green",
  blue: "bg-tone-blue-soft text-tone-blue",
  gray: "bg-tone-gray-soft text-tone-gray",
};

/** A solid dot, for legends and compact states. */
export const toneDot: Record<Tone, string> = {
  red: "bg-tone-red-dot",
  amber: "bg-tone-amber-dot",
  green: "bg-tone-green-dot",
  blue: "bg-tone-blue-dot",
  gray: "bg-tone-gray-dot",
};

/** The same solid color as a CSS value, for SVG strokes and fills. */
export const toneColor: Record<Tone, string> = {
  red: "var(--tone-red-dot)",
  amber: "var(--tone-amber-dot)",
  green: "var(--tone-green-dot)",
  blue: "var(--tone-blue-dot)",
  gray: "var(--tone-gray-dot)",
};

/**
 * A chart series color for a tone: the chart palette (blue, orange, aqua),
 * which stays distinct for color-blind readers, instead of the status dots.
 */
export const chartColor: Record<Tone, string> = {
  blue: "var(--chart-1)",
  amber: "var(--chart-2)",
  green: "var(--chart-3)",
  red: "var(--chart-red)",
  gray: "var(--chart-gray)",
};
