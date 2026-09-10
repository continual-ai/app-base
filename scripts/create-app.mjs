import {
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, resolve, basename } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const [key, displayName = key] = process.argv.slice(2);
if (!key || !/^[a-z][a-z0-9-]*$/.test(key)) {
  throw new Error("Usage: pnpm create-app <lowercase-app-key> [display-name]");
}
const destination = join(root, "apps", key);
if (existsSync(destination)) throw new Error(`App already exists: apps/${key}`);
const excluded = new Set([
  "node_modules",
  ".output",
  ".nitro",
  ".tanstack",
  ".wrangler",
  ".continual",
  "dist",
  "coverage",
  "routeTree.gen.ts",
]);
mkdirSync(destination, { recursive: true });
cpSync(join(root, "templates/app"), destination, {
  recursive: true,
  filter: (source) =>
    !excluded.has(basename(source)) &&
    !basename(source).startsWith(".env") &&
    !basename(source).startsWith(".dev.vars"),
});
const packagePath = join(destination, "package.json");
const pkg = JSON.parse(readFileSync(packagePath, "utf8"));
pkg.name = key;
pkg.continual = { ...pkg.continual, key, name: displayName };
writeFileSync(packagePath, JSON.stringify(pkg, null, 2) + "\n");
console.log(
  `Created apps/${key}. Run pnpm install, then pnpm --dir apps/${key} dev.`,
);
