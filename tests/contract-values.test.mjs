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
const validContract = path.join(
  repositoryRoot,
  "contracts",
  "examples",
  "readme-rewrite.json",
);

const invalidMutations = [
  {
    label: "unknown objective status",
    mutate: (contract) => {
      contract.objective.status = "maybe";
    },
    error: /objective\.status must be one of/,
  },
  {
    label: "unknown decision owner",
    mutate: (contract) => {
      contract.decisions.locked[0].owner = "robot";
    },
    error: /decisions\.locked\[0\]\.owner must be one of/,
  },
  {
    label: "decision item without an ID",
    mutate: (contract) => {
      delete contract.decisions.locked[0].id;
    },
    error: /decisions\.locked\[0\]\.id must be a non-empty string/,
  },
  {
    label: "decision item without evidence",
    mutate: (contract) => {
      delete contract.decisions.locked[0].evidence;
    },
    error: /decisions\.locked\[0\]\.evidence must be a non-empty string/,
  },
  {
    label: "unknown acceptance status",
    mutate: (contract) => {
      contract.acceptance_criteria[0].status = "maybe";
    },
    error: /acceptance_criteria\[0\]\.status must be one of/,
  },
  {
    label: "acceptance item without a check",
    mutate: (contract) => {
      delete contract.acceptance_criteria[0].check;
    },
    error: /acceptance_criteria\[0\]\.check must be a non-empty string/,
  },
  {
    label: "acceptance item without an ID",
    mutate: (contract) => {
      delete contract.acceptance_criteria[0].id;
    },
    error: /acceptance_criteria\[0\]\.id must be a non-empty string/,
  },
  {
    label: "acceptance item without evidence",
    mutate: (contract) => {
      delete contract.acceptance_criteria[0].evidence;
    },
    error: /acceptance_criteria\[0\]\.evidence must be a non-empty string/,
  },
  {
    label: "evidence item without supported acceptance IDs",
    mutate: (contract) => {
      delete contract.evidence[0].supports;
    },
    error: /evidence\[0\]\.supports must be an array/,
  },
  {
    label: "evidence item without a type",
    mutate: (contract) => {
      delete contract.evidence[0].type;
    },
    error: /evidence\[0\]\.type must be a non-empty string/,
  },
  {
    label: "evidence item without a source",
    mutate: (contract) => {
      delete contract.evidence[0].source;
    },
    error: /evidence\[0\]\.source must be a non-empty string/,
  },
];

for (const { label, mutate, error } of invalidMutations) {
  test(`rejects ${label}`, async () => {
    const contract = JSON.parse(await readFile(validContract, "utf8"));
    mutate(contract);
    const temporaryDirectory = await mkdtemp(
      path.join(os.tmpdir(), "agency-contract-"),
    );
    const fixture = path.join(
      temporaryDirectory,
      `${label.replaceAll(" ", "-")}.json`,
    );
    await writeFile(fixture, JSON.stringify(contract));

    const result = spawnSync(process.execPath, [validator, fixture], {
      encoding: "utf8",
    });

    assert.equal(result.status, 1, `expected ${label} to fail`);
    assert.match(result.stderr, error);
  });
}
