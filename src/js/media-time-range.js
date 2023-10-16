import { MediaChromeRange } from './media-chrome-range.js';
import { globalThis, document } from './utils/server-safe-globals.js';
import { MediaUIEvents, MediaUIAttributes } from './constants.js';
import { nouns } from './labels/labels.js';
import { formatAsTimePhrase } from './utils/time.js';
import {
  getOrInsertCSSRule,
  closestComposedNode,
  getBooleanAttr,
  setBooleanAttr,
  getNumericAttr,
  setNumericAttr,
  getStringAttr,
  setStringAttr,
} from './utils/element-utils.js';

const DEFAULT_MISSING_TIME_PHRASE = 'video not loaded, unknown time.';

const updateAriaValueText = (el) => {
  const range = el.range;
  const currentTimePhrase = formatAsTimePhrase(+calcTimeFromRangeValue(el));
  const totalTimePhrase = formatAsTimePhrase(+el.mediaSeekableEnd);
  const fullPhrase = !(currentTimePhrase && totalTimePhrase)
    ? DEFAULT_MISSING_TIME_PHRASE
    : `${currentTimePhrase} of ${totalTimePhrase}`;
  range.setAttribute('aria-valuetext', fullPhrase);
};

const template = document.createElement('template');
template.innerHTML = /*html*/`
  <style>
    :host {
      --media-preview-border-radius: 3px;
      --media-box-padding-left: 10px;
      --media-box-padding-right: 10px;
    }

    #buffered {
      background: var(--media-time-range-buffered-color, rgb(255 255 255 / .4));
      border-radius: var(--media-range-track-border-radius, 1px);
      position: absolute;
      height: 100%;
    }

    #preview-rail,
    #current-rail {
      ${/* 1% of parent element and upscale by 100 in the translateX() */ ''}
      width: 1%;
      position: absolute;
      left: 0;
      bottom: 100%;
      pointer-events: none;
    }

    [part~="box"] {
      ${/* absolute position is needed here so the box doesn't overflow the bounds */''}
      position: absolute;
      bottom: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      transform: translateX(-50%);
    }

    [part~="preview-box"] {
      transition-property: var(--media-preview-transition-property, visibility, opacity);
      transition-duration: var(--media-preview-transition-duration-out, .25s);
      transition-delay: var(--media-preview-transition-delay-out, 0s);
      visibility: hidden;
      opacity: 0;
    }

    :host([${MediaUIAttributes.MEDIA_PREVIEW_IMAGE}]:hover) [part~="preview-box"],
    :host([${MediaUIAttributes.MEDIA_PREVIEW_TIME}]:hover) [part~="preview-box"] {
      transition-duration: var(--media-preview-transition-duration-in, .5s);
      transition-delay: var(--media-preview-transition-delay-in, .25s);
      visibility: visible;
      opacity: 1;
    }

    media-preview-thumbnail,
    ::slotted(media-preview-thumbnail) {
      visibility: hidden;
      ${/* delay changing these CSS props until the preview box transition is ended */''}
      transition: visibility 0s .25s;
      transition-delay: calc(var(--media-preview-transition-delay-out, 0s) + var(--media-preview-transition-duration-out, .25s));
      background: var(--media-preview-thumbnail-background, var(--media-preview-background, var(--media-control-background, var(--media-secondary-color, rgb(20 20 30 / .7)))));
      box-shadow: var(--media-preview-thumbnail-box-shadow, 0 0 4px rgb(0 0 0 / .2));
      max-width: var(--media-preview-thumbnail-max-width, 180px);
      max-height: var(--media-preview-thumbnail-max-height, 160px);
      min-width: var(--media-preview-thumbnail-min-width, 120px);
      min-height: var(--media-preview-thumbnail-min-height, 80px);
      border: var(--media-preview-thumbnail-border);
      border-radius: var(--media-preview-thumbnail-border-radius,
        var(--media-preview-border-radius) var(--media-preview-border-radius) 0 0);
    }

    :host([${MediaUIAttributes.MEDIA_PREVIEW_IMAGE}]:hover) media-preview-thumbnail,
    :host([${MediaUIAttributes.MEDIA_PREVIEW_IMAGE}]:hover) ::slotted(media-preview-thumbnail) {
      transition-delay: var(--media-preview-transition-delay-in, .25s);
      visibility: visible;
    }

    media-preview-time-display,
    ::slotted(media-preview-time-display) {
      min-width: 0;
      ${/* delay changing these CSS props until the preview box transition is ended */''}
      transition: min-width 0s, border-radius 0s;
      transition-delay: calc(var(--media-preview-transition-delay-out, 0s) + var(--media-preview-transition-duration-out, .25s));
      background: var(--media-preview-time-background, var(--media-preview-background, var(--media-control-background, var(--media-secondary-color, rgb(20 20 30 / .7)))));
      border-radius: var(--media-preview-time-border-radius,
        var(--media-preview-border-radius) var(--media-preview-border-radius)
        var(--media-preview-border-radius) var(--media-preview-border-radius));
      padding: var(--media-preview-time-padding, 1px 10px 0);
      margin: var(--media-preview-time-margin, 0 0 10px);
      text-shadow: var(--media-preview-time-text-shadow, 0 0 4px rgb(0 0 0 / .75));
    }

    :host([${MediaUIAttributes.MEDIA_PREVIEW_IMAGE}]) media-preview-time-display,
    :host([${MediaUIAttributes.MEDIA_PREVIEW_IMAGE}]) ::slotted(media-preview-time-display) {
      transition-delay: var(--media-preview-transition-delay-in, .25s);
      min-width: 100%;
      border-radius: var(--media-preview-time-border-radius,
        0 0 var(--media-preview-border-radius) var(--media-preview-border-radius));
    }

    :host([${MediaUIAttributes.MEDIA_PREVIEW_TIME}]:hover) {
      --media-time-range-hover-display: block;
    }
  </style>
  <div id="preview-rail">
    <slot name="preview" part="box preview-box">
      <media-preview-thumbnail></media-preview-thumbnail>
      <media-preview-time-display></media-preview-time-display>
    </slot>
  </div>
  <div id="current-rail">
    <slot name="current" part="box current-box">
      ${/* Example: add the current time to the playhead
        <media-time-display></media-time-display> */''}
    </slot>
  </div>
`;

