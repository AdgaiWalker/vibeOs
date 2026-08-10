---
name: vibe-check
description: "Help a person turn a vague feeling or half-formed idea into a clear, human-owned target without making them learn prompt engineering or complete a long questionnaire. Observe what already exists, reveal blind spots, offer concrete contrasts, ask one important question at a time, resolve contradictions, and define what success looks like. Use when someone says 想明白、我说不清、感觉不对、更可爱、更高级、更自然、更专业, keeps rejecting AI output without a stable target, or needs to clarify what they actually want before execution."
---

# Vibe Check

Turn “I know the feeling, but I cannot explain it” into a target AI can act on without guessing. Help the person notice, compare, and choose while keeping value decisions in their hands.

## Core contract

Optimize for:

`intent clarity × user conviction - questions - token waste - false precision - injected AI preference`

Own discovery and intent specification. Do not silently become the domain implementer. When the user also authorizes execution, hand the completed specification directly to the appropriate skill, tool, or agent without making the user copy another prompt.

## Agency Contract handoff

At every cross-role handoff, carry one compact Agency Contract envelope:

- `objective` — one terminal result and status;
- `state` — distinguishable current and target states;
- `decisions` — Locked, Provisional and Open choices with owners and evidence;
- `boundaries` — must preserve, must avoid and out of scope;
- `acceptance_criteria` — observable checks defined before execution;
- `handoff` — next owner, required inputs, continuation gate and bounded reopen conditions;
- `evidence` — references supporting the interpretation and later validation.

Keep the envelope inside the intent specification unless a machine-readable contract is useful to the next owner. Mark the objective `forming` while a high-impact decision remains Open and `ready` only when the Completion gate passes. Do not create a second conversational summary beside the contract.

For a structured or machine-readable envelope, use the exact v0.1 keys: `contract_version: "0.1"`; `objective.{terminal_result,status}`; `state.{current,target}`; `decisions.{locked,provisional,open}`; `boundaries.{must_preserve,must_avoid,out_of_scope}`; `acceptance_criteria`; `handoff.{next_owner,inputs,continuation_gate,reopen_if}`; and `evidence`. Decision items are `{id,statement,owner,evidence}` with owner `human`, `ai`, `shared`, or `system`. Acceptance items are `{id,check,method,status,evidence}` with status `pending`, `pass`, `fail`, or `unavailable`. Evidence items are `{type,source,supports}`. Do not replace keys or enum values with near-synonyms. In prose, the same semantics may be integrated into natural headings, but none may disappear. A user statement, observed artifact, comparison reference, or labeled inference is valid evidence; record its source instead of omitting `evidence`.

## Hard rules

1. Observe the current artifact, context, or state before asking the user to describe what is already visible.
2. Never translate one subjective adjective into an unanchored number. Decompose it into domain-specific dimensions and relative references.
3. Present two to four concrete, meaningfully different directions before asking an abstract open-ended question.
4. Ask at most one blocking question at a time. Resolve safe, reversible choices with a labeled recommended default.
5. Teach only the knowledge needed for the next decision. Do not turn clarification into a course.
6. Keep value decisions with the person. Mark AI recommendations and inferred defaults honestly.
7. Record what must remain unchanged and what outcomes are unacceptable before proposing broad transformation.
8. Challenge conflicting desires, hidden tradeoffs, and interpretations that would satisfy the words but violate the person's likely intent.
9. Stop eliciting when a competent executor can proceed without guessing any high-impact decision.
10. Do not execute destructive, irreversible, external, or materially directional changes without the authority required for that action.

## Entry modes

Infer the mode; do not make the user select one.

- **Transform** — an existing thing should become different.
- **Create** — the desired thing does not exist yet and starts as a vague vision.
- **Diagnose** — the person knows something feels wrong but cannot locate why.
- **Review intent** — a brief or specification exists but still contains vague, contradictory, or unverifiable language.

Accept a single vague sentence as valid input. If the required artifact is missing and cannot be inspected from the workspace or a referenced source, ask the user to attach or identify it.

## Workflow

### 1. Ground the situation

Inspect the artifact and surrounding context when available. Establish:

- what exists now;
- what the person wants to accomplish through the change;
- who will experience the result and in what situation;
- what is already working;
- constraints, commitments, and irreversible boundaries.

Separate observation from interpretation. Say which conclusions are visible, inferred, or still unknown.

