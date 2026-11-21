/** Call one of the App's operations from the browser; see `src/server/operations.ts`. */
export async function callOperation<Output>(
  name: string,
  input: Record<string, unknown> = {},
): Promise<Output> {
  const send = () =>
    fetch(`/api/v1/${name}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
  let response = await send();
  if (response.status === 401 && (await renewSession()))
    response = await send();
  const result = await response.json().catch(() => null);
  if (!response.ok)
    throw new Error(result?.error ?? "The request could not be completed.");
  return result as Output;
}

let renewing: Promise<boolean> | null = null;

/**
 * Inside Continual, the App's sign-in lasts a few minutes while the page can
 * stay open for hours. When it lapses, ask Continual to sign the App in again;
 * it answers once the new session is in place, so the request can be retried
 * once.
 */
function renewSession(): Promise<boolean> {
  if (window.parent === window) return Promise.resolve(false);
  renewing ??= new Promise<boolean>((resolve) => {
    const finish = (renewed: boolean) => {
      window.removeEventListener("message", onMessage);
      clearTimeout(timeout);
      renewing = null;
      resolve(renewed);
    };
    const onMessage = (event: MessageEvent) => {
      if (
        event.source === window.parent &&
        event.data?.type === "continual:app-session"
      )
        finish(true);
    };
    const timeout = setTimeout(() => finish(false), 15_000);
    window.addEventListener("message", onMessage);
    window.parent.postMessage(
      {
        type: "continual:app-session-refresh",
        path: window.location.pathname + window.location.search,
      },
      "*",
    );
  });
  return renewing;
}
