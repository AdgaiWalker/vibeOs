# Goal Document: Agency Protocol v0.1

## Go / No-Go

- **Judgment**: Go
- **Reason**: The first milestone is a narrow, reversible vertical slice: define one shared handoff contract, apply it to the three existing skills, and prove the repository mechanics with automated checks and one real case.

## Target Outcome

Agency-Craft is no longer only a collection of three related skills. It has a written Vibe 2.0 protocol, one canonical Agency Contract used by all three reference skills, a repeatable evaluation record, and one-command repository operations that a new Codex user can verify locally.

## Goal Definition

- **Type**: technical + learning + quality
- **Boundary**: Add the protocol, contract, evaluation and case structures; add link/status/unlink/test tooling; align the three existing skills with the contract; rename the Skill-Craft invocation from `skill-making-skill` to `skill-craft`; update the root README.
- **Non-goals**:
  - Building a website, visual brand or hosted documentation.
  - Supporting platforms other than Codex in v0.1.
  - Adding a fourth skill.
  - Claiming measured Token reduction without a baseline.
  - Fabricating a full-pipeline user case where no trace exists.
- **Deferred work**:
  - Automated Token collection.
  - Multi-agent and multi-platform adapters.
  - A statistically meaningful benchmark suite.
  - Additional real-user cases.
- **Verification rule**: The repository's automated test command must validate skill identity, UI metadata, relative README links, contract examples and tool behavior. Link/status/unlink must also pass in an isolated `CODEX_HOME`.
- **Evidence source**: Automated command output, versioned protocol/contract artifacts, and an evidence-linked case record.
- **Pass criteria**:
  - `make test` exits 0.
  - Isolated `make link`, `make status` and `make unlink` complete without touching unrelated files.
  - All three skill folders contain a valid `SKILL.md` whose declared name matches the folder.
  - Each skill emits or consumes the common contract envelope at its handoff boundary.
  - At least one contract example passes and malformed fixtures fail for the expected reason.
  - The real case cites inspectable commits or source artifacts and labels unavailable metrics honestly.
- **Confidence note**: These checks prove structural coherence and repeatability, not that the protocol improves human outcomes. That requires subsequent real-user comparisons.
- **Judgment owner**: Automated tests declare the technical milestone complete; the project author decides whether later user evidence justifies expanding the protocol.

## Baseline State Before Execution

- The repository contains `Vibe-Craft`, `Vibe-Flow` and `Skill-Craft`.
- Each skill currently uses its own output language; no canonical handoff envelope exists.
- The root README explains the relationship but no protocol, contract or evaluation artifact makes the relationship enforceable.
- Installation is documented as three manual symbolic-link commands.
- `Skill-Craft` is stored in `skills/skill-craft/` but declares `name: skill-making-skill`.
- Two Skill-Craft cases and two patterns exist; Vibe-Craft has a template and examples; Vibe-Flow has no bundled evidence record.

## Priority Rationale

- The contract comes first because protocol prose without an enforceable handoff remains a slogan.
- Tests precede tooling and interface changes because the project currently has no regression boundary.
- One real, modest case is more credible than a fabricated end-to-end showcase.
- The directory expansion is limited to artifacts used by the first proof; empty future-facing structure is prohibited.

## Assumptions and Open Decisions

| Item | Status | Impact | Owner / Next step |
| --- | --- | --- | --- |
| Codex is the only supported runtime for v0.1 | Confirmed | Keeps installation and skill metadata concrete | User-approved target |
| No installed or documented consumer requires `$skill-making-skill` | Confirmed locally | Allows direct rename without an alias | Repository search + local skill catalog check |
| A shared envelope can remain concise enough for single-skill use | Assumed | If false, the protocol adds more friction than it removes | Test with the first case and contract example |
| Real Token reduction can be claimed now | Rejected | Prevents unsupported marketing claims | Defer until baseline collection exists |

## Phases

### Phase 1: Define the protocol boundary

- **Purpose**: Turn Vibe 2.0 from a slogan into explicit roles, states, decisions and completion rules.
- **Entry condition**: The target model and v0.1 cut list are fixed.
- **Phase rules**:
  - Add only concepts exercised by one of the three current skills.
  - Keep value decisions human-owned.
  - Do not prescribe a mandatory three-skill pipeline.
- **Todos**:
  - [x] Write `protocol/README.md`.
    - **Surface**: Protocol documentation.
    - **Proof**: Every protocol state maps to an existing skill behavior or an executor/human boundary.
    - **Depends on**: None.
  - [x] Define the canonical Agency Contract and one valid example.
    - **Surface**: Contract documentation and JSON fixture.
    - **Proof**: Contract validation test initially fails because validation does not exist.
    - **Depends on**: Protocol roles.
- **Exit proof**: The protocol and contract have no field without a named producer and consumer.
- **Stop condition**: Pause if the contract requires domain-specific fields or forces every skill to populate irrelevant sections.

### Phase 2: Build the proof boundary through TDD

- **Purpose**: Make repository and contract behavior repeatable.
- **Entry condition**: The contract's minimum required fields are fixed.
- **Phase rules**:
  - Every behavior begins with an observed failing test.
  - Scripts use only built-in Node.js or POSIX shell capabilities.
  - Unlink may remove only symbolic links that resolve to this repository.
