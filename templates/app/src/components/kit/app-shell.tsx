import { useEffect, useState, type ReactNode } from "react";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useViewer } from "@/lib/use-viewer";
import { cn } from "@/lib/utils";
import { BrandMark } from "./app-header";
import { initials } from "./format";
import { KitIcon, type KitIconName } from "./icons";

export type ShellItem = {
  label: string;
  /** A kit icon name, or any small node such as an `AgentMark`. */
  icon?: KitIconName | ReactNode;
  /** A number after the label. `attention` draws it as a filled badge. */
  count?: number;
  attention?: boolean;
  /** A short note after the label instead of a count, e.g. "Working". */
  note?: ReactNode;
  current?: boolean;
  onSelect?: () => void;
};

export type ShellSection = { label?: string; items: ShellItem[] };

function NavItem({ item, onPick }: { item: ShellItem; onPick?: () => void }) {
  const icon =
    typeof item.icon === "string" ? (
      <KitIcon name={item.icon as KitIconName} className="size-4" />
    ) : (
      item.icon
    );
  return (
    <button
      aria-current={item.current ? "page" : undefined}
      className={cn(
        "group flex h-8 w-full min-w-0 items-center gap-2 rounded-md px-2 text-left text-small transition-colors duration-150 ease-kit focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring pointer-coarse:h-11",
        item.current
          ? "bg-sidebar-accent font-medium text-strong"
          : "text-soft hover:bg-sidebar-accent/60 hover:text-strong",
      )}
      onClick={() => {
        item.onSelect?.();
        onPick?.();
      }}
      type="button"
    >
      {icon ? (
        <span
          className={cn(
            "flex size-4 shrink-0 items-center justify-center",
            item.current
              ? "text-foreground"
              : "text-muted-foreground group-hover:text-foreground",
          )}
        >
          {icon}
        </span>
      ) : null}
      <span className="min-w-0 flex-1 truncate">{item.label}</span>
      {item.note ? (
        <span className="shrink-0 text-caption text-muted-foreground">
          {item.note}
        </span>
      ) : item.count !== undefined ? (
        <span
          className={cn(
            "shrink-0 text-caption tabular-nums",
            item.attention
              ? "inline-flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-brand px-1 font-medium text-brand-foreground"
              : "text-muted-foreground",
          )}
        >
          {item.count}
        </span>
      ) : null}
    </button>
  );
}

function Navigation({
  name,
  subtitle,
  sections,
  onPick,
}: {
  name: string;
  subtitle?: string;
  sections: ShellSection[];
  onPick?: () => void;
}) {
  const viewer = useViewer();
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex min-w-0 items-center gap-2.5 px-2 pt-1 pb-4">
        <BrandMark
          name={subtitle || name}
          className="size-6 rounded-md text-caption"
        />
        <div className="min-w-0 leading-tight">
          <div className="truncate text-small font-medium text-strong">
            {name}
          </div>
          {subtitle ? (
            <div className="truncate text-caption text-muted-foreground">
              {subtitle}
            </div>
          ) : null}
        </div>
      </div>
      <nav
        aria-label={`${name} navigation`}
        className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto"
      >
        {sections.map((section, index) => (
          <div className="grid gap-0.5" key={section.label ?? index}>
            {section.label ? (
              <div className="px-2 pb-1 text-caption text-muted-foreground">
                {section.label}
              </div>
            ) : null}
            {section.items.map((item) => (
              <NavItem item={item} key={item.label} onPick={onPick} />
            ))}
          </div>
        ))}
      </nav>
      {viewer ? (
        <div className="mt-3 flex min-w-0 items-center gap-2 px-2 py-2">
          <span
            aria-hidden="true"
            className="flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-soft text-micro font-semibold text-brand-ink"
          >
            {initials(viewer.name)}
          </span>
          <span className="min-w-0 truncate text-small font-medium text-strong">
            {viewer.name}
          </span>
        </div>
      ) : null}
    </div>
  );
}

/**
 * The App's frame: navigation in a sidebar on the canvas, and the App on an
 * inset panel. On phones the sidebar becomes a sheet behind a menu button.
 * Put a `PanelHeader` first inside, then the view.
 */
export function AppShell({
  name,
  subtitle,
  sections,
  children,
  className,
}: {
  name: string;
  /** Usually the company the App is for. */
  subtitle?: string;
  sections: ShellSection[];
  children: ReactNode;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1024px)");
    const closeOnDesktop = () => {
      if (desktop.matches) setOpen(false);
    };
    closeOnDesktop();
    desktop.addEventListener("change", closeOnDesktop);
    return () => desktop.removeEventListener("change", closeOnDesktop);
  }, []);
  const current = sections
    .flatMap((section) => section.items)
    .find((item) => item.current);

  return (
    <div className="min-h-svh min-w-0 bg-canvas text-foreground lg:grid lg:h-svh lg:grid-cols-[15rem_minmax(0,1fr)] lg:p-2 lg:pl-0">
      <aside className="hidden min-h-0 px-3 pt-3 pb-1 lg:block">
        <Navigation name={name} sections={sections} subtitle={subtitle} />
      </aside>
      <header className="sticky top-0 z-30 flex min-w-0 items-center gap-2 border-b border-line bg-canvas/90 px-2 py-1.5 backdrop-blur-md lg:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <button
              aria-label="Open navigation"
              className="flex size-11 items-center justify-center rounded-md text-soft hover:bg-accent"
              type="button"
            >
              <KitIcon name="menu" className="size-5" />
            </button>
          </SheetTrigger>
          <SheetContent
            side="left"
            aria-describedby={undefined}
            className="bg-canvas"
          >
            <SheetTitle className="sr-only">{name}</SheetTitle>
            <Navigation
              name={name}
              onPick={() => setOpen(false)}
              sections={sections}
              subtitle={subtitle}
            />
          </SheetContent>
        </Sheet>
        <BrandMark
          name={subtitle || name}
          className="size-6 rounded-md text-caption"
        />
        <span className="min-w-0 truncate text-small font-medium text-strong">
          {current?.label ?? name}
        </span>
      </header>
      <main
        className={cn(
          "flex min-h-0 min-w-0 flex-col bg-background lg:overflow-hidden lg:rounded-2xl lg:shadow-panel",
          className,
        )}
      >
        {children}
      </main>
    </div>
  );
}

/**
 * The 48px bar at the top of the panel: the view's title or trail on the left,
 * its actions on the right. Phones show the title in the shell's bar instead.
 */
export function PanelHeader({
  title,
  trail = [],
  meta,
  actions,
}: {
  title: ReactNode;
  /** Parent views before the title, e.g. ["Clients"]. */
  trail?: ReactNode[];
  /** A small note or badge after the title. */
  meta?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <div className="flex min-h-12 min-w-0 shrink-0 flex-wrap items-center gap-x-3 gap-y-2 border-b border-line px-4 py-2 max-lg:hidden">
      <div className="flex min-w-0 items-center gap-1.5 text-small">
        {trail.map((part, index) => (
          <span
            className="flex shrink-0 items-center gap-1.5 text-muted-foreground"
            key={index}
          >
            {part}
            <KitIcon name="chevronRight" className="size-3.5" />
          </span>
        ))}
        <h1 className="min-w-0 truncate text-small font-medium text-strong">
          {title}
        </h1>
        {meta ? <span className="shrink-0">{meta}</span> : null}
      </div>
      {actions ? (
        <div className="ml-auto flex shrink-0 items-center gap-2">
          {actions}
        </div>
      ) : null}
    </div>
  );
}
