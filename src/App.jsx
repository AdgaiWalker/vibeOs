import { useEffect, useRef, useState } from "react";
import { FilmCanvas } from "./components/FilmCanvas";
import { InstallWithAgent } from "./components/InstallWithAgent";
import {
  contractFieldCopy,
  contractFields,
  gates,
  loopSteps,
} from "./data/content";
import { orbitTexture, orbitTextureMobile, scenes } from "./data/scenes";
import { useCinematicTimeline } from "./hooks/useCinematicSequence";

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
        <span>{command}</span>
        <small>{copied ? "已复制" : "复制命令"}</small>
      </button>
      <span className="sr-only" role="status" aria-live="polite">
        {copied ? `${command} 已复制` : ""}
      </span>
    </>
  );
}

function HeroBeat() {
  return (
    <div className="beat-frame beat-frame--hero">
      <div className="hero-copy" data-cinematic-cue>
        <p className="scene-kicker">HUMAN AGENCY · AI EXECUTION</p>
        <h1>
          <span>不是只有伟大的开创者，</span>
          <span>才能让人们看见新的可能。</span>
        </h1>
      </div>
      <InstallWithAgent />
    </div>
  );
}

function WhyBeat() {
  return (
    <div className="beat-frame beat-frame--why">
      <div className="why-copy scene-copy" data-cinematic-cue>
        <p className="scene-kicker">DIRECTION BEFORE SPEED</p>
        <h2>执行速度，不能补偿方向错误。</h2>
        <p>当要求仍然模糊，更快只会更快地偏离。</p>
      </div>
      <div className="ambiguity-terms" data-cinematic-cue aria-hidden="true">
        <span>更可爱</span>
        <span>更高级</span>
        <span>更自然</span>
      </div>
    </div>
  );
}

function LoopBeat({ activeStep }) {
  return (
    <div className="beat-frame beat-frame--loop">
      <div className="loop-copy scene-copy" data-cinematic-cue>
        <p className="scene-kicker">
          VIBE LOOP · {String(activeStep + 1).padStart(2, "0")}/08
        </p>
        <h2>把模糊变成具体。</h2>
        <p>AI 引导意图，人做决策，AI 执行。</p>
      </div>

      <div className="loop-playhead" data-cinematic-cue aria-hidden="true">
        <span>{String(activeStep + 1).padStart(2, "0")}</span>
        <strong>{loopSteps[activeStep]}</strong>
      </div>

      <ol
        className="loop-steps"
        data-cinematic-cue
        aria-label="Vibe Loop 八个步骤"
      >
        {loopSteps.map((step, index) => (
          <li key={step} className={index === activeStep ? "is-active" : ""}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <strong>{step}</strong>
          </li>
        ))}
      </ol>
    </div>
  );
}

