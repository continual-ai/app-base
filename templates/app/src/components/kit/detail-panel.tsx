import type { ReactNode } from "react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";

/**
 * The selected record's details: a sticky side panel on wide screens and a
 * sheet on phones. Open the sheet when a record is chosen below `lg`, or
 * always with `sheetOnly` (boards, which use the full width).
 */
export function DetailPanel({
  title,
  sheetOpen,
  onSheetOpenChange,
  sheetOnly = false,
  children,
}: {
  title: string;
  sheetOpen: boolean;
  onSheetOpenChange: (open: boolean) => void;
  sheetOnly?: boolean;
  children: ReactNode;
}) {
  return (
    <>
      {sheetOnly ? null : (
        <aside
          aria-label={`${title} details`}
          className="hidden min-w-0 lg:block"
        >
          <div className="sticky top-20 max-h-[calc(100svh-6rem)] overflow-y-auto rounded-xl bg-card shadow-surface">
            <div className="motion-safe:animate-kit-enter" key={title}>
              {children}
            </div>
          </div>
        </aside>
      )}
      <Sheet open={sheetOpen} onOpenChange={onSheetOpenChange}>
        <SheetContent className="w-full max-w-full gap-0 bg-card p-0 sm:w-[30rem] sm:max-w-[calc(100%-2rem)]">
          <SheetTitle className="sr-only">{title} details</SheetTitle>
          {children}
        </SheetContent>
      </Sheet>
    </>
  );
}

/** Whether the detail opens as a sheet rather than beside the list. */
export function opensAsSheet() {
  return !window.matchMedia("(min-width: 1024px)").matches;
}
