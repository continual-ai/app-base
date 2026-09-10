import { Buffer } from "node:buffer";
import { afterEach, expect, it, vi } from "vitest";
import { createOperationContext } from "@/server/context";

const { me } = vi.hoisted(() => ({ me: vi.fn() }));
vi.mock("@continual/sdk/app", () => ({
  APP_RUNTIME_ASSERTION_HEADER: "x-continual-app-runtime-assertion",
  createAppServerClient: () => ({ auth: { me } }),
}));
afterEach(() => vi.resetAllMocks());
const actor = { actorId: "alice", name: "Alice", email: null };
function request(host: string) {
  return new Request("http://sandbox.internal/api/v1/currentActor", {
    headers: {
      "x-continual-app-runtime-assertion": `header.${Buffer.from(JSON.stringify({ host })).toString("base64url")}.signature`,
      "x-forwarded-host": "evil.example",
    },
  });
}
it("uses the verified assertion host, not the sandbox or forwarded host", async () => {
  me.mockResolvedValue(actor);
  expect(await createOperationContext(request("app.example"))).toMatchObject({
    actor,
    origin: "https://app.example",
  });
});
it("does not accept a forged assertion when authentication fails", async () => {
  me.mockRejectedValue(new Error("Invalid assertion"));
  await expect(createOperationContext(request("evil.example"))).rejects.toThrow(
    "Invalid assertion",
  );
});
it("rejects malformed authenticated host values", async () => {
  me.mockResolvedValue(actor);
  await expect(
    createOperationContext(request("app.example/path")),
  ).rejects.toThrow("Invalid authenticated App host");
});
it("uses the request origin without an assertion for local execution", async () => {
  me.mockResolvedValue(actor);
  expect(
    await createOperationContext(new Request("http://localhost:9999")),
  ).toMatchObject({ origin: "http://localhost:9999" });
});
