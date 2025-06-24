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
import { t } from './utils/i18n.js';

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

const formatTimesLabel = (
  el: MediaTimeDisplay,
  { timesSep = DEFAULT_TIMES_SEP } = {}
): string => {
  const currentTime = el.mediaCurrentTime ?? 0;
  const [, seekableEnd] = el.mediaSeekable ?? [];
  let endTime = 0;
  if (Number.isFinite(el.mediaDuration)) {
    endTime = el.mediaDuration;
  } else if (Number.isFinite(seekableEnd)) {
    endTime = seekableEnd;
  }

  const timeLabel = el.remaining
    ? formatTime(0 - (endTime - currentTime))
    : formatTime(currentTime);

  if (!el.showDuration) return timeLabel;
  return `${timeLabel}${timesSep}${formatTime(endTime)}`;
};

const DEFAULT_MISSING_TIME_PHRASE = 'video not loaded, unknown time.';

const updateAriaValueText = (el: MediaTimeDisplay): void => {
  const currentTime = el.mediaCurrentTime;
  const [, seekableEnd] = el.mediaSeekable ?? [];
  let endTime = null;
  if (Number.isFinite(el.mediaDuration)) {
    endTime = el.mediaDuration;
  } else if (Number.isFinite(seekableEnd)) {
    endTime = seekableEnd;
  }
  if (currentTime == null || endTime === null) {
    el.setAttribute('aria-valuetext', DEFAULT_MISSING_TIME_PHRASE);
    return;
  }

  const currentTimePhrase = el.remaining
    ? formatAsTimePhrase(0 - (endTime - currentTime))
    : formatAsTimePhrase(currentTime);

  if (!el.showDuration) {
    el.setAttribute('aria-valuetext', currentTimePhrase);
    return;
  }
  const totalTimePhrase = formatAsTimePhrase(endTime);
  const fullPhrase = `${currentTimePhrase} of ${totalTimePhrase}`;
  el.setAttribute('aria-valuetext', fullPhrase);
};

function getSlotTemplateHTML(_attrs: Record<string, string>, props: Record<string, any>) {
  return /*html*/ `
    <slot>${formatTimesLabel(props as MediaTimeDisplay)}</slot>
  `;
}

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
  static getSlotTemplateHTML = getSlotTemplateHTML;

  #slot: HTMLSlotElement;

  static get observedAttributes(): string[] {
    return [...super.observedAttributes, ...CombinedAttributes, 'disabled'];
  }

  constructor() {
    super();

    this.#slot = this.shadowRoot.querySelector('slot');
    this.#slot.innerHTML = `${formatTimesLabel(this)}`;
  }

  connectedCallback(): void {
    const { style } = getOrInsertCSSRule(
      this.shadowRoot,
      ':host(:hover:not([notoggle]))'
    );
    style.setProperty('cursor', 'var(--media-cursor, pointer)');
    style.setProperty(
      'background',
      'var(--media-control-hover-background, rgba(50 50 70 / .7))'
    );

    if (!this.hasAttribute('disabled')) {
      this.enable();
    }

    this.setAttribute('role', 'progressbar');
    this.setAttribute('aria-label', t('playback time'));

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

  toggleTimeDisplay(): void {
    if (this.noToggle) {
      return;
    }
    if (this.hasAttribute('remaining')) {
      this.removeAttribute('remaining');
    } else {
      this.setAttribute('remaining', '');
    }
  }

  disconnectedCallback(): void {
    this.disable();
    super.disconnectedCallback();
  }

  attributeChangedCallback(
    attrName: string,
    oldValue: string | null,
    newValue: string | null
  ): void {
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

  enable(): void {
    this.tabIndex = 0;
  }

  disable(): void {
    this.tabIndex = -1;
  }

  // Own props

  /**
   * Whether to show the remaining time
   */
  get remaining(): boolean {
    return getBooleanAttr(this, Attributes.REMAINING);
  }

  set remaining(show: boolean) {
    setBooleanAttr(this, Attributes.REMAINING, show);
  }

  /**
   * Whether to show the duration
   */
  get showDuration(): boolean {
    return getBooleanAttr(this, Attributes.SHOW_DURATION);
  }

  set showDuration(show: boolean) {
    setBooleanAttr(this, Attributes.SHOW_DURATION, show);
  }

  /**
   * Disable the default behavior that toggles between current and remaining time
   */
  get noToggle(): boolean {
    return getBooleanAttr(this, Attributes.NO_TOGGLE);
  }

  set noToggle(noToggle: boolean) {
    setBooleanAttr(this, Attributes.NO_TOGGLE, noToggle);
  }

  // Props derived from media UI attributes

  /**
   * Get the duration
   */
  get mediaDuration(): number {
    return getNumericAttr(this, MediaUIAttributes.MEDIA_DURATION);
  }

  set mediaDuration(time: number) {
    setNumericAttr(this, MediaUIAttributes.MEDIA_DURATION, time);
  }

  /**
   * The current time in seconds
   */
  get mediaCurrentTime(): number {
    return getNumericAttr(this, MediaUIAttributes.MEDIA_CURRENT_TIME);
  }

  set mediaCurrentTime(time: number) {
    setNumericAttr(this, MediaUIAttributes.MEDIA_CURRENT_TIME, time);
  }

  /**
   * Range of values that can be seeked to.
   * An array of two numbers [start, end]
   */
  get mediaSeekable(): [number, number] {
    const seekable = this.getAttribute(MediaUIAttributes.MEDIA_SEEKABLE);
    if (!seekable) return undefined;
    // Only currently supports a single, contiguous seekable range (CJP)
    return seekable.split(':').map((time) => +time) as [number, number];
  }

  set mediaSeekable(range: [number, number]) {
    if (range == null) {
      this.removeAttribute(MediaUIAttributes.MEDIA_SEEKABLE);
      return;
    }
    this.setAttribute(MediaUIAttributes.MEDIA_SEEKABLE, range.join(':'));
  }

  update(): void {
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
