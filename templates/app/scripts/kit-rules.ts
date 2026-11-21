/**
 * The design system's rules from AGENTS.md as patterns: no raw colors (white
 * and black included, since they stay put in dark mode), no type sizes or
 * shadows outside the scale, no bold. `pnpm run kit:check`
 * applies them to the App's screens.
 */

const palette =
  "red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|slate|gray|zinc|neutral|stone";

const rules: { pattern: RegExp; message: string }[] = [
  {
    pattern: /\b[a-z-]+-\[(#|rgb|hsl|oklch|color-mix)/,
    message:
      "Raw color in a class: use a token class such as bg-card, text-soft or bg-tone-red-soft.",
  },
  {
    pattern:
      /\b(color|background|backgroundColor|fill|stroke|borderColor)\s*:\s*["'`](#|rgb|hsl|oklch|white\b|black\b)/,
    message:
      "Raw color in a style: use a token such as var(--brand) or var(--tone-red-dot).",
  },
  {
    pattern: new RegExp(
      `\\b(bg|text|border|ring|fill|stroke|from|to|via|outline|decoration)-(${palette})-\\d{2,3}\\b`,
    ),
    message:
      "Tailwind palette color: use a token class such as text-tone-red or bg-brand-soft.",
  },
  {
    pattern:
      /\b(bg|text|border(-[trblxyse])?|divide|ring|fill|stroke|from|to|via|outline|decoration|placeholder|caret|shadow)-(white|black)\b/,
    message:
      "White or black stays the same in dark mode: use a token class such as bg-card, bg-background, text-foreground or border-line.",
  },
  {
    pattern: /\btext-\[\d/,
    message:
      "Arbitrary type size: use text-caption, text-small, text-title, text-heading, text-display or text-metric.",
  },
  {
    pattern: /\btext-(xs|sm|base|lg|[2-9]?xl)\b/,
    message:
      "Tailwind type size: use text-caption, text-small, text-title, text-heading, text-display or text-metric.",
  },
  {
    pattern: /\bshadow-(\[|sm\b|md\b|lg\b|xl\b|2xl\b)/,
    message: "Shadow outside the system: use shadow-surface or shadow-raised.",
  },
  {
    pattern: /\bfont-(bold|extrabold|black)\b/,
    message: "Bold type: use font-medium for emphasis.",
  },
];

/** The design system's own source, where its values are defined. */
export const skipped = [
  "src/components/ui/",
  "src/components/kit/",
  "src/styles/",
];

export type Issue = {
  file: string;
  line: number;
  message: string;
  text: string;
};

/** The rule breaks in one file's source. */
export function findIssues(file: string, source: string): Issue[] {
  const issues: Issue[] = [];
  source.split("\n").forEach((text, index) => {
    const trimmed = text.trim();
    if (trimmed.startsWith("//") || trimmed.startsWith("*")) return;
    for (const rule of rules)
      if (rule.pattern.test(text))
        issues.push({
          file,
          line: index + 1,
          message: rule.message,
          text: trimmed,
        });
  });
  return issues;
}
