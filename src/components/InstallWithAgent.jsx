import { useEffect, useRef, useState } from "react";
import { agencyInstallPrompt, skillRepository } from "../data/install";

const RESET_DELAY = 1800;

export function InstallWithAgent() {
  const [copyState, setCopyState] = useState("idle");
  const resetTimerRef = useRef(null);

  useEffect(
    () => () => {
      window.clearTimeout(resetTimerRef.current);
    },
    [],
  );

  const copyPrompt = async () => {
    window.clearTimeout(resetTimerRef.current);

    try {
      if (!navigator.clipboard?.writeText) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(agencyInstallPrompt);
      setCopyState("copied");
      resetTimerRef.current = window.setTimeout(
        () => setCopyState("idle"),
        RESET_DELAY,
      );
    } catch {
      setCopyState("failed");
    }
  };

  const copyLabel = copyState === "copied" ? "提示词已复制" : "复制安装提示词";

  return (
    <section
      className="hero-install"
      data-cinematic-ui
      data-cinematic-hold
      data-cinematic-cue
      aria-label="使用 Agent 安装 vibeOs 三件套"
    >
      <div className="hero-install__intro">
        <p>INSTALL WITH AGENT</p>
        <span>粘贴给你的 Agent · 写入前确认技能与范围</span>
      </div>

      <div className="hero-install__actions">
        <button
          type="button"
          className="hero-install__copy"
          onClick={copyPrompt}
          data-copy-state={copyState}
        >
          <span>{copyLabel}</span>
          <span aria-hidden="true">↗</span>
        </button>
        <a
          className="hero-install__source"
          href={skillRepository.sourceUrl}
          target="_blank"
          rel="noreferrer"
          aria-label={`在 GitHub 查看 vibeOs 源码（${skillRepository.ref}）`}
          title={`GitHub · ${skillRepository.ref}`}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="currentColor"
              d="M12 1.25a10.75 10.75 0 0 0-3.4 20.95c.54.1.73-.23.73-.52v-2.05c-3 .65-3.63-1.27-3.63-1.27-.49-1.25-1.2-1.58-1.2-1.58-.98-.67.08-.66.08-.66 1.08.08 1.65 1.11 1.65 1.11.97 1.65 2.53 1.17 3.15.9.1-.7.38-1.17.69-1.44-2.4-.27-4.92-1.2-4.92-5.31 0-1.17.42-2.13 1.1-2.88-.11-.27-.48-1.37.11-2.85 0 0 .9-.29 2.96 1.1A10.28 10.28 0 0 1 12 7.14c.91 0 1.82.12 2.68.36 2.05-1.39 2.95-1.1 2.95-1.1.6 1.48.22 2.58.11 2.85.69.75 1.1 1.71 1.1 2.88 0 4.12-2.52 5.03-4.92 5.3.39.34.73 1 .73 2.01v2.24c0 .29.2.63.74.52A10.75 10.75 0 0 0 12 1.25Z"
            />
          </svg>
        </a>
      </div>

      <p className="hero-install__skills" aria-label="包含的技能">
        {skillRepository.skills.map(({ name }) => name).join(" · ")}
      </p>

      {copyState === "failed" ? (
        <label className="hero-install__fallback">
          <span>浏览器未允许自动复制，请在下方手动全选复制：</span>
          <textarea
            readOnly
            value={agencyInstallPrompt}
            onFocus={(event) => event.currentTarget.select()}
            aria-label="安装提示词"
          />
        </label>
      ) : null}

      <span className="sr-only" role="status" aria-live="polite">
        {copyState === "copied"
          ? "安装提示词已复制"
          : copyState === "failed"
            ? "自动复制失败，已显示可手动复制的提示词"
            : ""}
      </span>
    </section>
  );
}
