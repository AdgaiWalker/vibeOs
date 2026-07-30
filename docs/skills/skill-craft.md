# Skill-Craft

把只有作者能用的第一版技能，锻造成其他人也能理解、触发、测试和继续迭代的可靠技能。

它用 `SKILL.md` 保存决策逻辑和资源路由，用 `references/` 保存案例、模式和领域知识，用真实测试挑战第一版的错误假设。不是写完就完，而是“写—测—审—改—再测”的循环。

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](../../LICENSE)

## 对谁有用

- 正在创建 Codex Skill 的人。
- 技能写了一版但真实使用效果不稳定的人。
- 想把个人方法迁移成其他人也能使用的技能作者。
- 想知道为什么代码审查通过，但实际运行仍然失败的人。

## 触发词

“创建技能”“改进技能”“技能质量”“技能架构”“测试技能”“技能总是出问题”“怎么写好一个 skill”。

## 安装

克隆 Agency-Craft 并链接三个技能：

```bash
git clone https://github.com/AdgaiWalker/Agency-Craft.git
cd Agency-Craft
make link
```

如果只需要 Skill-Craft：

```bash
mkdir -p ~/.codex/skills
ln -s "$PWD/skills/skill-craft" ~/.codex/skills/skill-craft
```

## 工作方式

```text
Phase 1: 问题建模
  → 类型判定、作用域边界、标准锚点和静默失败
Phase 2: 草稿
  → 只加入实现目标真正需要的内容
Phase 3: 真实测试
  → 代码审查查逻辑，独立测试查错误假设
Phase 4: 审计分级
  → P0 / P1 / P2，修根因而不是症状
Phase 5: 做减法
  → 离去（删）、转化（变）、迁移（移）
Phase 6: 通用化
  → 把专家术语转成普通人能理解的选择
```

这套方法论从真实案例中提炼：代码审查能够发现逻辑问题，独立测试才能暴露环境、数据、边界和用户理解中的错误假设。

## 经验库

每次 f(X)→Y 的变换完成后，案例记入 `skills/skill-craft/references/cases/`，决策规则记入 `skills/skill-craft/references/patterns/`。规则指导下一次变换，案例验证规则是否站得住脚。

```text
skills/skill-craft/references/
├── cases/
│   ├── 001-astro-component-diagnosis.md
│   └── 002-side-hustle-blueprint.md
└── patterns/
    ├── framework-component-evaluation.md
    └── skill-as-gatekeeper.md
```

## 使用

在 Codex 中直接说“我要创建一个新技能”或“这个技能质量有问题，帮我改进”即可触发。

需要显式调用时：

```text
使用 $skill-craft，把这套方法做成经过真实测试、可以继续迭代的技能。
```

## License

MIT
