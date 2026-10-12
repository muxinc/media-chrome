import { assert } from '@open-wc/testing';
import { RangeAnimation } from '../../../src/js/utils/range-animation.js';

describe('RangeAnimation', () => {
  describe('update()', () => {
    // Long VOD from issue #1306. A 20s seek is ~0.34% of duration, inside the old -0.03 guard.
    const duration = 5909.6;
    const currentTime = 2301;

    it('moves the range backward for a seek smaller than 3% of duration', () => {
      const calls = [];
      const range = { valueAsNumber: currentTime / duration };
      const animation = new RangeAnimation(
        range,
        (value) => calls.push(value),
        60
      );
      const start = (currentTime - 20) / duration;

      animation.update({ start, duration, playbackRate: 1 });

      assert.equal(calls.length, 1);
      assert.equal(calls[0], start);
    });

    it('does not move the range for a sub-second playhead decrease', () => {
      const calls = [];
      const range = { valueAsNumber: currentTime / duration };
      const animation = new RangeAnimation(
        range,
        (value) => calls.push(value),
        60
      );
      const start = (currentTime - 0.2) / duration;

      animation.update({ start, duration, playbackRate: 1 });

      assert.equal(calls.length, 0);
    });
  });
});
