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
