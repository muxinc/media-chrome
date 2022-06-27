import MediaChromeRange from './media-chrome-range.js';
import { defineCustomElement } from './utils/defineCustomElement.js';
import {
  Window as window,
  Document as document,
} from './utils/server-safe-globals.js';
import { MediaUIEvents, MediaUIAttributes } from './constants.js';
import { nouns } from './labels/labels.js';
import { formatAsTimePhrase } from './utils/time.js';

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
    [part~="box"] {
      display: inline-block;
      position: absolute;
      left: 0;
      bottom: calc(100% + 10px);
    }

    [part~="preview-box"] {
      transition: visibility .25s, opacity .25s;
      visibility: hidden;
      opacity: 0;
    }

    media-thumbnail-preview {
      background-color: #000;
      max-width: var(--media-thumbnail-preview-max-width, 180px);
      max-height: var(--media-thumbnail-preview-max-height, 160px);
      min-width: var(--media-thumbnail-preview-min-width, 120px);
      min-height: var(--media-thumbnail-preview-min-height, 80px);
      border: var(--media-thumbnail-preview-border, 2px solid #fff);
      border-radius: var(--media-thumbnail-preview-border-radius, 2px);
    }

    :host([${MediaUIAttributes.MEDIA_PREVIEW_IMAGE}]:hover) [part~="preview-box"] {
      transition: visibility .5s, opacity .5s;
      visibility: visible;
      opacity: 1;
    }

    #range-hover {
      /* Add z-index so it overlaps the top of the control buttons if they are right under. */
      z-index: 1;
      display: none;
      box-sizing: border-box;
      position: absolute;
      left: var(--media-range-padding-left, 10px);
      right: var(--media-range-padding-right, 10px);
      bottom: var(--media-time-range-hover-bottom, -5px);
      height: var(--media-time-range-hover-height, max(calc(100% + 5px), 20px));
    }

    :host(:hover) #range-hover {
      display: block;
    }

    #range {
      z-index: 2;
      position: relative;
      height: var(--media-range-track-height, 4px);
    }
  </style>
  <span part="box preview-box">
    <slot name="preview">
      <media-thumbnail-preview></media-thumbnail-preview>
    </slot>
  </span>
  <span part="box current-box">
    <slot name="current">
      <!-- Example: add the current time to the playhead -->
      <!-- <media-current-time-display></media-current-time-display> -->
    </slot>
  </span>
  <div id="range-hover"></div>
  <div id="range-temp"></div>
