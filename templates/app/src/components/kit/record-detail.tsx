import type { ReactNode } from "react";
import { StatusPill } from "./status-pill";
import type { Tone } from "./tones";

/**
 * One record: its name and status, an optional slot such as a draft, its
 * fields, and its history (newest first). Put it in a `DetailPanel`.
 */
export function RecordDetail({
  title,
  subtitle,
  status,
  fields = [],
  history = [],
  children,
}: {
  title: string;
  subtitle?: string;
  status?: { tone: Tone; label: string };
  fields?: [label: string, value: ReactNode][];
  history?: { when: string; what: string }[];
  children?: ReactNode;
}) {
  return (
    <>
      <div className="px-5 pt-5 pb-4 pr-16 lg:pr-5">
        {status ? <StatusPill {...status} /> : null}
        <h2 className="mt-3 text-heading font-medium text-strong wrap-anywhere">
          {title}
        </h2>
        {subtitle ? (
          <p className="mt-0.5 text-small text-muted-foreground">{subtitle}</p>
        ) : null}
      </div>
      {children ? <div className="px-3 pb-4">{children}</div> : null}
      {fields.length ? (
        <section className="@container border-t border-line px-5 py-4">
          <h3 className="text-caption font-medium text-muted-foreground">
            Details
          </h3>
          <dl className="mt-3 grid gap-2.5 text-small @xl:grid-cols-2 @xl:gap-x-8">
            {fields.map(([label, value]) => (
              <div
                className="grid grid-cols-[7rem_minmax(0,1fr)] gap-3"
                key={label}
              >
                <dt className="text-muted-foreground">{label}</dt>
                <dd className="wrap-anywhere tabular-nums">{value}</dd>
              </div>
            ))}
          </dl>
        </section>
      ) : null}
      {history.length ? (
        <section className="border-t border-line px-5 py-4">
          <h3 className="text-caption font-medium text-muted-foreground">
            History
          </h3>
          <ol className="relative mt-3 grid gap-3 before:absolute before:top-2 before:bottom-2 before:left-[3px] before:w-px before:bg-border">
            {history.map(({ when, what }, index) => (
              <li
                className="relative grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-3 pl-5 text-small"
                key={`${index}-${what}`}
              >
                <span
                  aria-hidden="true"
                  className={
                    index === 0
                      ? "absolute top-1.5 left-0 size-[7px] rounded-full bg-brand ring-3 ring-card"
                      : "absolute top-1.5 left-0 size-[7px] rounded-full bg-muted-foreground/40 ring-3 ring-card"
                  }
                />
                <span className="wrap-anywhere">{what}</span>
                <span className="text-caption whitespace-nowrap text-muted-foreground tabular-nums">
                  {when}
                </span>
              </li>
            ))}
          </ol>
        </section>
      ) : null}
    </>
  );
}
