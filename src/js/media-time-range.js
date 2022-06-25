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
    #thumbnail-container {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      transition: visibility .25s, opacity .25s;
      visibility: hidden;
      opacity: 0;
    }

    media-thumbnail-preview {
      max-width: var(--media-thumbnail-preview-max-width, 180px);
      max-height: var(--media-thumbnail-preview-max-height, 160px);
      min-width: var(--media-thumbnail-preview-min-width, 120px);
      min-height: var(--media-thumbnail-preview-min-height, 80px);
      width: 100%;
      position: absolute;
      bottom: calc(100% + 5px);
      border: var(--media-thumbnail-preview-border, 2px solid #fff);
      border-radius: var(--media-thumbnail-preview-border-radius, 2px);
    }

    :host([${MediaUIAttributes.MEDIA_PREVIEW_IMAGE}]:hover) #thumbnail-container {
      transition: visibility .5s, opacity .5s;
      visibility: visible;
      opacity: 1;
    }

    #time-range-container {
      z-index: 3;
      position: relative;
      height: 100%;
      cursor: pointer;
    }

    #time-range-hover-padding {
      display: none;
      position: absolute;
      left: 0;
      right: 0;
      bottom: var(--media-time-range-hover-bottom, -5px);
      height: var(--media-time-range-hover-height, max(calc(100% + 5px), 20px));
    }

    #time-range-container:hover #time-range-hover-padding {
      display: block;
    }
  </style>
  <div id="thumbnail-container">
    <media-thumbnail-preview></media-thumbnail-preview>
  </div>
  <div id="time-range-container">
    <div id="time-range-hover-padding"></div>
  </div>
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

    const container = this.shadowRoot.querySelector('#time-range-container');
    container.append(this.range);

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
    }
    if (attrName === MediaUIAttributes.MEDIA_DURATION) {
      // Since our range's step is 1, floor the max value to ensure reasonable rendering
      this.range.max = Math.floor(this.mediaSeekableEnd ?? this.mediaDuration ?? 1000);
      updateAriaValueText(this);
      this.updateBar();
    }
    if (attrName === MediaUIAttributes.MEDIA_SEEKABLE) {
      this.range.min = this.mediaSeekableStart ?? 0;
      // Since our range's step is 1, floor the max value to ensure reasonable rendering
      this.range.max = Math.floor(this.mediaSeekableEnd ?? this.mediaDuration ?? 1000);
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
    return buffered.split(' ').map((timePair) => timePair.split(':').map(timeStr => +timeStr));
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
    const [, bufferedEnd = range.min] = buffered.find(([start, end]) => start <= currentTime && currentTime <= end) ?? [];
    const relativeBufferedEnd = bufferedEnd - range.min;

    const buffPercent = (relativeBufferedEnd / relativeMax) * 100;
    colorsArray.splice(1, 0, [
      'var(--media-time-buffered-color, #777)',
      buffPercent,
    ]);
    return colorsArray;
  }

  enableThumbnails() {
    this.thumbnailPreview = this.shadowRoot.querySelector(
      'media-thumbnail-preview'
    );
    const thumbnailContainer = this.shadowRoot.querySelector(
      '#thumbnail-container'
    );
    thumbnailContainer.classList.add('enabled');

    let pointermoveHandler;
    const trackMouse = () => {
      pointermoveHandler = (evt) => {
        const duration = +this.getAttribute(MediaUIAttributes.MEDIA_DURATION);

        // If no duration we can't calculate which time to show
        if (!duration) return;

        // Get mouse position percent
        const rect = this.getBoundingClientRect();
        const rangeRect = this.range.getBoundingClientRect();
        let mousePercent = (evt.clientX - rangeRect.left) / rangeRect.width;

        // Lock between 0 and 1
        mousePercent = Math.max(0, Math.min(1, mousePercent));

        // Get thumbnail center position
        const leftPadding = rangeRect.left - rect.left;
        const thumbnailOffset = leftPadding + mousePercent * rangeRect.width;

        // Use client dimensions instead of offset dimensions to exclude borders.
        const { clientWidth, clientHeight } = this.thumbnailPreview;
        const thumbnailLeft = thumbnailOffset - clientWidth / 2;

        this.thumbnailPreview.style.transform = `translateX(${thumbnailLeft}px)`;

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
        {composed: true, bubbles: true, detail: null}
      );
      this.dispatchEvent(endEvt);
    };

    // Trigger when the mouse moves over the range
    let rangeEntered = false;
    let rangepointermoveHander = (evt) => {
      const mediaDurationStr = this.getAttribute(
        MediaUIAttributes.MEDIA_DURATION
      );
      if (!rangeEntered && mediaDurationStr) {
        rangeEntered = true;
        trackMouse();

        let offRangeHandler = (evt) => {
          if (
            !evt.composedPath().includes(this) ||
            evt.composedPath().includes(thumbnailContainer)
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

defineCustomElement('media-time-range', MediaTimeRange);

export default MediaTimeRange;
