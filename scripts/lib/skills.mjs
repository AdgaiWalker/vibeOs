import { lstat, readdir, realpath } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const repositoryRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../..",
);
export const sourceRoot = path.join(repositoryRoot, "skills");
export const codexHome =
  process.env.CODEX_HOME || path.join(os.homedir(), ".codex");
export const targetRoot = path.join(codexHome, "skills");

export async function getSkillNames() {
  const entries = await readdir(sourceRoot, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
}

export async function getSkillRecord(skillName) {
  const source = path.join(sourceRoot, skillName);
  const target = path.join(targetRoot, skillName);

  let targetStats;
  try {
    targetStats = await lstat(target);
  } catch (error) {
    if (error.code === "ENOENT") {
      return { skillName, source, target, state: "missing" };
    }
    throw error;
  }

  if (!targetStats.isSymbolicLink()) {
    return { skillName, source, target, state: "conflict" };
  }

  try {
    if ((await realpath(target)) === (await realpath(source))) {
      return { skillName, source, target, state: "linked" };
    }
  } catch (error) {
    if (error.code !== "ENOENT") {
      throw error;
    }
  }

  return { skillName, source, target, state: "conflict" };
}
