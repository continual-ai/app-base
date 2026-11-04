import { useEffect, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

/** Optional sidebar layout. Pass the same navigation content to both layouts. */
export function AppShell({
  appName,
  navigation,
  children,
  className,
}: {
  appName: string;
  navigation: ReactNode;
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

  return (
    <div className="min-h-svh min-w-0 bg-background text-foreground">
      <aside className="fixed inset-y-0 left-0 hidden w-64 overflow-y-auto border-r bg-sidebar p-4 text-sidebar-foreground lg:block">
        <div className="mb-6 min-w-0 wrap-anywhere font-semibold">
          {appName}
        </div>
        <nav aria-label="Main navigation" className="min-w-0 wrap-anywhere">
          {navigation}
        </nav>
      </aside>
      <header className="flex min-w-0 items-center gap-3 border-b px-4 py-2 lg:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-11"
              aria-label="Open navigation"
            >
              <Icon name="menu" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" aria-describedby={undefined}>
            <SheetTitle className="min-w-0 pr-12 wrap-anywhere font-semibold">
              {appName}
            </SheetTitle>
            <nav
              aria-label="Main navigation"
              className="min-w-0 wrap-anywhere"
              onClick={(event) => {
                if (
                  event.target instanceof Element &&
                  event.target.closest("a[href]")
                )
                  setOpen(false);
              }}
            >
              {navigation}
            </nav>
          </SheetContent>
        </Sheet>
        <div className="min-w-0 wrap-anywhere font-semibold">{appName}</div>
      </header>
      <div className="min-w-0 lg:pl-64">
        <main
          className={cn(
            "min-w-0 w-full space-y-6 p-4 wrap-anywhere sm:p-6 lg:p-8",
            className,
          )}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
