import MediaChromeRange from './media-chrome-range.js';
import { defineCustomElement } from './utils/defineCustomElement.js';
import { Window as window } from './utils/server-safe-globals.js';

class MediaVolumeRange extends MediaChromeRange {
  constructor() {
    super();

    this.range.addEventListener('input', () => {
      const media = this.media;

      if (!media) return;

      const volume = this.range.value / 1000;
      media.volume = volume;

      // If the viewer moves the volume we should unmute for them.
      if (volume > 0 && media.muted) {
        media.muted = false;
      }
    });

    // Store the last set positive volume before a drag
    // so we have it when unmuting
    this.range.addEventListener('mousedown', () => {
      const volume = this.media && this.media.volume;

      if (volume > 0) {
        this._lastNonZeroVolume = volume;
      }
    });

    this.range.addEventListener('change', () => {
      const media = this.media;

      if (!media) return;

      // If the user is just sliding the volume to zero, we want to treat
      // that the same as muting. And when they unmute, go back to the volume
      // that was previously set.
      if (media.volume == 0) {
        media.muted = true;
        media.volume = this._lastNonZeroVolume || 1;
      }

      // Store the last set volume as a local preference, if ls is supported
      try {
        window.localStorage.setItem(
          'media-chrome-pref-volume',
          media.volume.toString()
        );
      } catch (e) { }
    });
  }

  mediaSetCallback(media) {
    this._handleVolumeChange = this._updateRange.bind(this);
    media.addEventListener('volumechange', this._handleVolumeChange);

    // Update the media with the last set volume preference
    // This would preferably live with the media element,
    // not a control.
    try {
      const volPref = window.localStorage.getItem('media-chrome-pref-volume');
      if (volPref !== null) media.volume = volPref;
    } catch (e) { }

    this._updateRange();
  }

  mediaUnsetCallback(media) {
    media.removeEventListener('volumechange', this._handleVolumeChange);
  }

  _updateRange() {
    const media = this.media;
    const range = this.range;

    if (media.muted) {
      range.value = 0;
    } else {
      range.value = Math.round(media.volume * 1000);
    }

    this.updateBar();
  }
}

defineCustomElement('media-volume-range', MediaVolumeRange);

export default MediaVolumeRange;
