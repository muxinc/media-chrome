import MediaTextDisplay from './media-text-display.js';
import { defineCustomElement } from './utils/defineCustomElement.js';
import { formatTime } from './utils/time.js';
import { Document as document } from './utils/server-safe-globals.js';
// Todo: Use data locals: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleTimeString

class MediaCurrentTimeDisplay extends MediaTextDisplay {
  constructor() {
    super();
    this.mediaCurrentTimeSet(0);
  }

  mediaCurrentTimeSet(time) {
    this.container.innerHTML = formatTime(time);
  }
}

defineCustomElement('media-current-time-display', MediaCurrentTimeDisplay);

export default MediaCurrentTimeDisplay;
