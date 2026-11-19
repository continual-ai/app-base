/** Call one of the App's operations from the browser; see `src/server/operations.ts`. */
export async function callOperation<Output>(
  name: string,
  input: Record<string, unknown> = {},
): Promise<Output> {
  const response = await fetch(`/api/v1/${name}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  const result = await response.json().catch(() => null);
  if (!response.ok)
    throw new Error(result?.error ?? "The request could not be completed.");
  return result as Output;
}
