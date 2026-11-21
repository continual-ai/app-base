import { useEffect, useState } from "react";

/** "auto" follows Continual inside Continual, and the device everywhere else. */
export type ThemePreference = "auto" | "light" | "dark";

const STORAGE_KEY = "app-theme";
const CHANGE_EVENT = "app:theme-change";

/**
 * Runs in <head> before the first paint and owns the `dark` class on <html>:
 * the person's choice wins, then Continual's mode when the App is shown inside
 * it, then the device. Re-applies when any of them changes.
 */
export const THEME_SCRIPT = `(function () {
  var root = document.documentElement;
  var media = matchMedia("(prefers-color-scheme: dark)");
  var host = null;
  function apply() {
    var choice = null;
    try { choice = localStorage.getItem("${STORAGE_KEY}"); } catch (error) {}
    var dark = choice === "dark" || (choice !== "light" && (host ? host === "dark" : media.matches));
    root.classList.toggle("dark", dark);
    root.style.colorScheme = dark ? "dark" : "light";
  }
  apply();
  media.addEventListener("change", apply);
  window.addEventListener("storage", apply);
  window.addEventListener("${CHANGE_EVENT}", apply);
  if (window.parent === window) return;
  window.addEventListener("message", function (event) {
    var mode = event.data && event.data.type === "continual:theme" && event.data.mode;
    if (event.source !== window.parent || (mode !== "light" && mode !== "dark")) return;
    host = mode;
    apply();
  });
  window.parent.postMessage({ type: "continual:theme-request" }, "*");
})();`;

function readPreference(): ThemePreference {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "light" || stored === "dark") return stored;
  } catch {
    // Storage can be blocked; "auto" still applies.
  }
  return "auto";
}

/**
 * The person's light or dark choice for this App, saved in the browser. Null
 * until the page is in the browser, since the server can't know it.
 */
export function useThemePreference() {
  const [preference, setPreference] = useState<ThemePreference | null>(null);
  useEffect(() => setPreference(readPreference()), []);
  const choose = (next: ThemePreference) => {
    try {
      if (next === "auto") localStorage.removeItem(STORAGE_KEY);
      else localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Without storage the choice can't be kept; the page stays as it is.
    }
    setPreference(next);
    window.dispatchEvent(new Event(CHANGE_EVENT));
  };
  return [preference, choose] as const;
}