function GatesBeat({ initialGateIndex }) {
  const [selectedGate, setSelectedGate] = useState(initialGateIndex);
  const [copyState, setCopyState] = useState("idle");
  const gateButtonRefs = useRef([]);
  const copyTimerRef = useRef(null);
  const gate = gates[selectedGate];

  useEffect(
    () => () => {
      window.clearTimeout(copyTimerRef.current);
    },
    [],
  );

  const selectGate = (index, { focus = false } = {}) => {
    window.clearTimeout(copyTimerRef.current);
    setCopyState("idle");
    setSelectedGate(index);
    if (focus) gateButtonRefs.current[index]?.focus();
  };

  const handleGateKeyDown = (event, index) => {
    let nextIndex = index;

    if (event.key === "ArrowRight") {
      nextIndex = (index + 1) % gates.length;
    } else if (event.key === "ArrowLeft") {
      nextIndex = (index - 1 + gates.length) % gates.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = gates.length - 1;
    } else {
      return;
    }

    event.preventDefault();
    selectGate(nextIndex, { focus: true });
  };

  const copyGatePrompt = async () => {
    window.clearTimeout(copyTimerRef.current);

    try {
      if (!navigator.clipboard?.writeText) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(gate.copyText ?? gate.prompt);
      setCopyState("copied");
      copyTimerRef.current = window.setTimeout(
        () => setCopyState("idle"),
        1800,
      );
    } catch {
      setCopyState("failed");
    }
  };

  return (
    <div className="beat-frame beat-frame--gates">
      <div className="gates-copy scene-copy" data-cinematic-cue>
        <p className="scene-kicker">SELECTIVE GATES</p>
        <h2>三道独立闸门</h2>
      </div>

      <div
        id="gate-panel"
        className="gate-focus"
        data-cinematic-cue
        role="tabpanel"
        aria-labelledby={`gate-tab-${selectedGate}`}
      >
        <div key={gate.key} className="gate-focus__content">
          <span>{gate.key}</span>
          <strong>{gate.skill}</strong>
          <p>{gate.description}</p>
          <div className="gate-prompt">
            <span>{gate.promptLabel}</span>
            {copyState === "failed" ? (
              <textarea
                readOnly
                value={gate.copyText ?? gate.prompt}
                onFocus={(event) => event.currentTarget.select()}
                aria-label={`${gate.skill} 可手动复制的内容`}
              />
            ) : (
              <p>{gate.prompt}</p>
            )}
            <button
              type="button"
              className="gate-prompt__copy"
              onClick={copyGatePrompt}
              data-copy-state={copyState}
            >
              <span>
                {copyState === "copied"
                  ? "已复制"
                  : copyState === "failed"
                    ? "请手动复制"
                    : gate.copyLabel}
              </span>
              <span aria-hidden="true">↗</span>
            </button>
            <span className="sr-only" role="status" aria-live="polite">
              {copyState === "copied"
                ? `${gate.skill} ${gate.copyText ? "启用指令" : "提示词"}已复制`
                : copyState === "failed"
                  ? "自动复制失败，已显示可手动复制的内容"
                  : ""}
            </span>
          </div>
        </div>
      </div>

      <div
        className="gate-labels"
        data-cinematic-cue
        role="tablist"
        aria-orientation="horizontal"
        aria-label="三道能力闸门"
      >
        {gates.map((item, index) => (
          <button
            key={item.key}
            ref={(element) => {
              gateButtonRefs.current[index] = element;
            }}
            id={`gate-tab-${index}`}
            type="button"
            role="tab"
            tabIndex={index === selectedGate ? 0 : -1}
            aria-selected={index === selectedGate}
            aria-controls="gate-panel"
            className={`gate-label ${index === selectedGate ? "is-active" : ""}`}
            onClick={() => selectGate(index)}
            onKeyDown={(event) => handleGateKeyDown(event, index)}
          >
            <span>{item.key}</span>
            <strong>{item.skill}</strong>
          </button>
        ))}
      </div>
    </div>
  );
}

function ContractBeat({ selectedFieldIndex }) {
  const selectedField = contractFields[selectedFieldIndex];

  return (
    <div className="beat-frame beat-frame--contract">
      <div className="contract-copy scene-copy" data-cinematic-cue>
        <p className="scene-kicker">AGENCY CONTRACT · V0.1</p>
        <h2>共同交接语言</h2>
        <p>它是人与 Agent 之间可验证的交接物。</p>
      </div>

      <div className="contract-focus" data-cinematic-cue aria-live="off">
        <span>{selectedField}</span>
        <strong>{contractFieldCopy[selectedField]}</strong>
      </div>

      <div
        className="contract-fields"
        data-cinematic-cue
        aria-label="Agency Contract 字段"
      >
        {contractFields.map((field, index) => (
          <span
            key={field}
            className={index === selectedFieldIndex ? "is-active" : ""}
          >
            {field}
          </span>
        ))}
      </div>
    </div>
  );
}

function EvidenceBeat() {
  return (
    <div className="beat-frame beat-frame--evidence">
      <div className="evidence-copy scene-copy" data-cinematic-cue>
        <p className="scene-kicker">PROOF BEFORE CLAIMS</p>
        <h2>证据，而不是口号。</h2>
        <p>
          当前证据证明：一个真实任务可以被回溯成可追溯裁决、选择性闸门与机器可读评估记录。
        </p>
        <p>尚未证明降低 Token、减少人工投入或提高作品质量。</p>
        <div
          className="command-links"
          data-cinematic-ui
          data-cinematic-hold
          aria-label="本地命令"
        >
          <CopyCommand command="make link" />
          <CopyCommand command="make test" />
        </div>
      </div>

      <div className="closing-principle" data-cinematic-cue>
        <p>AI 扩展人的觉察力并执行决定；人保留价值判断与最终验收权。</p>
      </div>
    </div>
  );
}

function BeatContent({ index, snapshot }) {
  switch (index) {
    case 0:
      return <HeroBeat />;
    case 1:
      return <WhyBeat />;
    case 2:
      return <LoopBeat activeStep={snapshot.loopStep} />;
    case 3:
      return <GatesBeat initialGateIndex={snapshot.selectedGate} />;
    case 4:
      return <ContractBeat selectedFieldIndex={snapshot.selectedFieldIndex} />;
    case 5:
      return <EvidenceBeat />;
    default:
      return null;
  }
}

