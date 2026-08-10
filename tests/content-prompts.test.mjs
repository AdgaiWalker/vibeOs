import assert from "node:assert/strict";
import test from "node:test";

import { gates } from "../src/data/content.js";

test("homepage examples use the published dollar-prefixed skill calls", () => {
  const expectedCalls = ["$vibe-check", "$vibe-flow", "$vibe-recipe"];

  assert.deepEqual(
    gates.map(({ prompt }) => prompt.split(" ", 1)[0]),
    expectedCalls,
  );

  for (const { prompt } of gates) {
    assert.doesNotMatch(prompt, /^\//);
  }
});
