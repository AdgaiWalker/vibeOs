#!/usr/bin/env node

import { mkdir, symlink } from "node:fs/promises";
import {
  getSkillNames,
  getSkillRecord,
  targetRoot,
} from "./lib/skills.mjs";

await mkdir(targetRoot, { recursive: true });

let hasConflict = false;

for (const skillName of await getSkillNames()) {
  const record = await getSkillRecord(skillName);

  if (record.state === "linked") {
    console.log(`${skillName}: already linked`);
  } else if (record.state === "conflict") {
    console.error(`${skillName}: conflict at ${record.target}; left unchanged`);
    hasConflict = true;
  } else {
    await symlink(record.source, record.target, "dir");
    console.log(`${skillName}: linked`);
  }
}

if (hasConflict) {
  process.exitCode = 1;
}
