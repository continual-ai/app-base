import type { CSSProperties } from "react";
import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * Teaches class merging the design kit's type scale and shadows from
 * src/styles/kit.css, so `cn("text-small", "text-muted-foreground")` keeps
 * both instead of treating the size as a color.
 */
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: [
        "micro",
        "caption",
        "small",
        "body",
        "title",
        "heading",
        "display",
        "metric",
      ],
      shadow: ["surface", "raised"],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Staggers a list's rows as a view opens: pair `style={stagger(index)}` with
 * `motion-safe:animate-kit-stagger`. Rows past the tenth wait no longer.
 */
export function stagger(index: number): CSSProperties {
  return { "--kit-i": index } as CSSProperties;
}
