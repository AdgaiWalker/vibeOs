import assert from "node:assert/strict";
import test from "node:test";
import {
  GESTURE_COMMIT_DISTANCE,
  GESTURE_COMMIT_VELOCITY,
  GESTURE_FLICK_MIN_DISTANCE,
  MAX_TRACK_OFFSET_SCENES,
  SCENE_COUNT,
  SPRING_RESPONSE_S,
  advancePageSpring,
  beginPageGesture,
  cancelPageGesture,
  createPagerState,
  endPageGesture,
  frameForPosition,
  frameForProgress,
  pageProgress,
  swipePullDelta,
  timelineSnapshot,
  updatePageGesture,
  wheelPullDelta,
} from "../src/state/cinematicSequence.js";

function runSpring(state, frameCount, deltaSeconds) {
  let current = state;
  for (let frame = 0; frame < frameCount; frame += 1) {
    current = advancePageSpring(current, deltaSeconds);
  }
  return current;
}

test("idle pager does not advance on its own", () => {
  const state = createPagerState(2);
  assert.deepEqual(runSpring(state, 60 * 42, 1 / 60), state);
});

test("scene positions project to finite non-looping render progress", () => {
  assert.equal(pageProgress(0), 0.003);
  assert.ok(Math.abs(pageProgress(5) - 5.018 / 6) < 1e-12);
  assert.equal(pageProgress(-10), 0.003);
  assert.ok(Math.abs(pageProgress(99) - 5.018 / 6) < 1e-12);
});

test("scene texture sampling is continuous in both directions", () => {
  for (let cut = 1; cut < SCENE_COUNT; cut += 1) {
    const boundary = cut / SCENE_COUNT;
    const before = frameForProgress(boundary - 0.000001);
    const after = frameForProgress(boundary + 0.000001);
    const beforeVisible = before.imageMix >= 0.5 ? before.nextIndex : before.index;
    const afterVisible = after.imageMix >= 0.5 ? after.nextIndex : after.index;
    assert.equal(beforeVisible, afterVisible);
  }
});

test("the final scene never samples the opening scene", () => {
  const frame = frameForProgress(pageProgress(SCENE_COUNT - 1));
  assert.equal(frame.index, SCENE_COUNT - 1);
  assert.equal(frame.nextIndex, SCENE_COUNT - 1);
  assert.equal(frame.imageMix, 0);
});

test("scene position maps directly to two vertically adjacent visual planes", () => {
  const frame = frameForPosition(2.25);
  assert.equal(frame.index, 2);
  assert.equal(frame.nextIndex, 3);
  assert.equal(frame.local, 0.25);
  assert.equal(frame.edgeOffset, 0);
});

test("visual frames preserve first and last page rubber-band offsets", () => {
  const first = frameForPosition(-0.12);
  assert.equal(first.index, 0);
  assert.equal(first.nextIndex, 1);
  assert.equal(first.local, 0);
  assert.equal(first.edgeOffset, -0.12);

  const last = frameForPosition(SCENE_COUNT - 1 + 0.12);
  assert.equal(last.index, SCENE_COUNT - 1);
  assert.equal(last.nextIndex, SCENE_COUNT - 1);
  assert.equal(last.local, 0);
  assert.ok(Math.abs(last.edgeOffset - 0.12) < 1e-12);
});

test("wheel and upward swipe map to forward page pull", () => {
  assert.ok(wheelPullDelta(100) >= GESTURE_COMMIT_DISTANCE);
  assert.ok(wheelPullDelta(-100) <= -GESTURE_COMMIT_DISTANCE);
  assert.ok(swipePullDelta(-120, 844) > 0);
  assert.ok(swipePullDelta(120, 844) < 0);
});

test("tracking is resisted and never previews more than one scene", () => {
  let state = beginPageGesture(createPagerState(2));
  state = updatePageGesture(state, 100, 4);
  assert.equal(state.phase, "tracking");
  assert.ok(state.position > 2);
  assert.ok(state.position <= 2 + MAX_TRACK_OFFSET_SCENES);
  assert.ok(state.velocity <= 2.4);
});

