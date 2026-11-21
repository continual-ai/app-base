import { useThemePreference, type ThemePreference } from "@/lib/theme";
import { cn } from "@/lib/utils";
import { KitIcon, type KitIconName } from "./icons";

const choices: { value: ThemePreference; label: string; icon: KitIconName }[] =
  [
    { value: "auto", label: "Automatic", icon: "auto" },
    { value: "light", label: "Light", icon: "sun" },
    { value: "dark", label: "Dark", icon: "moon" },
  ];

/**
 * Light, dark or automatic, kept in the browser for this App. `AppShell` and
 * `AppHeader` already show it beside the person signed in.
 */
export function ThemePicker({ className }: { className?: string }) {
  const [preference, choose] = useThemePreference();
  return (
    <div
      aria-label="Appearance"
      className={cn(
        "inline-flex shrink-0 items-center gap-0.5 rounded-md bg-muted p-0.5",
        className,
      )}
      role="radiogroup"
    >
      {choices.map(({ value, label, icon }) => (
        <button
          aria-checked={preference === value}
          aria-label={label}
          className="flex size-7 items-center justify-center rounded-sm text-muted-foreground transition-colors duration-150 ease-kit hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring aria-checked:bg-background aria-checked:text-foreground aria-checked:shadow-surface"
          key={value}
          onClick={() => choose(value)}
          role="radio"
          title={label}
          type="button"
        >
          <KitIcon name={icon} className="size-3.5" />
        </button>
      ))}
    </div>
  );
}
