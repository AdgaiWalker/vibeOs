import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import {
  agencyInstallPrompt,
  skillRepository,
} from "../src/data/install.js";

test("homepage install source follows the branch that publishes renamed skills", () => {
  assert.equal(skillRepository.ref, "main");
  assert.equal(
    skillRepository.sourceUrl,
    "https://github.com/AdgaiWalker/vibeOs/tree/main",
  );
});

test("repository publishes the complete Vibe Tri-Pack", () => {
  assert.deepEqual(
    skillRepository.skills.map(({ name }) => name),
    ["vibe-check", "vibe-flow", "vibe-recipe"],
  );
});

test("install prompt stays at the two-line zero-friction entry", () => {
  assert.equal(
    agencyInstallPrompt,
    "https://github.com/AdgaiWalker/vibeOs\n帮我安装技能",
  );
});

test("README and website share one prompt and one safety expectation", async () => {
  const readme = await readFile(new URL("../README.md", import.meta.url), "utf8");
  assert.equal(readme.includes(agencyInstallPrompt), true);
  assert.match(
    readme,
    /AI 会先检查兼容性、安装位置和同名冲突，等你确认后再开始/,
  );
});
