# Agency-Craft Motion Review

Date: 2026-08-01
Standard: `review-animations`

## Part 1 — Findings table

| Before | After | Why |
| --- | --- | --- |
| Keyboard button activation could enter the same 880ms scene transition as a pointer click | Input source is derived from the activation event; keyboard navigation commits before the busy-state branch and invalidates an active token (`src/App.jsx:275`, `src/state/cinematicSequence.js:22`) | Keyboard actions must never wait for or trigger decorative motion |
| Focus could select Gate or Contract values and animate both old and new active states | Focus no longer changes selection; stage-wide keyboard modality disables button, pseudo-element, and chapter-line transitions (`src/App.jsx:312`, `src/styles.css:987`) | Browsing with Tab remains distinct from making a decision |
| Enabling reduced motion during a transition could leave the renderer playing the stale transition | The reducer commits the destination and the renderer cancels `runtime.play`, swapping only a matching target texture (`src/state/cinematicSequence.js:118`, `src/components/FilmCanvas.jsx:693`) | State, DOM, and pixels settle on the same scene immediately |
| Pointer easing used fixed per-frame interpolation values | Pointer position and presence use delta-corrected exponential interpolation (`src/components/FilmCanvas.jsx:439`) | Parallax has the same physical feel at 60Hz and 120Hz |
| Reduced motion omitted several decorative transforms and could remove the side-control positioning transform | Reduced motion stops both orbit planes, scene transforms, active-state transforms, and preserves `translateY(-50%)` for side controls (`src/styles.css:1383`) | Motion reduction cannot introduce layout jumps |
| A discrete swipe gesture triggered a non-interruptible film transition | The stage swipe recognizer was removed; touch users retain explicit chapter and next/back controls plus pinch zoom | A fake direct-manipulation gesture is worse than a clear discrete control |

## Part 2 — Verdict

**Approve.** No P1 or P2 findings remain.

- The 880ms transition is limited to pointer and wheel initiated whole-scene narrative motion.
- Keyboard input is immediate and can interrupt an active film transition.
- Ambient WebGL rendering stops when paused or reduced motion is active and no transition is pending.
- Hover motion is gated to fine pointers.
- Motion uses transforms and opacity; no layout-property animation, `transition: all`, `scale(0)`, or `ease-in` remains.
- The background and foreground ribbons move at different speeds without rotating around a center, preserving the intended encircling depth.
