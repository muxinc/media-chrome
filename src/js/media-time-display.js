import MediaTextDisplay from './media-text-display.js';
import { defineCustomElement } from './utils/defineCustomElement.js';
import { formatTime } from './utils/time.js';
import { MediaUIAttributes } from './constants.js';
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
    return [...super.observedAttributes, MediaUIAttributes.MEDIA_CURRENT_TIME, MediaUIAttributes.MEDIA_DURATION, 'remaining', 'show-duration'];
  }

  connectedCallback() {
    this.setAttribute(MediaUIAttributes.MEDIA_CHROME_ATTRIBUTES, this.constructor.observedAttributes.join(' '));
    super.connectedCallback();
  }

  attributeChangedCallback(attrName, oldValue, newValue) {
    if ([MediaUIAttributes.MEDIA_CURRENT_TIME, MediaUIAttributes.MEDIA_DURATION, 'remaining', 'show-duration'].includes(attrName)) {
      const timesLabel = formatTimesLabel(this);
      this.container.innerHTML = timesLabel;
    }
    super.attributeChangedCallback(attrName, oldValue, newValue);
  }
}

defineCustomElement('media-time-display', MediaTimeDisplay);

export default MediaTimeDisplay;
