import MediaTextDisplay from './media-text-display.js';
import { defineCustomElement } from './utils/defineCustomElement.js';
import { formatTime } from './utils/time.js';
import { Document as document } from './utils/server-safe-globals.js';
// Todo: Use data locals: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleTimeString

class MediaCurrentTimeDisplay extends MediaTextDisplay {
  connectedCallback() {
    this._update();
  }

  mediaCurrentTimeSet() {
    this._update();
  }

  _update() {
    this.container.innerHTML = formatTime(this.mediaCurrentTime);
  }
}

defineCustomElement('media-current-time-display', MediaCurrentTimeDisplay);

export default MediaCurrentTimeDisplay;
