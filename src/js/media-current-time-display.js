import MediaTextDisplay from './media-text-display.js';
import { defineCustomElement } from './utils/defineCustomElement.js';
import { formatTime } from './utils/time.js';
import { MediaUIAttributes } from './constants.js';
// Todo: Use data locals: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleTimeString

class MediaCurrentTimeDisplay extends MediaTextDisplay {

  static get observedAttributes() {
    return [MediaUIAttributes.MEDIA_CURRENT_TIME];
  }

  connectedCallback() {
    this.setAttribute(MediaUIAttributes.MEDIA_CHROME_ATTRIBUTES, this.constructor.observedAttributes.join(' '));
  }

  attributeChangedCallback(_attrName, _oldValue, newValue) {
    this.container.innerHTML = formatTime(newValue);
  }
}

defineCustomElement('media-current-time-display', MediaCurrentTimeDisplay);

export default MediaCurrentTimeDisplay;
