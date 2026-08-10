export const SCENE_COUNT = 6;
export const SCENE_PHASE_OFFSET_PROGRESS = 0.003;
export const GESTURE_COMMIT_DISTANCE = 0.16;
export const GESTURE_COMMIT_VELOCITY = 0.85;
export const GESTURE_FLICK_MIN_DISTANCE = 0.08;
export const MAX_TRACK_OFFSET_SCENES = 0.92;
export const MAX_RELEASE_VELOCITY = 2.4;
export const WHEEL_SESSION_GAP_MS = 110;
export const WHEEL_PIXELS_PER_SCENE = 560;
export const SPRING_RESPONSE_S = 0.38;
export const SPRING_POSITION_EPSILON = 0.001;
export const SPRING_VELOCITY_EPSILON = 0.01;

const SPRING_OMEGA = (Math.PI * 2) / SPRING_RESPONSE_S;
const EDGE_PULL_LIMIT = 0.18;
const MAX_FRAME_DELTA_S = 0.05;

export function clamp(value, minimum, maximum) {
  return Math.min(maximum, Math.max(minimum, value));
}

export function smoothstep(edge0, edge1, value) {
  if (edge0 === edge1) return value < edge0 ? 0 : 1;
  const amount = clamp((value - edge0) / (edge1 - edge0), 0, 1);
  return amount * amount * (3 - 2 * amount);
}

export function pageProgress(position, sceneCount = SCENE_COUNT) {
  const bounded = clamp(position, 0, sceneCount - 1);
  return bounded / sceneCount + SCENE_PHASE_OFFSET_PROGRESS;
}

export function frameForProgress(progress, sceneCount = SCENE_COUNT) {
  const maximum = (sceneCount - 1) / sceneCount + SCENE_PHASE_OFFSET_PROGRESS;
  const bounded = clamp(Number.isFinite(progress) ? progress : 0, 0, maximum);
  const scaled = bounded * sceneCount;
  const whole = Math.floor(scaled);
  const index = Math.min(sceneCount - 1, whole);
  const nextIndex = Math.min(sceneCount - 1, index + 1);
  const local = index === sceneCount - 1 ? 0 : scaled - whole;

  return {
    progress: bounded,
    index,
    nextIndex,
    local,
    imageMix: index === nextIndex ? 0 : smoothstep(0.02, 0.98, local),
  };
}

export function frameForPosition(position, sceneCount = SCENE_COUNT) {
  const numericPosition = Number.isFinite(position) ? position : 0;
  const boundedPosition = clamp(numericPosition, 0, sceneCount - 1);
  const whole = Math.floor(boundedPosition);
  const index = Math.min(sceneCount - 1, whole);
  const nextIndex = Math.min(sceneCount - 1, index + 1);
  const local = index === nextIndex ? 0 : boundedPosition - whole;

  return {
    position: numericPosition,
    boundedPosition,
    edgeOffset: numericPosition - boundedPosition,
    index,
    nextIndex,
    local,
  };
}

export function wheelPullDelta(deltaPixels) {
  if (!Number.isFinite(deltaPixels)) return 0;
  return clamp(
    deltaPixels / WHEEL_PIXELS_PER_SCENE,
    -MAX_TRACK_OFFSET_SCENES,
    MAX_TRACK_OFFSET_SCENES,
  );
}

export function swipePullDelta(deltaY, viewportHeight) {
  if (!Number.isFinite(deltaY) || viewportHeight <= 0) return 0;
  return clamp(
    -(deltaY / viewportHeight),
    -MAX_TRACK_OFFSET_SCENES,
    MAX_TRACK_OFFSET_SCENES,
  );
}

function resistedPull(pull, limit) {
  const magnitude = Math.abs(pull);
  if (magnitude === 0) return 0;
  return Math.sign(pull) * limit * (1 - Math.exp(-magnitude / limit));
}

export function createPagerState(index = 0, sceneCount = SCENE_COUNT) {
  const target = clamp(Math.round(index), 0, sceneCount - 1);
  return {
    position: target,
    velocity: 0,
    target,
    anchor: target,
    minimumTarget: target,
    maximumTarget: target,
    startPosition: target,
    pull: 0,
    inputDirection: 0,
    phase: "idle",
  };
}

export function beginPageGesture(state, sceneCount = SCENE_COUNT) {
  const interruptingSettle = state.phase === "settling";
  const intendedAnchor = interruptingSettle
    ? state.anchor
    : state.target;
  const anchor = clamp(
    Number.isFinite(intendedAnchor)
      ? Math.round(intendedAnchor)
      : Math.round(state.position),
    0,
    sceneCount - 1,
  );
  const hasAdjacentSettleTarget = interruptingSettle && state.target !== anchor;
  const minimumTarget = hasAdjacentSettleTarget
    ? Math.min(anchor, state.target)
    : Math.max(0, anchor - 1);
  const maximumTarget = hasAdjacentSettleTarget
    ? Math.max(anchor, state.target)
    : Math.min(sceneCount - 1, anchor + 1);

  return {
    ...state,
    anchor,
    minimumTarget,
    maximumTarget,
    startPosition: state.position,
    pull: 0,
    velocity: 0,
    inputDirection: 0,
    phase: "tracking",
  };
}