`;

class MediaTimeRange extends MediaChromeRange {
  static get observedAttributes() {
    return [
      ...super.observedAttributes,
      'thumbnails',
      MediaUIAttributes.MEDIA_DURATION,
      MediaUIAttributes.MEDIA_SEEKABLE,
      MediaUIAttributes.MEDIA_CURRENT_TIME,
      MediaUIAttributes.MEDIA_PREVIEW_IMAGE,
      MediaUIAttributes.MEDIA_BUFFERED,
    ];
  }

  constructor() {
    super();

    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.shadowRoot.querySelector('#range-temp').replaceWith(this.range);

    this.range.addEventListener('input', () => {
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

    this.enableThumbnails();
  }

  connectedCallback() {
    this.range.setAttribute('aria-label', nouns.SEEK());
    super.connectedCallback();
  }

  attributeChangedCallback(attrName, oldValue, newValue) {
    if (attrName === MediaUIAttributes.MEDIA_CURRENT_TIME) {
      this.range.value = this.mediaCurrentTime;
      updateAriaValueText(this);
      this.updateBar();
      this.updateCurrentBox();
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
    // Use mediaCurrentTime instead of range.value for precision (CJP)
    const currentTime = this.mediaCurrentTime;
    const relativeMax = range.max - range.min;
    const buffered = this.mediaBuffered;

    if (!buffered.length || !Number.isFinite(relativeMax) || relativeMax <= 0) {
      return colorsArray;
    }

    // Find the buffered range that "contains" the current time and get its end. If none, just assume the
    // start of the media timeline/range.min for visualization purposes.
    const [, bufferedEnd = range.min] =
      buffered.find(
        ([start, end]) => start <= currentTime && currentTime <= end
      ) ?? [];
    const relativeBufferedEnd = bufferedEnd - range.min;

    const buffPercent = (relativeBufferedEnd / relativeMax) * 100;
    colorsArray.splice(1, 0, [
      'var(--media-time-buffered-color, #777)',
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

  enableThumbnails() {
    const boxes = this.shadowRoot.querySelectorAll('[part~="box"]');
    const previewBox = this.shadowRoot.querySelector('[part~="preview-box"]');

    let pointermoveHandler;
    const trackMouse = () => {
      pointermoveHandler = (evt) => {
        if ([...boxes].some((b) => evt.composedPath().includes(b))) return;

        const duration = +this.getAttribute(MediaUIAttributes.MEDIA_DURATION);
        // If no duration we can't calculate which time to show
        if (!duration) return;

        // Get mouse position percent
        const rangeRect = this.range.getBoundingClientRect();
        let mousePercent = (evt.clientX - rangeRect.left) / rangeRect.width;
        // Lock between 0 and 1
        mousePercent = Math.max(0, Math.min(1, mousePercent));

        const boxPos = getBoxPosition(this, previewBox, mousePercent);
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
      };
      window.addEventListener('pointermove', pointermoveHandler, false);
    };

    const stopTrackingMouse = () => {
      window.removeEventListener('pointermove', pointermoveHandler);
      const endEvt = new window.CustomEvent(
        MediaUIEvents.MEDIA_PREVIEW_REQUEST,
        { composed: true, bubbles: true, detail: null }
      );
      this.dispatchEvent(endEvt);
    };

    // Trigger when the mouse moves over the range
    let rangeEntered = false;
    let rangepointermoveHander = () => {
      const mediaDurationStr = this.getAttribute(
        MediaUIAttributes.MEDIA_DURATION
      );
      if (!rangeEntered && mediaDurationStr) {
        rangeEntered = true;
        trackMouse();

        let offRangeHandler = (evt) => {
          if (
            !evt.composedPath().includes(this) ||
            [...boxes].some((b) => evt.composedPath().includes(b))
          ) {
            window.removeEventListener('pointermove', offRangeHandler);
            rangeEntered = false;
            stopTrackingMouse();
          }
        };
        window.addEventListener('pointermove', offRangeHandler, false);
      }
    };
    this.addEventListener('pointermove', rangepointermoveHander, false);
  }
}

/**
 * Get or insert a CSS rule with a selector in an element containing <style> tags.
 * @param  {Element} styleParent
 * @param  {string} selectorText
 * @return {CSSStyleRule|undefined}
 */
function getOrInsertCSSRule(styleParent, selectorText) {
  let style;
  for (style of styleParent.querySelectorAll('style')) {
    for (let rule of style.sheet.cssRules)
      if (rule.selectorText === selectorText) return rule;
  }
  style.sheet.insertRule(`${selectorText}{}`, style.sheet.cssRules.length);
  return style.sheet.cssRules[style.sheet.cssRules.length - 1];
}

function getBoxPosition(el, box, percent) {
  const rect = el.getBoundingClientRect();
  const rangeRect = el.range.getBoundingClientRect();

  // Get preview box center position
  const leftPadding = rangeRect.left - rect.left;
  const rightPadding = rect.right - rangeRect.right;
  const boxOffset = leftPadding + percent * rangeRect.width;

  // Use offset dimensions to include borders.
  const boxWidth = box.offsetWidth;
  const boxLeft = boxOffset - boxWidth / 2;

  // Get the element that enforces the bounding box for the hover preview.
  const mediaBounds = el.getAttribute('media-bounds')
    ? document.getElementById(el.getAttribute('media-bounds'))
    : el.parentElement;

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
