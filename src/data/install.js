const repositoryUrl = "https://github.com/AdgaiWalker/vibe0s";

export const skillRepository = Object.freeze({
  name: "vibeOs",
  url: repositoryUrl,
  ref: "main",
  sourceUrl: `${repositoryUrl}/tree/main`,
  skills: Object.freeze([
    Object.freeze({ name: "vibe-check", path: "skills/vibe-check" }),
    Object.freeze({ name: "vibe-flow", path: "skills/vibe-flow" }),
    Object.freeze({ name: "vibe-recipe", path: "skills/vibe-recipe" }),
  ]),
});

export const agencyInstallPrompt = `${skillRepository.url}
帮我安装技能`;