export default function App() {
  const stageRef = useRef(null);
  const timelineTrackRef = useRef(null);
  const fallbackTrackRef = useRef(null);
  const filmPresenterRef = useRef(null);
  const beatRefs = useRef([]);
  const orbitFrontRef = useRef(null);
  const progressBarRef = useRef(null);
  const resistanceTopRef = useRef(null);
  const resistanceBottomRef = useRef(null);
  const visualPositionRef = useRef(0);

  const { snapshot, seekTo, release } = useCinematicTimeline({
    scenes,
    stageRef,
    timelineTrackRef,
    fallbackTrackRef,
    filmPresenterRef,
    beatRefs,
    orbitFrontRef,
    progressBarRef,
    resistanceTopRef,
    resistanceBottomRef,
    visualPositionRef,
  });
  const currentScene = scenes[snapshot.index];

  return (
    <>
      <a
        className="skip-link"
        href="#timeline-content"
        onClick={(event) => {
          event.preventDefault();
          stageRef.current?.focus();
        }}
      >
        跳到当前内容
      </a>

      <main
        ref={stageRef}
        className="cinematic-stage"
        tabIndex={-1}
        data-navigation="pages"
        data-scene={currentScene.id}
        data-page-state={snapshot.pageState}
        data-page-direction={
          snapshot.pageDirection > 0
            ? "next"
            : snapshot.pageDirection < 0
              ? "previous"
              : "idle"
        }
        aria-label="vibeoOs 单屏介绍；上下滑动一次切换一幕"
      >
        <FilmCanvas
          visuals={scenes}
          fallbackTrackRef={fallbackTrackRef}
          presenterRef={filmPresenterRef}
          orbitSrc={orbitTexture}
          orbitMobileSrc={orbitTextureMobile}
          visualPositionRef={visualPositionRef}
          paused={snapshot.motionHeld}
          reducedMotion={snapshot.reducedMotion}
          manipulating={snapshot.isManipulating}
          onReady={() => release("media")}
        />

        <div className="stage-grade" aria-hidden="true" />
        <span
          ref={resistanceTopRef}
          className="page-resistance page-resistance--top"
          aria-hidden="true"
        />
        <span
          ref={resistanceBottomRef}
          className="page-resistance page-resistance--bottom"
          aria-hidden="true"
        />

        <header className="stage-header">
          <button
            className="wordmark"
            type="button"
            data-cinematic-ui
            onClick={() => seekTo(0)}
            aria-label="返回开场"
          >
            vibeoOs
          </button>
          <div className="stage-meta" aria-hidden="true">
            <span>{currentScene.label}</span>
            <span>ONE SCENE AT A TIME</span>
          </div>
        </header>

        <div
          ref={timelineTrackRef}
          id="timeline-content"
          className="timeline-content"
        >
          {scenes.map((scene, index) => (
            <section
              key={scene.id}
              ref={(element) => {
                beatRefs.current[index] = element;
              }}
              className={`cinematic-beat cinematic-beat--${scene.id}`}
              style={{ transform: `translate3d(0, ${index * 100}%, 0)` }}
              data-beat={scene.id}
              aria-label={scene.label}
            >
              <BeatContent index={index} snapshot={snapshot} />
            </section>
          ))}
        </div>

        <picture
          ref={orbitFrontRef}
          className="stage-orbit stage-orbit--front"
          aria-hidden="true"
        >
          <source media="(max-aspect-ratio: 4/5)" srcSet={orbitTextureMobile} />
          <img src={orbitTexture} alt="" />
        </picture>

        <footer className="timeline-footer">
          <div className="page-counter" aria-hidden="true">
            <strong>{String(snapshot.index + 1).padStart(2, "0")}</strong>
            <span>/ {String(scenes.length).padStart(2, "0")}</span>
          </div>

          <div className="timeline-rail" aria-hidden="true">
            <span ref={progressBarRef} className="timeline-rail__progress" />
            {scenes.slice(1, -1).map((scene, index) => (
              <span
                key={scene.id}
                className="timeline-rail__cut"
                style={{ left: `${((index + 1) / (scenes.length - 1)) * 100}%` }}
              />
            ))}
          </div>

          <div className="director-hint" aria-hidden="true">
            <span>
              {snapshot.index === scenes.length - 1
                ? "向上滑动返回"
                : "向下滑动 · 一次一幕"}
            </span>
            <strong>
              {snapshot.isTracking
                ? "TRACKING"
                : snapshot.isSettling
                  ? "SETTLING"
                  : "SCROLL"}
            </strong>
          </div>
        </footer>

        <div className="sr-only" aria-live="polite" aria-atomic="true">
          当前段落：{currentScene.label}
        </div>
      </main>
    </>
  );
}
