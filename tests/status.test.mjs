import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtemp } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import os from "node:os";
import path from "node:path";
import test from "node:test";

const repositoryRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const skillNames = ["skill-craft", "vibe-craft", "vibe-flow"];

test("make status reports repository links without changing them", async () => {
  const codexHome = await mkdtemp(path.join(os.tmpdir(), "agency-codex-home-"));
  const environment = { ...process.env, CODEX_HOME: codexHome };
  const linkResult = spawnSync("make", ["link"], {
    cwd: repositoryRoot,
    encoding: "utf8",
    env: environment,
  });
  assert.equal(linkResult.status, 0);

  const statusResult = spawnSync("make", ["status"], {
    cwd: repositoryRoot,
    encoding: "utf8",
    env: environment,
  });

  assert.equal(
    statusResult.status,
    0,
    `expected make status to pass\n${statusResult.stdout}${statusResult.stderr}`,
  );
  for (const skillName of skillNames) {
    assert.match(statusResult.stdout, new RegExp(`${skillName}: linked`));
  }
});
