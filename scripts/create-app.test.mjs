import { test } from "node:test";
import assert from "node:assert/strict";
import {
  mkdtempSync,
  mkdirSync,
  cpSync,
  readFileSync,
  writeFileSync,
  existsSync,
  rmSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

test("creates independent Apps, preserves the template, and refuses overwrites or invalid keys", () => {
  const root = mkdtempSync(join(tmpdir(), "app-template-test-"));
  try {
    mkdirSync(join(root, "scripts"));
    cpSync(
      new URL("./create-app.mjs", import.meta.url),
      join(root, "scripts/create-app.mjs"),
    );
    mkdirSync(join(root, "templates/app/node_modules"), { recursive: true });
    writeFileSync(
      join(root, "templates/app/package.json"),
      JSON.stringify({ name: "app", continual: { key: "app", name: "App" } }),
    );
    writeFileSync(join(root, "templates/app/source.ts"), "original");
    writeFileSync(join(root, "templates/app/.env"), "secret");
    const run = (...args) =>
      spawnSync(
        process.execPath,
        [join(root, "scripts/create-app.mjs"), ...args],
        { encoding: "utf8" },
      );
    assert.equal(run("first", "First App").status, 0);
    assert.deepEqual(
      JSON.parse(readFileSync(join(root, "apps/first/package.json"))),
      { name: "first", continual: { key: "first", name: "First App" } },
    );
    assert.equal(existsSync(join(root, "apps/first/.env")), false);
    assert.equal(existsSync(join(root, "apps/first/node_modules")), false);
    writeFileSync(join(root, "apps/first/source.ts"), "user changes");
    assert.notEqual(run("first").status, 0);
    assert.equal(
      readFileSync(join(root, "apps/first/source.ts"), "utf8"),
      "user changes",
    );
    assert.equal(run("second").status, 0);
    assert.equal(
      readFileSync(join(root, "apps/second/source.ts"), "utf8"),
      "original",
    );
    assert.equal(
      readFileSync(join(root, "templates/app/source.ts"), "utf8"),
      "original",
    );
    assert.notEqual(run("../outside").status, 0);
    assert.notEqual(run().status, 0);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
