import MediaChromeRange from './media-chrome-range.js';
import { defineCustomElement } from './utils/defineCustomElement.js';
import {
  Window as window,
  Document as document,
} from './utils/server-safe-globals.js';
import { MediaUIEvents, MediaUIAttributes } from './constants.js';
import { nouns } from './labels/labels.js';
import { formatAsTimePhrase } from './utils/time.js';
import { getOrInsertCSSRule } from './utils/element-utils.js';

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
template.innerHTML = `
  <style>
    :host {
      --media-preview-background-color: rgba(20,20,30, .5);
      --media-preview-background: var(--media-control-background,
        var(--media-preview-background-color));
      --media-preview-border-radius: 3px;
      --media-box-padding-left: 10px;
      --media-box-padding-right: 10px;
      color: #fff;
    }

    [part~="box"] {
      display: flex;
      flex-direction: column;
      align-items: center;
      position: absolute;
      left: 0;
      bottom: 100%;
    }

    [part~="preview-box"] {
      transition: visibility .25s, opacity .25s;
      visibility: hidden;
      opacity: 0;
    }

    media-preview-thumbnail,
    ::slotted(media-preview-thumbnail) {
      visibility: hidden;
      transition: visibility 0s .25s;
      background: var(--media-preview-time-background, var(--media-preview-background));
      box-shadow: var(--media-preview-thumbnail-box-shadow, 0 0 4px rgba(0,0,0, .2));
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
      transition-delay: 0s;
      visibility: visible;
    }

    media-preview-time-display,
    ::slotted(media-preview-time-display) {
      color: unset;
      min-width: 0;
      ${/* delay changing these CSS props until the preview box transition is ended */''}
      transition: min-width 0s .25s, border-radius 0s .25s;
      background: var(--media-preview-time-background, var(--media-preview-background));
      border-radius: var(--media-preview-time-border-radius,
        var(--media-preview-border-radius) var(--media-preview-border-radius)
        var(--media-preview-border-radius) var(--media-preview-border-radius));
      padding: var(--media-preview-time-padding, 1px 10px 0);
      margin: var(--media-preview-time-margin, 0 0 10px);
      text-shadow: var(--media-preview-time-text-shadow, 0 0 4px rgba(0,0,0, .75));
    }

    :host([${MediaUIAttributes.MEDIA_PREVIEW_IMAGE}]) media-preview-time-display,
    :host([${MediaUIAttributes.MEDIA_PREVIEW_IMAGE}]) ::slotted(media-preview-time-display) {
      transition-delay: 0s;
      min-width: 100%;
      border-radius: var(--media-preview-time-border-radius,
        0 0 var(--media-preview-border-radius) var(--media-preview-border-radius));
    }

    :host([${MediaUIAttributes.MEDIA_PREVIEW_IMAGE}]:hover) [part~="preview-box"],
    :host([${MediaUIAttributes.MEDIA_PREVIEW_TIME}]:hover) [part~="preview-box"] {
      transition: visibility .5s, opacity .5s;
      visibility: visible;
      opacity: 1;
    }

    :host([${MediaUIAttributes.MEDIA_PREVIEW_TIME}]:hover) {
      --media-time-range-hover-display: block;
    }
  </style>
  <span part="box preview-box">
    <slot name="preview">
      <media-preview-thumbnail></media-preview-thumbnail>
      <media-preview-time-display></media-preview-time-display>
    </slot>
  </span>
  <span part="box current-box">
    <slot name="current">
      ${/* Example: add the current time to the playhead
        <media-current-time-display></media-current-time-display> */''}
    </slot>
  </span>
`;

