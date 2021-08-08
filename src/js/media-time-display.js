import MediaTextDisplay from './media-text-display.js';
import { defineCustomElement } from './utils/defineCustomElement.js';
import { Window as window } from './utils/server-safe-globals.js';
import { formatTime } from './utils/time.js';
import { MediaUIEvents, MediaUIAttributes } from './constants.js';
// Todo: Use data locals: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleTimeString

const DEFAULT_TIMES_SEP = ' / ';

const formatTimesLabel = (el, { timesSep = DEFAULT_TIMES_SEP } = {}) => {
  const showRemaining = el.getAttribute('remaining') != null;
  const showDuration = el.getAttribute('show-duration') != null;
  const currentTime = +el.getAttribute(MediaUIAttributes.MEDIA_CURRENT_TIME);
  const duration = +el.getAttribute(MediaUIAttributes.MEDIA_DURATION);

  const timeLabel = showRemaining 
    ? formatTime(0 - (duration - currentTime)) 
    : formatTime(currentTime);

  if (!showDuration) return timeLabel;
  return `${timeLabel}${timesSep}${formatTime(duration)}`;
};

class MediaTimeDisplay extends MediaTextDisplay {

  static get observedAttributes() {
    return [MediaUIAttributes.MEDIA_CURRENT_TIME, MediaUIAttributes.MEDIA_DURATION, 'remaining', 'show-duration'];
  }

  connectedCallback() {
    /** Option 1 */
    const detail = this.constructor.observedAttributes;
    const evt = new window.CustomEvent(MediaUIEvents.MEDIA_CHROME_ELEMENT_CONNECTED, { composed: true, bubbles: true, detail });
    this.dispatchEvent(evt);
    /** Option 2 */
    this.setAttribute(MediaUIAttributes.MEDIA_CHROME_ATTRIBUTES, this.constructor.observedAttributes.join(' '));
  }

  attributeChangedCallback(_attrName, _oldValue, _newValue) {
    const timesLabel = formatTimesLabel(this);
    this.container.innerHTML = timesLabel;
  }
}

defineCustomElement('media-time-display', MediaTimeDisplay);

export default MediaTimeDisplay;
