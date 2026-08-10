# Agency-Craft 官网二次设计审计

## Audit scope

- Surface: Agency-Craft 单页官网的六个滚动章节
- User goal: 找出“视觉很强，但整体仍然感觉不对”的高影响原因
- Capture: Codex 应用内浏览器
- Desktop viewport: 1440 × 1024
- Mobile viewport: 390 × 844
- Date: 2026-07-31

## Overall verdict

网站已经有鲜明、统一的银灰与钴蓝材质身份，问题不是“不够艺术”，而是艺术画面、产品叙事和交互反馈没有形成同一条因果链。六章更像六张连续海报，而不是一部由用户推进、由选择改变的互动影片。

## Strengths

- 银灰、纸张、金属与钴蓝液体构成了可识别的品牌资产。
- 六章内容顺序明确：主张 → 问题 → 闭环 → 闸门 → 契约 → 证据。
- 证据章节主动说明尚未证明的内容，建立了可信度。
- 桌面与手机均有完整布局，当前采集未发现浏览器控制台错误。

## Three high-impact problems

### 1. 六章使用同一种舞台语法，叙事没有形成递进

每章都是“全屏材质图 + 漂浮文字 + 固定章节圆点”。Hero 很有冲击力，但后续章节没有在构图、密度、尺度或视觉行为上形成机制展示与结论收束，导致体验很快进入平台期。

Evidence:

- [desktop hero](./desktop-01-hero.png)
- [desktop loop](./desktop-03-loop.png)
- [desktop evidence](./desktop-06-evidence.png)

Direction:

- 保留六章和所有现有文案。
- 将六章组织为三个节奏段：`主张 / 冲突`、`机制 / 选择`、`交接 / 证据`。
- 使用同一条钴蓝“决策流”贯穿章节，但让每段拥有不同的构图职责与信息密度。

### 2. 控件改变了标签，却没有改变影片

闸门和契约字段在语义上是全站最重要的交互，但选择后主要只有文字位移、下划线或明暗变化；材质主体没有回应选择。用户看到的是“可点击的字幕”，不是“选择正在改变系统”。

Evidence:

- [desktop gates](./desktop-04-gates.png)
- [desktop contract](./desktop-05-contract.png)
- [mobile gates](./mobile-04-gates.png)
- [mobile contract](./mobile-05-contract.png)

Direction:

- hover 只做预览，click/focus 保留选择。
- 每个选择必须让材质的焦点、钴蓝流向、层级或开合状态发生可辨认的变化。
- 文字保持稳定，主要反馈发生在画面层，避免用更多装饰动画补偿。

### 3. 视觉层级与可读性在关键章节失衡

大标题与材质图足够强，但解释文字、闭环步骤、闸门说明、契约字段和最终原则普遍偏小、偏灰。手机端的闭环、闸门和契约把文字压在高对比材质上，信息竞争最明显；证据章节则出现很长的空场，结尾原则太弱。

Evidence:

- [mobile loop](./mobile-03-loop.png)
- [mobile gates](./mobile-04-gates.png)
- [mobile contract](./mobile-05-contract.png)
- [mobile evidence](./mobile-06-evidence.png)
- [desktop evidence](./desktop-06-evidence.png)

Direction:

- 不增加新营销文案，重新安排现有文案的尺度、对比和稳定暗区。
- 机制文字不与材质高光重叠；移动端减少同时出现的信息量。
- 让 `make link`、`make test` 与最终原则共同完成收束，而不是散落在空场中。

## Step health

1. **开场 — Strong visual / weak orientation**
   画面和主张有记忆点，但用户仍难以立即判断 Agency-Craft 是什么。

2. **方向 — Healthy**
   冲突清楚，标题、模糊词与画面的关系是六章中最完整的一章。

3. **闭环 — Needs hierarchy work**
   八步逻辑存在，但步骤过小，视觉主体没有清楚解释流程如何推进。

4. **闸门 — Needs interaction work**
   三个选项结构清楚，但选择没有显著改变画面；手机端文字与中轴材质竞争。

5. **契约 — Needs readability work**
   “交接语言”的意象准确，但字段压在亮色纸面上，部分状态难以辨认。

6. **证据 — Needs closure work**
   文案可信、按钮可见，但空间关系没有把证据、行动和最终原则汇聚成结尾。

## Accessibility risks

- 多处小字号灰色文字叠在纹理和高光之上，存在对比度风险。
- 手机底部章节圆点的视觉目标偏小，是否满足触控目标尺寸仍需实测。
- 章节与选择状态主要依赖明暗、位移或下划线；需确认键盘焦点和状态公告。
- 截图无法证明完整 WCAG 合规，也无法判断所有动效在 reduced-motion 下的体验。

## Evidence limits

本轮截图可以确认视觉层级、响应式重排、明显对比风险与页面节奏；不能单凭截图确认键盘遍历、读屏输出、实际帧率、指针反馈强度或完整的 reduced-motion 行为。
