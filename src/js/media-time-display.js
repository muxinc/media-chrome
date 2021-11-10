import MediaTextDisplay from './media-text-display.js';
import { defineCustomElement } from './utils/defineCustomElement.js';
import { formatAsTimePhrase, formatTime } from './utils/time.js';
import { MediaUIAttributes } from './constants.js';
import { nouns } from './labels/labels.js';
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

const DEFAULT_MISSING_TIME_PHRASE = 'video not loaded, unknown time.';

const updateAriaValueText = (el) => {
  if (!(el.hasAttribute(MediaUIAttributes.MEDIA_CURRENT_TIME) && el.hasAttribute(MediaUIAttributes.MEDIA_DURATION))) {
    el.setAttribute('aria-valuetext', DEFAULT_MISSING_TIME_PHRASE);
    return;
  }
  const showRemaining = el.getAttribute('remaining') != null;
  const showDuration = el.getAttribute('show-duration') != null;
  const currentTime = +el.getAttribute(MediaUIAttributes.MEDIA_CURRENT_TIME);
  const duration = +el.getAttribute(MediaUIAttributes.MEDIA_DURATION);

  const currentTimePhrase = showRemaining 
    ? formatAsTimePhrase(0 - (duration - currentTime)) 
    : formatAsTimePhrase(currentTime);

  if (!showDuration) {
    el.setAttribute('aria-valuetext', currentTimePhrase);
    return;
  }
  const totalTimePhrase = formatAsTimePhrase(duration);
  const fullPhrase = `${currentTimePhrase} of ${totalTimePhrase}`;
  el.setAttribute('aria-valuetext', fullPhrase);
};

class MediaTimeDisplay extends MediaTextDisplay {

  static get observedAttributes() {
    return [...super.observedAttributes, MediaUIAttributes.MEDIA_CURRENT_TIME, MediaUIAttributes.MEDIA_DURATION, 'remaining', 'show-duration'];
  }

  connectedCallback() {
    this.setAttribute('role', 'progressbar');
    this.setAttribute('aria-label', nouns.PLAYBACK_TIME());
    this.setAttribute('tabindex', 0);
    super.connectedCallback();
  }

  attributeChangedCallback(attrName, oldValue, newValue) {
    if ([MediaUIAttributes.MEDIA_CURRENT_TIME, MediaUIAttributes.MEDIA_DURATION, 'remaining', 'show-duration'].includes(attrName)) {
      const timesLabel = formatTimesLabel(this);
      updateAriaValueText(this);
      this.container.innerHTML = timesLabel;
    }
    super.attributeChangedCallback(attrName, oldValue, newValue);
  }
}

defineCustomElement('media-time-display', MediaTimeDisplay);

export default MediaTimeDisplay;
