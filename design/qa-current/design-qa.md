# Agency-Craft Single-Stage Design QA

Date: 2026-08-01
Target: `design/targets/single-stage-occlusion-cut.png`
Preview: `http://127.0.0.1:5175/`

## Verdict

**Pass.** The implemented site is one fixed cinematic stage with six reachable scene states, no page-level scrolling, one persistent WebGL canvas, responsive still-image plates, and code-driven foreground/background motion. No publication was performed.

## Browser matrix

| Viewport | Page dimensions | Canvas count | Visual evidence | Result |
| --- | --- | ---: | --- | --- |
| Desktop · 1440×1024 | 1440×1024, `scrollY = 0` | 1 | `desktop-01-hero.png` through `desktop-06-evidence.png` | Pass |
| Tablet · 834×1194 | 834×1194, `scrollY = 0` | 1 | `tablet-01-hero.png`, `tablet-03-loop.png`, `tablet-05-contract.png` | Pass |
| Mobile · 390×844 | 390×844, `scrollY = 0` | 1 | `mobile-01-hero.png` through `mobile-06-evidence.png` | Pass |

At every viewport, `scrollWidth === innerWidth` and `scrollHeight === innerHeight`.

## Target comparison

- Exact hero statement remains code-native and dominant.
- Main sculptural material remains on the right, leaving a stable reading field on the left.
- A distant upper ribbon and a nearer lower ribbon live on separate visual planes. Their opposite-speed motion reads as edge-to-edge encircling depth, not a center orbit.
- Portrait viewports use a dedicated 900×1600 texture instead of cropping the center of the desktop plate.
- Silver-gray, graphite, and restrained cobalt remain consistent across all six scenes.
- Navigation, pause, contract fields, gates, commands, and all locked narrative copy remain reachable without vertical page travel.

## Interaction checks

| Check | Evidence | Result |
| --- | --- | --- |
| Pause / resume | `data-paused` toggled and both orbit animations reported `paused` | Pass |
| Gate selection | `CAPABILITY / Skill-Craft` became the sole `aria-pressed=true` choice and its explanation updated | Pass |
| Keyboard navigation | Arrow navigation committed with `phase=idle`; keyboard input interrupted an active pointer transition immediately | Pass |
| Pointer navigation | Chapter controls completed the 880ms cinematic transition and returned to `phase=idle` | Pass |
| Ambient motion | Two tablet captures 1.2s apart differed by 67,570 encoded bytes | Pass |
| Console | Fresh cold start produced no warnings or errors; two historical HMR-only warnings did not recur after reload | Pass |
| Build and tests | Vite production build passed; 63 Node tests passed | Pass |

## Evidence boundary

This QA proves the local responsive composition, interaction state, one-canvas lifecycle, no-scroll constraint, code-driven motion, and browser-console cleanliness at the three accepted sizes. It does not authorize deployment or claim production-device GPU coverage.
