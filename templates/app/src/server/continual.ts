import { createAppServerClient } from "@continual/sdk/app";

// Add the generated projectToolCatalog here when this App calls typed tools.
// Keep the return type inferred so OperationContext retains the catalog's methods.
export function createContinual(request: Request) {
  return createAppServerClient({ request });
}
