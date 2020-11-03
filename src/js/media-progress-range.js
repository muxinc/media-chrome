import MediaChromeRange from './media-chrome-range.js';
import { defineCustomElement } from './utils/defineCustomElement.js';

class MediaProgressRange extends MediaChromeRange {
  constructor() {
    super();

    this.setMediaTimeWithRange = () => {
      const media = this.media;
      const range = this.range;

      // Can't set the time before the media is ready
      // Ignore if readyState isn't supported
      if (media.readyState > 0 || media.readyState === undefined) {
        media.currentTime = Math.round((range.value / 1000) * media.duration);
      }
    };
    this.range.addEventListener('input', this.setMediaTimeWithRange);

    // The following listeners need to be removeable
    this.updateRangeWithMediaTime = () => {
      const media = this.media;
      this.range.value = Math.round(
        (media.currentTime / media.duration) * 1000
      );

      this.updateBar();
    };

    this.playIfNotReady = e => {
      this.range.removeEventListener('change', this.playIfNotReady);
      const media = this.media;
      media.play().then(this.setMediaTimeWithRange);
    };
  }

  mediaSetCallback() {
    const media = this.media;
    const range = this.range;

    media.addEventListener('timeupdate', this.updateRangeWithMediaTime);

    // If readyState is supported, and the range is used before
    // the media is ready, use the play promise to set the time.
    if (media.readyState !== undefined && media.readyState == 0) {
      // range.addEventListener('change', this.playIfNotReady);
    }

    media.addEventListener('progress', this.updateBar.bind(this));
  }

  mediaUnsetCallback() {
    const media = this.media;
    const range = this.range;

    media.removeEventListener('timeupdate', this.updateRangeWithMediaTime);
    range.removeEventListener('change', this.playIfNotReady);
  }

  /* Add a buffered progress bar */
  getBarColors() {
    const media = this.media;
    let colorsArray = super.getBarColors();

    if (!media || !media.buffered || !media.buffered.length || media.duration <= 0) {
      return colorsArray;
    }

    const buffered = media.buffered;
    const buffPercent = (buffered.end(buffered.length - 1) / media.duration) * 100;
    colorsArray.splice(1, 0, ['var(--media-progress-buffered-color, #777)', buffPercent]);
    return colorsArray;
  }
}

defineCustomElement('media-progress-range', MediaProgressRange);

export default MediaProgressRange;
