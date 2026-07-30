#!/usr/bin/env node

import { getSkillNames, getSkillRecord } from "./lib/skills.mjs";

let hasConflict = false;

for (const skillName of await getSkillNames()) {
  const record = await getSkillRecord(skillName);

  console.log(`${skillName}: ${record.state}`);
  if (record.state === "conflict") {
    hasConflict = true;
  }
}

if (hasConflict) {
  process.exitCode = 1;
}