const calcRangeValueFromTime = (el, time = el.mediaCurrentTime) => {
  if (Number.isNaN(el.mediaSeekableEnd)) return 0;
  const value = (time - el.mediaSeekableStart) / (el.mediaSeekableEnd - el.mediaSeekableStart);
  return Math.max(0, Math.min(value, 1));
}

const calcTimeFromRangeValue = (el, value = el.range.valueAsNumber) => {
  if (Number.isNaN(el.mediaSeekableEnd)) return 0;
  return (value * (el.mediaSeekableEnd - el.mediaSeekableStart)) + el.mediaSeekableStart;
}

/**
 * @slot preview - An element that slides along the timeline to the position of the pointer hovering.
 * @slot current - An element that slides along the timeline to the position of the current time.
 *
 * @attr {string} mediabuffered - (read-only) Set to the buffered time ranges.
 * @attr {string} mediaplaybackrate - (read-only) Set to the media playback rate.
 * @attr {string} mediaduration - (read-only) Set to the media duration.
 * @attr {string} mediaseekable - (read-only) Set to the seekable time ranges.
 * @attr {boolean} mediapaused - (read-only) Present if the media is paused.
 * @attr {boolean} medialoading - (read-only) Present if the media is loading.
 * @attr {string} mediacurrenttime - (read-only) Set to the current media time.
 * @attr {string} mediapreviewimage - (read-only) Set to the timeline preview image URL.
 * @attr {string} mediapreviewtime - (read-only) Set to the timeline preview time.
 *
 * @csspart box - A CSS part that selects both the preview and current box elements.
 * @csspart preview-box - A CSS part that selects the preview box element.
 * @csspart current-box - A CSS part that selects the current box element.
 *
 * @cssproperty [--media-time-range-display = inline-block] - `display` property of range.
 *
 * @cssproperty --media-preview-transition-property - `transition-property` of range hover preview.
 * @cssproperty --media-preview-transition-duration-out - `transition-duration` out of range hover preview.
 * @cssproperty --media-preview-transition-delay-out - `transition-delay` out of range hover preview.
 * @cssproperty --media-preview-transition-duration-in - `transition-duration` in of range hover preview.
 * @cssproperty --media-preview-transition-delay-in - `transition-delay` in of range hover preview.
 *
 * @cssproperty --media-preview-thumbnail-background - `background` of range preview thumbnail.
 * @cssproperty --media-preview-thumbnail-box-shadow - `box-shadow` of range preview thumbnail.
 * @cssproperty --media-preview-thumbnail-max-width - `max-width` of range preview thumbnail.
 * @cssproperty --media-preview-thumbnail-max-height - `max-height` of range preview thumbnail.
 * @cssproperty --media-preview-thumbnail-min-width - `min-width` of range preview thumbnail.
 * @cssproperty --media-preview-thumbnail-min-height - `min-height` of range preview thumbnail.
 * @cssproperty --media-preview-thumbnail-border-radius - `border-radius` of range preview thumbnail.
 * @cssproperty --media-preview-thumbnail-border - `border` of range preview thumbnail.
 *
 * @cssproperty --media-preview-time-background - `background` of range preview time display.
 * @cssproperty --media-preview-time-border-radius - `border-radius` of range preview time display.
 * @cssproperty --media-preview-time-padding - `padding` of range preview time display.
 * @cssproperty --media-preview-time-margin - `margin` of range preview time display.
 * @cssproperty --media-preview-time-text-shadow - `text-shadow` of range preview time display.
 */
