import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import {
  access,
  lstat,
  mkdir,
  mkdtemp,
  realpath,
  writeFile,
} from "node:fs/promises";
import { fileURLToPath } from "node:url";
import os from "node:os";
import path from "node:path";
import test from "node:test";

const repositoryRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const skillNames = ["skill-craft", "vibe-craft", "vibe-flow"];

test("make link installs all reference skills into an isolated Codex home", async () => {
  const codexHome = await mkdtemp(path.join(os.tmpdir(), "agency-codex-home-"));
  const result = spawnSync("make", ["link"], {
    cwd: repositoryRoot,
    encoding: "utf8",
    env: { ...process.env, CODEX_HOME: codexHome },
  });

  assert.equal(
    result.status,
    0,
    `expected make link to pass\n${result.stdout}${result.stderr}`,
  );

  for (const skillName of skillNames) {
    const installedPath = path.join(codexHome, "skills", skillName);
    assert.equal((await lstat(installedPath)).isSymbolicLink(), true);
    assert.equal(
      await realpath(installedPath),
      await realpath(path.join(repositoryRoot, "skills", skillName)),
    );
  }
});

test("make link reports a same-name conflict without overwriting it", async () => {
  const codexHome = await mkdtemp(path.join(os.tmpdir(), "agency-codex-home-"));
  const conflictRoot = path.join(codexHome, "skills", "vibe-craft");
  const marker = path.join(conflictRoot, "owner.txt");
  await mkdir(conflictRoot, { recursive: true });
  await writeFile(marker, "another installation");

  const result = spawnSync("make", ["link"], {
    cwd: repositoryRoot,
    encoding: "utf8",
    env: { ...process.env, CODEX_HOME: codexHome },
  });

  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /vibe-craft: conflict/);
  await access(marker);
});
