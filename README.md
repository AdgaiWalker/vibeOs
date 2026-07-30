# Agency-Craft

> **不是只有伟大的开创者，才能让人们看见新的可能。**

[![Protocol](https://img.shields.io/badge/Agency_Protocol-v0.1-5B5BD6)](protocol/)
[![Skills](https://img.shields.io/badge/reference_skills-3-111111)](skills/)
[![Tests](https://img.shields.io/badge/tests-Node.js-339933)](tests/)
[![License: MIT](https://img.shields.io/badge/license-MIT-yellow.svg)](LICENSE)

> Vibe 2.0：AI 引导意图，人做决策，AI 执行，把模糊变成具体。

**让人说清楚、选明白、做得到。**

Agency-Craft 是一套人机协作协议，以及它在 Codex 中的参考实现。它解决的不是“AI 会不会做”，而是更早、更昂贵的问题：当人的意图还很模糊时，怎样避免 AI 猜错方向、技能互相堆叠，以及执行结果反复返工。

它把协作约束成一个可跳过、可验证的闭环：

```text
观察现状 → 建立对照 → 人做决定 → 写成规格
        → 裁决能力 → AI 执行 → 按证据验收 → 沉淀经验
```

核心分工始终不变：

> **AI 扩展人的觉察力并执行决定；人保留价值判断与最终验收权。**

---

## 为什么需要 Agency-Craft

AI 的执行能力越来越强，但执行速度不能补偿方向错误。

- “更可爱、更高级、更自然”看似是要求，实际上还不是可执行的决定。
- 一个人往往需要先看见差异、理解相关知识，才能知道自己真正想要什么。
- 技能越多，选择、排序、交接和恢复上下文的成本越高。
- 一次成功的方法如果没有经过真实测试，就很难让别人稳定复用。
- 模糊意图直接进入执行，会变成反复改稿、低质量作品和无效 Token 消耗。

Agency-Craft 不要求用户先学会专业表达。AI 负责观察、提供刚好够用的知识与有意义的对照；用户只在真正影响结果的地方做决定。

---

## 一套协议，三道独立闸门

完整规则见 [Agency Protocol v0.1](protocol/)。每次任务从最早尚未解决的状态进入，不必走完整条流水线。

| 闸门 | 何时需要 | 参考技能 | 闸门通过的证据 |
| --- | --- | --- | --- |
| **Intent** | 执行者仍需猜测主观词语或高影响偏好 | [`Vibe-Craft`](skills/vibe-craft/) | 当前与目标可区分；重要选择、边界和验收标准已明确 |
| **Flow** | 多个技能可能参与，顺序与必要性不明 | [`Vibe-Flow`](skills/vibe-flow/) | 每个幸存技能都有独特价值、合法输入、明确消费者和继续条件 |
| **Capability** | 一次方法要变成可复用技能，或现有技能不可靠 | [`Skill-Craft`](skills/skill-craft/) | 真实独立测试已挑战关键假设；P0 / P1 问题已清除；经验已回流 |

目标已经清晰，就跳过 Intent；一个能力已经足够，就不必编排复杂 Flow；不需要长期复用，就不要过早制作 Skill。

### 共同交接语言

三个技能通过同一份 [Agency Contract](contracts/) 交接，最小信封只保留下一位执行者真正需要的信息：

- `objective`：终点、当前状态、目标状态与状态；
- `decisions`：哪些选择已锁定、哪些是可逆默认、哪些仍开放；
- `boundaries`：必须保留、必须避免和暂不处理的范围；
- `acceptance_criteria`：如何观察或测试结果；
- `handoff`：下一位负责人、所需输入、继续闸门与重开条件；
- `evidence`：支持决定或验收的可检查证据。

它是交接物，不是让用户填写的表格。AI 应先观察和推断，只对无法安全推断的高影响选择提问。

---

## 三个参考技能

### Vibe-Craft · 把感觉变成决定

用于“我知道想改变，但说不清具体要什么”的场景。它先观察已有对象，再把模糊词拆成与领域有关的维度，提供两到四个有意义的对照方向，让人做价值选择，最后产出可执行、可验收的意图规格。

```text
这个杯子我想让它更可爱，但不要幼稚。我说不清该改哪里。
→ Vibe-Craft
```

### Vibe-Flow · 让能力选明白、组织好

用于“我有很多技能，但不知道该用谁、怎么组合、先做什么”的场景。它对候选技能进行对抗式审理，再用华罗庚式统筹方法组织关键路径、并行支线与最少闸门。

```text
从零设计一个网站。这些设计和动画技能该怎么组合？直接帮我推进。
→ Vibe-Flow
```

### Skill-Craft · 把一次方法变成可靠技能

用于创建、改进或调试技能。它把第一版当作待证伪的假设，经过问题建模、草稿、独立真实测试、分级审计、减法和经验回流后，才把方法视为可复用能力。

```text
把这套反复使用的方法做成别人也能稳定使用、可以继续迭代的技能。
→ Skill-Craft
```

Skill-Craft 的详细使用说明见 [docs/skills/skill-craft.md](docs/skills/skill-craft.md)。

---

## 安装与验证

需要 Git、Node.js 18+ 与 Codex。仓库脚本只创建指向当前仓库的符号链接，不会覆盖同名文件或其他安装。

```bash
git clone https://github.com/AdgaiWalker/Agency-Craft.git
cd Agency-Craft
make link
make status
make test
```

默认安装到 `~/.codex/skills`。如需隔离环境，可设置 `CODEX_HOME`：

```bash
CODEX_HOME=/path/to/codex-home make link
```

重新开启 Codex 任务后，可直接用自然语言触发；也可以显式指定：

```text
使用 $vibe-craft，把这个模糊感觉澄清成可执行、可验收的意图规格。
使用 $vibe-flow，审理这些候选技能并推进最小可靠工作流。
使用 $skill-craft，把这套方法做成经过真实测试、可以继续迭代的技能。
```

卸载当前仓库创建的链接：

```bash
make unlink
```

从早期版本升级时请注意：Skill-Craft 的显式调用名已从 `$skill-making-skill` 改为 `$skill-craft`，使调用名与目录和项目名一致。重新执行 `make link` 并开启新的 Codex 任务即可。

---

## 证据，而不是口号

项目把“协议有效”与“文件存在”分开验证：

- `make test` 检查契约语义、技能身份、交接信封、安装生命周期和案例证据；
- [`AC-001：README 重写`](cases/001-readme-rewrite.md) 记录一个真实仓库任务的技能裁决、关键路径、交接与结果；
- 对应的[机器可读评估记录](evals/cases/001-readme-rewrite.json)明确区分 `measured`、`observed` 与 `unavailable`。

当前证据只证明一个真实任务可以被**回溯**成可追溯裁决、选择性闸门与机器可读评估记录，同时项目结构可以自动验证。它**尚未证明**前置使用协议的摩擦足够低，也未证明相较基线能降低 Token、减少人工投入或提高作品质量；这些结论必须来自预先设计的对照或多次真实用户任务，不能事后估算。

---

## 仓库结构

```text
Agency-Craft/
├── protocol/                 # Agency Protocol：角色、状态、闭环与闸门
├── contracts/                # 跨角色、跨技能的最小交接契约
├── skills/                   # Codex 参考实现
│   ├── vibe-craft/
│   ├── vibe-flow/
│   └── skill-craft/
├── cases/                    # 人可读真实案例
├── evals/                    # 评估方法与机器可读记录
├── scripts/                  # 安装、状态、卸载与契约验证
├── tests/                    # 项目级自动化检查
├── docs/                     # 目标文档与技能使用说明
├── website/                  # 中文优先的 Agency-Craft 官方网站
├── Makefile
└── README.md
```

`protocol/` 定义共同规则，`contracts/` 定义最小交接面，`skills/` 是可替换的实现，`cases/` 与 `evals/` 负责证明或推翻项目的主张。协议不依赖某一个技能目录才能成立。

---

## 当前边界

v0.1 刻意保持狭窄：

- 只提供 Codex 的三个参考技能；
- 只包含一份协议版本、一种契约格式和一个真实案例；
- 官网当前只提供本地可运行版本，暂不承诺生产托管或自定义域名；
- 暂不提供跨平台安装器、完整 Token 仪表盘或第四个技能；
- 契约验证器验证协作语义，不承担通用 JSON Schema 平台的职责。

下一步不是继续堆功能，而是在更多真实任务中收集可比较证据：高影响猜测、阻塞式澄清轮次、首轮验收率、返工决定与 Token 成本。证据若不支持主张，就修改协议，而不是修饰数据。

---

## 愿景

我们希望 AI 不只是替人快速生产世界，也帮助人更清楚地看见自己真正想创造什么。

当模糊可以被觉察，当感受可以被表达，当选择始终掌握在人手中，AI 的执行能力才不会放大噪声，而会放大人的创造力、审美力与行动力。

> 从模糊到具体，从被默认值牵引到主动选择，从消耗 AI 到真正驾驭 AI——这就是 Agency-Craft 想推动的 Vibe 2.0。
