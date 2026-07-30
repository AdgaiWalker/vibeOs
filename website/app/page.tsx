const githubRoot = "https://github.com/AdgaiWalker/Agency-Craft";

const gates = [
  {
    number: "01",
    eyebrow: "INTENT GATE",
    name: "Vibe-Craft",
    title: "把感觉变成决定",
    description:
      "观察现状，建立有意义的对照，让人锁定真正影响结果的偏好，最后生成可执行、可验收的意图规格。",
    question: "执行者还需要猜你的价值判断吗？",
    href: `${githubRoot}/tree/main/skills/vibe-craft`,
  },
  {
    number: "02",
    eyebrow: "FLOW GATE",
    name: "Vibe-Flow",
    title: "让能力选明白、组织好",
    description:
      "对候选技能进行对抗式审理，再用华罗庚式统筹方法组织关键路径、并行支线与最少闸门。",
    question: "每个进入工作流的能力都不可替代吗？",
    href: `${githubRoot}/tree/main/skills/vibe-flow`,
  },
  {
    number: "03",
    eyebrow: "CAPABILITY GATE",
    name: "Skill-Craft",
    title: "把一次方法变成可靠技能",
    description:
      "把第一版当作待证伪的假设，用独立真实测试、分级审计、减法与经验回流锻造可复用能力。",
    question: "这个方法经得住别人独立使用吗？",
    href: `${githubRoot}/tree/main/skills/skill-craft`,
  },
];

const loop = [
  ["Ground", "看清现状"],
  ["Contrast", "建立对照"],
  ["Decide", "人做决定"],
  ["Specify", "写成规格"],
  ["Route", "裁决能力"],
  ["Execute", "AI 执行"],
  ["Validate", "证据验收"],
  ["Learn", "沉淀经验"],
];

