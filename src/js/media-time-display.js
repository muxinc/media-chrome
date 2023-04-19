import MediaTextDisplay from './media-text-display.js';
import { getOrInsertCSSRule } from './utils/element-utils.js';
import { window } from './utils/server-safe-globals.js';
import { formatAsTimePhrase, formatTime } from './utils/time.js';
import { MediaUIAttributes } from './constants.js';
import { nouns } from './labels/labels.js';

export const Attributes = {
  REMAINING: 'remaining',
  SHOW_DURATION: 'showduration',
};


// Todo: Use data locals: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleTimeString
//

const ButtonPressedKeys = ['Enter', ' '];

const DEFAULT_TIMES_SEP = '&nbsp;/&nbsp;';

const formatTimesLabel = (el, { timesSep = DEFAULT_TIMES_SEP } = {}) => {
  const showRemaining = el.hasAttribute(Attributes.REMAINING);
  const showDuration = el.hasAttribute(Attributes.SHOW_DURATION);
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
  const showRemaining = el.hasAttribute(Attributes.REMAINING);
  const showDuration = el.hasAttribute(Attributes.SHOW_DURATION);

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

/**
 * @preserve
 *
 * @cssproperty [--media-text-color = var(--media-primary-color, rgb(238 238 238))]
 * @cssproperty [--media-icon-color = var(--media-primary-color, rgb(238 238 238))]
 * @cssproperty [--media-primary-color = rgb(238 238 238)]
 * @cssproperty [--media-secondary-color = rgb(20 20 30 / .7)]
 *
 * @cssproperty [--media-time-display-display = inline-flex]
 * @cssproperty [--media-control-display = var(--media-time-display-display, inline-flex))]
 * @cssproperty [--media-control-background = var(--media-secondary-color, rgb(20 20 30 / .7))]
 * @cssproperty [--media-control-hover-background = rgba(50 50 70 / .7)]
 * @cssproperty [--media-control-padding = 10px]
 * @cssproperty [--media-control-height = 24px]
 *
 * @cssproperty --media-font
 * @cssproperty [--media-font-weight = bold]
 * @cssproperty [--media-font-family = helvetica neue, segoe ui, roboto, arial, sans-serif]
 * @cssproperty [--media-font-size = 14px]
 * @cssproperty [--media-text-content-height = var(--media-control-height, 24px)]
 */
class MediaTimeDisplay extends MediaTextDisplay {
  #slot;

  static get observedAttributes() {
    return [
      ...super.observedAttributes,
      MediaUIAttributes.MEDIA_CURRENT_TIME,
      MediaUIAttributes.MEDIA_DURATION,
      MediaUIAttributes.MEDIA_SEEKABLE,
      Attributes.REMAINING,
      Attributes.SHOW_DURATION,
      'disabled',
    ];
  }

  constructor() {
    super();

    this.#slot = this.shadowRoot.querySelector('slot');
    this.#slot.innerHTML = `${formatTimesLabel(this)}`;

    const { style } = getOrInsertCSSRule(this.shadowRoot, ':host');
    style.setProperty('cursor', 'pointer');
  }

  connectedCallback() {
    if (!this.hasAttribute('disabled')) {
      this.enable();
    }

    this.setAttribute('role', 'progressbar');
    this.setAttribute('aria-label', nouns.PLAYBACK_TIME());

    const keyUpHandler = (evt) => {
      const { key } = evt;
      if (!ButtonPressedKeys.includes(key)) {
        this.removeEventListener('keyup', keyUpHandler);
        return;
      }

      this.toggleTimeDisplay();
    };

    this.addEventListener('keydown', (evt) => {
      const { metaKey, altKey, key } = evt;
      if (metaKey || altKey || !ButtonPressedKeys.includes(key)) {
        this.removeEventListener('keyup', keyUpHandler);
        return;
      }
      this.addEventListener('keyup', keyUpHandler);
    });

    this.addEventListener('click', this.toggleTimeDisplay);

    super.connectedCallback();
  }

  toggleTimeDisplay() {
    if (this.hasAttribute('remaining')) {
      this.removeAttribute('remaining');
    } else {
      this.setAttribute('remaining', '');
    }
  }

  disconnectedCallback() {
    this.disable();
    super.disconnectedCallback();
  }

  attributeChangedCallback(attrName, oldValue, newValue) {
    if (
      [
        Attributes.SHOW_DURATION,
        Attributes.REMAINING,
        MediaUIAttributes.MEDIA_CURRENT_TIME,
        MediaUIAttributes.MEDIA_DURATION,
        MediaUIAttributes.MEDIA_SEEKABLE,
      ].includes(attrName)
    ) {
      this.update();
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
    this.tabIndex = 0;
  }

  disable() {
    this.tabIndex = -1;
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

  update() {
    const timesLabel = formatTimesLabel(this);
    updateAriaValueText(this);
    // Only update if it changed, timeupdate events are called a few times per second.
    if (timesLabel !== this.#slot.innerHTML) {
      this.#slot.innerHTML = timesLabel;
    }
  }
}

if (!window.customElements.get('media-time-display')) {
  window.customElements.define('media-time-display', MediaTimeDisplay);
}

export default MediaTimeDisplay;
