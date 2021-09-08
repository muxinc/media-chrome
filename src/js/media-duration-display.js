import MediaTextDisplay from './media-text-display.js';
import { defineCustomElement } from './utils/defineCustomElement.js';
import { formatTime } from './utils/time.js';
import { MediaUIAttributes } from './constants.js';
// Todo: Use data locals: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleTimeString

class MediaDurationDisplay extends MediaTextDisplay {

  static get observedAttributes() {
    return [...super.observedAttributes, MediaUIAttributes.MEDIA_DURATION];
  }

  attributeChangedCallback(attrName, oldValue, newValue) {
    if (attrName === MediaUIAttributes.MEDIA_DURATION) {
      this.container.innerHTML = formatTime(newValue);
    }
    super.attributeChangedCallback(attrName, oldValue, newValue);
  }
}

defineCustomElement('media-duration-display', MediaDurationDisplay);

export default MediaDurationDisplay;