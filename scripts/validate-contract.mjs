#!/usr/bin/env node

import { readFile } from "node:fs/promises";

const contractPath = process.argv[2];

function requireObject(value, field) {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`${field} must be an object`);
  }
}

function requireArray(value, field) {
  if (!Array.isArray(value)) {
    throw new Error(`${field} must be an array`);
  }
}

function requireString(value, field) {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`${field} must be a non-empty string`);
  }
}

function requireEnum(value, field, allowed) {
  if (!allowed.includes(value)) {
    throw new Error(`${field} must be one of: ${allowed.join(", ")}`);
  }
}

function validateDecisionItems(items, field) {
  for (const [index, item] of items.entries()) {
    const itemField = `${field}[${index}]`;
    requireObject(item, itemField);
    requireString(item.id, `${itemField}.id`);
    requireString(item.statement, `${itemField}.statement`);
    requireEnum(item.owner, `${itemField}.owner`, [
      "human",
      "ai",
      "shared",
      "system",
    ]);
    requireString(item.evidence, `${itemField}.evidence`);
  }
}

if (!contractPath) {
  console.error("Usage: node scripts/validate-contract.mjs <contract.json>");
  process.exit(2);
}

try {
  const source = await readFile(contractPath, "utf8");
  const contract = JSON.parse(source);

  if (contract.contract_version !== "0.1") {
    throw new Error("contract_version must be the string 0.1");
  }
  requireObject(contract.objective, "objective");
  requireObject(contract.state, "state");
  requireObject(contract.decisions, "decisions");
  requireObject(contract.boundaries, "boundaries");
  requireArray(contract.acceptance_criteria, "acceptance_criteria");
  requireObject(contract.handoff, "handoff");
  requireArray(contract.evidence, "evidence");

  requireString(contract.objective.terminal_result, "objective.terminal_result");
  requireString(contract.objective.status, "objective.status");
  requireString(contract.state.current, "state.current");
  requireString(contract.state.target, "state.target");
  requireArray(contract.decisions.locked, "decisions.locked");
  requireArray(contract.decisions.provisional, "decisions.provisional");
  requireArray(contract.decisions.open, "decisions.open");
  requireArray(contract.boundaries.must_preserve, "boundaries.must_preserve");
  requireArray(contract.boundaries.must_avoid, "boundaries.must_avoid");
  requireArray(contract.boundaries.out_of_scope, "boundaries.out_of_scope");
  requireString(contract.handoff.next_owner, "handoff.next_owner");
  requireArray(contract.handoff.inputs, "handoff.inputs");
  requireString(
    contract.handoff.continuation_gate,
    "handoff.continuation_gate",
  );
  requireArray(contract.handoff.reopen_if, "handoff.reopen_if");

  if (contract.acceptance_criteria.length === 0) {
    throw new Error("acceptance_criteria must contain at least one item");
  }

  requireEnum(contract.objective.status, "objective.status", [
    "forming",
    "ready",
    "executing",
    "blocked",
    "achieved",
    "failed",
  ]);

  validateDecisionItems(contract.decisions.locked, "decisions.locked");
  validateDecisionItems(
    contract.decisions.provisional,
    "decisions.provisional",
  );
  validateDecisionItems(contract.decisions.open, "decisions.open");

  for (const [index, item] of contract.acceptance_criteria.entries()) {
    const itemField = `acceptance_criteria[${index}]`;
    requireObject(item, itemField);
    requireString(item.id, `${itemField}.id`);
    requireString(item.check, `${itemField}.check`);
    requireString(item.method, `${itemField}.method`);
    requireEnum(item.status, `${itemField}.status`, [
      "pending",
      "pass",
      "fail",
      "unavailable",
    ]);
    requireString(item.evidence, `${itemField}.evidence`);
  }

  for (const [index, item] of contract.evidence.entries()) {
    const itemField = `evidence[${index}]`;
    requireObject(item, itemField);
    requireString(item.type, `${itemField}.type`);
    requireString(item.source, `${itemField}.source`);
    requireArray(item.supports, `${itemField}.supports`);
  }

  console.log(`${contractPath}: valid Agency Contract`);
} catch (error) {
  console.error(`${contractPath}: ${error.message}`);
  process.exit(1);
}
