import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import test from "node:test";

const repositoryRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const scorecardPath = path.join(
  repositoryRoot,
  "evals",
  "cases",
  "001-readme-rewrite.json",
);
const casePath = path.join(
  repositoryRoot,
  "cases",
  "001-readme-rewrite.md",
);

test("case 001 has an inspectable evidence-linked evaluation record", async () => {
  const scorecard = JSON.parse(await readFile(scorecardPath, "utf8"));
  const caseSource = await readFile(casePath, "utf8");

  assert.equal(scorecard.case_id, "AC-001");
  assert.equal(scorecard.case_type, "real-repository-task");
  assert.equal(scorecard.result.commit, "3c4f208");
  assert.match(caseSource, /3c4f208/);

  for (const commit of [scorecard.baseline.commit, scorecard.result.commit]) {
    const result = spawnSync("git", ["cat-file", "-e", `${commit}^{commit}`], {
      cwd: repositoryRoot,
      encoding: "utf8",
    });
    assert.equal(result.status, 0, `expected commit ${commit} to exist`);
  }

  for (const signal of scorecard.signals) {
    assert.match(signal.evidence_level, /^(observed|measured|unavailable)$/);
    if (signal.evidence_level === "unavailable") {
      assert.equal(signal.value, null);
      assert.equal(typeof signal.reason, "string");
    } else {
      assert.equal(typeof signal.source, "string");
    }
  }
});
