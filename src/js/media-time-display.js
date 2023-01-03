import MediaTextDisplay from './media-text-display.js';
import { window } from './utils/server-safe-globals.js';
import { formatAsTimePhrase, formatTime } from './utils/time.js';
import { MediaUIAttributes } from './constants.js';
import { nouns } from './labels/labels.js';
// Todo: Use data locals: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleTimeString

const DEFAULT_TIMES_SEP = '&nbsp;/&nbsp;';

const formatTimesLabel = (el, { timesSep = DEFAULT_TIMES_SEP } = {}) => {
  const showRemaining = el.getAttribute('remaining') != null;
  const showDuration = el.getAttribute('show-duration') != null;
  const currentTime = el.mediaCurrentTime ?? 0;
  const endTime = el.mediaDuration ?? el.mediaSeekableEnd ?? 0;

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
      'disabled',
    ];
  }

  constructor() {
    super();
  }

  connectedCallback() {
    if (!this.hasAttribute('disabled')) {
      this.enable();
    }

    this.setAttribute('role', 'progressbar');
    this.setAttribute('aria-label', nouns.PLAYBACK_TIME());
    super.connectedCallback();
  }

  disconnectedCallback() {
    this.disable();
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
    } else if (attrName === 'disabled' && newValue !== oldValue) {
      if (newValue == null) {
        this.enable();
      } else {
        this.disable();
      }
    }

    super.attributeChangedCallback(attrName, oldValue, newValue);
  }

  enable() {
    this.setAttribute('tabindex', 0);
  }

  disable() {
    this.removeAttribute('tabindex');
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

if (!window.customElements.get('media-time-display')) {
  window.customElements.define('media-time-display', MediaTimeDisplay);
}

export default MediaTimeDisplay;