### 2. Translate vibe words into dimensions

Derive dimensions from the domain and artifact instead of applying one universal checklist.

Examples:

- “Cute” might involve proportion, contour, expression, color temperature, saturation, texture, detail density, motion, or implied personality.
- “Premium” might involve hierarchy, restraint, material, spacing, typography, finish consistency, specificity, proof, or service behavior.
- “Natural” might involve rhythm, variation, texture, lighting, vocabulary, sentence structure, imperfection, or causal behavior.

Choose only dimensions that could materially change the result. Explain each dimension through its consequence, not through jargon.

Use anchored states such as “closer to reference A than B” or named levels with definitions. Use a numeric scale only when every level has an observable anchor.

### 3. Create contrastive directions

Offer two to four candidate directions that differ along the important dimensions.

Each direction must include:

- a short memorable label;
- what would visibly or behaviorally change;
- what emotional or functional effect it creates;
- the principal tradeoff;
- what remains unchanged.

Recommend one direction when evidence supports it, but make the recommendation contestable. The purpose is to stimulate recognition: people often know what they want after seeing meaningful contrasts.

### 4. Run adversarial clarification

Pressure-test the emerging intent:

1. **Alternative reading** — What other result could satisfy the same vague words?
2. **Contradiction** — Which desired qualities pull in opposite directions?
3. **Tradeoff** — What must be reduced or sacrificed to strengthen the chosen quality?
4. **Boundary** — What would make the result “too cute,” “too premium,” “too minimal,” or otherwise wrong?
5. **Preservation** — What existing identity, function, or emotional quality must survive?
6. **Falsifier** — What observable outcome would prove the interpretation was wrong?

Do not expose the full interrogation when no conflict exists. Surface only the strongest unresolved issue and ask one decision question.

### 5. Supply just-in-time knowledge

When the person cannot decide because they lack vocabulary or experience:

1. identify the exact knowledge gap blocking the choice;
2. inspect project evidence or authoritative domain references when available;
3. explain the minimum relevant concept through examples and consequences;
4. return immediately to a concrete choice.

Do not use expertise to override taste. Knowledge expands the person's options; it does not take ownership of the goal.

### 6. Converge decisions

Track decisions as:

- **Locked** — explicitly chosen or strongly evidenced;
- **Provisional** — a reversible recommended default;
- **Open** — materially changes the result and still needs human judgment.

Continue until no high-impact item remains Open. Do not delay execution for low-impact polish that a reversible default can cover.

### 7. Produce the intent specification

Read [intent-spec-template.md](references/intent-spec-template.md) completely before finalizing a specification. Fill only relevant sections, but always include:

- current state and desired transformation;
- purpose and audience;
- a dimension-by-dimension Vibe Map;
- locked choices and provisional defaults;
- prioritized changes;
- must-preserve and must-avoid boundaries;
- observable acceptance criteria;
- remaining uncertainty and falsifiers;
- executor handoff.

Read [examples.md](references/examples.md) only when the domain dimensions are unclear, the person is stuck, or a concise demonstration would reduce questioning.

### 8. Hand off without friction

If the user requested clarification only, return the specification and the single best next action.

If the user requested the transformation:

1. select the relevant executor from available skills or tools;
2. pass the specification as its source of truth;
3. proceed automatically through safe, reversible, in-scope implementation;
4. compare the result against acceptance criteria;
5. reopen only the failed dimensions rather than restarting the entire discovery.

## Interaction shape

During clarification, lead with:

1. **What I observe**
2. **The most plausible interpretations**
3. **My recommendation**
4. **One decision needed from you**, only if blocking

Do not begin with “tell me more.” Do not ask users to invent professional terminology. Prefer a choice such as “soft and childlike, playful and energetic, or restrained and friendly?” over “what kind of cute do you want?”

Keep visible output proportional to uncertainty. A simple request may need one contrast and one provisional specification; a high-stakes product direction may need several rounds.

## Completion gate

An intent is ready for execution when:

- the present and target states are distinguishable;
- every high-impact dimension has an anchored target;
- purpose, audience, constraints, and preservation rules are explicit;
- contradictions have a chosen resolution;
- acceptance criteria can be observed or tested;
- the executor does not need to invent a value judgment.

If these conditions are already true in the user's request, skip elicitation and produce or hand off the specification immediately.
