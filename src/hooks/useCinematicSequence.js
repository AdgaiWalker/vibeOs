import { useCallback, useEffect, useRef, useState } from "react";
import {
  WHEEL_SESSION_GAP_MS,
  advancePageSpring,
  beginPageGesture,
  cancelPageGesture,
  clamp,
  createPagerState,
  endPageGesture,
  frameForPosition,
  pageProgress,
  swipePullDelta,
  timelineSnapshot,
  updatePageGesture,
  wheelPullDelta,
} from "../state/cinematicSequence";

const GESTURE_HYSTERESIS = 8;
const VERTICAL_DOMINANCE_RATIO = 1.2;
const UI_SELECTOR = "[data-cinematic-ui], button, a, textarea, input, select";
const HOLD_SELECTOR = "[data-cinematic-hold]";

function readInitialIndex(scenes) {
  if (typeof window === "undefined") return 0;
  const id = window.location.hash.slice(1);
  const index = scenes.findIndex((scene) => scene.id === id);
  return index >= 0 ? index : 0;
}

function isInterfaceTarget(target) {
  return target instanceof Element && Boolean(target.closest(UI_SELECTOR));
}

function isHoldTarget(target) {
  return target instanceof Element && Boolean(target.closest(HOLD_SELECTOR));
}

function isScrollableTarget(target) {
  return target instanceof Element && Boolean(target.closest("textarea, select"));
}

function wheelPixels(event) {
  if (event.deltaMode === WheelEvent.DOM_DELTA_LINE) return event.deltaY * 16;
  if (event.deltaMode === WheelEvent.DOM_DELTA_PAGE) {
    return event.deltaY * window.innerHeight;
  }
  return event.deltaY;
}

function pageDirection(pager) {
  if (pager.phase === "tracking") {
    return pager.inputDirection || Math.sign(pager.pull);
  }
  if (pager.phase === "settling") return Math.sign(pager.target - pager.position);
  return 0;
}

function snapshotKey(snapshot) {
  return [
    snapshot.index,
    snapshot.pageState,
    snapshot.pageDirection,
    snapshot.motionHeld,
    snapshot.reducedMotion,
  ].join(":");
}

