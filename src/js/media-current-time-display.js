import MediaTextDisplay from './media-text-display.js';
import { defineCustomElement } from './utils/defineCustomElement.js';
import { formatTime } from './utils/time.js';
import { MediaUIAttributes } from './constants.js';
// Todo: Use data locals: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleTimeString

class MediaCurrentTimeDisplay extends MediaTextDisplay {

  static get observedAttributes() {
    return [...super.observedAttributes, MediaUIAttributes.MEDIA_CURRENT_TIME];
  }

  connectedCallback() {
    this.setAttribute(MediaUIAttributes.MEDIA_CHROME_ATTRIBUTES, this.constructor.observedAttributes.join(' '));
    super.connectedCallback();
  }

  attributeChangedCallback(attrName, oldValue, newValue) {
    if (attrName === MediaUIAttributes.MEDIA_CURRENT_TIME) {
      this.container.innerHTML = formatTime(newValue);
    }
    super.attributeChangedCallback(attrName, oldValue, newValue);
  }
}

defineCustomElement('media-current-time-display', MediaCurrentTimeDisplay);

export default MediaCurrentTimeDisplay;
