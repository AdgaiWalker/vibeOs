import { useEffect, useState } from "react";
import { ChapterNav } from "./components/ChapterNav";
import { CinematicScene } from "./components/CinematicScene";
import {
  chapters,
  contractFields,
  gates,
  loopSteps,
} from "./data/content";

const media = {
  hero: "/media/hero-material.png",
  heroMobile: "/media/hero-material-mobile.png",
  why: "/media/direction-error.png",
  loop: "/media/vibe-loop.png",
  gates: "/media/three-gates.png",
  gatesMobile: "/media/three-gates-mobile.png",
  contract: "/media/agency-contract.png",
  evidence: "/media/evidence-footer.png",
};

function CopyCommand({ command }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    } catch {
      setCopied(false);
    }
  };

  return (
    <>
      <button
        type="button"
        className={`command-link ${copied ? "is-copied" : ""}`}
        onClick={copy}
      >
        {command}
      </button>
      <span className="sr-only" role="status" aria-live="polite">
        {copied ? `${command} 已复制` : ""}
      </span>
    </>
  );
}

function HeroScene() {
  return (
    <CinematicScene
      id="hero"
      className="scene--hero"
      src={media.hero}
      mobileSrc={media.heroMobile}
      mode={0}
      focus={[0.5, 0.5]}
      mobileFocus={[0.44, 0.5]}
    >
      <a className="hero-wordmark" href="#hero" aria-label="Agency-Craft 首页">
        AGENCY—CRAFT
      </a>
      <div className="hero-copy">
        <h1>
          <span className="hero-line">
            <span>不是只有</span>
            <span>伟大的开创者，</span>
          </span>
          <span className="hero-line">
            <span>才能让人们</span>
            <span>看见新的可能。</span>
          </span>
        </h1>
      </div>
    </CinematicScene>
  );
}

function WhyScene() {
  return (
    <CinematicScene
      id="why"
      className="scene--why"
      src={media.why}
      mode={1}
      focus={[0.52, 0.5]}
      mobileFocus={[0.59, 0.52]}
    >
      <div className="why-copy scene-copy">
        <p className="section-label">为什么需要 Agency-Craft</p>
        <h2>AI 的执行能力越来越强，但执行速度不能补偿方向错误。</h2>
      </div>
      <div className="ambiguity-terms" aria-label="仍然模糊的要求">
        <span>更可爱</span>
        <span>更高级</span>
        <span>更自然</span>
      </div>
    </CinematicScene>
  );
}

function LoopScene() {
  return (
    <CinematicScene
      id="loop"
      className="scene--loop"
      src={media.loop}
      mode={2}
      focus={[0.5, 0.5]}
      mobileFocus={[0.49, 0.51]}
    >
      {({ progress }) => {
        const activeStep = Math.min(
          loopSteps.length - 1,
          Math.floor(progress * loopSteps.length),
        );

        return (
          <>
            <div className="loop-copy scene-copy">
              <h2>把模糊变成具体。</h2>
              <p>AI 引导意图，人做决策，AI 执行。</p>
            </div>
            <ol className="loop-steps">
              {loopSteps.map((step, index) => (
                <li
                  key={step}
                  className={index === activeStep ? "is-active" : ""}
                >
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  {step}
                </li>
              ))}
            </ol>
          </>
        );
      }}
    </CinematicScene>
  );
}

function GatesScene() {
  const [selectedGate, setSelectedGate] = useState(1);

  return (
    <CinematicScene
      id="gates"
      className={`scene--gates is-gate-${selectedGate}`}
      src={media.gates}
      mobileSrc={media.gatesMobile}
      mode={3}
      focus={[0.5, 0.5]}
    >
      <h2 className="gates-heading">三道独立闸门</h2>
      <div className="gate-labels">
        {gates.map((gate, index) => (
          <button
            key={gate.key}
            type="button"
            className={`gate-label ${
              selectedGate === index ? "is-active" : ""
            }`}
            onPointerEnter={() => setSelectedGate(index)}
            onFocus={() => setSelectedGate(index)}
            onClick={() => setSelectedGate(index)}
            aria-pressed={selectedGate === index}
          >
            <span className="gate-label__key">{gate.key}</span>
            <strong>{gate.skill}</strong>
            <span>{gate.description}</span>
          </button>
        ))}
      </div>
    </CinematicScene>
  );
}

function ContractScene() {
  const [selectedField, setSelectedField] = useState("decisions");

  return (
    <CinematicScene
      id="contract"
      className="scene--contract"
      src={media.contract}
      mode={4}
      focus={[0.54, 0.5]}
      mobileFocus={[0.61, 0.52]}
    >
      <div className="contract-copy scene-copy">
        <p className="section-label">AGENCY CONTRACT</p>
        <h2>共同交接语言</h2>
        <p>它是交接物，不是让用户填写的表格。</p>
      </div>
      <div className="contract-fields" aria-label="Agency Contract 字段">
        {contractFields.map((field) => (
          <button
            key={field}
            type="button"
            className={selectedField === field ? "is-active" : ""}
            onPointerEnter={() => setSelectedField(field)}
            onFocus={() => setSelectedField(field)}
            onClick={() => setSelectedField(field)}
            aria-pressed={selectedField === field}
          >
            {field}
          </button>
        ))}
      </div>
    </CinematicScene>
  );
}

function EvidenceScene() {
  return (
    <CinematicScene
      id="evidence"
      className="scene--evidence"
      src={media.evidence}
      mode={5}
      focus={[0.51, 0.5]}
      mobileFocus={[0.36, 0.5]}
    >
      <div className="evidence-copy scene-copy">
        <h2>证据，而不是口号。</h2>
        <p>
          当前证据只证明一个真实任务可以被回溯成可追溯裁决、选择性闸门与机器可读评估记录。
        </p>
        <p>尚未证明降低 Token、减少人工投入或提高作品质量。</p>
        <div className="command-links" aria-label="本地命令">
          <CopyCommand command="make link" />
          <CopyCommand command="make test" />
        </div>
      </div>
      <div className="closing-principle">
        <p>AI 扩展人的觉察力并执行决定；人保留价值判断与最终验收权。</p>
        <a href="#hero">AGENCY—CRAFT</a>
      </div>
    </CinematicScene>
  );
}

export default function App() {
  const [activeChapter, setActiveChapter] = useState("hero");

  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll("[data-chapter]"));
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible[0]) setActiveChapter(visible[0].target.id);
      },
      {
        rootMargin: "-38% 0px -38% 0px",
        threshold: [0, 0.15, 0.35, 0.6],
      },
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <a className="skip-link" href="#why">
        跳到主要内容
      </a>
      <ChapterNav chapters={chapters} activeChapter={activeChapter} />
      <main>
        <HeroScene />
        <WhyScene />
        <LoopScene />
        <GatesScene />
        <ContractScene />
        <EvidenceScene />
      </main>
    </>
  );
}
