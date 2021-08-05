import { Window as window, Document as document } from './utils/server-safe-globals.js';
import MediaTextDisplay from './media-text-display.js';
import { defineCustomElement } from './utils/defineCustomElement.js';
import { formatTime } from './utils/time.js';
import { MediaUIEvents, MediaUIAttributes } from './constants.js';
// Todo: Use data locals: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleTimeString

class MediaCurrentTimeDisplay extends MediaTextDisplay {

  static get observedAttributes() {
    return [MediaUIAttributes.MEDIA_CURRENT_TIME];
  }

  constructor(...args) {
    super(...args);
  }

  connectedCallback() {
    /** Option 1 */
    const evt = new window.CustomEvent(MediaUIEvents.MEDIA_CHROME_ELEMENT_CONNECTED, { composed: true, bubbles: true, detail: this.constructor.observedAttributes });
    this.dispatchEvent(evt);
    /** Option 2 */
    this.setAttribute(MediaUIAttributes.MEDIA_CHROME_ATTRIBUTES, this.constructor.observedAttributes.join(' '));
  }

  attributeChangedCallback(_attrName, _oldValue, newValue) {
    this.container.innerHTML = formatTime(newValue);
  }
}

defineCustomElement('media-current-time-display', MediaCurrentTimeDisplay);

export default MediaCurrentTimeDisplay;
