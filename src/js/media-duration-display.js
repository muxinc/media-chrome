import MediaTextDisplay from './media-text-display.js';
import { window } from './utils/server-safe-globals.js';
import { formatTime } from './utils/time.js';
import { MediaUIAttributes } from './constants.js';
// Todo: Use data locals: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleTimeString

/**
 * @preserve
 *
 * @cssproperty [--media-text-color = var(--media-primary-color, rgb(238 238 238))]
 * @cssproperty [--media-icon-color = var(--media-primary-color, rgb(238 238 238))]
 * @cssproperty [--media-primary-color = rgb(238 238 238)]
 * @cssproperty [--media-secondary-color = rgb(20 20 30 / .7)]
 *
 * @cssproperty [--media-duration-display-display = inline-flex]
 * @cssproperty [--media-control-display = var(--media-duration-display-display, inline-flex))]
 * @cssproperty [--media-control-background = var(--media-secondary-color, rgb(20 20 30 / .7))]
 * @cssproperty [--media-control-hover-background = rgba(50 50 70 / .7)]
 * @cssproperty [--media-control-padding = 10px]
 * @cssproperty [--media-control-height = 24px]
 *
 * @cssproperty --media-font
 * @cssproperty [--media-font-weight = bold]
 * @cssproperty [--media-font-family = helvetica neue, segoe ui, roboto, arial, sans-serif]
 * @cssproperty [--media-font-size = 14px]
 * @cssproperty [--media-text-content-height = var(--media-control-height, 24px)]
 */
class MediaDurationDisplay extends MediaTextDisplay {
  #slot;

  static get observedAttributes() {
    return [...super.observedAttributes, MediaUIAttributes.MEDIA_DURATION];
  }

  constructor() {
    super();
    this.#slot = this.shadowRoot.querySelector('slot');
    this.#slot.textContent = formatTime(0);
  }

  attributeChangedCallback(attrName, oldValue, newValue) {
    if (attrName === MediaUIAttributes.MEDIA_DURATION) {
      this.#slot.textContent = formatTime(newValue);
    }
    super.attributeChangedCallback(attrName, oldValue, newValue);
  }
}

if (!window.customElements.get('media-duration-display')) {
  window.customElements.define('media-duration-display', MediaDurationDisplay);
}

export default MediaDurationDisplay;
