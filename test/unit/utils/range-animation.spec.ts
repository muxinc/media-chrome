import { assert } from '@open-wc/testing';
import { RangeAnimation } from '../../../src/js/utils/range-animation.js';

const DURATION = 134;

/**
 * Drives RangeAnimation on a fake clock so the animation can be stepped
 * deterministically instead of waiting on real frames.
 */
function harness() {
  const realNow = performance.now;
  const realRaf = globalThis.requestAnimationFrame;
  const realCancelRaf = globalThis.cancelAnimationFrame;

  let now = 0;
  let callbacks: FrameRequestCallback[] = [];

  performance.now = () => now;
  globalThis.requestAnimationFrame = (cb: FrameRequestCallback) =>
    callbacks.push(cb);
  globalThis.cancelAnimationFrame = () => {
    callbacks = [];
  };

  const range = { valueAsNumber: 0 };
  const animation = new RangeAnimation(
    range,
    (value) => {
      range.valueAsNumber = value;
    },
    60
  );

  return {
    animation,
    get displayedTime() {
      return range.valueAsNumber * DURATION;
    },
    tick(ms: number) {
      const frames = Math.round(ms / 16.7);
      for (let i = 0; i < frames; i++) {
        now += 16.7;
        const pending = callbacks;
        callbacks = [];
        pending.forEach((cb) => cb(now));
      }
    },
    // Simulate media-chrome pushing a new `mediacurrenttime` down to the range.
    updateTo(currentTime: number) {
      animation.update({
        start: currentTime / DURATION,
        duration: DURATION,
        playbackRate: 1,
      });
    },
    restore() {
      performance.now = realNow;
      globalThis.requestAnimationFrame = realRaf;
      globalThis.cancelAnimationFrame = realCancelRaf;
    },
  };
}

describe('RangeAnimation', () => {
  let h: ReturnType<typeof harness>;

  beforeEach(() => {
    h = harness();
  });

  afterEach(() => {
    h.animation.stop();
    h.restore();
  });

  it('tracks the playhead while time updates keep arriving', () => {
    h.updateTo(0);
    h.animation.start();

    let currentTime = 0;
    for (let i = 0; i < 28; i++) {
      h.tick(250);
      currentTime += 0.25;
      h.updateTo(currentTime);
    }

    assert.closeTo(h.displayedTime, 7, 0.01, 'displays the real current time');
  });

  it('smooths over a gap between time updates', () => {
    h.updateTo(0);
    h.animation.start();
    h.tick(400);

    assert.closeTo(
      h.displayedTime,
      0.4,
      0.05,
      'keeps moving while a time update is merely late'
    );
  });

  it('holds the playhead when time updates stop arriving', () => {
    // A media element can report itself as unpaused while playback is stalled;
    // extrapolating then claims progress that never happened.
    h.updateTo(7);
    h.animation.start();

    h.tick(3000);
    const afterThreeSeconds = h.displayedTime;
    h.tick(17000);

    assert.isBelow(
      afterThreeSeconds,
      7 + RangeAnimation.STALE_TIMEOUT / 1000 + 0.1,
      'stops advancing shortly after the last time update'
    );
    assert.closeTo(
      h.displayedTime,
      afterThreeSeconds,
      0.01,
      'stays put no matter how long the stall lasts'
    );
  });

  it('resumes tracking once time updates come back', () => {
    h.updateTo(7);
    h.animation.start();
    h.tick(20000);

    let currentTime = 7;
    for (let i = 0; i < 8; i++) {
      h.tick(250);
      currentTime += 0.25;
      h.updateTo(currentTime);
    }

    assert.closeTo(h.displayedTime, 9, 0.01, 'snaps back to the real playhead');
  });
});
