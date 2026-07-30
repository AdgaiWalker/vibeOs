import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";
import test from "node:test";

const repositoryRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const validator = path.join(repositoryRoot, "scripts", "validate-contract.mjs");
const validContract = path.join(
  repositoryRoot,
  "contracts",
  "examples",
  "readme-rewrite.json",
);

test("accepts a complete Agency Contract", () => {
  const result = spawnSync(process.execPath, [validator, validContract], {
    encoding: "utf8",
  });

  assert.equal(
    result.status,
    0,
    `expected a valid contract to pass\n${result.stdout}${result.stderr}`,
  );
  assert.match(result.stdout, /valid Agency Contract/);
});
