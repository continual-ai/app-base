import { Buffer } from "node:buffer";
import {
  APP_RUNTIME_ASSERTION_HEADER,
  createAppServerClient,
} from "@continual/sdk/app";
import type { OperationContext } from "./operation";

export async function createOperationContext(
  request: Request,
): Promise<OperationContext> {
  const continual = createAppServerClient({ request });
  // auth.me() verifies this request's runtime assertion with Continual before any
  // assertion claims are used. Merely decoding a JWT does not authenticate it.
  const actor = await continual.auth.me();
  const assertion = request.headers.get(APP_RUNTIME_ASSERTION_HEADER);
  let origin = new URL(request.url).origin;
  if (assertion) {
    const { host } = JSON.parse(
      Buffer.from(assertion.split(".")[1], "base64url").toString(),
    );
    // Managed public App URLs use HTTPS, including development previews.
    if (typeof host !== "string" || new URL(`https://${host}`).host !== host) {
      throw new Error("Invalid authenticated App host.");
    }
    origin = `https://${host}`;
  }
  return { actor, continual, origin };
}
