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
  const currentTimePhrase = formatAsTimePhrase(+range.value);
  const totalTimePhrase = formatAsTimePhrase(+range.max);
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

  #boxes;
  #previewBox;
  #currentBox;
  #boxPaddingLeft;
  #boxPaddingRight;

  constructor() {
    super();

    this.container.appendChild(template.content.cloneNode(true));

    this.range.addEventListener('input', () => {
      // Cancel color bar refreshing when seeking.
      cancelAnimationFrame(this._refreshId);

      const newTime = this.range.value;
      const detail = newTime;
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

    this._refreshBar = () => {
      const delta = (performance.now() - this._updateTimestamp) / 1000;
      this.range.value = this.mediaCurrentTime + delta * this.mediaPlaybackRate;
      this.updateBar();
      this.updateCurrentBox();

      this._refreshId = requestAnimationFrame(this._refreshBar);
    };

    this.#boxes = this.shadowRoot.querySelectorAll('[part~="box"]');
    this.#previewBox = this.shadowRoot.querySelector('[part~="preview-box"]');
    this.#currentBox = this.shadowRoot.querySelector('[part~="current-box"]');

    const computedStyle = getComputedStyle(this);
    this.#boxPaddingLeft = parseInt(
      computedStyle.getPropertyValue('--media-box-padding-left')
    );
    this.#boxPaddingRight = parseInt(
      computedStyle.getPropertyValue('--media-box-padding-right')
    );

    this.#enableBoxes();
  }

  connectedCallback() {
    this.range.setAttribute('aria-label', nouns.SEEK());
    super.connectedCallback();
  }

  disconnectedCallback() {
    cancelAnimationFrame(this._refreshId);
    super.disconnectedCallback();
  }

  attributeChangedCallback(attrName, oldValue, newValue) {
    if (
      attrName === MediaUIAttributes.MEDIA_CURRENT_TIME ||
      attrName === MediaUIAttributes.MEDIA_PAUSED ||
      attrName === MediaUIAttributes.MEDIA_ENDED ||
      attrName === MediaUIAttributes.MEDIA_LOADING
    ) {
      this._updateTimestamp = performance.now();
      this.range.value = this.mediaCurrentTime;
      updateAriaValueText(this);
      this.updateBar();
      this.updateCurrentBox();

      cancelAnimationFrame(this._refreshId);
      if (!this.mediaPaused && !this.mediaLoading) {
        this._refreshId = requestAnimationFrame(this._refreshBar);
      }
    }
    if (attrName === MediaUIAttributes.MEDIA_DURATION) {
      this.range.max = this.#mediaSeekableEnd ?? this.mediaDuration ?? 1000;
      updateAriaValueText(this);
      this.updateBar();
      this.updateCurrentBox();
    }
    if (attrName === MediaUIAttributes.MEDIA_SEEKABLE) {
      this.range.min = this.#mediaSeekableStart ?? 0;
      this.range.max = this.#mediaSeekableEnd ?? this.mediaDuration ?? 1000;
      updateAriaValueText(this);
      this.updateBar();
    }
    if (attrName === MediaUIAttributes.MEDIA_BUFFERED) {
      this.updateBar();
    }
    if (attrName === 'disabled') {
      if (newValue == null) {
        this.#enableBoxes();
      } else {
        this.#disableBoxes();
      }
    }
    super.attributeChangedCallback(attrName, oldValue, newValue);
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
    const strVal = list.map((n1, n2) => `${n1}:${n2}`).join(' ');
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
  get #mediaSeekableEnd() {
    const [, end] = this.mediaSeekable ?? [];
    return end;
  }

  get #mediaSeekableStart() {
    const [start] = this.mediaSeekable ?? [];
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

  getRelativeValues() {
    const defaultRelativeValues = super.getRelativeValues();
    if (!this.mediaEnded) return defaultRelativeValues;
    return {
      ...defaultRelativeValues,
      relativeValue: defaultRelativeValues.relativeMax,
    };
  }

  /* Add a buffered progress bar */
  getBarColors() {
    let colorsArray = super.getBarColors();
    const { range } = this;
    const relativeMax = range.max - range.min;
    const buffered = this.mediaBuffered;

    if (!buffered.length || !Number.isFinite(relativeMax) || relativeMax <= 0) {
      return colorsArray;
    }

    // Find the buffered range that "contains" the current time and get its end.
    // If none, just assume the start of the media timeline/range.min for
    // visualization purposes.
    let relativeBufferedEnd;
    if (!this.mediaEnded) {
      const currentTime = this.mediaCurrentTime;
      const [, bufferedEnd = range.min] = buffered.find(
        ([start, end]) => start <= currentTime && currentTime <= end
      ) ?? [];
      relativeBufferedEnd = bufferedEnd - range.min;
    } else {
      // If we've ended, there may be some discrepancies between seekable end, duration, and current time.
      // In this case, just presume `relativeBufferedEnd` is the maximum possible value for visualization
      // purposes (CJP.)
      relativeBufferedEnd = relativeMax;
    }

    const buffPercent = (relativeBufferedEnd / relativeMax) * 100;
    colorsArray.splice(1, 0, [
      'var(--media-time-range-buffered-color, rgb(255 255 255 / .4))',
      buffPercent,
    ]);
    return colorsArray;
  }

  updateCurrentBox() {
    // If there are no elements in the current box no need for expensive style updates.
    // @ts-ignore
    if (!this.#currentBox.assignedElements().length) return;

    const boxRatio = this.range.value / (this.range.max - this.range.min);
    const boxPos = this.#getBoxPosition(this.#currentBox, boxRatio);
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
    if ([...this.#boxes].some((b) => evt.composedPath().includes(b))) return;

    this.updatePointerBar(evt);

    const duration = this.mediaDuration;
    // If no duration we can't calculate which time to show
    if (!duration) return;

    // Get mouse position percent
    const rangeRect = this.range.getBoundingClientRect();
    let mouseRatio = (evt.clientX - rangeRect.left - this.thumbWidth / 2) / (rangeRect.width - this.thumbWidth);
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

  #offRangeHandler = (evt) => {
    if (
      !evt.composedPath().includes(this) ||
      // @ts-ignore
      [...this.#boxes].some((b) => evt.composedPath().includes(b))
    ) {
      globalThis.window?.removeEventListener('pointermove', this.#offRangeHandler);
      this.#rangeEntered = false;
      this.#stopTrackingMouse();
    }
  };

  #trackMouse = () => {
    globalThis.window?.addEventListener('pointermove', this.#pointermoveHandler, false);
  };

  #stopTrackingMouse = () => {
    globalThis.window?.removeEventListener('pointermove', this.#pointermoveHandler);
    const endEvt = new globalThis.CustomEvent(MediaUIEvents.MEDIA_PREVIEW_REQUEST, {
      composed: true,
      bubbles: true,
      detail: null,
    });
    this.dispatchEvent(endEvt);
  };

  #rangepointermoveHandler = () => {
    const mediaDurationStr = this.getAttribute(
      MediaUIAttributes.MEDIA_DURATION
    );
    if (!this.#rangeEntered && mediaDurationStr) {
      this.#rangeEntered = true;
      this.#trackMouse();

      globalThis.window?.addEventListener('pointermove', this.#offRangeHandler, false);
    }
  };

  #enableBoxes() {
    this.addEventListener('pointermove', this.#rangepointermoveHandler, false);
  }

  #disableBoxes() {
    globalThis.window?.removeEventListener('pointermove', this.#offRangeHandler);
    this.removeEventListener('pointermove', this.#rangepointermoveHandler);
    this.#rangeEntered = false;
    this.#stopTrackingMouse();
  }
}

if (!globalThis.customElements.get('media-time-range')) {
  globalThis.customElements.define('media-time-range', MediaTimeRange);
}

export default MediaTimeRange;
