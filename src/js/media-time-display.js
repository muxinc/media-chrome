import { MediaTextDisplay } from './media-text-display.js';
import {
  getBooleanAttr,
  getNumericAttr,
  getOrInsertCSSRule,
  setBooleanAttr,
  setNumericAttr,
} from './utils/element-utils.js';
import { globalThis } from './utils/server-safe-globals.js';
import { formatAsTimePhrase, formatTime } from './utils/time.js';
import { MediaUIAttributes } from './constants.js';
import { nouns } from './labels/labels.js';

export const Attributes = {
  REMAINING: 'remaining',
  SHOW_DURATION: 'showduration',
  NO_TOGGLE: 'notoggle',
};

const CombinedAttributes = [
  ...Object.values(Attributes),
  MediaUIAttributes.MEDIA_CURRENT_TIME,
  MediaUIAttributes.MEDIA_DURATION,
  MediaUIAttributes.MEDIA_SEEKABLE,
];

// Todo: Use data locals: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleTimeString

const ButtonPressedKeys = ['Enter', ' '];

const DEFAULT_TIMES_SEP = '&nbsp;/&nbsp;';

const formatTimesLabel = (el, { timesSep = DEFAULT_TIMES_SEP } = {}) => {
  const showRemaining = el.hasAttribute(Attributes.REMAINING);
  const showDuration = el.hasAttribute(Attributes.SHOW_DURATION);
  const currentTime = el.mediaCurrentTime ?? 0;
  const [, seekableEnd] = el.mediaSeekable ?? [];
  const endTime = el.mediaDuration ?? seekableEnd ?? 0;

  const timeLabel = showRemaining
    ? formatTime(0 - (endTime - currentTime))
    : formatTime(currentTime);

  if (!showDuration) return timeLabel;
  return `${timeLabel}${timesSep}${formatTime(endTime)}`;
};

const DEFAULT_MISSING_TIME_PHRASE = 'video not loaded, unknown time.';

const updateAriaValueText = (el) => {
  const currentTime = el.mediaCurrentTime;
  const [, seekableEnd] = el.mediaSeekable ?? [];
  const endTime = el.mediaDuration || seekableEnd;
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
 * @attr {boolean} remaining - Toggle on to show the remaining time instead of elapsed time.
 * @attr {boolean} showduration - Toggle on to show the duration.
 * @attr {boolean} disabled - The Boolean disabled attribute makes the element not mutable or focusable.
 * @attr {boolean} notoggle - Set this to disable click or tap behavior that toggles between remaining and current time.
 * @attr {string} mediacurrenttime - (read-only) Set to the current media time.
 * @attr {string} mediaduration - (read-only) Set to the media duration.
 * @attr {string} mediaseekable - (read-only) Set to the seekable time ranges.
 *
 * @cssproperty [--media-time-display-display = inline-flex] - `display` property of display.
 * @cssproperty --media-control-hover-background - `background` of control hover state.
 */
class MediaTimeDisplay extends MediaTextDisplay {
  /** @type {HTMLSlotElement} */
  #slot;

  static get observedAttributes() {
    return [...super.observedAttributes, ...CombinedAttributes, 'disabled'];
  }

  constructor() {
    super();

    this.#slot = this.shadowRoot.querySelector('slot');
    this.#slot.innerHTML = `${formatTimesLabel(this)}`;

    const { style } = getOrInsertCSSRule(
      this.shadowRoot,
      ':host(:hover:not([notoggle]))'
    );
    style.setProperty('cursor', 'pointer');
    style.setProperty(
      'background',
      'var(--media-control-hover-background, rgba(50 50 70 / .7))'
    );
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
    if (this.noToggle) {
      return;
    }
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
    if (CombinedAttributes.includes(attrName)) {
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

  // Own props

  /**
   * Whether to show the remaining time
   * @type {boolean}
   */
  get remaining() {
    return getBooleanAttr(this, Attributes.REMAINING);
  }

  set remaining(show) {
    setBooleanAttr(this, Attributes.REMAINING, show);
  }

  /**
   * Whether to show the duration
   * @type {boolean}
   */
  get showDuration() {
    return getBooleanAttr(this, Attributes.SHOW_DURATION);
  }

  set showDuration(show) {
    setBooleanAttr(this, Attributes.SHOW_DURATION, show);
  }

  /**
   * Disable the default behavior that toggles between current and remaining time
   * @type {boolean}
   */
  get noToggle() {
    return getBooleanAttr(this, Attributes.NO_TOGGLE);
  }

  set noToggle(notoggle) {
    setBooleanAttr(this, Attributes.NO_TOGGLE, notoggle);
  }

  // Props derived from media UI attributes

  /**
   * Get the duration
   * @type {number | undefined} In seconds
   */
  get mediaDuration() {
    return getNumericAttr(this, MediaUIAttributes.MEDIA_DURATION);
  }

  set mediaDuration(time) {
    setNumericAttr(this, MediaUIAttributes.MEDIA_DURATION, time);
  }

  /**
   * The current time
   * @type {number | undefined} In seconds
   */
  get mediaCurrentTime() {
    return getNumericAttr(this, MediaUIAttributes.MEDIA_CURRENT_TIME);
  }

  set mediaCurrentTime(time) {
    setNumericAttr(this, MediaUIAttributes.MEDIA_CURRENT_TIME, time);
  }

  /**
   * Range of values that can be seeked to
   * @type {[number, number] | undefined} An array of two numbers [start, end]
   */
  get mediaSeekable() {
    const seekable = this.getAttribute(MediaUIAttributes.MEDIA_SEEKABLE);
    if (!seekable) return undefined;
    // Only currently supports a single, contiguous seekable range (CJP)
    return seekable.split(':').map((time) => +time);
  }

  set mediaSeekable(range) {
    if (range == null) {
      this.removeAttribute(MediaUIAttributes.MEDIA_SEEKABLE);
      return;
    }
    this.setAttribute(MediaUIAttributes.MEDIA_SEEKABLE, range.join(':'));
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

if (!globalThis.customElements.get('media-time-display')) {
  globalThis.customElements.define('media-time-display', MediaTimeDisplay);
}

export default MediaTimeDisplay;