test("equal wheel deltas move immediately with progressively stronger resistance", () => {
  let state = beginPageGesture(createPagerState(2));
  const positions = [state.position];
  for (let sample = 0; sample < 6; sample += 1) {
    state = updatePageGesture(state, wheelPullDelta(40), 0.2);
    positions.push(state.position);
  }
  const increments = positions.slice(1).map(
    (position, index) => position - positions[index],
  );
  assert.ok(increments.every((increment) => increment > 0));
  assert.ok(increments.slice(1).every(
    (increment, index) => increment < increments[index],
  ));
});

test("a short slow gesture returns to its anchor", () => {
  let state = beginPageGesture(createPagerState(2));
  state = updatePageGesture(
    state,
    GESTURE_COMMIT_DISTANCE * 0.99,
    GESTURE_COMMIT_VELOCITY * 0.5,
  );
  state = endPageGesture(state);
  assert.equal(state.target, 2);
  assert.equal(state.phase, "settling");
});

test("a single sub-threshold wheel event does not inherit synthetic velocity", () => {
  let state = beginPageGesture(createPagerState(2));
  state = updatePageGesture(state, wheelPullDelta(40), 0);
  state = endPageGesture(state);
  assert.equal(state.target, 2);
  assert.equal(state.phase, "settling");
});

test("distance or release velocity can commit exactly one page", () => {
  let byDistance = beginPageGesture(createPagerState(2));
  byDistance = updatePageGesture(byDistance, GESTURE_COMMIT_DISTANCE, 0);
  byDistance = endPageGesture(byDistance);
  assert.equal(byDistance.target, 3);

  let byVelocity = beginPageGesture(createPagerState(2));
  byVelocity = updatePageGesture(
    byVelocity,
    GESTURE_FLICK_MIN_DISTANCE,
    GESTURE_COMMIT_VELOCITY,
  );
  byVelocity = endPageGesture(byVelocity);
  assert.equal(byVelocity.target, 3);

  let huge = beginPageGesture(createPagerState(2));
  huge = updatePageGesture(huge, 1000, 1000);
  huge = endPageGesture(huge);
  assert.equal(huge.target, 3);
});

test("recent reversal decides the landing direction", () => {
  let state = beginPageGesture(createPagerState(2));
  state = updatePageGesture(state, 0.3, 1.2);
  state = updatePageGesture(state, -0.52, -1.4);
  state = endPageGesture(state);
  assert.equal(state.target, 1);
});

test("instant input direction reverses before cumulative pull changes sign", () => {
  let state = beginPageGesture(createPagerState(2));
  state = updatePageGesture(state, 0.3, 1.2);
  const beforeReverse = state.position;
  state = updatePageGesture(state, -0.1, -1);
  assert.ok(state.position < beforeReverse);
  assert.equal(state.inputDirection, -1);
  assert.ok(state.pull > 0);
});

test("tiny opposite tail noise cannot override a committed pull", () => {
  let state = beginPageGesture(createPagerState(2));
  state = updatePageGesture(state, 0.3, 1.2);
  state = updatePageGesture(
    state,
    -GESTURE_FLICK_MIN_DISTANCE / 2,
    -GESTURE_COMMIT_VELOCITY * 1.2,
  );
  state = endPageGesture(state);
  assert.equal(state.target, 3);
});

test("interrupting a settle cannot advance beyond its original adjacent page", () => {
  let state = beginPageGesture(createPagerState(2));
  state = updatePageGesture(state, 0.3, 1.2);
  state = endPageGesture(state);
  assert.equal(state.target, 3);
  state = advancePageSpring(state, 1 / 60);

  state = beginPageGesture(state);
  state = updatePageGesture(state, 0.4, 1.2);
  state = endPageGesture(state);
  assert.equal(state.anchor, 2);
  assert.equal(state.target, 3);
});

