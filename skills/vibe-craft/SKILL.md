---
name: vibe-craft
description: "Guide a person from vague feelings, adjectives, or dissatisfaction to a concrete, human-owned intent specification by observing the current state, deriving domain-specific dimensions, presenting useful contrasts, teaching only decision-relevant knowledge, challenging contradictions, and defining executable changes plus acceptance criteria. Use when someone wants an object, image, interface, product, brand, document, or experience to become “cuter,” “prettier,” “more premium,” “more natural,” “more professional,” or otherwise different but cannot explain exactly how; says 更可爱、漂亮、高级、自然、专业、我说不清、感觉不对; repeatedly rejects AI output without a stable target; or needs product-manager-style intent elicitation without a long questionnaire."
---

# Vibe Craft

Turn vibe into decisions, not guesses. Help the person notice, learn, compare, and choose; preserve their authority over values while making the result executable by AI.

## Core contract

Optimize for:

`intent clarity × user conviction - questions - token waste - false precision - injected AI preference`

Own discovery and intent specification. Do not silently become the domain implementer. When the user also authorizes execution, hand the completed specification directly to the appropriate skill, tool, or agent without making the user copy another prompt.

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
