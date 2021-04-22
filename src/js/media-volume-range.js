import MediaChromeRange from './media-chrome-range.js';
import { defineCustomElement } from './utils/defineCustomElement.js';
import { Window as window } from './utils/server-safe-globals.js';
import { MEDIA_VOLUME_REQUEST } from './media-ui-events.js';

class MediaVolumeRange extends MediaChromeRange {
  constructor() {
    super();

    this.range.addEventListener('input', () => {
      const volume = this.range.value / 1000;

      console.log(volume);

      this.dispatchEvent(new window.CustomEvent(MEDIA_VOLUME_REQUEST, {
        bubbles: true,
        composed: true,
        detail: volume
      }));
    });

    // Store the last set positive volume before a drag
    // so we have it when unmuting
    // this.range.addEventListener('mousedown', () => {
    //   const volume = this.mediaVolume;

    //   if (volume > 0) {
    //     this._lastNonZeroVolume = volume;
    //   }
    // });

    // Come back to this
    // this.range.addEventListener('change', () => {
    //   // If the user is just sliding the volume to zero, we want to treat
    //   // that the same as muting. And when they unmute, go back to the volume
    //   // that was previously set.
    //   if (media.volume == 0) {
    //     media.muted = true;
    //     media.volume = this._lastNonZeroVolume || 1;
    //   }
    // });
  }

  get mediaVolume() {
    return this._mediaVolume;
  }

  set mediaVolume(volume) {
    volume = parseFloat(volume);

    this._mediaVolume = volume;

    const attrValue = parseFloat(this.getAttribute('media-volume'));

    if (attrValue !== volume) {
      this.setAttribute('media-volume', volume);
    }

    this._updateRange();
  }

  get mediaMuted() {
    return this._mediaMuted;
  }

  set mediaMuted(muted) {
    muted = !!muted;

    this._mediaMuted = muted;

    // Update the attribute first if needed, but don't inf loop
    const attrBoolValue = this.getAttribute('media-muted') !== null;

    if (muted !== attrBoolValue) {
      if (muted) {
        this.setAttribute('media-muted', 'media-muted');
      } else {
        this.removeAttribute('media-muted');
      }      
    }

    this._updateRange();
  }

  _updateRange() {
    const range = this.range;
    const muted = this.mediaMuted;
    const volume = this.mediaVolume;

    if (muted) {
      range.value = 0;
    } else {
      range.value = Math.round(volume * 1000);
    }

    this.updateBar();
  }
}

defineCustomElement('media-volume-range', MediaVolumeRange);

export default MediaVolumeRange;