test("reversing an interrupted settle can only return to its original anchor", () => {
  let state = beginPageGesture(createPagerState(2));
  state = updatePageGesture(state, 0.3, 1.2);
  state = endPageGesture(state);
  state = advancePageSpring(state, 1 / 60);

  state = beginPageGesture(state);
  state = updatePageGesture(state, -0.4, -1.2);
  assert.ok(state.position >= 2);
  state = endPageGesture(state);
  assert.equal(state.minimumTarget, 2);
  assert.equal(state.maximumTarget, 3);
  assert.equal(state.target, 2);
});

test("interrupting a return spring can still continue toward an adjacent page", () => {
  let state = beginPageGesture(createPagerState(2));
  state = updatePageGesture(state, GESTURE_COMMIT_DISTANCE * 0.6, 0.2);
  state = endPageGesture(state);
  assert.equal(state.target, 2);
  state = advancePageSpring(state, 1 / 60);

  state = beginPageGesture(state);
  state = updatePageGesture(state, GESTURE_COMMIT_DISTANCE * 1.2, 0.9);
  state = endPageGesture(state);
  assert.equal(state.target, 3);
});

test("first and last page rubber-band instead of looping", () => {
  let first = beginPageGesture(createPagerState(0));
  first = updatePageGesture(first, -1, -2);
  assert.ok(first.position < 0);
  assert.ok(first.position > -0.2);
  first = endPageGesture(first);
  assert.equal(first.target, 0);

  let last = beginPageGesture(createPagerState(SCENE_COUNT - 1));
  last = updatePageGesture(last, 1, 2);
  assert.ok(last.position > SCENE_COUNT - 1);
  assert.ok(last.position < SCENE_COUNT - 1 + 0.2);
  last = endPageGesture(last);
  assert.equal(last.target, SCENE_COUNT - 1);
});

test("a cancelled gesture always returns without inherited velocity", () => {
  let state = beginPageGesture(createPagerState(3));
  state = updatePageGesture(state, 0.4, 2);
  state = cancelPageGesture(state);
  assert.equal(state.target, 3);
  assert.equal(state.velocity, 0);
});

test("a critical spring settles without overshoot", () => {
  let state = beginPageGesture(createPagerState(1));
  state = updatePageGesture(state, 0.3, 1.2);
  state = endPageGesture(state);

  let previous = state.position;
  for (let frame = 0; frame < 90; frame += 1) {
    state = advancePageSpring(state, 1 / 60);
    assert.ok(state.position >= previous - 1e-9);
    assert.ok(state.position <= state.target + 1e-9);
    previous = state.position;
  }

  assert.equal(state.phase, "idle");
  assert.equal(state.position, 2);
  assert.equal(state.velocity, 0);
  assert.ok(SPRING_RESPONSE_S >= 0.35 && SPRING_RESPONSE_S <= 0.42);
});

test("spring sampling is effectively frame-rate independent", () => {
  let start = beginPageGesture(createPagerState(1));
  start = updatePageGesture(start, 0.3, 1.1);
  start = endPageGesture(start);
  const at60 = runSpring(start, 24, 1 / 60);
  const at120 = runSpring(start, 48, 1 / 120);
  assert.ok(Math.abs(at60.position - at120.position) < 1e-10);
  assert.ok(Math.abs(at60.velocity - at120.velocity) < 1e-10);
});

test("reduced motion lands immediately", () => {
  let state = beginPageGesture(createPagerState(1));
  state = updatePageGesture(state, 0.3, 1.2);
  state = endPageGesture(state, SCENE_COUNT, true);
  assert.equal(state.phase, "idle");
  assert.equal(state.position, 2);
  assert.equal(state.velocity, 0);
});

test("page detail states are stable during inter-page motion", () => {
  const snapshots = Array.from({ length: 100 }, (_, sample) =>
    timelineSnapshot(pageProgress(2 + sample / 100)),
  );
  assert.deepEqual(new Set(snapshots.map((item) => item.loopStep)), new Set([3]));
  assert.deepEqual(new Set(snapshots.map((item) => item.selectedGate)), new Set([1]));
  assert.deepEqual(
    new Set(snapshots.map((item) => item.selectedFieldIndex)),
    new Set([5]),
  );
});
