# Agency Contract v0.1

Agency Contract is the shared handoff envelope for Agency Protocol roles and reference skills.

It prevents the next worker from recovering intent, decisions and evidence from an entire conversation. It is not a form shown to the human and not every field requires a question.

## Required envelope

| Field | Producer | Consumer | Purpose |
| --- | --- | --- | --- |
| `contract_version` | Any contract producer | Validator and next owner | Makes future migration explicit |
| `objective` | Guide or orchestrator | Executor and evaluator | Names one observable terminal result and its status |
| `state` | Guide or current owner | Next owner | Distinguishes the present from the intended state |
| `decisions` | Human with AI assistance | Orchestrator and executor | Separates Locked, Provisional and Open choices |
| `boundaries` | Human with AI assistance | Executor | Records what must survive, must not happen and is not part of this run |
| `acceptance_criteria` | Guide, orchestrator or skill author | Evaluator | Defines observable checks before execution |
| `handoff` | Current owner | Next owner | Names inputs, continuation gate and bounded reopen conditions |
| `evidence` | Any role producing a claim or result | Evaluator and future runs | Keeps decisions and validation inspectable |

## Core rules

1. Use contract version `"0.1"`.
2. Write one terminal result in `objective.terminal_result`.
3. Keep `state.current` and `state.target` distinguishable.
4. Put each material decision in exactly one of `locked`, `provisional` or `open`.
5. Label every decision owner and supporting evidence.
6. Define at least one acceptance criterion.
7. Do not continue past `handoff.continuation_gate` until its evidence exists.
8. Use `handoff.reopen_if` to bound failure recovery.
9. Leave unavailable measurements unavailable; never estimate them into apparent evidence.

## Decision ownership

Use these owner values:

- `human` — taste, identity, priority, risk acceptance or authorization.
- `ai` — a labeled reversible default or evidence-supported workflow judgment.
- `shared` — a conclusion explicitly reached through human choice over AI-provided options.
- `system` — a deterministic test, schema, policy or runtime constraint.

## Objective status

- `forming` — high-impact decisions remain Open.
- `ready` — the next owner can proceed without inventing a value judgment.
- `executing` — authorized work is underway.
- `blocked` — continuation gate lacks required evidence or authority.
- `achieved` — all required acceptance criteria pass.
- `failed` — evidence falsified the target or implementation.

## Acceptance status

- `pending`
- `pass`
- `fail`
- `unavailable`

An `unavailable` check must explain why and what evidence would make it measurable.

## Example

[`examples/readme-rewrite.json`](examples/readme-rewrite.json) records the real Agency-Craft README rewrite at commit `3c4f208`. It proves traceable selective skill use; it does not prove reduced Token use or better human outcomes.

Validate a contract:

```bash
node scripts/validate-contract.mjs contracts/examples/readme-rewrite.json
```

The repository test suite also validates examples and malformed fixtures:

```bash
make test
```
