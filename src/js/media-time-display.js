import MediaTextDisplay from './media-text-display.js';
import { defineCustomElement } from './utils/defineCustomElement.js';
import { formatTime } from './utils/time.js';
import { Document as document } from './utils/server-safe-globals.js';
// Todo: Use data locals: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleTimeString

class MediaTimeDisplay extends MediaTextDisplay {
  constructor() {
    super();
    this.mediaCurrentTimeSet(0);
  }

  mediaCurrentTimeSet() {
    this._update();
  }

  mediaDurationSet() {
    this._update();
  }

  _update() {
    if (this.getAttribute('remaining') !== null) {
      this.container.innerHTML = formatTime(0-(this.mediaDuration - this.mediaCurrentTime));  
    } else {
      this.container.innerHTML = formatTime(this.mediaCurrentTime);
    }

    if (this.getAttribute('show-duration') !== null) {
      this.container.innerHTML += ' / ' + formatTime(this.mediaDuration);
    }
  }
}

defineCustomElement('media-time-display', MediaTimeDisplay);

export default MediaTimeDisplay;
