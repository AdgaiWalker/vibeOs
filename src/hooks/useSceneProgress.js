import { useEffect, useState } from "react";

const clamp = (value, min = 0, max = 1) =>
  Math.min(max, Math.max(min, value));

export function useSceneProgress(sceneRef) {
  const [sceneState, setSceneState] = useState({
    progress: 0,
    active: false,
  });

  useEffect(() => {
    let frame = 0;

    const measure = () => {
      frame = 0;
      const node = sceneRef.current;
      if (!node) return;

      const rect = node.getBoundingClientRect();
      const scrollableDistance = Math.max(1, rect.height - window.innerHeight);
      const progress = clamp(-rect.top / scrollableDistance);
      const active = rect.bottom > 0 && rect.top < window.innerHeight;

      setSceneState((previous) => {
        if (
          Math.abs(previous.progress - progress) < 0.002 &&
          previous.active === active
        ) {
          return previous;
        }

        return { progress, active };
      });
    };

    const requestMeasure = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", requestMeasure, { passive: true });
    window.addEventListener("resize", requestMeasure);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", requestMeasure);
      window.removeEventListener("resize", requestMeasure);
    };
  }, [sceneRef]);

  return sceneState;
}
