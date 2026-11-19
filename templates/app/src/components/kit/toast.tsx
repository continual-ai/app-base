import { useCallback, useEffect, useState } from "react";
import { KitIcon } from "./icons";

type ToastAction = { label: string; onClick: () => void };
type ToastMessage = { key: number; text: string; action?: ToastAction };

/**
 * A short confirmation after an action: `const [toast, show] = useToast()`.
 * Pass an action such as Undo as the second argument; the toast then stays a
 * little longer.
 */
export function useToast() {
  const [toast, setToast] = useState<ToastMessage | null>(null);
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), toast.action ? 6000 : 3200);
    return () => clearTimeout(timer);
  }, [toast]);
  const show = useCallback(
    (text: string, action?: ToastAction) =>
      setToast({ key: Date.now(), text, action }),
    [],
  );
  const dismiss = useCallback(() => setToast(null), []);
  return [toast, show, dismiss] as const;
}

/** Render once near the end of the page. */
export function Toast({
  toast,
  onDismiss,
}: {
  toast: ToastMessage | null;
  onDismiss?: () => void;
}) {
  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-[max(1rem,env(safe-area-inset-bottom))] z-50 flex justify-center px-4"
      role="status"
    >
      {toast ? (
        <div
          className="pointer-events-auto flex max-w-full items-center gap-2.5 rounded-xl bg-popover py-2 pr-2 pl-3 text-small font-medium text-strong shadow-raised motion-safe:animate-kit-enter"
          key={toast.key}
        >
          <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-tone-green-soft text-tone-green">
            <KitIcon name="check" className="size-3" />
          </span>
          <span className="min-w-0 truncate py-0.5">{toast.text}</span>
          {toast.action ? (
            <button
              className="h-6 shrink-0 rounded-md bg-fill px-2 text-caption font-medium text-strong transition-colors duration-150 hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              onClick={() => {
                toast.action?.onClick();
                onDismiss?.();
              }}
              type="button"
            >
              {toast.action.label}
            </button>
          ) : (
            <span className="w-1.5" />
          )}
        </div>
      ) : null}
    </div>
  );
}
