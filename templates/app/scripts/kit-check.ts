/**
 * Checks the App's screens against the design system's rules in AGENTS.md.
 * The design system's own source is where its values are defined, so it is
 * not checked.
 *
 *   pnpm run kit:check
 */
import { readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { findIssues, skipped } from "./kit-rules";

function sourceFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return sourceFiles(path);
    return /\.(tsx?|jsx?)$/.test(entry.name) && !entry.name.endsWith(".gen.ts")
      ? [path]
      : [];
  });
}

const root = process.cwd();
const issues = sourceFiles(join(root, "src"))
  .map((path) => relative(root, path))
  .filter((file) => !skipped.some((prefix) => file.startsWith(prefix)))
  .flatMap((file) => findIssues(file, readFileSync(join(root, file), "utf8")));
for (const issue of issues)
  console.log(
    `${issue.file}:${issue.line}  ${issue.message}\n    ${issue.text}`,
  );
if (issues.length) {
  console.log(
    `\n${issues.length} design system issue${issues.length === 1 ? "" : "s"}. See "Design system" in AGENTS.md.`,
  );
  process.exit(1);
}
console.log("Design system check passed.");