class MediaTimeRange extends MediaChromeRange {
  static get observedAttributes() {
    return [
      ...super.observedAttributes,
      MediaUIAttributes.MEDIA_PAUSED,
      MediaUIAttributes.MEDIA_DURATION,
      MediaUIAttributes.MEDIA_SEEKABLE,
      MediaUIAttributes.MEDIA_CURRENT_TIME,
      MediaUIAttributes.MEDIA_PREVIEW_IMAGE,
      MediaUIAttributes.MEDIA_PREVIEW_TIME,
      MediaUIAttributes.MEDIA_BUFFERED,
      MediaUIAttributes.MEDIA_PLAYBACK_RATE,
      MediaUIAttributes.MEDIA_LOADING,
      MediaUIAttributes.MEDIA_ENDED,
    ];
  }

  #refreshId = 0;
  #lastRangeIncrease = 0;
  #updateTimestamp;
  #updateCurrentTime;
  #boxes;
  #previewBox;
  #currentBox;
  #boxPaddingLeft;
  #boxPaddingRight;

  constructor() {
    super();

    const bufferedElement = document.createElement('div');
    bufferedElement.id = 'buffered';
    this.track.prepend(bufferedElement);

    this.container.appendChild(template.content.cloneNode(true));

    this.range.addEventListener('input', () => {
      // Cancel color bar refreshing when seeking.
      cancelAnimationFrame(this.#refreshId);
      this.#refreshId = 0;

      const detail = calcTimeFromRangeValue(this);
      const evt = new globalThis.CustomEvent(MediaUIEvents.MEDIA_SEEK_REQUEST, {
        composed: true,
        bubbles: true,
        detail,
      });
      this.dispatchEvent(evt);
    });

    // Come back to this feature
    // this.playIfNotReady = e => {
    //   this.range.removeEventListener('change', this.playIfNotReady);
    //   const media = this.media;
    //   media.play().then(this.setMediaTimeWithRange);
    // };

    this.#boxes = this.shadowRoot.querySelectorAll('[part~="box"]');
    this.#previewBox = this.shadowRoot.querySelector('[part~="preview-box"]');
    this.#currentBox = this.shadowRoot.querySelector('[part~="current-box"]');

    const computedStyle = getComputedStyle(this);
    this.#boxPaddingLeft = parseInt(computedStyle.getPropertyValue('--media-box-padding-left'));
    this.#boxPaddingRight = parseInt(computedStyle.getPropertyValue('--media-box-padding-right'));

    this.#enableBoxes();
  }

  connectedCallback() {
    super.connectedCallback();
    this.range.setAttribute('aria-label', nouns.SEEK());
    this.#toggleRefreshBar();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.#toggleRefreshBar();
  }

  attributeChangedCallback(attrName, oldValue, newValue) {
    super.attributeChangedCallback(attrName, oldValue, newValue);

    if (oldValue == newValue) return;

    if (
      attrName === MediaUIAttributes.MEDIA_CURRENT_TIME ||
      attrName === MediaUIAttributes.MEDIA_PAUSED ||
      attrName === MediaUIAttributes.MEDIA_ENDED ||
      attrName === MediaUIAttributes.MEDIA_LOADING ||
      attrName === MediaUIAttributes.MEDIA_DURATION ||
      attrName === MediaUIAttributes.MEDIA_SEEKABLE
    ) {
      this.#toggleRefreshBar();
      this.#updateFromMedia();
      updateAriaValueText(this);
    }
    else if (attrName === MediaUIAttributes.MEDIA_BUFFERED) {
      this.updateBufferedBar();
    }
    else if (attrName === 'disabled') {
      if (newValue == null) {
        this.#enableBoxes();
      } else {
        this.#disableBoxes();
      }
    }
  }

  #toggleRefreshBar() {
    if (this.#shouldRefreshBar()) {
      if (this.#refreshId === 0) {
        this.#updateFromMedia();
        this.#refreshId = requestAnimationFrame(this.#refreshBar);
      }
    } else {
      if (this.#refreshId !== 0) {
        this.#updateFromMedia();
        cancelAnimationFrame(this.#refreshId);
        this.#refreshId = 0;
      }
    }
  }

  #shouldRefreshBar() {
    return this.isConnected && !this.mediaPaused && !this.mediaLoading && !this.mediaEnded;
  }

