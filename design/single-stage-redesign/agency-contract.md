# Agency-Craft Single-Stage Redesign

Date: 2026-07-31

## Agency Contract

```yaml
contract_version: "0.1"
objective:
  terminal_result: >
    A locally verified, responsive, film-grade Agency-Craft website that lives
    in one viewport-sized stage, uses no page-level vertical scrolling, keeps
    the exact hero statement, and lets user decisions visibly change the film.
  status: complete
state:
  current: >
    The selected single-stage direction is implemented locally: one 100dvh
    stage, one reducer-owned sequence, one persistent WebGL canvas, code-driven
    encircling material, explicit navigation, and responsive scene layouts.
    Build and 63 automated tests pass. Real-browser desktop, tablet, and mobile
    acceptance passes at 1440×1024, 834×1194, and 390×844. Motion review is approved.
  target: >
    Preserve the approved local single-stage build until a human authorizes any
    further visual revision or publication.
decisions:
  locked:
    - id: fixed-stage
      statement: The experience uses one page and no page-level vertical scrolling.
      owner: human
      evidence: User request on 2026-07-31.
    - id: hero-copy
      statement: "Preserve verbatim: 不是只有伟大的开创者，才能让人们看见新的可能。"
      owner: human
      evidence: User request on 2026-07-31.
    - id: visual-dna
      statement: Preserve the existing charcoal, silver-gray, cobalt-blue tactile film identity.
      owner: shared
      evidence: Existing product screenshots and Product Design context rule.
    - id: no-publish
      statement: Do not publish or deploy without explicit authorization.
      owner: human
      evidence: Existing workflow boundary.
    - id: visual-direction
      statement: Implement direction 1, the occlusion-cut single-stage composition.
      owner: human
      evidence: User selected the third revised option, then approved the recommended direction 1 implementation.
    - id: media-model
      statement: Use still image plates plus code-driven motion; use no video asset.
      owner: human
      evidence: User clarified that the cinematic site must be dynamic with code and images, not video.
  provisional:
    - id: explicit-control
      statement: Explicit next/back/scene controls are primary; ambient motion is secondary.
      owner: ai
      evidence: Removing scroll requires a reachable replacement input.
    - id: chapter-as-state
      statement: The six current chapters become time-based scene states, not document sections.
      owner: ai
      evidence: Current information architecture remains useful while the control model changes.
    - id: single-canvas
      statement: Use one persistent WebGL context and keep only current/next textures resident.
      owner: ai
      evidence: Current six-canvas lifecycle and memory inventory.
  open: []
boundaries:
  must_preserve:
    - Exact hero statement.
    - Code-native text and semantic controls.
    - Existing tactile silver/cobalt material identity.
    - Core concepts represented by the current six chapters.
    - WebGL fallback and a reduced-motion path.
  must_avoid:
    - Page-level vertical scrolling.
    - Six simultaneously active full-screen WebGL canvases.
    - Autoplay that removes user control.
    - Invisible off-stage controls remaining keyboard-focusable.
    - Generic dashboard, card grid, or project-management visual language.
  out_of_scope:
    - Production deployment.
    - New routes or a content-management system.
    - Rewriting the Agency-Craft protocol.
acceptance_criteria:
  - id: concept-count
    check: Exactly three independent single-screen concepts are visible.
    method: Built-in Image Gen results in current thread.
    status: pass
    evidence:
      - Three independent concept images were generated before implementation.
  - id: no-scroll-concept
    check: Every concept is a single 1440 × 1024 viewport with no vertical page narrative.
    method: Visual inspection.
    status: pass
    evidence:
      - design/targets/single-stage-occlusion-cut.png
  - id: hero-legibility
    check: The exact hero statement is the dominant, legible message.
    method: Visual inspection.
    status: pass
    evidence:
      - Selected concept and code-native hero heading preserve the exact statement.
  - id: interaction-legibility
    check: Each direction visibly communicates how users advance and alter the film.
    method: Visual inspection.
    status: pass
    evidence:
      - Persistent previous, next, chapter, pause, keyboard, wheel, and pointer-parallax controls are implemented.
  - id: stop-before-build
    check: No application code is changed before the user selects a concept.
    method: Git diff inspection.
    status: pass
    evidence:
      - Git history and prior audit confirm application code changed only after the human selection.
  - id: local-build
    check: Production build and automated tests pass.
    method: npm run build and npm test.
    status: pass
    evidence:
      - Vite production build passed on 2026-08-01.
      - 63 Node tests passed on 2026-08-01.
  - id: one-stage-source
    check: The active application contains one fixed stage and one canvas with no scroll-driven chapter code.
    method: Source inspection and build output.
    status: pass
    evidence:
      - src/App.jsx
      - src/components/FilmCanvas.jsx
      - src/state/cinematicSequence.js
  - id: browser-matrix
    check: Desktop, tablet, and mobile real-browser screenshots and interactions pass.
    method: In-app browser viewport checks at 1440×1024, 834×1194, and 390×844.
    status: pass
    evidence:
      - design/qa-2026-08-01/desktop-01-hero.png through desktop-06-evidence.png.
      - design/qa-2026-08-01/tablet-01-hero.png, tablet-03-loop.png, and tablet-05-contract.png.
      - design/qa-2026-08-01/mobile-01-hero.png through mobile-06-evidence.png.
      - Browser measurements confirm scroll dimensions equal viewport dimensions at all three sizes.
      - A fresh cold-start browser session contains no warnings or errors.
handoff:
  next_owner: human
  inputs:
    - Implemented React/Vite single-stage source.
    - Selected concept in design/targets/single-stage-occlusion-cut.png.
    - Generated orbit texture in public/media/encircling-ribbon-v1.png.
    - Generated portrait orbit texture in public/media/encircling-ribbon-mobile-v1.png.
    - Passing build and automated test evidence.
  continuation_gate: Human visual approval; publishing remains separately gated.
  reopen_if:
    - The user changes the no-scroll constraint.
    - A concept cannot keep all content reachable on mobile or with reduced motion.
    - The selected interaction model cannot be implemented with one accessible stage.
    - Real-browser evidence reveals clipping, contrast, WebGL, or interaction regressions.
evidence:
  - type: screenshot
    source: ../audit-single-stage-20260731/
    supports: Current six-stage desktop and mobile visual baseline.
  - type: browser-measurement
    source: 1440×1024, 834×1194, and 390×844 current-run capture.
    supports: The stage has no page-level overflow and owns exactly one canvas at all accepted sizes.
  - type: code
    source: ../../src/components/FilmCanvas.jsx
    supports: One persistent WebGL context owns only current and target scene textures; two code-animated DOM planes provide encircling depth.
  - type: image
    source: ../targets/single-stage-occlusion-cut.png
    supports: Human-selected composition and occlusion reference.
  - type: image
    source: ../../public/media/encircling-ribbon-v1.png
    supports: Project-bound desktop still texture used for code-driven depth motion.
  - type: image
    source: ../../public/media/encircling-ribbon-mobile-v1.png
    supports: Project-bound portrait texture preserves edge-biased depth on phones and portrait tablets.
  - type: test
    source: ../../tests/cinematic-sequence.test.mjs
    supports: Token, queue, reduced-motion, keyboard, timeout, and scene-choice invariants.
```

