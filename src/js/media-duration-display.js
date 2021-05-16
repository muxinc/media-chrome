import MediaTextDisplay from './media-text-display.js';
import { defineCustomElement } from './utils/defineCustomElement.js';
import { formatTime } from './utils/time.js';
import { Document as document } from './utils/server-safe-globals.js';
// Todo: Use data locals: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleTimeString

class MediaDurationDisplay extends MediaTextDisplay {
  constructor() {
    super();
    this.mediaDurationSet(0);
  }

  mediaDurationSet(duration) {
    this.container.innerHTML = formatTime(duration);
  }
}

defineCustomElement('media-duration-display', MediaDurationDisplay);

export default MediaDurationDisplay;
