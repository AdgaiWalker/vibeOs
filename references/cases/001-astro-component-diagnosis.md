# 案例 001：astro-component-diagnosis

## 输入 X

- **什么技能**：React 组件诊断技能（react-component-diagnosis），要适配为 Astro 版本
- **类型**：评估诊断类
- **领域**：Web 前端框架

## 过程

### 被证伪的假设

| 假设 | 实际 | 后果 |
|------|------|------|
| React 的诊断维度可直接迁移到 Astro | Astro 渲染一次（构建时），无响应式、无 hooks，心智模型根本不同 | 直接迁移会产出误导性诊断 |
| 评分可以凭经验判断 | Astro 官方文档有 28 条可验证的规范陈述 | 凭印象评分 → 补查标准后评分质量大幅提升 |
| Navigation.astro 的性能问题都是 Navigation 的问题 | SearchModal 的 VT 生命周期问题拖低了 Navigation 的性能分 | 子单元问题误伤父单元评分 |

### 关键决策

1. **先研究框架再写技能**：花了完整一轮读 Astro 官方文档（组件、布局、指令、Islands、样式、View Transitions），提取 28 条标准，放到 `references/astro-standards.md`
2. **重写心智模型维度**：React 的 "hooks 生命周期" 变成 Astro 的 "构建时 vs 运行时边界"
3. **新增维度特化**："性能"维度从 React 的 "re-render 优化" 变成 Astro 的 "零 JS 纯度"

### 测试发现

- **Base.astro 测试**：发现死 `theme` prop、手动 SEO prop 转发、内联光晕逻辑
- **Navigation.astro 测试**（subagent）：发现 P0（SearchModal VT 兼容性）、P1（52 行死 CSS + 死 TopNavBar.astro 引用）

## 输出 Y

- `astro-component-diagnosis` 技能（SKILL.md 193 行 + references/astro-standards.md 72 行）
- 7 维度诊断体系，28 条可验证标准锚点
- 推送到 `https://github.com/AdgaiWalker/hai-stack-to-Astro` 的 `astro-skills/` 目录

## 产出（回流到 skill-making-skill 的规则）

| # | 规则 | 对应 SKILL.md 位置 |
|---|------|-------------------|
| 1 | 评估类技能必须定义作用域边界（被诊断单元 vs 关联单元） | Phase 1 §2 |
| 2 | 评估类技能必须搜索标准锚点（有→references/，无→显式声明） | Phase 1 §3 |
| 3 | 测试前必须定义量化通过标准，测试后逐条勾选 | Phase 3 通过标准清单 |

## 教训

最大的教训不是"Astro 和 React 不同"——这谁都知道。真正的教训是：**标准锚点搜索这个动作本身**，在没有做的时候你不觉得缺了什么，做了之后才发现它改变了整个技能的质量。这说明 Phase 1 的"问题建模"阶段，不能只凭经验回答问题，必须主动去外部寻找可验证的依据。
