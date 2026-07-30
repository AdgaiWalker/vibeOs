import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import {
  access,
  lstat,
  mkdir,
  mkdtemp,
  unlink,
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

test("make unlink removes only links owned by this repository", async () => {
  const codexHome = await mkdtemp(path.join(os.tmpdir(), "agency-codex-home-"));
  const environment = { ...process.env, CODEX_HOME: codexHome };
  const linkResult = spawnSync("make", ["link"], {
    cwd: repositoryRoot,
    encoding: "utf8",
    env: environment,
  });
  assert.equal(linkResult.status, 0);

  const unrelatedSkill = path.join(codexHome, "skills", "unrelated-skill");
  await mkdir(unrelatedSkill);
  await writeFile(path.join(unrelatedSkill, "SKILL.md"), "leave me");

  const unlinkResult = spawnSync("make", ["unlink"], {
    cwd: repositoryRoot,
    encoding: "utf8",
    env: environment,
  });

  assert.equal(
    unlinkResult.status,
    0,
    `expected make unlink to pass\n${unlinkResult.stdout}${unlinkResult.stderr}`,
  );

  for (const skillName of skillNames) {
    await assert.rejects(
      lstat(path.join(codexHome, "skills", skillName)),
      (error) => error.code === "ENOENT",
    );
  }
  await access(path.join(unrelatedSkill, "SKILL.md"));
});

test("make unlink leaves a same-name path it does not own", async () => {
  const codexHome = await mkdtemp(path.join(os.tmpdir(), "agency-codex-home-"));
  const environment = { ...process.env, CODEX_HOME: codexHome };
  const linkResult = spawnSync("make", ["link"], {
    cwd: repositoryRoot,
    encoding: "utf8",
    env: environment,
  });
  assert.equal(linkResult.status, 0);

  const conflictRoot = path.join(codexHome, "skills", "vibe-craft");
  const marker = path.join(conflictRoot, "owner.txt");
  await unlink(conflictRoot);
  await mkdir(conflictRoot);
  await writeFile(marker, "another installation");

  const unlinkResult = spawnSync("make", ["unlink"], {
    cwd: repositoryRoot,
    encoding: "utf8",
    env: environment,
  });

  assert.notEqual(unlinkResult.status, 0);
  assert.match(unlinkResult.stderr, /vibe-craft: not owned/);
  await access(marker);
});
