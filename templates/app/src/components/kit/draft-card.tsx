import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { AgentMark } from "./agent";
import { KitIcon } from "./icons";
import { Kbd, Tray } from "./tray";

export type DraftState = "pending" | "approved" | "skipped";

/**
 * Something prepared for a person to review: an email, a message or a
 * change, on a tray that says who prepared it. Pending drafts offer Approve
 * (also ⌘ or Ctrl and Enter), Edit and Skip; decided ones fold into one line
 * saying what happened.
 */
export function DraftCard({
  id,
  kind,
  to,
  subject,
  body,
  state,
  decision,
  editing,
  agent,
  label,
  onApprove,
  onEdit,
  onCancel,
  onSave,
  onSkip,
}: {
  /** Unique on the page, for the edit field. */
  id: string;
  /** What was drafted, e.g. "Reminder email". */
  kind: string;
  to?: string;
  subject?: string;
  body: string;
  state: DraftState;
  /** Shown once decided, e.g. "Reminder sent · Dana Ruiz, just now". */
  decision?: string;
  editing: boolean;
  /** The agent that prepared it, shown with its mark on the tray. */
  agent?: { name: string; color?: string };
  /** Replaces the tray's label, e.g. "Collector · drafted at 08:02". */
  label?: ReactNode;
  onApprove: () => void;
  onEdit: () => void;
  onCancel: () => void;
  onSave: (body: string) => void;
  onSkip: () => void;
}) {
  const [text, setText] = useState("");
  const fieldId = `draft-${id}`;

  if (state !== "pending")
    return (
      <Tray className="motion-safe:animate-kit-enter">
        <p className="flex items-center gap-2.5 px-2.5 py-2 text-small text-soft">
          <span
            className={cn(
              "flex size-5 shrink-0 items-center justify-center rounded-full",
              state === "approved"
                ? "bg-tone-green-soft text-tone-green"
                : "bg-tone-gray-soft text-tone-gray",
            )}
          >
            <KitIcon
              name={state === "approved" ? "check" : "skip"}
              className="size-3"
            />
          </span>
          <span className="min-w-0">
            {decision ??
              (state === "approved" ? `${kind} approved` : `${kind} skipped`)}
          </span>
        </p>
      </Tray>
    );

  return (
    <Tray
      label={
        label ?? (
          <>
            <AgentMark color={agent?.color} className="size-3.5" />
            <span className="font-medium text-soft">{kind}</span>
            <span>
              ·{" "}
              {agent
                ? `${agent.name} drafted it for you`
                : "Drafted for review"}
            </span>
          </>
        )
      }
    >
      <div
        className="overflow-hidden rounded-xl bg-card shadow-surface focus-within:ring-2 focus-within:ring-ring/40"
        onKeyDown={(event) => {
          if (event.key !== "Enter" || !(event.metaKey || event.ctrlKey))
            return;
          event.preventDefault();
          if (editing) onSave(text);
          else onApprove();
        }}
      >
        {to || subject ? (
          <dl className="grid gap-1 border-b border-line px-4 py-2.5 text-small">
            {to ? (
              <div className="grid grid-cols-[3.75rem_minmax(0,1fr)] gap-2">
                <dt className="text-muted-foreground">To</dt>
                <dd className="min-w-0 wrap-anywhere">{to}</dd>
              </div>
            ) : null}
            {subject ? (
              <div className="grid grid-cols-[3.75rem_minmax(0,1fr)] gap-2">
                <dt className="text-muted-foreground">Subject</dt>
                <dd className="min-w-0 font-medium text-strong wrap-anywhere">
                  {subject}
                </dd>
              </div>
            ) : null}
          </dl>
        ) : null}
        {editing ? (
          <>
            <Label className="sr-only" htmlFor={fieldId}>
              Edit {kind.toLowerCase()}
            </Label>
            <Textarea
              autoFocus
              className="min-h-56 resize-y rounded-none bg-transparent px-4 py-3 text-body shadow-none focus-visible:ring-0"
              id={fieldId}
              onChange={(event) => setText(event.target.value)}
              value={text}
            />
          </>
        ) : (
          <p className="max-w-[72ch] px-4 py-3 text-body whitespace-pre-line">
            {body}
          </p>
        )}
        <div className="flex flex-wrap items-center gap-2 border-t border-line bg-muted px-3 py-2.5">
          {editing ? (
            <>
              <Button onClick={() => onSave(text)} type="button">
                Save changes
                <Kbd onPrimary>⌘↵</Kbd>
              </Button>
              <Button onClick={onCancel} type="button" variant="ghost">
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Button onClick={onApprove} type="button">
                Approve
                <Kbd onPrimary>⌘↵</Kbd>
              </Button>
              <Button
                onClick={() => {
                  setText(body);
                  onEdit();
                }}
                type="button"
                variant="outline"
              >
                Edit
              </Button>
              <Button onClick={onSkip} type="button" variant="ghost">
                Skip
              </Button>
            </>
          )}
        </div>
      </div>
    </Tray>
  );
}