- **Todos**:
  - [x] Add failing tests for valid and malformed Agency Contracts.
    - **Surface**: `tests/` fixtures and test runner.
    - **Proof**: RED failure cites the missing validator.
    - **Depends on**: Phase 1 contract.
  - [x] Implement the minimum contract validator.
    - **Surface**: `scripts/`.
    - **Proof**: Contract tests turn GREEN.
    - **Depends on**: Failing tests.
  - [x] Add failing tests for link/status/unlink safety.
    - **Surface**: Repository operations.
    - **Proof**: RED failure cites missing commands.
    - **Depends on**: Contract validator GREEN.
  - [x] Implement link/status/unlink and a `Makefile`.
    - **Surface**: POSIX scripts and command interface.
    - **Proof**: Isolated lifecycle test turns GREEN.
    - **Depends on**: Failing lifecycle test.
- **Exit proof**: `make test` passes from a clean checkout path with an isolated `CODEX_HOME`.
- **Stop condition**: Pause if a command needs to overwrite an existing non-symlink path or requires network access.

### Phase 3: Align the reference implementations

- **Purpose**: Make all three skills participate in one handoff protocol.
- **Entry condition**: Contract validator and repository tests are GREEN.
- **Phase rules**:
  - Keep each skill independently usable.
  - Put only the minimal contract envelope in the skill body; keep full documentation canonical at repository root.
  - Rename internal identifiers directly; do not add an alias without a named compatibility contract.
- **Todos**:
  - [x] Rename Skill-Craft's declared invocation and add current UI metadata.
    - **Surface**: `skills/skill-craft/`.
    - **Proof**: Skill identity and default-prompt checks pass.
    - **Depends on**: Repository test runner.
  - [x] Add contract handoff rules to Vibe-Craft, Vibe-Flow and Skill-Craft.
    - **Surface**: Three `SKILL.md` files.
    - **Proof**: Project checks find all required envelope labels and skill validation passes.
    - **Depends on**: Canonical contract.
- **Exit proof**: A consumer can identify objective, decisions, boundaries, acceptance evidence and next owner without reconstructing prior conversation.
- **Stop condition**: Pause if self-contained skill use requires loading files outside its directory.

### Phase 4: Publish one honest proof

- **Purpose**: Demonstrate the protocol using inspectable evidence without inventing unavailable metrics.
- **Entry condition**: Three skill interfaces and automated checks are GREEN.
- **Phase rules**:
  - Use a real repository task with commit evidence.
  - Mark missing baseline, Token and human-outcome data as unavailable.
  - Do not call the case proof of effectiveness; it proves traceability and selective skill use.
- **Todos**:
  - [x] Record the Agency-Craft README rewrite as case 001.
    - **Surface**: `cases/`.
    - **Proof**: Source request, skill rulings, output commit and known limitations are cited.
    - **Depends on**: Contract format.
  - [x] Add an evaluation scorecard for the case.
    - **Surface**: `evals/`.
    - **Proof**: The scorecard distinguishes measured, observed and unavailable evidence.
    - **Depends on**: Case record.
  - [x] Update the root README to present protocol, proof, installation and current limits.
    - **Surface**: README.
    - **Proof**: Relative links and documented commands pass automated checks.
    - **Depends on**: Case and tooling.
- **Exit proof**: A new reader can install, run tests, inspect one evidence chain and see what remains unproven.
- **Stop condition**: Do not publish any numerical improvement without a recorded baseline.

## Dry-Run Findings

- A repository-root contract cannot be a required runtime dependency for individually installed skills. Therefore each skill must carry the minimal envelope fields in its own instructions while the root contract remains the authoring and evaluation source of truth.
- The first real case does not exercise Vibe-Craft. That is acceptable and useful evidence that the three gates are independent; it must not be represented as a full-pipeline effectiveness proof.
- Tooling should target macOS/Linux POSIX environments in v0.1 because the current installation method already relies on symbolic links. Windows support remains deferred.
- Renaming `$skill-making-skill` has no detected local installed consumer, but it remains a public-interface change and must be called out in release notes or the commit summary.

## Final Validation

- Run `make test`.
- Run `make link`, `make status` and `make unlink` with an isolated `CODEX_HOME`.
- Run the Codex skill validator for all three skills.
- Run `git diff --check`.
- Verify the remote default branch contains the protocol, contract, case and evaluation artifacts.

## Execution Evidence

- The Agency Contract tests captured RED failures for the missing validator, incomplete envelopes and invalid semantic values before the minimum implementation was added.
- Repository-operation tests captured RED failures for missing `link`, `status`, `unlink` and `test` commands before their implementations were added.
- Skill-identity and handoff tests captured the old `skill-making-skill` identifier and missing contract envelopes before the three skills were aligned.
- Independent forward use of all three skills exposed near-synonym keys and invalid nested item shapes in the first handoffs. The self-contained v0.1 item schemas and enums were then added; the revised Vibe-Craft, Vibe-Flow and Skill-Craft runs all returned validator-compatible envelopes.
- Case AC-001 and its scorecard distinguish measured, observed and unavailable evidence; no Token or outcome improvement is claimed.
- `make test` passes 46 checks after the README rewrite and safety regressions.

## First Execution Step

Write the contract behavior test and run it before implementing the validator, recording the expected RED failure.
