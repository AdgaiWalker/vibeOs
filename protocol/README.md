# Agency Protocol v0.1

Agency Protocol defines how a person and AI move from an unclear wish to an executable, human-owned and verifiable outcome.

Its first principle is:

> AI may expand perception and execute decisions. It must not quietly own the person's values.

The protocol is the product. The skills in [`skills/`](../skills/) are Codex reference implementations of three decision gates within it.

## Roles

| Role | Responsibility | Must not silently own |
| --- | --- | --- |
| **Human** | Notice differences, choose values, authorize material changes and accept the outcome | Implementation details that AI can safely infer |
| **Guide** | Observe, teach just enough, create meaningful contrasts and expose tradeoffs | The human's desired identity, taste or definition of success |
| **Orchestrator** | Admit the minimum capabilities, order real dependencies and define gates | Authority that neither the user nor an admitted capability granted |
| **Executor** | Implement the specified change and produce inspectable evidence | High-impact choices left Open |
| **Evaluator** | Compare evidence with acceptance criteria and reopen failed dimensions | New requirements invented after execution |

One AI may perform several roles, but the ownership boundaries remain explicit.

## Decision states

Every material choice has exactly one state:

- **Locked** — explicitly chosen by the human or established by strong evidence.
- **Provisional** — a labeled, reversible AI default.
- **Open** — unresolved and capable of materially changing the result.

Execution may begin when no high-impact decision is Open. Low-impact reversible choices may remain Provisional.

## Category-conditioned first-principles reasoning

This is an optional reasoning mechanism, not a fourth gate. Use it inside Ground or Route only when unresolved facts, causal models or predictions could materially change capability selection or the execution network.

- Human-owned value, taste, identity, priority and risk-acceptance decisions stay Open for the person or the Intent gate.
- AI- or system-owned factual uncertainty may be examined through two to four context-derived categories with distinct first principles, evidence and falsifiers.
- Categories investigate the same object independently; they do not vote and are not forced to agree.
- Robust intersections become evidence. Action-changing disagreements become observable evidence tasks with named consumers and continuation gates.
- Experts are not execution-network nodes. Their evidence tasks enter Vibe-Flow, which identifies one or more current main-contradiction paths, float, resource constraints and re-planning triggers.

Keep category analyses inside the existing Agency Contract: conclusions in `decisions`, sources in `evidence`, decisive tests in `handoff.inputs` and falsifiers in `handoff.reopen_if`. Do not add contract fields until real forward-use evidence shows v0.1 cannot carry the handoff.

## The interaction loop

```text
Ground → Contrast → Decide → Specify → Route → Execute → Validate → Learn
```

| State | Required result | Continue when |
| --- | --- | --- |
| **Ground** | Current state, purpose, audience and constraints are separated from interpretation | The existing situation no longer needs to be guessed |
| **Contrast** | Two to four materially different directions reveal important dimensions and tradeoffs | The human can recognize meaningful differences |
| **Decide** | Choices are Locked, Provisional or Open; preservation and rejection boundaries are recorded | No high-impact value choice remains Open |
| **Specify** | The minimum Agency Contract is complete | A competent executor can proceed without inventing a value judgment |
| **Route** | Every admitted capability has unique value, a valid input and a named consumer | One or more current main-contradiction paths and continuation gates are observable |
| **Execute** | The selected domain capability changes only the authorized scope | Evidence exists for each acceptance check |
| **Validate** | Evidence is compared with acceptance criteria | Checks pass, or only failed dimensions are reopened |
| **Learn** | A useful failure, case or repeated rule is recorded | The next run can start with less recovery and fewer assumptions |

The loop is not a mandatory pipeline. Enter at the earliest unresolved state and skip gates that already pass.

## Vibe Tri-Pack: three reference gates

### Check gate — Vibe-Check

Use when the executor would otherwise need to guess what subjective language means. The gate passes when present and target states are distinguishable, important dimensions have anchors, boundaries are explicit and acceptance can be observed.

### Flow gate — Vibe-Flow

Use when several capabilities could participate. The gate passes when every admitted capability survives an adversarial necessity test, real dependencies reveal one or more current main-contradiction paths, and every handoff has a consumer and evidence gate.

### Recipe gate — Vibe-Recipe

Use when a successful method should become a reusable recipe or an existing recipe is unreliable. The gate passes when realistic independent testing has challenged its assumptions, P0/P1 failures are cleared, and cases or patterns preserve what was learned.

## Friction rules

1. Observe before asking the human to repeat visible facts.
2. Ask at most one blocking question at a time.
3. Resolve safe, reversible details with a labeled Provisional default.
4. Teach only the knowledge required for the next human decision.
5. Do not invoke every available skill; each addition must justify its context and handoff cost.
6. Pass one structured handoff instead of making the human reconstruct prior conversation.
7. When validation fails, reopen only the dimensions implicated by evidence.

## Handoff contract

Every cross-role handoff uses the minimum envelope defined in [`contracts/`](../contracts/):

- terminal result and current/target state;
- Locked, Provisional and Open decisions;
- must-preserve, must-avoid and out-of-scope boundaries;
- observable acceptance criteria;
- next owner, required inputs, continuation gate and reopen conditions;
- evidence supporting decisions or validation.

The envelope is a handoff artifact, not a questionnaire. Producers infer and observe before asking, and omit no field required by the next owner.

## Evaluation

Track only evidence that can be observed:

| Signal | Meaning |
| --- | --- |
| Blocking clarification turns | Friction paid before execution |
| High-impact decisions guessed by the executor | Loss of human ownership or specification failure |
| Decisions reopened after execution | Directional rework |
| Acceptance checks passing on first execution | Specification and implementation alignment |
| Total execution and rework turns | Coordination cost |
| Total Token use | Context cost, only when a comparable baseline is recorded |

Do not claim improvement from one run. A result needs a comparable baseline or repeated real-user evidence.

## Conformance

A run conforms to v0.1 when:

1. value ownership is explicit;
2. no high-impact Open decision is silently executed;
3. the handoff contract contains an observable continuation gate;
4. validation uses recorded acceptance criteria;
5. failure reopens a bounded decision or stops the run instead of continuing mechanically.
