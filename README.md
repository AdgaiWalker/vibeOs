# vibeOs

[![Protocol](https://img.shields.io/badge/Agency_Protocol-v0.1-5B5BD6)](protocol/) [![Skills](https://img.shields.io/badge/reference_skills-3-111111)](skills/) [![Tests](https://img.shields.io/badge/tests-Node.js-339933)](tests/) [![License: MIT](https://img.shields.io/badge/license-MIT-yellow.svg)](LICENSE)

**不知道该用哪个 Skill？把你想做的事告诉 `$vibe-flow`，它会选择需要的 Skill、安排顺序，然后继续执行。**

你不用先研究提示词，也不用记住一串 Skill 名字。多数时候，只需要记住 `$vibe-flow` 这一个入口。

```text
使用 $vibe-flow，帮我选择合适的 Skill，把这件事做完。
```

如果目标还说不清，它会先把需要你决定的问题交给 `$vibe-check`；事情做成以后，你还可以用 `$vibe-recipe` 把方法保存成下次能直接复用的 Skill。

![vibeOs 的 Vibe Tri-Pack：想明白、串起来、变套路](docs/assets/vibe-tri-pack.svg)

## 什么时候用 vibeOs

| 你现在卡在哪里 | 直接这样说 | 接下来会发生什么 |
| --- | --- | --- |
| Skill 装了很多，不知道该咋用 | `使用 $vibe-flow，选择合适的 Skill，把这件事做完。` | 排除不需要的 Skill，安排先后与并行关系，然后继续执行 |
| 心里有方向，但说不具体，AI 做出来总是不对 | `使用 $vibe-check，和我聊聊把这个想法变成具体目标。` | 先看现状，再给出几个具体方向，每次只确认一个重要选择，最后写清要什么、不要什么、怎样算完成 |
| 刚用 `skill-creator` 做了一个 Skill，想换个任务继续用 | `使用 $vibe-recipe，用另一个真实任务测试并改进这个 Skill。` | 找出隐藏假设、固定步骤和可替换内容，反复测试，得到一个写清适用范围并经过换任务验证的 Skill |

已经知道该怎么做，只想让 AI 选择工具并完成任务？直接使用 `$vibe-flow`。只是一次性小事？做完就停，不必强行保存成 Skill。

## vibeOs 替你选工具，不替你做决定

vibeOs 可以查看现状、提出方向、选择工具、安排执行和记录方法，但下面这些决定不会交给 AI 猜：

- 你真正想要什么；
- 哪种取舍更像你；
- 哪些内容不能改，哪些风险不能接受；
- 最终结果是否通过。

AI 负责减少重复的研究、组织和交接；你保留目标、取舍和验收权。

## 安装

复制下面的内容，粘贴到你常用的 AI 对话框：

```text
https://github.com/AdgaiWalker/vibe0s
帮我安装技能
```

AI 会先检查兼容性、安装位置和同名冲突，等你确认后再开始。安装完成后，从 `$vibe-flow` 开始即可。

### 按需安装常用 Skill

`$vibe-flow` 会从你已经安装的 Skill 中选择需要的能力。下面是哆啦日常使用的两套 Skill；它们不是 vibeOs 的必装依赖，需要哪类能力，就复制对应内容到 AI 对话框。

#### 让 AI 做出更自然的动画和更精致的界面：[`emilkowalski/skills`](https://github.com/emilkowalski/skills)

```text
https://github.com/emilkowalski/skills
帮我安装技能
```

#### 让 AI 动手少做错、代码更好：[`hylarucoder/hai-stack`](https://github.com/hylarucoder/hai-stack)

```text
https://github.com/hylarucoder/hai-stack
帮我安装技能
```

## 使用方法

### 不知道用哪个 Skill：从 `$vibe-flow` 开始

```text
使用 $vibe-flow，帮我选择合适的 Skill，把这件事推进到可以检查的结果。
```

它会根据任务选择足够完成工作的最少 Skill，安排依赖关系，并在证据或条件变化时重新调整后续步骤。

### 目标说不清：使用 `$vibe-check`

```text
使用 $vibe-check，和我聊聊把“这个首页想更有信任感，但不要太严肃”变成清晰的具体需求。
```

它不会先丢给你一张长问卷。它会查看现状、给出能比较的方向，并保留真正需要你决定的取舍。

### 做成后想复用：使用 `$vibe-recipe`

```text
使用 $vibe-recipe，把这次做成官网的方法变成换个项目也能直接使用的 Skill。
```

它会提取这次成功中不能省略的步骤和可以替换的内容，再用另一个真实任务测试这套方法是否站得住。

这三个 Skill 不要求按顺序全部使用：目标清楚时可以跳过 `$vibe-check`，一次性任务可以跳过 `$vibe-recipe`。

## 看一个完整例子

假设你只知道：

> 我想把 README 写得更吸引小白，但又不想变成夸张广告。

| 阶段 | 具体发生什么 | 可以检查的结果 |
| --- | --- | --- |
| `$vibe-check` | 找出真正影响结果的选择：读者是谁、第一眼要看见什么、哪些表达不能丢 | 一份不会让执行者猜方向的目标 |
| `$vibe-flow` | 选择需要的文档、产品、视觉和验证能力，安排读取、重写和检查 | 一份可以直接阅读和验收的 README |
| `$vibe-recipe` | 回看这次为什么做成，分离固定原则与项目变量，再用另一个仓库测试 | 一份其他项目也能复用的 README Skill |

一次答对只解决这一次；把做成的方法留下来，下一次才不用重新开始。

## 为什么要这样做

AI 没有自动消除学习成本。很多时候，人要先学怎么描述需求、研究该选哪个工具，再手动拼接流程；即使成功一次，下次还要重新来。

vibeOs 把这些工作拆成三个可以检查的动作：

```text
想明白（vibe-check） → 串起来（vibe-flow） → 变套路（vibe-recipe）
```

| 原本需要你反复处理 | vibeOs 的具体做法 |
| --- | --- |
| 研究怎样把需求说得专业 | 用具体对比确认目标，而不是要求你先学会专业表达 |
| 阅读每个工具的说明，再决定谁先谁后 | 只选择对当前任务有独特价值的 Skill，并安排执行 |
| 保存提示词，靠记忆复现一次成功 | 把固定步骤和可替换部分写进 Skill，再用真实任务验证 |

## 证据与边界

仓库测试会检查三个 Skill 能否安装、识别和卸载，也会检查它们的身份、交接规则和案例证据是否一致。

```bash
make test
```

现有证据证明，这套流程可以把一次真实任务记录成可追踪、可检查的过程。它还不能证明所有人都会节省时间、减少 Token 或得到更好的作品；这些结论需要更多真实任务和可比较的数据。

- [Agency Protocol v0.1](protocol/)：人与 AI 各自负责什么。
- [Agency Contract v0.1](contracts/)：任务换人或换工具时，怎样不丢上下文。
- [评估记录](evals/)：怎样区分事实、观察和暂时无法证明的主张。
- [真实案例](cases/001-readme-rewrite.md)：一次 README 任务怎样被记录和复盘。

<details>
<summary><strong>查看仓库结构</strong></summary>

```text
vibeOs/
├── skills/
│   ├── vibe-check/          # 想明白
│   ├── vibe-flow/           # 串起来
│   └── vibe-recipe/         # 变套路
├── protocol/                # 人与 AI 的协作规则
├── contracts/               # 交接时共同使用的信息
├── cases/                   # 真实案例
├── evals/                   # 检查方法与结果
├── scripts/                 # 安装、检查和卸载
└── tests/                   # 自动测试
```

</details>

## 研究来源

- [Ferry](https://github.com/AdgaiWalker/Ferry)：vibeOs 的主要研究来源，涵盖人类主权、意图—执行—记忆—进化闭环，以及通过记录和复盘对抗协作遗忘。
- [华罗庚《统筹方法平话及补充》](https://www.amss.cas.cn/ryszl/hlg/lwzz/)：统筹方法的研究来源。华罗庚在中国生产实践中提炼和推广统筹法；vibeOs 借鉴其中组织任务网络、识别关键环节和安排并行工作的思想。

## License

[MIT](LICENSE)
