import MediaTextDisplay from './media-text-display.js';
import { defineCustomElement } from './utils/defineCustomElement.js';
import { formatTime } from './utils/time.js';
import { MediaUIAttributes } from './constants.js';
// Todo: Use data locals: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleTimeString

class MediaDurationDisplay extends MediaTextDisplay {

  static get observedAttributes() {
    return [MediaUIAttributes.MEDIA_DURATION];
  }

  connectedCallback() {
    this.setAttribute(MediaUIAttributes.MEDIA_CHROME_ATTRIBUTES, this.constructor.observedAttributes.join(' '));
  }

  attributeChangedCallback(_attrName, _oldValue, newValue) {
    this.container.innerHTML = formatTime(newValue);
  }
}

defineCustomElement('media-duration-display', MediaDurationDisplay);

export default MediaDurationDisplay;