## Current-state audit

| Step | Current role | General health against the new goal |
| --- | --- | --- |
| 1. Hero | Establishes the statement and material identity | Strong; preserve as the opening keyframe |
| 2. Why | Explains the direction problem | Strong content, but it currently requires vertical travel |
| 3. Loop | Uses scroll progress to reveal eight steps | Structurally incompatible; needs a controlled playhead |
| 4. Gates | Lets users select Intent, Flow, or Capability | Semantics are useful; selection does not currently alter the film |
| 5. Contract | Reveals the shared handoff fields | Useful scene state; field selection is only a text highlight |
| 6. Evidence | Closes with claims and commands | Strong closing keyframe; currently separated by more than seven viewports |

### Highest-impact gaps

1. Disabling scroll would make five chapters and their progress unreachable.
2. Six independent canvases cannot behave like one continuous film without a central state and transition model.
3. A fixed stage needs explicit next/back/pause, keyboard, touch, focus, live-announcement, and reduced-motion behavior.

### Evidence limits

Screenshots establish layout, hierarchy, contrast risk, and responsive cropping. They do not prove screen-reader output, 200% zoom behavior, GPU memory on real devices, or motion comfort; those remain implementation-stage checks.

## Coordination baseline

```text
Current main-contradiction path:
fresh audit → three single-stage concepts → human visual choice

After selection:
selected visual → one-stage architecture → Design QA
               → motion review → desktop/tablet/mobile acceptance → local handoff

Parallel after a visual choice:
portrait asset preparation ↘
accessibility state model  → implementation convergence
```

Implementation and local acceptance are complete. Publication remains unauthorized until a human explicitly opens that gate.
