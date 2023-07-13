import { MediaTextDisplay } from './media-text-display.js';
import { globalThis } from './utils/server-safe-globals.js';
import { formatTime } from './utils/time.js';
import { MediaUIAttributes } from './constants.js';
import { getNumericAttr, setNumericAttr } from './utils/element-utils.js';
// Todo: Use data locals: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleTimeString

/**
 * @attr {string} mediaduration - (read-only) Set to the media duration.
 *
 * @cssproperty [--media-duration-display-display = inline-flex] - `display` property of display.
 */
class MediaDurationDisplay extends MediaTextDisplay {
  /** @type {HTMLSlotElement} */
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

  /**
   * @type {number | undefined} In seconds
   */
  get mediaDuration() {
    return getNumericAttr(this, MediaUIAttributes.MEDIA_DURATION);
  }

  set mediaDuration(time) {
    setNumericAttr(this, MediaUIAttributes.MEDIA_DURATION, time);
  }
}

if (!globalThis.customElements.get('media-duration-display')) {
  globalThis.customElements.define('media-duration-display', MediaDurationDisplay);
}

export default MediaDurationDisplay;
