type Range = { valueAsNumber: number };

/**
 * Smoothly animate a range input accounting for hiccups and diverging playback.
 */
export class RangeAnimation {
  fps: number;
  callback: (value: number) => void;
  duration: number;
  playbackRate: number;

  #range: Range;
  #startTime: number;
  #previousTime: number;
  #deltaTime: number;
  #frameCount: number;
  #updateTimestamp: number;
  #updateStartValue: number;
  #lastRangeIncrease: number;
  #id = 0;

  constructor(range: Range, callback: (value: number) => void, fps: number) {
    this.#range = range;
    this.callback = callback;
    this.fps = fps;
  }

  start() {
    if (this.#id !== 0) return;

    this.#previousTime = performance.now();
    this.#startTime = this.#previousTime;
    this.#frameCount = 0;
    this.#animate();
  }

  stop() {
    if (this.#id === 0) return;

    cancelAnimationFrame(this.#id);
    this.#id = 0;
  }

  update({ start, duration, playbackRate }) {
    // 1. Always allow increases.
    // 2. Allow a relatively large decrease (user action or Safari jumping back :s).
    const increase = start - this.#range.valueAsNumber;
    const durationDelta = Math.abs(duration - this.duration);
    if (increase > 0 || increase < -0.03 || durationDelta >= 0.5) {
      this.callback(start);
    }

    this.#updateStartValue = start;
    this.#updateTimestamp = performance.now();
    this.duration = duration;
    this.playbackRate = playbackRate;
  }

  #animate = (now = performance.now()) => {
    this.#id = requestAnimationFrame(this.#animate);
    this.#deltaTime = performance.now() - this.#previousTime;
    const fpsInterval = 1000 / this.fps;

    if (this.#deltaTime > fpsInterval) {
      // Get ready for next frame by setting previousTime=now, but also adjust for your
      // specified fpsInterval not being a multiple of RAF's interval (16.7ms)
      this.#previousTime = now - (this.#deltaTime % fpsInterval);

      const fps = 1000 / ((now - this.#startTime) / ++this.#frameCount);
      const delta = (now - this.#updateTimestamp) / 1000 / this.duration;
      let value = this.#updateStartValue + delta * this.playbackRate;
      const increase = value - this.#range.valueAsNumber;

      // If the increase is negative, the animation was faster than the playhead.
      // Can happen on video startup. Slow down the animation to match the playhead.
      if (increase > 0) {
        // A perfect increase at this frame rate should be this much.
        this.#lastRangeIncrease = this.playbackRate / this.duration / fps;
      } else {
        this.#lastRangeIncrease = 0.995 * this.#lastRangeIncrease;
        value = this.#range.valueAsNumber + this.#lastRangeIncrease;
      }

      this.callback(value);
    }
  };
}
