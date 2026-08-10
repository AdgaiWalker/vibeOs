import test from "node:test";
import assert from "node:assert/strict";
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

test("install prompt maps every published skill to its repository path", () => {
  for (const { name, path } of skillRepository.skills) {
    assert.match(agencyInstallPrompt, new RegExp(name));
    assert.match(agencyInstallPrompt, new RegExp(path));
  }
});

test("install prompt requires scope and skill confirmation before writes", () => {
  assert.match(agencyInstallPrompt, /先不要修改文件/);
  assert.match(agencyInstallPrompt, /全局安装/);
  assert.match(agencyInstallPrompt, /当前项目安装/);
  assert.match(agencyInstallPrompt, /选择安装一个还是全部/);
  assert.match(agencyInstallPrompt, /等待我的回答/);
});

test("install prompt covers conflicts, verification, and honest failure", () => {
  assert.match(agencyInstallPrompt, /同名不同来源冲突/);
  assert.match(agencyInstallPrompt, /不要覆盖或删除/);
  assert.match(agencyInstallPrompt, /验证结果/);
  assert.match(agencyInstallPrompt, /卸载和回滚方法/);
  assert.match(agencyInstallPrompt, /不要宣称安装成功/);
});

test("install prompt treats legacy skill names as an explicit migration", () => {
  assert.match(agencyInstallPrompt, /vibe-craft/);
  assert.match(agencyInstallPrompt, /skill-craft/);
  assert.match(agencyInstallPrompt, /不要直接删除/);
  assert.match(agencyInstallPrompt, /明确同意迁移/);
});
