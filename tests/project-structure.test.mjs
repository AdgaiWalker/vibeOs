import assert from "node:assert/strict";
import { access, readFile, readdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import test from "node:test";

const repositoryRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);

async function findMarkdownFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  const ignoredDirectories = new Set([
    ".git",
    ".next",
    ".vinext",
    ".wrangler",
    "dist",
    "node_modules",
  ]);

  for (const entry of entries) {
    if (entry.isDirectory() && ignoredDirectories.has(entry.name)) {
      continue;
    }

    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await findMarkdownFiles(entryPath)));
    } else if (entry.name.endsWith(".md")) {
      files.push(entryPath);
    }
  }

  return files;
}

test("skill identities match their folders and UI prompts", async () => {
  const skillsRoot = path.join(repositoryRoot, "skills");
  const entries = await readdir(skillsRoot, { withFileTypes: true });
  const skillNames = entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();

  for (const skillName of skillNames) {
    const skillRoot = path.join(skillsRoot, skillName);
    const skillSource = await readFile(path.join(skillRoot, "SKILL.md"), "utf8");
    const declaredName = skillSource.match(/^name:\s*(\S+)$/m)?.[1];
    assert.equal(
      declaredName,
      skillName,
      `${skillName}/SKILL.md must declare name: ${skillName}`,
    );

    const metadata = await readFile(
      path.join(skillRoot, "agents", "openai.yaml"),
      "utf8",
    );
    assert.match(
      metadata,
      new RegExp(`default_prompt:.*\\$${skillName}`),
      `${skillName}/agents/openai.yaml must invoke $${skillName}`,
    );
  }
});

test("all reference skills declare the Agency Contract handoff envelope", async () => {
  const skillsRoot = path.join(repositoryRoot, "skills");
  const entries = await readdir(skillsRoot, { withFileTypes: true });
  const skillNames = entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
  const envelopeFields = [
    "objective",
    "state",
    "decisions",
    "boundaries",
    "acceptance_criteria",
    "handoff",
    "evidence",
  ];
  const structuredContractFragments = [
    "contract_version:",
    "terminal_result",
    "must_preserve",
    "must_avoid",
    "out_of_scope",
    "next_owner",
    "inputs",
    "continuation_gate",
    "reopen_if",
    "{id,statement,owner,evidence}",
    "{id,check,method,status,evidence}",
    "{type,source,supports}",
  ];

  for (const skillName of skillNames) {
    const skillSource = await readFile(
      path.join(skillsRoot, skillName, "SKILL.md"),
      "utf8",
    );
    assert.match(skillSource, /^## Agency Contract handoff$/m);
    for (const field of envelopeFields) {
      assert.equal(
        skillSource.includes(`\`${field}\``),
        true,
        `${skillName}/SKILL.md must carry ${field}`,
      );
    }
    for (const fragment of structuredContractFragments) {
      assert.equal(
        skillSource.includes(fragment),
        true,
        `${skillName}/SKILL.md must specify ${fragment}`,
      );
    }
  }
});

test("skill directories contain execution resources, not human README files", async () => {
  const skillsRoot = path.join(repositoryRoot, "skills");
  const entries = await readdir(skillsRoot, { withFileTypes: true });
  const skillNames = entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);

  for (const skillName of skillNames) {
    await assert.rejects(
      access(path.join(skillsRoot, skillName, "README.md")),
      (error) => error.code === "ENOENT",
      `${skillName}/README.md belongs in docs/, not the runtime skill`,
    );
  }
});

test("relative links in Markdown documents resolve inside the repository", async () => {
  const markdownFiles = await findMarkdownFiles(repositoryRoot);

  for (const markdownFile of markdownFiles) {
    const source = await readFile(markdownFile, "utf8");
    const links = [...source.matchAll(/\[[^\]]*\]\(([^)]+)\)/g)].map(
      (match) => match[1],
    );
    const relativeLinks = links.filter(
      (link) =>
        !link.startsWith("http://") &&
        !link.startsWith("https://") &&
        !link.startsWith("#") &&
        !link.startsWith("mailto:"),
    );

    for (const link of relativeLinks) {
      const filePart = link.split("#", 1)[0];
      const resolved = path.resolve(path.dirname(markdownFile), filePart);
      assert.equal(
        resolved.startsWith(repositoryRoot),
        true,
        `${markdownFile} links outside the repository: ${link}`,
      );
      await access(resolved);
    }
  }
});
