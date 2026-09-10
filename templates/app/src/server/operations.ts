import { z } from "zod";
import { defineOperation } from "./operation";

/** Add app operations here. Every entry is exposed through HTTP and MCP. */
export const operations = {
  currentActor: defineOperation({
    description:
      "Return the authenticated Continual actor making this request.",
    input: z.object({}),
    output: z.object({
      actor: z.object({
        actorId: z.string(),
        name: z.string(),
        email: z.string().nullable(),
      }),
    }),
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
    },
    handler: async ({ context }) => ({ actor: context.actor }),
  }),
};
