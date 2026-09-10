import { createAppServerClient } from "@continual/sdk/app";
import type { OperationContext } from "./operation";

export async function createOperationContext(
  request: Request,
): Promise<OperationContext> {
  const continual = createAppServerClient({ request });
  const actor = await continual.auth.me();
  return { actor, continual };
}
