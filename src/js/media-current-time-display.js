import MediaTextDisplay from './media-text-display.js';
import { window } from './utils/server-safe-globals.js';
import { formatTime } from './utils/time.js';
import { MediaUIAttributes } from './constants.js';
// Todo: Use data locals: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleTimeString

/**
 * @cssproperty [--media-current-time-display-display = inline-flex]
 */
class MediaCurrentTimeDisplay extends MediaTextDisplay {
  #slot;

  static get observedAttributes() {
    return [...super.observedAttributes, MediaUIAttributes.MEDIA_CURRENT_TIME];
  }

  constructor() {
    super();
    this.#slot = this.shadowRoot.querySelector('slot');
    this.#slot.textContent = formatTime(0);
  }

  attributeChangedCallback(attrName, oldValue, newValue) {
    if (attrName === MediaUIAttributes.MEDIA_CURRENT_TIME) {
      this.#slot.textContent = formatTime(newValue);
    }
    super.attributeChangedCallback(attrName, oldValue, newValue);
  }
}

if (!window.customElements.get('media-current-time-display')) {
  window.customElements.define('media-current-time-display', MediaCurrentTimeDisplay);
}

export default MediaCurrentTimeDisplay;
