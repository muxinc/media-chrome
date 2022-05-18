import MediaTextDisplay from './media-text-display.js';
import { defineCustomElement } from './utils/defineCustomElement.js';
import { formatAsTimePhrase, formatTime } from './utils/time.js';
import { MediaUIAttributes } from './constants.js';
import { nouns } from './labels/labels.js';
// Todo: Use data locals: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleTimeString

const DEFAULT_TIMES_SEP = '&nbsp;/&nbsp;';

const formatTimesLabel = (el, { timesSep = DEFAULT_TIMES_SEP } = {}) => {
  const showRemaining = el.getAttribute('remaining') != null;
  const showDuration = el.getAttribute('show-duration') != null;
  const currentTime = el.mediaCurrentTime;
  const endTime = el.mediaDuration ?? el.mediaSeekableEnd;

  const timeLabel = showRemaining
    ? formatTime(0 - (endTime - currentTime))
    : formatTime(currentTime);

  if (!showDuration) return timeLabel;
  return `${timeLabel}${timesSep}${formatTime(endTime)}`;
};

const DEFAULT_MISSING_TIME_PHRASE = 'video not loaded, unknown time.';

const updateAriaValueText = (el) => {
  const currentTime = el.mediaCurrentTime;
  const endTime = el.mediaDuration || el.mediaSeekableEnd;
  if (currentTime == null || endTime == null) {
    el.setAttribute('aria-valuetext', DEFAULT_MISSING_TIME_PHRASE);
    return;
  }
  const showRemaining = el.hasAttribute('remaining');
  const showDuration = el.hasAttribute('show-duration');

  const currentTimePhrase = showRemaining
    ? formatAsTimePhrase(0 - (endTime - currentTime))
    : formatAsTimePhrase(currentTime);

  if (!showDuration) {
    el.setAttribute('aria-valuetext', currentTimePhrase);
    return;
  }
  const totalTimePhrase = formatAsTimePhrase(endTime);
  const fullPhrase = `${currentTimePhrase} of ${totalTimePhrase}`;
  el.setAttribute('aria-valuetext', fullPhrase);
};

class MediaTimeDisplay extends MediaTextDisplay {
  static get observedAttributes() {
    return [
      ...super.observedAttributes,
      MediaUIAttributes.MEDIA_CURRENT_TIME,
      MediaUIAttributes.MEDIA_DURATION,
      MediaUIAttributes.MEDIA_SEEKABLE,
      'remaining',
      'show-duration',
    ];
  }

  connectedCallback() {
    this.setAttribute('role', 'progressbar');
    this.setAttribute('aria-label', nouns.PLAYBACK_TIME());
    this.setAttribute('tabindex', 0);
    super.connectedCallback();
  }

  attributeChangedCallback(attrName, oldValue, newValue) {
    if (
      [
        MediaUIAttributes.MEDIA_CURRENT_TIME,
        MediaUIAttributes.MEDIA_DURATION,
        MediaUIAttributes.MEDIA_SEEKABLE,
        'remaining',
        'show-duration',
      ].includes(attrName)
    ) {
      const timesLabel = formatTimesLabel(this);
      updateAriaValueText(this);
      this.container.innerHTML = timesLabel;
    }
    super.attributeChangedCallback(attrName, oldValue, newValue);
  }

  get mediaDuration() {
    const attrVal = this.getAttribute(MediaUIAttributes.MEDIA_DURATION);
    return attrVal != null ? +attrVal : undefined;
  }

  get mediaCurrentTime() {
    const attrVal = this.getAttribute(MediaUIAttributes.MEDIA_CURRENT_TIME);
    return attrVal != null ? +attrVal : undefined;
  }

  get mediaSeekable() {
    const seekable = this.getAttribute(MediaUIAttributes.MEDIA_SEEKABLE);
    if (!seekable) return undefined;
    // Only currently supports a single, contiguous seekable range (CJP)
    return seekable.split(':').map((time) => +time);
  }

  get mediaSeekableEnd() {
    const [, end] = this.mediaSeekable ?? [];
    return end;
  }

  get mediaSeekableStart() {
    const [start] = this.mediaSeekable ?? [];
    return start;
  }
}

defineCustomElement('media-time-display', MediaTimeDisplay);

export default MediaTimeDisplay;