export default function Home() {
  return (
    <main id="top">
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Agency-Craft 首页">
          <span className="brand-mark" aria-hidden="true">
            A
          </span>
          <span>Agency-Craft</span>
        </a>

        <nav className="site-nav" aria-label="主导航">
          <a href="#protocol">协议</a>
          <a href="#skills">技能</a>
          <a href="#evidence">证据</a>
          <a href="#install">安装</a>
        </nav>

        <a
          className="header-link"
          href={githubRoot}
          target="_blank"
          rel="noreferrer"
        >
          GitHub <span aria-hidden="true">↗</span>
        </a>
      </header>

      <section className="hero section-shell" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="hero-thesis">
            不是只有伟大的开创者，才能让人们看见新的可能。
          </p>
          <p className="eyebrow">
            VIBE 2.0 <span>·</span> HUMAN–AI AGENCY PROTOCOL
          </p>
          <h1 id="hero-title">
            让人说清楚，
            <br />
            让 AI 做得到。
          </h1>
          <p className="hero-lede">
            一套把模糊感觉变成清晰选择、可靠工作流与可复用能力的人机协作协议。
            AI 引导意图，人做决策；AI 执行，人用证据验收。
          </p>
          <div className="hero-actions">
            <a className="button button-primary" href="#protocol">
              看协作协议 <span aria-hidden="true">↓</span>
            </a>
            <a
              className="button button-secondary"
              href={`${githubRoot}/blob/main/README.md`}
              target="_blank"
              rel="noreferrer"
            >
              阅读文档 <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>

        <div className="contract-preview" aria-label="Agency Contract 预览">
          <div className="contract-topline">
            <span>AGENCY CONTRACT</span>
            <span>v0.1</span>
          </div>

          <div className="contract-objective">
            <span className="contract-label">OBJECTIVE</span>
            <strong>把模糊变成具体</strong>
            <span className="status-pill">
              <i aria-hidden="true" /> READY
            </span>
          </div>

          <div className="contract-states">
            <div>
              <span>LOCKED</span>
              <strong>人已决定</strong>
              <b>03</b>
            </div>
            <div>
              <span>PROVISIONAL</span>
              <strong>可逆默认</strong>
              <b>02</b>
            </div>
            <div>
              <span>OPEN</span>
              <strong>高影响未决</strong>
              <b>00</b>
            </div>
          </div>

          <div className="contract-flow" aria-hidden="true">
            {["觉察", "决策", "执行", "证据"].map((item, index) => (
              <div className="flow-chip" key={item}>
                <i style={{ "--delay": `${index * 1.6}s` } as React.CSSProperties} />
                <span>{item}</span>
              </div>
            ))}
          </div>

          <p className="contract-foot">
            HUMAN DECIDES <span>·</span> AI EXECUTES
          </p>
        </div>
      </section>

      <aside className="proof-strip" aria-label="项目摘要">
        <p>
          不是提示词合集
          <span>而是协作协议</span>
        </p>
        <p>
          3 道独立闸门
          <span>按需进入，随时跳过</span>
        </p>
        <p>
          1 份共同契约
          <span>不用重建上下文</span>
        </p>
        <p>
          Evidence first
          <span>不拿估算冒充测量</span>
        </p>
      </aside>

      <section className="problem section-shell" aria-labelledby="problem-title">
        <div className="section-heading">
          <p className="eyebrow">THE REAL BOTTLENECK</p>
          <h2 id="problem-title">
            AI 越会做，
            <br />
            猜错方向就越昂贵。
          </h2>
        </div>

        <div className="problem-body">
          <p className="problem-intro">
            “更可爱、更高级、更自然”看似是要求，实际上还不是可执行的决定。
            人往往需要先看见差异、理解刚好够用的知识，才能说清真正想创造什么。
          </p>

          <div className="friction-list">
            <article>
              <span>01</span>
              <div>
                <h3>意图摩擦</h3>
                <p>模糊偏好直接执行，AI 只能猜；每一次猜测都可能变成整轮返工。</p>
              </div>
            </article>
            <article>
              <span>02</span>
              <div>
                <h3>能力摩擦</h3>
                <p>技能越多，选择、排序、交接与恢复上下文的成本就越高。</p>
              </div>
            </article>
            <article>
              <span>03</span>
              <div>
                <h3>复用摩擦</h3>
                <p>一次成功如果没有真实测试与证据回流，就仍然只是作者的偶然经验。</p>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section
        className="protocol section-shell"
        id="protocol"
        aria-labelledby="protocol-title"
      >
        <div className="protocol-copy">
          <p className="eyebrow">AGENCY PROTOCOL · v0.1</p>
          <h2 id="protocol-title">从 Vibe 到 Agency</h2>
          <p>
            AI 可以扩展选项、指出矛盾、预测后果并执行决定，但不能静默拥有人的价值观。
            每次任务从最早尚未解决的状态进入，不必走完整条流水线。
          </p>
          <blockquote>
            <strong>AI 扩展人的觉察力并执行决定；</strong>
            <span>人保留价值判断与最终验收权。</span>
          </blockquote>
          <a
            className="text-link"
            href={`${githubRoot}/tree/main/protocol`}
            target="_blank"
            rel="noreferrer"
          >
            阅读 Agency Protocol <span aria-hidden="true">↗</span>
          </a>
        </div>

        <ol className="loop-list" aria-label="Agency Protocol 协作闭环">
          {loop.map(([name, description], index) => (
            <li key={name}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{name}</strong>
              <p>{description}</p>
              <i aria-hidden="true" />
            </li>
          ))}
        </ol>
      </section>

      <section
        className="skills section-shell"
        id="skills"
        aria-labelledby="skills-title"
      >
        <div className="skills-heading">
          <div>
            <p className="eyebrow">THREE INDEPENDENT GATES</p>
            <h2 id="skills-title">只在真正需要时，启动对应能力。</h2>
          </div>
          <p>
            目标已经清晰，就跳过 Intent；一个能力足够，就不要编排复杂
            Flow；不需要长期复用，就别过早制作 Skill。
          </p>
        </div>

        <div className="gate-grid">
          {gates.map((gate) => (
            <article className="gate-card" key={gate.name}>
              <div className="gate-card-top">
                <span>{gate.number}</span>
                <p>{gate.eyebrow}</p>
              </div>
              <h3>{gate.name}</h3>
              <h4>{gate.title}</h4>
              <p>{gate.description}</p>
              <blockquote>{gate.question}</blockquote>
              <a href={gate.href} target="_blank" rel="noreferrer">
                查看技能 <span aria-hidden="true">↗</span>
              </a>
            </article>
          ))}
        </div>
      </section>

      <section className="handoff section-shell" aria-labelledby="handoff-title">
        <div className="handoff-code" aria-label="Agency Contract 字段示例">
          <div className="code-topline">
            <span>agency-contract.json</span>
            <span>v0.1</span>
          </div>
          <pre>
            <code>{`{
  "objective": "one terminal result",
  "decisions": {
    "locked":      ["human choice"],
    "provisional": ["reversible default"],
    "open":        []
  },
  "boundaries": ["preserve", "avoid"],
  "acceptance_criteria": ["observable"],
  "handoff": {
    "next_owner": "executor",
    "continuation_gate": "evidence exists"
  }
}`}</code>
          </pre>
        </div>

        <div className="handoff-copy">
          <p className="eyebrow">ONE SHARED HANDOFF</p>
          <h2 id="handoff-title">
            交接意图，
            <br />
            不要交接整段对话。
          </h2>
          <p>
            Agency Contract 保存终点、决定、边界、验收标准、下一负责人和证据。
            下一位执行者无需从历史聊天里重新猜测，也不会让用户再填一遍表。
          </p>
          <ul>
            <li>人做过的价值选择不会在交接中丢失</li>
            <li>安全、可逆的细节可以标记为 Provisional</li>
            <li>高影响 Open 决定归零后，执行才能继续</li>
          </ul>
          <a
            className="text-link"
            href={`${githubRoot}/tree/main/contracts`}
            target="_blank"
            rel="noreferrer"
          >
            查看契约定义 <span aria-hidden="true">↗</span>
          </a>
        </div>
      </section>

      <section
        className="evidence section-shell"
        id="evidence"
        aria-labelledby="evidence-title"
      >
        <div className="section-heading evidence-heading">
          <p className="eyebrow">EVIDENCE, NOT CLAIMS</p>
          <h2 id="evidence-title">让证据推动协议，而不是让口号修饰数据。</h2>
        </div>

        <div className="evidence-grid">
          <article className="case-card">
            <div className="case-topline">
              <span>REAL REPOSITORY TASK</span>
              <span>AC-001</span>
            </div>
            <h3>Agency-Craft README 重写</h3>
            <p>
              记录真实请求、技能裁决、关键路径、结果提交与已知限制。
              这个案例证明回溯式可追踪性，不冒充协议有效性的完整证据。
            </p>
            <dl>
              <div>
                <dt>Required</dt>
                <dd>2 skills</dd>
              </div>
              <div>
                <dt>Rejected</dt>
                <dd>3 skills</dd>
              </div>
              <div>
                <dt>Result</dt>
                <dd>3c4f208</dd>
              </div>
            </dl>
            <a
              href={`${githubRoot}/blob/main/cases/001-readme-rewrite.md`}
              target="_blank"
              rel="noreferrer"
            >
              检查完整证据链 <span aria-hidden="true">↗</span>
            </a>
          </article>

          <article className="limits-card">
            <p>当前证据边界</p>
            <div className="evidence-status">
              <span className="measured">MEASURED</span>
              <strong>结构、契约与安装生命周期</strong>
            </div>
            <div className="evidence-status">
              <span className="observed">OBSERVED</span>
              <strong>真实任务的选择性技能使用</strong>
            </div>
            <div className="evidence-status">
              <span className="unavailable">UNAVAILABLE</span>
              <strong>Token 降低、人工投入与质量提升</strong>
            </div>
            <p className="limits-note">
              没有可比基线的数据必须保持 unavailable，不能用事后估算填满。
            </p>
          </article>
        </div>
      </section>

      <section
        className="install section-shell"
        id="install"
        aria-labelledby="install-title"
      >
        <div className="install-copy">
          <p className="eyebrow">INSTALL · VERIFY · USE</p>
          <h2 id="install-title">不用背提示词，从一句自然语言开始。</h2>
          <p>
            克隆仓库、链接技能并运行验证。重新开启 Codex
            任务后，直接描述你的模糊目标或工作流困惑。
          </p>
          <a
            className="text-link"
            href={`${githubRoot}/blob/main/README.md#安装与验证`}
            target="_blank"
            rel="noreferrer"
          >
            查看安装说明 <span aria-hidden="true">↗</span>
          </a>
        </div>

        <div className="terminal" aria-label="Agency-Craft 安装命令">
          <div className="terminal-topline">
            <span aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
            <p>agency-craft — zsh</p>
          </div>
          <pre>
            <code>
              <span>$</span> git clone{" "}
              <b>https://github.com/AdgaiWalker/Agency-Craft.git</b>
              {"\n"}
              <span>$</span> cd <b>Agency-Craft</b>
              {"\n"}
              <span>$</span> make <b>link</b>
              {"\n"}
              <span>$</span> make <b>status</b>
              {"\n"}
              <span>$</span> make <b>test</b>
              {"\n\n"}
              <em>✓ 3 reference skills linked</em>
              {"\n"}
              <em>✓ Agency Contract validated</em>
            </code>
          </pre>
        </div>
      </section>

      <section className="closing section-shell" aria-labelledby="closing-title">
        <p className="eyebrow">THE VIBE 2.0 DIRECTION</p>
        <h2 id="closing-title">
          不是让 AI 替人创造世界，
          <br />
          而是让 AI 放大人真正想创造的世界。
        </h2>
        <div>
          <p>
            从模糊到具体，从被默认值牵引到主动选择，
            从消耗 AI 到真正驾驭 AI。
          </p>
          <a
            className="button button-light"
            href={githubRoot}
            target="_blank"
            rel="noreferrer"
          >
            在 GitHub 查看项目 <span aria-hidden="true">↗</span>
          </a>
        </div>
      </section>

      <footer className="site-footer">
        <a className="brand footer-brand" href="#top">
          <span className="brand-mark" aria-hidden="true">
            A
          </span>
          <span>Agency-Craft</span>
        </a>
        <p>AI 引导，人决策；AI 执行，人验收。</p>
        <p>MIT License · 2026</p>
      </footer>
    </main>
  );
}
