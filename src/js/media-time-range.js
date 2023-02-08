import MediaChromeRange from './media-chrome-range.js';
import { window, document } from './utils/server-safe-globals.js';
import { MediaUIEvents, MediaUIAttributes } from './constants.js';
import { nouns } from './labels/labels.js';
import { formatAsTimePhrase } from './utils/time.js';
import { getOrInsertCSSRule, closestComposedNode } from './utils/element-utils.js';

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



      --media-preview-border-radius: 3px;
      --media-box-padding-left: 10px;
      --media-box-padding-right: 10px;
    }

    #preview-rail,
    #current-rail {
      ${/* 1% of parent element and upscale by 100 in the translateX() */''}
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
      background: var(--media-preview-time-background, var(--media-preview-background, var(--media-control-background, var(--media-secondary-color, rgb(20 20 30 / 0.7)))));
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
      transition-delay: var(--media-preview-transition-delay-in, .25s);
      visibility: visible;
    }

    media-preview-time-display,
    ::slotted(media-preview-time-display) {
      min-width: 0;
      ${/* delay changing these CSS props until the preview box transition is ended */''}
      transition: min-width 0s, border-radius 0s;
      transition-delay: calc(var(--media-preview-transition-delay-out, 0s) + var(--media-preview-transition-duration-out, .25s));
      background: var(--media-preview-time-background, var(--media-preview-background, var(--media-control-background, var(--media-secondary-color, rgb(20 20 30 / 0.7)))));
      border-radius: var(--media-preview-time-border-radius,
        var(--media-preview-border-radius) var(--media-preview-border-radius)
        var(--media-preview-border-radius) var(--media-preview-border-radius));
      padding: var(--media-preview-time-padding, 1px 10px 0);
      margin: var(--media-preview-time-margin, 0 0 10px);
      text-shadow: var(--media-preview-time-text-shadow, 0 0 4px rgba(0,0,0, .75));
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
        <media-current-time-display></media-current-time-display> */''}
    </slot>
  </div>
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
      this.range.max = this.mediaSeekableEnd ?? this.mediaDuration ?? 1000;
      updateAriaValueText(this);
      this.updateBar();
      this.updateCurrentBox();
    }
    if (attrName === MediaUIAttributes.MEDIA_SEEKABLE) {
      this.range.min = this.mediaSeekableStart ?? 0;
      this.range.max = this.mediaSeekableEnd ?? this.mediaDuration ?? 1000;
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
    // If there are no elements in the current box no need for expensive style updates.
    // @ts-ignore
    if (!this.#currentBox.assignedElements().length) return;

    const boxRatio = this.range.value / (this.range.max - this.range.min);
    const boxPos = this.#getBoxPosition(this.#currentBox, boxRatio);
    const { style } = getOrInsertCSSRule(
      this.shadowRoot,
      '#current-rail'
    );
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

    const duration = +this.getAttribute(MediaUIAttributes.MEDIA_DURATION);
    // If no duration we can't calculate which time to show
    if (!duration) return;

    // Get mouse position percent
    const rangeRect = this.range.getBoundingClientRect();
    let mouseRatio = (evt.clientX - rangeRect.left) / rangeRect.width;
    // Lock between 0 and 1
    mouseRatio = Math.max(0, Math.min(1, mouseRatio));

    const boxPos = this.#getBoxPosition(this.#previewBox, mouseRatio);
    const { style } = getOrInsertCSSRule(
      this.shadowRoot,
      '#preview-rail'
    );
    style.transform = `translateX(${boxPos})`;

    const detail = mouseRatio * duration;
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

if (!window.customElements.get('media-time-range')) {
  window.customElements.define('media-time-range', MediaTimeRange);
}

export default MediaTimeRange;