  #updateFromMedia() {
    const value = calcRangeValueFromTime(this);
    this.#smoothUpdateBar(value);

    this.#updateCurrentTime = this.mediaCurrentTime;
    this.#updateTimestamp = performance.now();
  }

  #refreshBar = () => {
    if (!this.#shouldRefreshBar()) {
      this.#refreshId = 0;
      return;
    }

    const delta = (performance.now() - this.#updateTimestamp) / 1000;
    const time = this.#updateCurrentTime + delta * this.mediaPlaybackRate;
    let value = calcRangeValueFromTime(this, time);
    const increase = value - this.range.valueAsNumber;

    // If the increase is negative, the animation was faster than the playhead.
    // Can happen on video startup. Slow down the animation to match the playhead.
    if (increase > 0) {
      this.#lastRangeIncrease = increase;
    } else {
      this.#lastRangeIncrease = this.#lastRangeIncrease * .995;
      value = this.range.valueAsNumber + this.#lastRangeIncrease;
    }

    this.#smoothUpdateBar(value);
    this.#refreshId = requestAnimationFrame(this.#refreshBar);
  }

  #smoothUpdateBar(value) {
    const increase = value - this.range.valueAsNumber;

    // 1. Always allow increases.
    // 2. Allow a relatively large decrease (user action).
    if (increase > 0 || increase < -.03) {
      this.range.valueAsNumber = value;
      this.updateBar();
    }
  }

  /**
   * @type {boolean} Is the media paused
   */
  get mediaPaused() {
    return getBooleanAttr(this, MediaUIAttributes.MEDIA_PAUSED);
  }

  set mediaPaused(value) {
    setBooleanAttr(this, MediaUIAttributes.MEDIA_PAUSED, value);
  }

  /**
   * @type {boolean} Is the media loading
   */
  get mediaLoading() {
    return getBooleanAttr(this, MediaUIAttributes.MEDIA_LOADING);
  }

  set mediaLoading(value) {
    setBooleanAttr(this, MediaUIAttributes.MEDIA_LOADING, value);
  }

  /**
   * @type {number | undefined}
   */
  get mediaDuration() {
    return getNumericAttr(this, MediaUIAttributes.MEDIA_DURATION);
  }

  set mediaDuration(value) {
    setNumericAttr(this, MediaUIAttributes.MEDIA_DURATION, value);
  }

  /**
   * @type {number | undefined}
   */
  get mediaCurrentTime() {
    return getNumericAttr(this, MediaUIAttributes.MEDIA_CURRENT_TIME);
  }

  set mediaCurrentTime(value) {
    setNumericAttr(this, MediaUIAttributes.MEDIA_CURRENT_TIME, value);
  }

  /**
   * @type {number}
   */
  get mediaPlaybackRate() {
    return getNumericAttr(this, MediaUIAttributes.MEDIA_PLAYBACK_RATE, 1);
  }

  set mediaPlaybackRate(value) {
    setNumericAttr(this, MediaUIAttributes.MEDIA_PLAYBACK_RATE, value);
  }

  /**
   * @type {Array<Array<number>>} An array of ranges, each range being an array of two numbers.
   * e.g. [[1, 2], [3, 4]]
   */
  get mediaBuffered() {
    const buffered = this.getAttribute(MediaUIAttributes.MEDIA_BUFFERED);
    if (!buffered) return [];
    return buffered
      .split(' ')
      .map((timePair) => timePair.split(':').map((timeStr) => +timeStr));
  }

  set mediaBuffered(list) {
    if (!list) {
      this.removeAttribute(MediaUIAttributes.MEDIA_BUFFERED);
      return;
    }
    const strVal = list.map((tuple) => tuple.join(':')).join(' ');
    this.setAttribute(MediaUIAttributes.MEDIA_BUFFERED, strVal);
  }

  /**
   * Range of values that can be seeked to
   * @type {Array<number> | undefined} An array of two numbers [start, end]
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

  /**
   * @type {number | undefined}
   */
  get mediaSeekableEnd() {
    const [, end = this.mediaDuration] = this.mediaSeekable ?? [];
    return end;
  }

  get mediaSeekableStart() {
    const [start = 0] = this.mediaSeekable ?? [];
    return start;
  }

  /**
   * @type {string | undefined} The url of the preview image
   */
  get mediaPreviewImage() {
    return getStringAttr(this, MediaUIAttributes.MEDIA_PREVIEW_IMAGE);
  }

  set mediaPreviewImage(value) {
    setStringAttr(this, MediaUIAttributes.MEDIA_PREVIEW_IMAGE, value);
  }

  /**
   * @type {number | undefined}
   */
  get mediaPreviewTime() {
    return getNumericAttr(this, MediaUIAttributes.MEDIA_PREVIEW_TIME);
  }

  set mediaPreviewTime(value) {
    setNumericAttr(this, MediaUIAttributes.MEDIA_PREVIEW_TIME, value);
  }

  /**
   * @type {boolean | undefined}
   */
  get mediaEnded() {
    return getBooleanAttr(this, MediaUIAttributes.MEDIA_ENDED);
  }

  set mediaEnded(value) {
    setBooleanAttr(this, MediaUIAttributes.MEDIA_ENDED, value);
  }

  /* Add a buffered progress bar */
  updateBar() {
    super.updateBar();
    this.updateBufferedBar();
    this.updateCurrentBox();
  }

  updateBufferedBar() {
    const buffered = this.mediaBuffered;
    if (!buffered.length) {
      return;
    }

    // Find the buffered range that "contains" the current time and get its end.
    // If none, just assume the start of the media timeline for
    // visualization purposes.
    let relativeBufferedEnd;

    if (!this.mediaEnded) {
      const currentTime = this.mediaCurrentTime;
      const [, bufferedEnd = this.mediaSeekableStart] = buffered.find(
        ([start, end]) => start <= currentTime && currentTime <= end
      ) ?? [];
      relativeBufferedEnd = calcRangeValueFromTime(this, bufferedEnd);
    } else {
      // If we've ended, there may be some discrepancies between seekable end, duration, and current time.
      // In this case, just presume `relativeBufferedEnd` is the maximum possible value for visualization
      // purposes (CJP.)
      relativeBufferedEnd = 1;
    }

    const { style } = getOrInsertCSSRule(this.shadowRoot, '#buffered');
    style.setProperty('width', `${relativeBufferedEnd * 100}%`);
  }

  updateCurrentBox() {
    // If there are no elements in the current box no need for expensive style updates.
    // @ts-ignore
    if (!this.#currentBox.assignedElements().length) return;

    const boxPos = this.#getBoxPosition(this.#currentBox, this.range.valueAsNumber);
    const { style } = getOrInsertCSSRule(this.shadowRoot, '#current-rail');
    style.transform = `translateX(${boxPos})`;
  }

  #getBoxPosition(box, ratio) {
    let position = `${ratio * 100 * 100}%`;

    // Use offset dimensions to include borders.
    const boxWidth = box.offsetWidth;
    if (!boxWidth) return position;

    // Get the element that enforces the bounds for the time range boxes.
    const bounds =
      (this.getAttribute('bounds')
        ? closestComposedNode(this, `#${this.getAttribute('bounds')}`)
        : this.parentElement) ?? this;

    const rangeRect = this.range.getBoundingClientRect();
    const mediaBoundsRect = bounds.getBoundingClientRect();
    const boxMin = (this.#boxPaddingLeft - (rangeRect.left - mediaBoundsRect.left - boxWidth / 2)) / rangeRect.width * 100;
    const boxMax = (mediaBoundsRect.right - rangeRect.left - boxWidth / 2 - this.#boxPaddingRight) / rangeRect.width * 100;

    if (!Number.isNaN(boxMin)) position = `max(${boxMin * 100}%, ${position})`;
    if (!Number.isNaN(boxMax)) position = `min(${position}, ${boxMax * 100}%)`;

    return position;
  }

  #pointermoveHandler = (evt) => {
    // @ts-ignore
    const isOverBoxes = [...this.#boxes].some((b) => evt.composedPath().includes(b));

    if (!evt.composedPath().includes(this) || isOverBoxes) {
      this.#stopTrackingPointer();
      return;
    }

    this.updatePointerBar(evt);

    const duration = this.mediaDuration;
    // If no duration we can't calculate which time to show
    if (!duration) return;

    // Get mouse position percent
    const rangeRect = this.range.getBoundingClientRect();
    let mouseRatio = (evt.clientX - rangeRect.left) / rangeRect.width;
    // Lock between 0 and 1
    mouseRatio = Math.max(0, Math.min(1, mouseRatio));

    const boxPos = this.#getBoxPosition(this.#previewBox, mouseRatio);
    const { style } = getOrInsertCSSRule(this.shadowRoot, '#preview-rail');
    style.transform = `translateX(${boxPos})`;

    const detail = mouseRatio * duration;
    const mediaPreviewEvt = new globalThis.CustomEvent(
      MediaUIEvents.MEDIA_PREVIEW_REQUEST,
      { composed: true, bubbles: true, detail }
    );
    this.dispatchEvent(mediaPreviewEvt);
  };

  // Trigger when the mouse moves over the range
  #rangeEntered = false;

  #stopTrackingPointer() {
    this.#rangeEntered = false;
    globalThis.window?.removeEventListener('pointermove', this.#pointermoveHandler);

    const endEvt = new globalThis.CustomEvent(MediaUIEvents.MEDIA_PREVIEW_REQUEST, {
      composed: true,
      bubbles: true,
      detail: null,
    });
    this.dispatchEvent(endEvt);
  }

  #pointerenterHandler = () => {
    if (!this.#rangeEntered && this.mediaDuration) {
      this.#rangeEntered = true;
      globalThis.window?.addEventListener('pointermove', this.#pointermoveHandler);
    }
  };

  #enableBoxes() {
    this.addEventListener('pointerenter', this.#pointerenterHandler);
  }

  #disableBoxes() {
    this.removeEventListener('pointerenter', this.#pointerenterHandler);
    this.#stopTrackingPointer();
  }
}

if (!globalThis.customElements.get('media-time-range')) {
  globalThis.customElements.define('media-time-range', MediaTimeRange);
}

export default MediaTimeRange;
