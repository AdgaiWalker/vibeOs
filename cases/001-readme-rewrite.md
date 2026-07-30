# Case AC-001: Agency-Craft README rewrite

## Classification

- **Type**: Real repository task.
- **Recording mode**: Retrospective. The task and skill rulings are real; the v0.1 contract and scorecard were added after the result commit.
- **Purpose**: Prove that a real task can be reconstructed into traceable, selective skill use and an evidence-linked handoff.
- **Does not prove**: The friction of using the contract prospectively, reduced Token use, reduced human effort or better output quality than a comparable baseline workflow.

## Source request

> 参考 hylarucoder/hai-stack 的 README 怎么写的。从第一性原理出发，对抗式审理我的 Agency-Craft，重新写一个 README。

## Starting state

- **Repository commit**: `fe95bd5`
- The README explained the Vibe 2.0 vision and three skills.
- It gave Vibe-Craft disproportionate detail.
- It lacked a project-level installation and natural-language adoption path.
- It documented a root `references/` directory that did not exist.

## Terminal result

A first-time visitor can understand why Agency-Craft exists, distinguish its three skills, install one or more skills, see natural-language trigger examples and identify what remains unproven.

## Skill ruling

| Candidate | Ruling | Evidence |
| --- | --- | --- |
| `vibe-flow` | Required | The request explicitly required adversarial adjudication and minimum workflow selection |
| `hai-rewrite-doc` | Required | The document needed evidence-first, in-place content reconstruction |
| `readme-beautifier` | Reject | Its contract prohibits adding, removing or changing content |
| `hai-audit-docs-internally` | Reject | It would duplicate verification already owned by the rewrite skill |
| `vibe-craft` | Reject | Purpose, reference source and finished artifact were already clear enough to execute without guessing a high-impact value decision |

The rejected Vibe-Craft gate is important: Agency Protocol gates are independent, not a ceremonial pipeline.

## Critical path

```text
Read admitted skill contracts
  → inspect hai-stack and Agency-Craft sources
  → freeze a numbered rewrite anchor
  → inventory and adversarially disposition old blocks
  → rewrite README in place
  → validate facts, links, commands and skill structures
  → commit and verify the remote artifact
```

## Agency Contract

The machine-readable handoff is stored at [`contracts/examples/readme-rewrite.json`](../contracts/examples/readme-rewrite.json).

Locked decisions included:

- Use hai-stack as an information-architecture reference, not a source of Agency-Craft claims.
- Optimize the README for first-time understanding and adoption.
- Preserve the project name, Vibe 2.0 positioning and human ownership of value decisions.

The continuation gate required repository facts, relative links, documented install commands and all three skill structures to pass validation before publishing.

## Result

- **Result commit**: `3c4f208`
- **Artifact**: [`README.md` at result commit](https://github.com/AdgaiWalker/Agency-Craft/blob/3c4f208/README.md)
- README relative links and headings passed automated checks.
- The three skill folders passed the available Codex skill validator.
- The documented symbolic-link installation commands were exercised in an isolated temporary Codex home.
- The remote default branch was checked after push.

## Evidence limits

- No comparable baseline Token count was collected.
- No independent first-pass quality rating was collected.
- The user continued project design from the result, but did not provide a formal acceptance score.
- High-impact executor guesses were not independently annotated.

Therefore this case proves **retrospective traceability and selective gate use**, not prospective protocol usability or effectiveness.

## Learning

1. A valid Agency run may reject two attractive but duplicative skills.
2. A shared contract should preserve the ruling and continuation gate so the next owner does not need the full conversation.
3. Effectiveness claims require measurements planned before execution; post-hoc estimates must remain unavailable.
