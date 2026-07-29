# Skill-Craft
对Claude code 家的skill creator生产的skill,锻造成所有人能用的通用skill.
skill文件决策,附带一系列知识库、工具。甚至工作流本身。

从真实测试中迭代出健壮技能的方法论。不是写完就完，是"写-测-审-改-再测"的迭代循环。

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](../../LICENSE)


## 对谁有用

- 正在创建 Claude Code Skill 的人
- 技能写了一版但测试不通过，不知道问题出在哪
- 想知道为什么代码审查全通过但实际效果差

## 触发词

"创建技能"、"改进技能"、"技能质量"、"技能架构"、"测试技能"、"技能总是出问题"、"怎么写好一个 skill"

## 安装

**方式 1：命令安装**

```bash
npx skills add AdgaiWalker/Walkcraft-Skill-Craft --skill skill-making-skill
```

**方式 2：让 AI 帮你安装**

把这段话发给 AI：

```text
帮我安装这个 skill：
https://github.com/AdgaiWalker/Walkcraft-Skill-Craft
skill 名称：skill-making-skill
请帮我用合适的方式完成安装。安装完成后，告诉我最短怎么调用它。
```

## 工作方式

```
Phase 1: 问题建模（10 分钟）
  → 想清楚再动手。类型判定 + 作用域边界 + 标准锚点搜索
Phase 2: 草稿
  → 三阶段架构（发现 → 处理 → 执行）+ 去重 + 环境感知
Phase 3: 真实测试
  → 最重要的一步。代码审查查逻辑，真实测试查现实
Phase 4: 审计分级
  → P0/P1/P2，修根因不修症状
Phase 5: 做减法（三把刀）
  → 离去（删）、转化（变）、迁移（移）
Phase 6: 通用化
  → 技术术语换成日常语言
```

**为什么这样设计**：第一版必然基于错误假设，只有真实测试才能暴露问题。这套方法论从一个真实案例中提炼——代码审查全部通过，但模拟测试才发现只扫到了一小半数据。

## 经验库

每次 f(X)→Y 的变换完成后，案例记入 `references/cases/`，决策规则记入 `references/patterns/`。规则指导下一次变换，案例验证规则是否站得住脚。具体→抽象→新的具体→更精确的抽象，每转一圈方法论本身变强。

```
references/
├── cases/                          # 变换记录（输入→过程→输出→产出的规则）
│   ├── 001-astro-component-diagnosis.md
│   └── 002-side-hustle-blueprint.md
└── patterns/                       # 决策规则（触发条件→核心动作→证据→例外）
    ├── framework-component-evaluation.md
    └── skill-as-gatekeeper.md
```

## 使用

在 Claude Code 中说"我要创建一个新技能"或"这个技能质量有问题，帮我改进"即可触发。AI 会引导你走完整个流程。

## License

MIT
