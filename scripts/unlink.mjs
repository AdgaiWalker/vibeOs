#!/usr/bin/env node

import { unlink } from "node:fs/promises";
import { getSkillNames, getSkillRecord } from "./lib/skills.mjs";

let hasConflict = false;

for (const skillName of await getSkillNames()) {
  const record = await getSkillRecord(skillName);

  if (record.state === "linked") {
    await unlink(record.target);
    console.log(`${skillName}: unlinked`);
  } else if (record.state === "missing") {
    console.log(`${skillName}: missing`);
  } else {
    console.error(`${skillName}: not owned by this repository; left unchanged`);
    hasConflict = true;
  }
}

if (hasConflict) {
  process.exitCode = 1;
}
