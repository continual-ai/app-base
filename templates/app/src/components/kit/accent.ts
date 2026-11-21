import { useEffect } from "react";

/** The accents in src/styles/tokens.css. Pick the one closest to the company's brand color. */
export const accents = [
  "indigo",
  "blue",
  "teal",
  "green",
  "amber",
  "orange",
  "rose",
  "violet",
] as const;

export type Accent = (typeof accents)[number];

/**
 * Puts the App's accent on the page root, so sheets and toasts rendered
 * outside the App's own markup wear it too. Also set `data-accent` on the
 * App's outer element so the first paint has it.
 */
export function useAccent(accent: Accent | undefined) {
  useEffect(() => {
    if (!accent) return;
    const root = document.documentElement;
    root.dataset.accent = accent;
    return () => {
      delete root.dataset.accent;
    };
  }, [accent]);
}
