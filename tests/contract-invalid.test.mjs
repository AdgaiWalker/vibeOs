import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtemp, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import os from "node:os";
import path from "node:path";
import test from "node:test";

const repositoryRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const validator = path.join(repositoryRoot, "scripts", "validate-contract.mjs");
const incompleteContract = path.join(
  repositoryRoot,
  "tests",
  "fixtures",
  "incomplete-contract.json",
);
const validContract = path.join(
  repositoryRoot,
  "contracts",
  "examples",
  "readme-rewrite.json",
);

test("rejects a handoff with missing decision state", () => {
  const result = spawnSync(process.execPath, [validator, incompleteContract], {
    encoding: "utf8",
  });

  assert.equal(result.status, 1, "expected an incomplete contract to fail");
  assert.match(result.stderr, /decisions must be an object/);
});

const requiredEnvelopeFields = [
  "contract_version",
  "objective",
  "state",
  "decisions",
  "boundaries",
  "acceptance_criteria",
  "handoff",
  "evidence",
];

for (const field of requiredEnvelopeFields) {
  test(`rejects an Agency Contract without ${field}`, async () => {
    const contract = JSON.parse(await readFile(validContract, "utf8"));
    delete contract[field];
    const temporaryDirectory = await mkdtemp(
      path.join(os.tmpdir(), "agency-contract-"),
    );
    const fixture = path.join(temporaryDirectory, `missing-${field}.json`);
    await writeFile(fixture, JSON.stringify(contract));

    const result = spawnSync(process.execPath, [validator, fixture], {
      encoding: "utf8",
    });

    assert.equal(result.status, 1, `expected missing ${field} to fail`);
    assert.match(result.stderr, new RegExp(`${field} must be`));
  });
}

const requiredNestedFields = [
  ["objective", "terminal_result"],
  ["objective", "status"],
  ["state", "current"],
  ["state", "target"],
  ["decisions", "locked"],
  ["decisions", "provisional"],
  ["decisions", "open"],
  ["boundaries", "must_preserve"],
  ["boundaries", "must_avoid"],
  ["boundaries", "out_of_scope"],
  ["handoff", "next_owner"],
  ["handoff", "inputs"],
  ["handoff", "continuation_gate"],
  ["handoff", "reopen_if"],
];

for (const [section, field] of requiredNestedFields) {
  test(`rejects an Agency Contract without ${section}.${field}`, async () => {
    const contract = JSON.parse(await readFile(validContract, "utf8"));
    delete contract[section][field];
    const temporaryDirectory = await mkdtemp(
      path.join(os.tmpdir(), "agency-contract-"),
    );
    const fixture = path.join(
      temporaryDirectory,
      `missing-${section}-${field}.json`,
    );
    await writeFile(fixture, JSON.stringify(contract));

    const result = spawnSync(process.execPath, [validator, fixture], {
      encoding: "utf8",
    });

    assert.equal(
      result.status,
      1,
      `expected missing ${section}.${field} to fail`,
    );
    assert.match(result.stderr, new RegExp(`${section}\\.${field} must be`));
  });
}

test("rejects a contract without an acceptance criterion", async () => {
  const contract = JSON.parse(await readFile(validContract, "utf8"));
  contract.acceptance_criteria = [];
  const temporaryDirectory = await mkdtemp(
    path.join(os.tmpdir(), "agency-contract-"),
  );
  const fixture = path.join(temporaryDirectory, "empty-acceptance.json");
  await writeFile(fixture, JSON.stringify(contract));

  const result = spawnSync(process.execPath, [validator, fixture], {
    encoding: "utf8",
  });

  assert.equal(result.status, 1, "expected empty acceptance criteria to fail");
  assert.match(
    result.stderr,
    /acceptance_criteria must contain at least one item/,
  );
});
