import MediaTextDisplay from './media-text-display.js';
import { window } from './utils/server-safe-globals.js';
import { formatTime } from './utils/time.js';
import { MediaUIAttributes } from './constants.js';
// Todo: Use data locals: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleTimeString

/**
 * @preserve
 *
 * @cssproperty --media-duration-display-display
 * @cssproperty --media-control-display
 *
 * @cssproperty --media-font
 * @cssproperty --media-font-weight
 * @cssproperty --media-font-family
 * @cssproperty --media-font-size
 * @cssproperty --media-text-content-height
 *
 * @cssproperty --media-text-color
 * @cssproperty --media-icon-color
 * @cssproperty --media-control-background
 * @cssproperty --media-control-hover-background
 * @cssproperty --media-primary-color
 * @cssproperty --media-secondary-color
 *
 * @cssproperty --media-control-height
 * @cssproperty --media-control-padding
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
