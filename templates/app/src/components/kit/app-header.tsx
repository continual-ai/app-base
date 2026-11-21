import type { ComponentType, ReactNode } from "react";
import { useViewer } from "@/lib/use-viewer";
import { cn } from "@/lib/utils";
import { initials } from "./format";
import { KitIcon, type KitIconName } from "./icons";
import { ThemePicker } from "./theme-picker";

export type HeaderView = { label: string; icon?: KitIconName; count?: number };

/**
 * An icon component, such as a `lucide-react` export, that says what the App
 * does: `Receipt` for invoices, `Truck` for deliveries, `Megaphone` for
 * campaigns. Never the company's initial.
 */
export type AppIcon = ComponentType<{
  className?: string;
  strokeWidth?: number;
}>;

/** The App's mark: its icon on the accent, with a soft top light. */
export function BrandMark({
  icon: Icon,
  className,
}: {
  icon: AppIcon;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "relative flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-brand text-brand-foreground shadow-[inset_0_1px_0_rgb(255_255_255/0.25),inset_0_0_0_1px_rgb(0_0_0/0.08),0_1px_2px_rgb(0_0_0/0.12)]",
        className,
      )}
    >
      <span className="absolute inset-0 bg-linear-to-b from-white/20 to-transparent" />
      <Icon className="relative size-[56%]" strokeWidth={2} />
    </span>
  );
}

/**
 * The App's top bar: its mark, name and owner, the views, and the person
 * signed in to Continual. Views move to their own row on phones.
 */
export function AppHeader({
  name,
  icon,
  subtitle,
  views = [],
  current = 0,
  onSelect,
  actions,
}: {
  name: string;
  /** What the App does, as an icon; see `AppIcon`. */
  icon: AppIcon;
  /** Usually the company the App is for. */
  subtitle?: string;
  views?: HeaderView[];
  current?: number;
  onSelect?: (index: number) => void;
  /** Extra controls before the signed-in person, e.g. a primary button. */
  actions?: ReactNode;
}) {
  const viewer = useViewer();
  return (
    <header className="sticky top-0 z-30 border-b bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1440px] flex-wrap items-center gap-x-8 px-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-3 py-3">
          <BrandMark icon={icon} />
          <div className="min-w-0">
            <h1 className="truncate text-title font-medium text-strong">
              {name}
            </h1>
            {subtitle ? (
              <p className="truncate text-caption text-muted-foreground">
                {subtitle}
              </p>
            ) : null}
          </div>
        </div>
        {views.length ? (
          <nav
            aria-label={`${name} views`}
            className="order-last -mx-4 flex w-[calc(100%+2rem)] gap-1 overflow-x-auto border-t px-2.5 [scrollbar-width:none] sm:order-none sm:mx-0 sm:w-auto sm:self-stretch sm:border-t-0 sm:px-0"
          >
            {views.map(({ label, icon, count }, index) => {
              const active = current === index;
              return (
                <button
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "group relative inline-flex min-h-11 shrink-0 items-center gap-2 rounded-md px-2.5 text-small font-medium whitespace-nowrap transition-colors duration-150 ease-kit focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring",
                    active
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                  key={label}
                  onClick={() => onSelect?.(index)}
                  type="button"
                >
                  {icon ? (
                    <KitIcon
                      name={icon}
                      className={cn(
                        "size-4 transition-colors duration-150",
                        active
                          ? "text-brand-ink"
                          : "text-muted-foreground/80 group-hover:text-foreground",
                      )}
                    />
                  ) : null}
                  {label}
                  {count ? (
                    <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-brand px-1.5 text-caption font-semibold text-brand-foreground tabular-nums">
                      {count}
                    </span>
                  ) : null}
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute inset-x-2.5 -bottom-px h-0.5 rounded-full bg-foreground transition-opacity duration-200 ease-kit",
                      active ? "opacity-100" : "opacity-0",
                    )}
                  />
                </button>
              );
            })}
          </nav>
        ) : null}
        <div className="ml-auto flex shrink-0 items-center gap-2.5 py-3">
          {actions}
          <ThemePicker />
          {viewer ? (
            <>
              <span className="hidden max-w-40 truncate text-small font-medium md:block">
                {viewer.name}
              </span>
              <span
                aria-label={`Signed in as ${viewer.name}`}
                className="flex size-8 items-center justify-center rounded-full bg-brand-soft text-caption font-semibold text-brand-ink ring-1 ring-brand/15"
                role="img"
              >
                {initials(viewer.name)}
              </span>
            </>
          ) : null}
        </div>
      </div>
    </header>
  );
}