export function updatePageGesture(
  state,
  pullDelta,
  inputVelocity = 0,
  sceneCount = SCENE_COUNT,
) {
  const tracking = state.phase === "tracking"
    ? state
    : beginPageGesture(state, sceneCount);
  const pull = tracking.pull + (Number.isFinite(pullDelta) ? pullDelta : 0);
  const direction = Math.sign(pull);
  const atOuterEdge =
    (tracking.anchor === 0 && direction < 0) ||
    (tracking.anchor === sceneCount - 1 && direction > 0);
  const limit = atOuterEdge ? EDGE_PULL_LIMIT : MAX_TRACK_OFFSET_SCENES;
  const offset = resistedPull(pull, limit);
  const minimum = tracking.anchor === 0 && direction < 0
    ? -EDGE_PULL_LIMIT
    : tracking.minimumTarget;
  const maximum = tracking.anchor === sceneCount - 1 && direction > 0
    ? sceneCount - 1 + EDGE_PULL_LIMIT
    : tracking.maximumTarget;

  return {
    ...tracking,
    position: clamp(tracking.startPosition + offset, minimum, maximum),
    pull,
    velocity: clamp(
      Number.isFinite(inputVelocity) ? inputVelocity : 0,
      -MAX_RELEASE_VELOCITY,
      MAX_RELEASE_VELOCITY,
    ),
    inputDirection: Math.sign(pullDelta) || tracking.inputDirection,
  };
}

function landingDirection(state) {
  if (
    Math.abs(state.velocity) >= GESTURE_COMMIT_VELOCITY &&
    Math.abs(state.pull) >= GESTURE_FLICK_MIN_DISTANCE &&
    Math.sign(state.velocity) === Math.sign(state.pull)
  ) {
    return Math.sign(state.velocity);
  }
  if (Math.abs(state.pull) >= GESTURE_COMMIT_DISTANCE) {
    return Math.sign(state.pull);
  }
  return 0;
}

export function endPageGesture(
  state,
  sceneCount = SCENE_COUNT,
  reducedMotion = false,
) {
  const direction = landingDirection(state);
  const target = clamp(
    state.anchor + direction,
    state.minimumTarget,
    state.maximumTarget,
  );

  if (reducedMotion) return createPagerState(target, sceneCount);

  const distance = target - state.position;
  const towardTarget = Math.sign(distance);
  const inheritedVelocity = Math.sign(state.velocity) === towardTarget
    ? Math.min(
        Math.abs(state.velocity),
        Math.abs(distance) * SPRING_OMEGA * 0.9,
      ) * towardTarget
    : 0;

  return {
    ...state,
    target,
    velocity: inheritedVelocity,
    phase: "settling",
  };
}

export function cancelPageGesture(
  state,
  sceneCount = SCENE_COUNT,
  reducedMotion = false,
) {
  if (reducedMotion) return createPagerState(state.anchor, sceneCount);
  return {
    ...state,
    target: state.anchor,
    velocity: 0,
    phase: "settling",
  };
}

export function advancePageSpring(state, deltaSeconds) {
  if (state.phase !== "settling") return state;
  const dt = clamp(deltaSeconds, 0, MAX_FRAME_DELTA_S);
  if (dt <= 0) return state;

  const offset = state.position - state.target;
  const coefficient = state.velocity + SPRING_OMEGA * offset;
  const decay = Math.exp(-SPRING_OMEGA * dt);
  const nextOffset = (offset + coefficient * dt) * decay;
  const nextVelocity =
    (state.velocity - SPRING_OMEGA * coefficient * dt) * decay;
  const nextPosition = state.target + nextOffset;

  if (
    Math.abs(nextOffset) <= SPRING_POSITION_EPSILON &&
    Math.abs(nextVelocity) <= SPRING_VELOCITY_EPSILON
  ) {
    return createPagerState(state.target);
  }

  return {
    ...state,
    position: nextPosition,
    velocity: nextVelocity,
  };
}

export function timelineSnapshot(progress, sceneCount = SCENE_COUNT) {
  const frame = frameForProgress(progress, sceneCount);

  return {
    ...frame,
    visualIndex: frame.local >= 0.5 ? frame.nextIndex : frame.index,
    loopStep: 3,
    selectedGate: 1,
    selectedFieldIndex: 5,
  };
}
