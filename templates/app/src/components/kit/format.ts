/** "Brightwater Consulting" reads as "BC". */
export function initials(name: string) {
  return name
    .split(/[\s&]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

/** When something happened: "Just now", a time today, or a short date. */
export function formatWhen(at: string, now = new Date()): string {
  const date = new Date(at);
  if (now.getTime() - date.getTime() < 2 * 60 * 1000) return "Just now";
  if (date.toDateString() === now.toDateString())
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

const MONTHS = "Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" ");
const SHORT_DATE =
  /^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) (\d{1,2})(?:, (\d{4}))?$/;
const DAY_MS = 24 * 60 * 60 * 1000;

/** "Nov 3" or "Nov 3, 2026" as a date; without a year, the one nearest today. */
export function parseShortDate(text: string, now = new Date()): Date | null {
  const match = SHORT_DATE.exec(text.trim());
  if (!match) return null;
  const month = MONTHS.indexOf(match[1]);
  const day = Number(match[2]);
  if (match[3]) return new Date(Number(match[3]), month, day);
  const candidates = [-1, 0, 1].map(
    (offset) => new Date(now.getFullYear() + offset, month, day),
  );
  return candidates.reduce((best, date) =>
    Math.abs(date.getTime() - now.getTime()) <
    Math.abs(best.getTime() - now.getTime())
      ? date
      : best,
  );
}

/** How far a day is from today: "Today", "Yesterday", "3 days ago", "In 2 weeks". */
export function formatRelative(date: Date, now = new Date()): string {
  const start = (value: Date) =>
    new Date(value.getFullYear(), value.getMonth(), value.getDate()).getTime();
  const days = Math.round((start(date) - start(now)) / DAY_MS);
  if (days === 0) return "Today";
  if (days === -1) return "Yesterday";
  if (days === 1) return "Tomorrow";
  const size = Math.abs(days);
  const [amount, unit] =
    size < 14
      ? [size, "day"]
      : size < 60
        ? [Math.round(size / 7), "week"]
        : [Math.round(size / 30), "month"];
  const span = `${amount} ${unit}${amount === 1 ? "" : "s"}`;
  return days < 0 ? `${span} ago` : `In ${span}`;
}

/** A full date for hover text: "Monday, November 3, 2026". */
export function formatFullDate(date: Date) {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

/** A signed change such as "+12%", "-38%", "+$1,204" or "-3". */
const DELTA = /^([+\-−])\s?(\$?[\d,.]+(%|k|m)?)$/i;

/** A signed change's direction, or null when the text is not one. */
export function parseDelta(text: string): "up" | "down" | "flat" | null {
  const value = text.trim();
  if (/^([+\-]0(\.0+)?%?|0(\.0+)?%)$/.test(value)) return "flat";
  const match = DELTA.exec(value);
  if (!match) return null;
  return match[1] === "+" ? "up" : "down";
}
