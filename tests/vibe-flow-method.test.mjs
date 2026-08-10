import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import test from "node:test";

const repositoryRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const vibeFlowRoot = path.join(repositoryRoot, "skills", "vibe-flow");

test("Vibe-Flow routes conditional category-first reasoning to a reference", async () => {
  const skillPath = path.join(vibeFlowRoot, "SKILL.md");
  const referencePath = path.join(
    vibeFlowRoot,
    "references",
    "category-first-principles.md",
  );
  const skillSource = await readFile(skillPath, "utf8");

  await access(referencePath);
  assert.match(skillSource, /category-first-principles\.md/);
  assert.match(skillSource, /多范畴第一性推演/);
  assert.match(skillSource, /人的价值判断/);
  assert.match(skillSource, /事实、因果或预测/);
  assert.match(skillSource, /不要强制共识/);
});

test("Vibe-Flow keeps admission separate from network placement", async () => {
  const skillSource = await readFile(
    path.join(vibeFlowRoot, "SKILL.md"),
    "utf8",
  );

  assert.match(skillSource, /准入裁决/);
  assert.match(skillSource, /Required \/ Optional \/ Conditional \/ Reject/);
  assert.match(skillSource, /执行位置/);
  assert.match(
    skillSource,
    /Main-contradiction \/ Parallel \/ Post-terminal \/ None/,
  );
});

test("Vibe-Flow models the fuller Hua Luogeng coordination loop", async () => {
  const skillSource = await readFile(
    path.join(vibeFlowRoot, "SKILL.md"),
    "utf8",
  );

  for (const expected of [
    "一条或多条主要矛盾线",
    "虚任务",
    "时差",
    "人力、工具、设备、文件和权限",
    "最乐观、最可能、最保守",
    "重新统筹",
  ]) {
    assert.equal(
      skillSource.includes(expected),
      true,
      `Vibe-Flow must include ${expected}`,
    );
  }
});

test("Vibe-Flow routes complex work through an inspectable end-to-end coordination cycle", async () => {
  const skillPath = path.join(vibeFlowRoot, "SKILL.md");
  const referencePath = path.join(
    vibeFlowRoot,
    "references",
    "hua-coordination-cycle.md",
  );
  const [skillSource, referenceSource] = await Promise.all([
    readFile(skillPath, "utf8"),
    readFile(referencePath, "utf8"),
  ]);

  assert.match(skillSource, /hua-coordination-cycle\.md/);
  assert.match(skillSource, /复杂、长周期或资源受限/);
  assert.match(skillSource, /简单、短时且依赖清楚/);

  for (const expected of [
    "任务调查表",
    "统筹网络表",
    "执行偏差表",
    "复盘定额表",
    "计划基线",
    "前推",
    "后推",
    "总时差",
    "触发重新统筹",
    "Vibe-Check",
    "Vibe-Recipe",
  ]) {
    assert.equal(
      referenceSource.includes(expected),
      true,
      `coordination cycle must include ${expected}`,
    );
  }
});

test("The coordination cycle makes resource calendars and artifact lineage computable", async () => {
  const referenceSource = await readFile(
    path.join(
      vibeFlowRoot,
      "references",
      "hua-coordination-cycle.md",
    ),
    "utf8",
  );

  for (const expected of [
    "产物版本",
    "资源日历",
    "固定时间窗",
    "串行调度生成",
    "资源顺序边",
    "不可行",
    "日历感知",
    "等待约束节点",
    "当前启发式未找到方案",
    "替代排序",
    "回溯",
    "不可行证据",
  ]) {
    assert.equal(
      referenceSource.includes(expected),
      true,
      `coordination cycle must make ${expected} explicit`,
    );
  }
});

test("Agency Protocol treats category-first reasoning as an optional mechanism", async () => {
  const protocolSource = await readFile(
    path.join(repositoryRoot, "protocol", "README.md"),
    "utf8",
  );

  assert.match(
    protocolSource,
    /^## Category-conditioned first-principles reasoning$/m,
  );
  assert.match(protocolSource, /optional reasoning mechanism, not a fourth gate/);
  assert.match(protocolSource, /one or more current main-contradiction paths/);
});

test("Vibe-Flow remains a compact gatekeeper", async () => {
  const skillSource = await readFile(
    path.join(vibeFlowRoot, "SKILL.md"),
    "utf8",
  );
  const lineCount = skillSource.trimEnd().split("\n").length;

  assert.ok(
    lineCount <= 280,
    `Vibe-Flow SKILL.md should remain at most 280 lines, received ${lineCount}`,
  );
});

test("Vibe-Recipe records the independent Vibe-Flow transformation evidence", async () => {
  const casePath = path.join(
    repositoryRoot,
    "skills",
    "vibe-recipe",
    "references",
    "cases",
    "003-vibe-flow-category-coordination.md",
  );
  const patternPath = path.join(
    repositoryRoot,
    "skills",
    "vibe-recipe",
    "references",
    "patterns",
    "conditional-reasoning-module.md",
  );

  const [caseSource, patternSource] = await Promise.all([
    readFile(casePath, "utf8"),
    readFile(patternPath, "utf8"),
  ]);

  for (const expected of [
    "RED",
    "GREEN",
    "价值边界",
    "因果路由",
    "安装版本漂移",
    "P0：0",
  ]) {
    assert.equal(
      caseSource.includes(expected),
      true,
      `case 003 must record ${expected}`,
    );
  }
  assert.match(patternSource, /条件化推理模块/);
  assert.match(patternSource, /不是第四个技能/);
});

test("Vibe-Recipe records the full-cycle operationalization evidence", async () => {
  const casePath = path.join(
    repositoryRoot,
    "skills",
    "vibe-recipe",
    "references",
    "cases",
    "004-hua-coordination-full-cycle.md",
  );
  const patternPath = path.join(
    repositoryRoot,
    "skills",
    "vibe-recipe",
    "references",
    "patterns",
    "governance-skill-operational-cycle.md",
  );

  const [caseSource, patternSource] = await Promise.all([
    readFile(casePath, "utf8"),
    readFile(patternPath, "utf8"),
  ]);

  for (const expected of [
    "RED",
    "GREEN",
    "无上下文",
    "任务调查表",
    "统筹网络表",
    "执行偏差表",
    "复盘定额表",
    "资源冲突",
    "P0：",
  ]) {
    assert.equal(
      caseSource.includes(expected),
      true,
      `case 004 must record ${expected}`,
    );
  }
  assert.match(patternSource, /治理型技能的操作闭环/);
  assert.match(patternSource, /复杂任务触发，简单任务跳过/);
});