export function useCinematicTimeline({
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
}) {
  const initialIndexRef = useRef(readInitialIndex(scenes));
  const runtimeRef = useRef({
    pager: createPagerState(initialIndexRef.current, scenes.length),
    progress: pageProgress(initialIndexRef.current, scenes.length),
    semanticIndex: initialIndexRef.current,
    holds: new Set(["media"]),
    reducedMotion: false,
    pointer: null,
    gestureKind: null,
    wheelTimer: 0,
    wheelSession: 0,
    lastWheelTime: 0,
    lastTimestamp: 0,
    lastPublishedKey: "",
    activeIndex: -1,
    lastAppliedPosition: Number.NaN,
    lastAppliedReducedMotion: null,
    requestPresentation: null,
  });
  visualPositionRef.current = runtimeRef.current.pager.position;

  const initialFrame = timelineSnapshot(
    runtimeRef.current.progress,
    scenes.length,
  );
  const [snapshot, setSnapshot] = useState({
    ...initialFrame,
    index: initialIndexRef.current,
    nextIndex: Math.min(initialIndexRef.current + 1, scenes.length - 1),
    pageState: "idle",
    pageDirection: 0,
    isDirecting: false,
    isTracking: false,
    isSettling: false,
    isManipulating: false,
    motionHeld: true,
    reducedMotion: false,
  });

  const publish = useCallback((runtime) => {
    const base = timelineSnapshot(runtime.progress, scenes.length);
    const direction = pageDirection(runtime.pager);
    const next = {
      ...base,
      index: runtime.semanticIndex,
      nextIndex: Math.min(runtime.semanticIndex + 1, scenes.length - 1),
      pageState: runtime.pager.phase,
      pageDirection: direction,
      isDirecting: runtime.pager.phase !== "idle",
      isTracking: runtime.pager.phase === "tracking",
      isSettling: runtime.pager.phase === "settling",
      isManipulating: false,
      motionHeld: runtime.holds.size > 0,
      reducedMotion: runtime.reducedMotion,
    };
    const key = snapshotKey(next);
    if (key === runtime.lastPublishedKey) return;
    runtime.lastPublishedKey = key;
    setSnapshot(next);
  }, [scenes.length]);

  const hold = useCallback((reason) => {
    const runtime = runtimeRef.current;
    runtime.holds.add(reason);
    publish(runtime);
  }, [publish]);

  const release = useCallback((reason) => {
    const runtime = runtimeRef.current;
    runtime.holds.delete(reason);
    publish(runtime);
  }, [publish]);

  const seekTo = useCallback((index) => {
    const runtime = runtimeRef.current;
    const destination = clamp(Math.round(index), 0, scenes.length - 1);
    runtime.pager = createPagerState(destination, scenes.length);
    runtime.progress = pageProgress(destination, scenes.length);
    runtime.semanticIndex = destination;
    runtime.gestureKind = null;
    window.clearTimeout(runtime.wheelTimer);
    runtime.wheelTimer = 0;
    visualPositionRef.current = destination;
    publish(runtime);
    runtime.requestPresentation?.();
  }, [publish, scenes.length, visualPositionRef]);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotionPreference = () => {
      const runtime = runtimeRef.current;
      runtime.reducedMotion = motionQuery.matches;
      if (motionQuery.matches) {
        runtime.holds.add("reduced-motion");
        runtime.pager = createPagerState(runtime.pager.target, scenes.length);
        runtime.progress = pageProgress(runtime.pager.target, scenes.length);
        runtime.semanticIndex = runtime.pager.target;
      } else {
        runtime.holds.delete("reduced-motion");
      }
      visualPositionRef.current = runtime.reducedMotion
        ? runtime.pager.target
        : runtime.pager.position;
      publish(runtime);
      runtime.requestPresentation?.();
    };

    updateMotionPreference();
    motionQuery.addEventListener("change", updateMotionPreference);
    return () => motionQuery.removeEventListener("change", updateMotionPreference);
  }, [publish, scenes.length, visualPositionRef]);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return undefined;
    const runtime = runtimeRef.current;
    let animationFrame = 0;
    beatRefs.current.forEach((element) => {
      if (!element) return;
      element.querySelectorAll("[data-cinematic-cue]").forEach((cue) => {
        cue.style.opacity = "1";
        cue.style.transform = "none";
        cue.style.willChange = "auto";
        cue.style.removeProperty("filter");
      });
    });

    const updateResistance = () => {
      const direction = pageDirection(runtime.pager);
      const strength = runtime.pager.phase === "tracking"
        ? clamp(Math.abs(runtime.pager.pull) / 0.42, 0, 1)
        : runtime.pager.phase === "settling"
          ? clamp(Math.abs(runtime.pager.target - runtime.pager.position) / 0.72, 0, 1)
          : 0;
      const scale = (0.18 + strength * 0.82).toFixed(4);
      const opacity = (strength * 0.72).toFixed(4);

      if (resistanceTopRef.current) {
        resistanceTopRef.current.style.opacity = direction < 0 ? opacity : "0";
        resistanceTopRef.current.style.transform = `scaleX(${scale})`;
      }
      if (resistanceBottomRef.current) {
        resistanceBottomRef.current.style.opacity = direction > 0 ? opacity : "0";
        resistanceBottomRef.current.style.transform = `scaleX(${scale})`;
      }
    };

    const applyPresentation = () => {
      runtime.progress = pageProgress(runtime.pager.position, scenes.length);
      const visualPosition = runtime.reducedMotion
        ? runtime.pager.target
        : runtime.pager.position;
      visualPositionRef.current = visualPosition;
      const visualFrame = frameForPosition(visualPosition, scenes.length);

      if (
        runtime.pager.phase === "idle" &&
        runtime.semanticIndex !== runtime.pager.target
      ) {
        runtime.semanticIndex = runtime.pager.target;
      }

      const presentationChanged =
        visualPosition !== runtime.lastAppliedPosition ||
        runtime.reducedMotion !== runtime.lastAppliedReducedMotion;

      if (presentationChanged) {
        const trackTransform = `translate3d(0, ${(-visualPosition * 100).toFixed(4)}%, 0)`;
        const trackWillChange = runtime.pager.phase === "idle"
          ? "auto"
          : "transform";
        if (timelineTrackRef.current) {
          timelineTrackRef.current.style.transform = trackTransform;
          timelineTrackRef.current.style.willChange = trackWillChange;
        }
        if (fallbackTrackRef.current) {
          fallbackTrackRef.current.style.transform = trackTransform;
          fallbackTrackRef.current.style.willChange = trackWillChange;
        }
        filmPresenterRef.current?.(visualPosition);

        const transitionPulse = visualFrame.index === visualFrame.nextIndex
          ? 0
          : Math.sin(clamp(visualFrame.local, 0, 1) * Math.PI) ** 2;

        if (orbitFrontRef.current) {
          orbitFrontRef.current.style.transform =
            `scale(${(1.01 + transitionPulse * 0.003).toFixed(4)})`;
          orbitFrontRef.current.style.opacity = (0.08 + transitionPulse * 0.58).toFixed(3);
        }

        if (progressBarRef.current) {
          const pageAmount = scenes.length > 1
            ? clamp(runtime.pager.position / (scenes.length - 1), 0, 1)
            : 0;
          progressBarRef.current.style.transform = `scaleX(${pageAmount.toFixed(5)})`;
        }

        runtime.lastAppliedPosition = visualPosition;
        runtime.lastAppliedReducedMotion = runtime.reducedMotion;
      }

      updateResistance();

      const direction = pageDirection(runtime.pager);
      const directionName = direction > 0
        ? "next"
        : direction < 0
          ? "previous"
          : "idle";
      if (stage.dataset.pageState !== runtime.pager.phase) {
        stage.dataset.pageState = runtime.pager.phase;
      }
      if (stage.dataset.pageDirection !== directionName) {
        stage.dataset.pageDirection = directionName;
      }
      if (runtime.activeIndex !== runtime.semanticIndex) {
        const previousBeat = beatRefs.current[runtime.activeIndex];
        if (previousBeat?.contains(document.activeElement)) {
          stage.focus({ preventScroll: true });
        }
        runtime.activeIndex = runtime.semanticIndex;
        beatRefs.current.forEach((element, index) => {
          if (!element) return;
          const interactive = index === runtime.semanticIndex;
          element.style.pointerEvents = interactive ? "auto" : "none";
          element.inert = !interactive;
          element.setAttribute("aria-hidden", interactive ? "false" : "true");
          if (interactive) element.setAttribute("aria-current", "page");
          else element.removeAttribute("aria-current");
        });

        const id = scenes[runtime.semanticIndex]?.id;
        stage.dataset.scene = id;
        if (id && window.location.hash !== `#${id}`) {
          window.history.replaceState(null, "", `#${id}`);
        }
      }

      publish(runtime);
    };

    const stopAnimation = () => {
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
      animationFrame = 0;
      runtime.lastTimestamp = 0;
    };

    const render = (timestamp) => {
      animationFrame = 0;
      const deltaSeconds = runtime.lastTimestamp
        ? (timestamp - runtime.lastTimestamp) / 1000
        : 0;
      runtime.lastTimestamp = timestamp;

      if (runtime.pager.phase === "settling") {
        runtime.pager = advancePageSpring(runtime.pager, deltaSeconds);
      }

      applyPresentation();
      if (runtime.pager.phase === "settling") {
        animationFrame = window.requestAnimationFrame(render);
      } else {
        runtime.lastTimestamp = 0;
      }
    };

    const startAnimation = () => {
      if (animationFrame || runtime.pager.phase !== "settling") return;
      runtime.lastTimestamp = window.performance.now();
      animationFrame = window.requestAnimationFrame(render);
    };

    const requestPresentation = () => {
      if (runtime.pager.phase !== "settling") stopAnimation();
      applyPresentation();
      if (runtime.pager.phase === "settling") startAnimation();
    };

    runtime.requestPresentation = requestPresentation;

    const clearWheelSession = () => {
      window.clearTimeout(runtime.wheelTimer);
      runtime.wheelTimer = 0;
      runtime.wheelSession += 1;
    };

    const finishWheelSession = (session) => {
      if (
        session !== runtime.wheelSession ||
        runtime.gestureKind !== "wheel" ||
        runtime.pager.phase !== "tracking"
      ) return;
      runtime.pager = endPageGesture(
        runtime.pager,
        scenes.length,
        runtime.reducedMotion,
      );
      runtime.gestureKind = null;
      runtime.wheelTimer = 0;
      requestPresentation();
    };

    const scrubWheel = (event) => {
      if (
        event.ctrlKey ||
        event.metaKey ||
        runtime.gestureKind === "pointer" ||
        isScrollableTarget(event.target)
      ) return;
      const pixels = wheelPixels(event);
      if (pixels === 0) return;
      event.preventDefault();

      const firstWheelEvent = runtime.gestureKind !== "wheel";
      if (firstWheelEvent) {
        clearWheelSession();
        runtime.pager = beginPageGesture(runtime.pager, scenes.length);
        runtime.gestureKind = "wheel";
      }

      const delta = wheelPullDelta(pixels);
      const elapsed = firstWheelEvent
        ? 0
        : Math.max(0.016, (event.timeStamp - runtime.lastWheelTime) / 1000);
      runtime.lastWheelTime = event.timeStamp;
      runtime.pager = updatePageGesture(
        runtime.pager,
        delta,
        firstWheelEvent ? 0 : delta / elapsed,
        scenes.length,
      );
      const session = runtime.wheelSession;
      window.clearTimeout(runtime.wheelTimer);
      runtime.wheelTimer = window.setTimeout(
        () => finishWheelSession(session),
        WHEEL_SESSION_GAP_MS,
      );
      requestPresentation();
    };

    const beginPointer = (event) => {
      if (
        !event.isPrimary ||
        runtime.pointer ||
        (event.pointerType === "mouse" && event.button !== 0) ||
        isInterfaceTarget(event.target)
      ) return;
      runtime.pointer = {
        id: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        lastY: event.clientY,
        lastTime: event.timeStamp,
        tracking: false,
      };
      stage.dataset.pointerDown = "true";
    };

    const movePointer = (event) => {
      const pointer = runtime.pointer;
      if (!pointer || pointer.id !== event.pointerId) return;

      const totalX = event.clientX - pointer.startX;
      const totalY = event.clientY - pointer.startY;

      if (!pointer.tracking) {
        if (Math.hypot(totalX, totalY) < GESTURE_HYSTERESIS) return;
        if (Math.abs(totalY) <= Math.abs(totalX) * VERTICAL_DOMINANCE_RATIO) {
          runtime.pointer = null;
          delete stage.dataset.pointerDown;
          return;
        }
        pointer.tracking = true;
        clearWheelSession();
        runtime.pager = beginPageGesture(runtime.pager, scenes.length);
        runtime.gestureKind = "pointer";
        stage.setPointerCapture?.(event.pointerId);
      }

      event.preventDefault();
      const deltaY = event.clientY - pointer.lastY;
      const elapsed = Math.max(0.016, (event.timeStamp - pointer.lastTime) / 1000);
      const delta = swipePullDelta(deltaY, stage.clientHeight);
      pointer.lastY = event.clientY;
      pointer.lastTime = event.timeStamp;
      runtime.pager = updatePageGesture(
        runtime.pager,
        delta,
        delta / elapsed,
        scenes.length,
      );
      requestPresentation();
    };

    const finishPointer = (event) => {
      const pointer = runtime.pointer;
      if (!pointer || pointer.id !== event.pointerId) return;

      const wasTracking = pointer.tracking;
      if (pointer.tracking) {
        if (event.timeStamp - pointer.lastTime > 80) {
          runtime.pager = { ...runtime.pager, velocity: 0 };
        }
        runtime.pager = endPageGesture(
          runtime.pager,
          scenes.length,
          runtime.reducedMotion,
        );
      }
      runtime.pointer = null;
      delete stage.dataset.pointerDown;
      if (wasTracking) {
        runtime.gestureKind = null;
        stage.releasePointerCapture?.(event.pointerId);
        requestPresentation();
      }
    };

    const cancelPointer = (event) => {
      const pointer = runtime.pointer;
      if (!pointer || pointer.id !== event.pointerId) return;
      const wasTracking = pointer.tracking;
      if (wasTracking) {
        runtime.pager = cancelPageGesture(
          runtime.pager,
          scenes.length,
          runtime.reducedMotion,
        );
      }
      runtime.pointer = null;
      delete stage.dataset.pointerDown;
      if (wasTracking) {
        runtime.gestureKind = null;
        requestPresentation();
      }
    };

    const handleKeyboard = (event) => {
      if (
        event.repeat ||
        event.altKey ||
        event.ctrlKey ||
        event.metaKey ||
        isInterfaceTarget(event.target)
      ) return;
      let destination = null;

      if (
        event.key === "ArrowDown" ||
        event.key === "ArrowRight" ||
        event.key === "PageDown" ||
        (event.key === " " && !event.shiftKey)
      ) {
        destination = runtime.semanticIndex + 1;
      } else if (
        event.key === "ArrowUp" ||
        event.key === "ArrowLeft" ||
        event.key === "PageUp" ||
        (event.key === " " && event.shiftKey)
      ) {
        destination = runtime.semanticIndex - 1;
      } else if (event.key === "Home") {
        destination = 0;
      } else if (event.key === "End") {
        destination = scenes.length - 1;
      }

      if (destination === null) return;
      event.preventDefault();
      const bounded = clamp(destination, 0, scenes.length - 1);
      runtime.pager = createPagerState(bounded, scenes.length);
      runtime.progress = pageProgress(bounded, scenes.length);
      runtime.semanticIndex = bounded;
      runtime.gestureKind = null;
      clearWheelSession();
      requestPresentation();
    };

    const handlePointerOver = (event) => {
      if (!isHoldTarget(event.target)) return;
      runtime.holds.add("interface-hover");
      publish(runtime);
    };

    const handlePointerOut = (event) => {
      const region = event.target instanceof Element
        ? event.target.closest(HOLD_SELECTOR)
        : null;
      if (!region || region.contains(event.relatedTarget)) return;
      runtime.holds.delete("interface-hover");
      publish(runtime);
    };

    const handleFocusIn = (event) => {
      if (!isHoldTarget(event.target)) return;
      runtime.holds.add("interface-focus");
      publish(runtime);
    };

    const handleFocusOut = (event) => {
      const region = event.target instanceof Element
        ? event.target.closest(HOLD_SELECTOR)
        : null;
      if (region?.contains(event.relatedTarget)) return;
      runtime.holds.delete("interface-focus");
      publish(runtime);
    };

    const handleHashChange = () => {
      const id = window.location.hash.slice(1);
      const index = scenes.findIndex((scene) => scene.id === id);
      if (index < 0) return;
      runtime.pager = createPagerState(index, scenes.length);
      runtime.progress = pageProgress(index, scenes.length);
      runtime.semanticIndex = index;
      runtime.gestureKind = null;
      clearWheelSession();
      requestPresentation();
    };

    const handleVisibility = () => {
      if (document.hidden) {
        runtime.holds.add("visibility");
        clearWheelSession();
        if (runtime.pager.phase === "tracking") {
          runtime.pager = cancelPageGesture(
            runtime.pager,
            scenes.length,
            runtime.reducedMotion,
          );
        }
        runtime.pointer = null;
        runtime.gestureKind = null;
        delete stage.dataset.pointerDown;
        requestPresentation();
      } else {
        runtime.holds.delete("visibility");
      }
      runtime.lastTimestamp = 0;
      publish(runtime);
    };

    const handleWindowBlur = () => {
      clearWheelSession();
      if (runtime.pager.phase === "tracking") {
        runtime.pager = cancelPageGesture(
          runtime.pager,
          scenes.length,
          runtime.reducedMotion,
        );
      }
      const pointerId = runtime.pointer?.id;
      runtime.pointer = null;
      runtime.gestureKind = null;
      runtime.lastTimestamp = 0;
      delete stage.dataset.pointerDown;
      if (pointerId !== undefined && stage.hasPointerCapture?.(pointerId)) {
        stage.releasePointerCapture(pointerId);
      }
      requestPresentation();
    };

    stage.addEventListener("pointerdown", beginPointer);
    stage.addEventListener("pointermove", movePointer);
    stage.addEventListener("pointerup", finishPointer);
    stage.addEventListener("pointercancel", cancelPointer);
    stage.addEventListener("lostpointercapture", cancelPointer);
    stage.addEventListener("pointerover", handlePointerOver);
    stage.addEventListener("pointerout", handlePointerOut);
    stage.addEventListener("wheel", scrubWheel, { passive: false });
    stage.addEventListener("focusin", handleFocusIn);
    stage.addEventListener("focusout", handleFocusOut);
    window.addEventListener("keydown", handleKeyboard);
    window.addEventListener("hashchange", handleHashChange);
    window.addEventListener("popstate", handleHashChange);
    window.addEventListener("blur", handleWindowBlur);
    document.addEventListener("visibilitychange", handleVisibility);

    requestPresentation();

    return () => {
      stopAnimation();
      if (runtime.requestPresentation === requestPresentation) {
        runtime.requestPresentation = null;
      }
      window.clearTimeout(runtime.wheelTimer);
      stage.removeEventListener("pointerdown", beginPointer);
      stage.removeEventListener("pointermove", movePointer);
      stage.removeEventListener("pointerup", finishPointer);
      stage.removeEventListener("pointercancel", cancelPointer);
      stage.removeEventListener("lostpointercapture", cancelPointer);
      stage.removeEventListener("pointerover", handlePointerOver);
      stage.removeEventListener("pointerout", handlePointerOut);
      stage.removeEventListener("wheel", scrubWheel);
      stage.removeEventListener("focusin", handleFocusIn);
      stage.removeEventListener("focusout", handleFocusOut);
      window.removeEventListener("keydown", handleKeyboard);
      window.removeEventListener("hashchange", handleHashChange);
      window.removeEventListener("popstate", handleHashChange);
      window.removeEventListener("blur", handleWindowBlur);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [
    beatRefs,
    fallbackTrackRef,
    filmPresenterRef,
    orbitFrontRef,
    progressBarRef,
    publish,
    resistanceBottomRef,
    resistanceTopRef,
    scenes,
    stageRef,
    timelineTrackRef,
    visualPositionRef,
  ]);

  return { snapshot, seekTo, hold, release };
}
