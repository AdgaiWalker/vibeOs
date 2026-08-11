# vibeOs Website Design Specification

## Locked direction

The site is a real-time interactive film built from physical material choreography. Ambient imagery always moves; vertical scroll advances narrative chapters; pointer movement locally changes tension, refraction, and focus; touch uses drag. It is not a conventional landing page with animations added afterward.

The human-selected concept is [`design/concepts/01-hero-material-choreography.png`](../design/concepts/01-hero-material-choreography.png). The coordinated desktop section concepts are `02` through `06`; `07` and `08` lock the mobile hero and mobile gate composition.

## Visible-copy lock

Above the fold:

- `vibeOs`
- `不是只有伟大的开创者，才能让人们看见新的可能。`

Downstream copy:

1. `为什么需要 vibeOs`
2. `AI 的执行能力越来越强，但执行速度不能补偿方向错误。`
3. `更可爱` / `更高级` / `更自然`
4. `把模糊变成具体。`
5. `AI 引导意图，人做决策，AI 执行。`
6. `观察现状` → `建立对照` → `人做决定` → `写成规格` → `裁决能力` → `AI 执行` → `按证据验收` → `沉淀经验`
7. `三道独立闸门`
8. `CHECK` / `Vibe-Check` / `想明白：把模糊感觉理成明确目标`
9. `FLOW` / `Vibe-Flow` / `串起来：自动挑工具并把事情做完`
10. `RECIPE` / `Vibe-Recipe` / `变套路：把一次成功炼成通用菜谱`
11. `AGENCY CONTRACT` / `共同交接语言`
12. `它是交接物，不是让用户填写的表格。`
13. `objective` / `decisions` / `boundaries` / `acceptance_criteria` / `handoff` / `evidence`
14. `证据，而不是口号。`
15. `当前证据只证明一个真实任务可以被回溯成可追溯裁决、选择性闸门与机器可读评估记录。`
16. `尚未证明降低 Token、减少人工投入或提高作品质量。`
17. `make link` / `make test`
18. `AI 扩展人的觉察力并执行决定；人保留价值判断与最终验收权。`

## Visual system

- Background: true deep charcoal `#08090b`, never cream, gray, or a decorative gradient.
- Primary text: bone white `#f2f0eb`.
- Muted text: cold silver `#a3a5aa` to `#c9cbd0`.
- Accent: saturated cobalt `#1539d1`.
- Container model: full-bleed cinematic stages and open text fields. No cards, rounded panels, bento grids, or dashboard chrome.
- Typography: light contemporary CJK grotesk using native platform CJK fonts; quiet monospaced English/field labels; large scale changes with disciplined letter spacing.
- Corners, shadows, icons: no decorative radii or shadows; the only navigation is a quiet wordmark and chapter progress rail.

## Section and motion inventory

| Chapter | Production plate | Scroll behavior | Pointer/touch behavior |
| --- | --- | --- | --- |
| Hero | `public/media/hero-stage-v2.png`, portrait variant `hero-material-mobile.png` | slow zoom into the fold; grid preview remains visible | localized pull/refraction around pointer or drag |
| Direction | `public/media/direction-error.png` | blurred material converges on the right crease | local focus changes |
| Loop | `public/media/vibe-loop.png` | eight labels advance through one pinned material path | local tension on the continuous ribbon |
| Gates | `public/media/three-gates.png`, portrait variant `three-gates-mobile.png` | same membrane crosses three apertures | selected gate copy and local aperture distortion |
| Contract | `public/media/agency-contract.png` | sheet rotates toward readable alignment | field selection and peeled-layer displacement |
| Evidence | `public/media/evidence-footer.png` | sheet settles into the grid | evidence line and command underlines respond |

Motion uses 8–14 second ambient cycles, a localized pointer radius, scroll progress mapped to texture shift/zoom, and short code-native text state transitions. `prefers-reduced-motion` disables shader movement, smooth scrolling, and nonessential transitions while leaving every section readable and functional.

## Responsive continuation

- Desktop and tablet retain horizontal material compositions with pinned `100svh` stages.
- Mobile hero and gates use independent portrait art, not a crop of the desktop concept.
- Remaining mobile chapters use controlled focal crops, single-column copy, and no horizontal scrolling.
- Chapter navigation moves from a vertical rail to a bottom horizontal rail.
- Touch drag is accepted anywhere over the active film layer; all controls remain keyboard reachable.

## Boundaries

- No generic AI orb, particles, neon grid, sci-fi HUD, archive wall, protocol theater, dashboard, or card grid.
- No unsupported effectiveness claim.
- No production deployment without explicit authorization.
- Generated plates contain no UI text; all navigation, headings, labels, commands, and accessibility text are code-native.
