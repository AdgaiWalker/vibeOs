# vibeOs Evaluations

Evaluations test whether Agency Protocol reduces guessing and rework while preserving human decision ownership.

## Evidence levels

- **Measured** — captured by a repeatable command, counter or comparable baseline.
- **Observed** — directly visible in an inspectable trace or versioned artifact, but not independently instrumented.
- **Unavailable** — not collected or not comparable; the record must give a reason and may not substitute an estimate.

## Core signals

| Signal | Desired direction | Required comparison |
| --- | --- | --- |
| Blocking clarification turns | Lower without losing high-impact decisions | Same task and comparable user |
| High-impact executor guesses | Zero | Independent annotation against Locked/Open decisions |
| Decisions reopened after execution | Lower | Same acceptance criteria |
| First-execution acceptance checks | Higher | Same artifact and executor capability |
| Total execution and rework turns | Lower | Comparable stopping rule |
| Total Token use | Lower | Same model, task, tools and context policy |

One case cannot establish project effectiveness. Publish raw task, baseline, result, scoring rule and unavailable data so later evidence can challenge earlier claims.

## Case scorecards

- [`AC-001 · README rewrite`](cases/001-readme-rewrite.json) — a real repository task proving traceability and selective gate use; no effectiveness baseline.

## Adding an evaluation

1. Freeze the task and success criteria before execution.
2. Record a baseline using the same model, tools and stopping rule when feasible.
3. Record the Agency run without editing unavailable measurements.
4. Link every observed or measured signal to a command, trace, artifact or reviewer.
5. State the claim boundary and falsifier.