class MediaTimeRange extends MediaChromeRange {
  static get observedAttributes() {
    return [
      ...super.observedAttributes,
      'thumbnails',
      'disabled',
      MediaUIAttributes.MEDIA_PAUSED,
      MediaUIAttributes.MEDIA_DURATION,
      MediaUIAttributes.MEDIA_SEEKABLE,
      MediaUIAttributes.MEDIA_CURRENT_TIME,
      MediaUIAttributes.MEDIA_PREVIEW_IMAGE,
      MediaUIAttributes.MEDIA_PREVIEW_TIME,
      MediaUIAttributes.MEDIA_BUFFERED,
      MediaUIAttributes.MEDIA_PLAYBACK_RATE,
      MediaUIAttributes.MEDIA_LOADING,
    ];
  }

  #boxes;
  #previewBox;

  constructor() {
    super();

    this.shadowRoot.appendChild(template.content.cloneNode(true));

    this.range.addEventListener('input', () => {
      // Cancel color bar refreshing when seeking.
      cancelAnimationFrame(this._refreshId);

      const newTime = this.range.value;
      const detail = newTime;
      const evt = new window.CustomEvent(MediaUIEvents.MEDIA_SEEK_REQUEST, {
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
      // Since our range's step is 1, floor the max value to ensure reasonable rendering
      this.range.max = Math.floor(
        this.mediaSeekableEnd ?? this.mediaDuration ?? 1000
      );
      updateAriaValueText(this);
      this.updateBar();
      this.updateCurrentBox();
    }
    if (attrName === MediaUIAttributes.MEDIA_SEEKABLE) {
      this.range.min = this.mediaSeekableStart ?? 0;
      // Since our range's step is 1, floor the max value to ensure reasonable rendering
      this.range.max = Math.floor(
        this.mediaSeekableEnd ?? this.mediaDuration ?? 1000
      );
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

  get mediaPaused() {
    return this.hasAttribute(MediaUIAttributes.MEDIA_PAUSED);
  }

  get mediaLoading() {
    return this.hasAttribute(MediaUIAttributes.MEDIA_LOADING);
  }

  get mediaDuration() {
    const attrVal = this.getAttribute(MediaUIAttributes.MEDIA_DURATION);
    return attrVal != null ? +attrVal : undefined;
  }

  get mediaCurrentTime() {
    const attrVal = this.getAttribute(MediaUIAttributes.MEDIA_CURRENT_TIME);
    return attrVal != null ? +attrVal : undefined;
  }

  get mediaPlaybackRate() {
    const attrVal = this.getAttribute(MediaUIAttributes.MEDIA_PLAYBACK_RATE);
    return attrVal != null ? +attrVal : 1;
  }

  get mediaBuffered() {
    const buffered = this.getAttribute(MediaUIAttributes.MEDIA_BUFFERED);
    if (!buffered) return [];
    return buffered
      .split(' ')
      .map((timePair) => timePair.split(':').map((timeStr) => +timeStr));
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
    // Use mediaCurrentTime instead of range.value for precision (CJP)
    const currentTime = this.mediaCurrentTime;
    const [, bufferedEnd = range.min] =
      buffered.find(
        ([start, end]) => start <= currentTime && currentTime <= end
      ) ?? [];
    const relativeBufferedEnd = bufferedEnd - range.min;

    const buffPercent = (relativeBufferedEnd / relativeMax) * 100;
    colorsArray.splice(1, 0, [
      'var(--media-time-buffered-color, rgba(255,255,255, .4))',
      buffPercent,
    ]);
    return colorsArray;
  }

  updateCurrentBox() {
    const currentBox = this.shadowRoot.querySelector('[part~="current-box"]');
    const percent = this.range.value / (this.range.max - this.range.min);
    const boxPos = getBoxPosition(this, currentBox, percent);
    const { style } = getOrInsertCSSRule(
      this.shadowRoot,
      '[part~="current-box"]'
    );
    style.transform = `translateX(${boxPos}px)`;
  }

  #pointermoveHandler = (evt) => {
    // @ts-ignore
    if ([...this.#boxes].some((b) => evt.composedPath().includes(b))) return;

    this.updatePointerBar(evt);

    const duration = +this.getAttribute(MediaUIAttributes.MEDIA_DURATION);
    // If no duration we can't calculate which time to show
    if (!duration) return;

    // Get mouse position percent
    const rangeRect = this.range.getBoundingClientRect();
    let mousePercent = (evt.clientX - rangeRect.left) / rangeRect.width;
    // Lock between 0 and 1
    mousePercent = Math.max(0, Math.min(1, mousePercent));

    const boxPos = getBoxPosition(this, this.#previewBox, mousePercent);
    const { style } = getOrInsertCSSRule(
      this.shadowRoot,
      '[part~="preview-box"]'
    );
    style.transform = `translateX(${boxPos}px)`;

    const detail = mousePercent * duration;
    const mediaPreviewEvt = new window.CustomEvent(
      MediaUIEvents.MEDIA_PREVIEW_REQUEST,
      { composed: true, bubbles: true, detail }
    );
    this.dispatchEvent(mediaPreviewEvt);
  }

  // Trigger when the mouse moves over the range
  #rangeEntered = false

  #offRangeHandler = (evt) => {
    if (
      !evt.composedPath().includes(this) ||
      // @ts-ignore
      [...this.#boxes].some((b) => evt.composedPath().includes(b))
    ) {
      window.removeEventListener('pointermove', this.#offRangeHandler);
      this.#rangeEntered = false;
      this.#stopTrackingMouse();
    }
  }

  #trackMouse = () => {
    window.addEventListener('pointermove', this.#pointermoveHandler, false);
  }

  #stopTrackingMouse = () => {
    window.removeEventListener('pointermove', this.#pointermoveHandler);
    const endEvt = new window.CustomEvent(
      MediaUIEvents.MEDIA_PREVIEW_REQUEST,
      { composed: true, bubbles: true, detail: null }
    );
    this.dispatchEvent(endEvt);
  }

  #rangepointermoveHandler = () => {
    const mediaDurationStr = this.getAttribute(
      MediaUIAttributes.MEDIA_DURATION
    );
    if (!this.#rangeEntered && mediaDurationStr) {
      this.#rangeEntered = true;
      this.#trackMouse();

      window.addEventListener('pointermove', this.#offRangeHandler, false);
    }
  }

  #enableBoxes() {
    this.addEventListener('pointermove', this.#rangepointermoveHandler, false);
  }

  #disableBoxes() {
    window.removeEventListener('pointermove', this.#offRangeHandler);
    this.removeEventListener('pointermove', this.#rangepointermoveHandler);
    this.#rangeEntered = false;
    this.#stopTrackingMouse();
  }
}

function getBoxPosition(el, box, percent) {
  const rect = el.getBoundingClientRect();
  const rangeRect = el.range.getBoundingClientRect();

  // Get preview box center position
  const leftPadding = parseInt(
    getComputedStyle(el).getPropertyValue('--media-box-padding-left')
  );
  const rightPadding = parseInt(
    getComputedStyle(el).getPropertyValue('--media-box-padding-right')
  );
  const boxOffset = leftPadding + percent * rangeRect.width;

  // Use offset dimensions to include borders.
  const boxWidth = box.offsetWidth;
  const boxLeft = boxOffset - boxWidth / 2;

  // Get the element that enforces the bounding box for the hover preview.
  const mediaBounds =
    (el.getAttribute('media-bounds')
      ? document.getElementById(el.getAttribute('media-bounds'))
      : el.parentElement) ?? el;

  const mediaBoundsRect = mediaBounds.getBoundingClientRect();
  const offsetLeft = rect.left - mediaBoundsRect.left;
  const offsetRight =
    mediaBoundsRect.right - rect.left - boxWidth - rightPadding;
  const boxMin = leftPadding - offsetLeft;
  const boxMax = offsetRight;

  return Math.max(boxMin, Math.min(boxLeft, boxMax));
}

defineCustomElement('media-time-range', MediaTimeRange);

export default MediaTimeRange;
