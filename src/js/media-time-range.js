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
    #thumbnailContainer {
      position: absolute;
      left: 0;
      top: 0;
      transition: visibility .25s, opacity .25s;
      visibility: hidden;
      opacity: 0;
    }

    media-thumbnail-preview {
      --thumb-min-width: var(--media-thumbnail-preview-min-width, 120px);
      --thumb-max-width: var(--media-thumbnail-preview-max-width, 200px);
      --thumb-min-height: var(--media-thumbnail-preview-min-height, 80px);
      --thumb-max-height: var(--media-thumbnail-preview-max-height, 160px);
      transform-origin: 50% 100%;
      position: absolute;
      bottom: calc(100% + 5px);
      border: var(--media-thumbnail-preview-border, 2px solid #fff);
      border-radius: var(--media-thumbnail-preview-border-radius, 2px);
      background-color: #000;
    }

    /*
      This is a downward triangle. Commented out for now because it would also
      require scaling the px properties below in JS; bottom and border-width.
    */
    /* media-thumbnail-preview::after {
      content: "";
      display: block;
      width: 0;
      height: 0;
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      bottom: -10px;
      border-left: 10px solid transparent;
      border-right: 10px solid transparent;
      border-top: 10px solid #fff;
    } */

    :host([${MediaUIAttributes.MEDIA_PREVIEW_IMAGE}]:hover) #thumbnailContainer {
      transition: visibility .5s, opacity .5s;
      visibility: visible;
      opacity: 1;
    }
  </style>
  <div id="thumbnailContainer">
    <media-thumbnail-preview></media-thumbnail-preview>
  </div>
`;

class MediaTimeRange extends MediaChromeRange {
  static get observedAttributes() {
    return [
      ...super.observedAttributes,
      'thumbnails',
      MediaUIAttributes.MEDIA_DURATION,
      MediaUIAttributes.MEDIA_CURRENT_TIME,
      MediaUIAttributes.MEDIA_PREVIEW_IMAGE,
      MediaUIAttributes.MEDIA_BUFFERED,
    ];
  }

  constructor() {
    super();

    this.shadowRoot.appendChild(template.content.cloneNode(true));

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
      this.range.value = +newValue;
      updateAriaValueText(this);
      this.updateBar();
    }
    if (attrName === MediaUIAttributes.MEDIA_DURATION) {
      // Since our range's step is 1, floor the max value to ensure reasonable rendering
      this.range.max = Math.floor(+newValue);
      updateAriaValueText(this);
      this.updateBar();
    }
    if (attrName === MediaUIAttributes.MEDIA_BUFFERED) {
      this.updateBar();
    }
    super.attributeChangedCallback(attrName, oldValue, newValue);
  }

  // mediaBufferedSet(bufferedRanges) {
  //   this.updateBar();
  // }

  // mediaSetCallback(media) {
  //   // Come back to this...
  //   // If readyState is supported, and the range is used before
  //   // the media is ready, use the play promise to set the time.
  //   // if (media.readyState !== undefined && media.readyState == 0) {
  //   //   // range.addEventListener('change', this.playIfNotReady);
  //   // }
  // }

  // mediaUnsetCallback(media) {
  //   // this.range.removeEventListener('change', this.playIfNotReady);
  //   // TODO: Reset value after media is unset
  // }

  get mediaDuration() {
    return +this.getAttribute(MediaUIAttributes.MEDIA_DURATION);
  }

  get mediaCurrentTime() {
    return +this.getAttribute(MediaUIAttributes.MEDIA_CURRENT_TIME);
  }

  get mediaBuffered() {
    const buffered = this.getAttribute(MediaUIAttributes.MEDIA_BUFFERED);
    if (buffered) {
      return buffered.split(' ').map((timePair) => timePair.split(':'));
    }
  }

  /* Add a buffered progress bar */
  getBarColors() {
    let colorsArray = super.getBarColors();

    if (
      !this.mediaBuffered ||
      !this.mediaBuffered.length ||
      this.mediaDuration <= 0
    ) {
      return colorsArray;
    }

    const buffered = this.mediaBuffered;
    let currentBufferedEnd = 0;
    for (const [start, end] of buffered) {
      if (this.mediaCurrentTime >= start && this.mediaCurrentTime <= end) {
        currentBufferedEnd = end;
        break;
      }
    }

    const buffPercent = (currentBufferedEnd / this.mediaDuration) * 100;
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
      '#thumbnailContainer'
    );
    thumbnailContainer.classList.add('enabled');

    let mouseMoveHandler;
    const trackMouse = () => {
      mouseMoveHandler = (evt) => {
        const duration = +this.getAttribute(MediaUIAttributes.MEDIA_DURATION);

        // If no duration we can't calculate which time to show
        if (!duration) return;

        // Get mouse position percent
        const rangeRect = this.range.getBoundingClientRect();
        let mousePercent = (evt.clientX - rangeRect.left) / rangeRect.width;

        // Lock between 0 and 1
        mousePercent = Math.max(0, Math.min(1, mousePercent));

        // Get thumbnail center position
        const leftPadding = rangeRect.left - this.getBoundingClientRect().left;
        const thumbnailOffset = leftPadding + mousePercent * rangeRect.width;

        const thumbStyle = getComputedStyle(this.thumbnailPreview);
        const thumbMinWidth = parseInt(
          thumbStyle.getPropertyValue('--thumb-min-width')
        );
        const thumbMaxWidth = parseInt(
          thumbStyle.getPropertyValue('--thumb-max-width')
        );
        const thumbMinHeight = parseInt(
          thumbStyle.getPropertyValue('--thumb-min-height')
        );
        const thumbMaxHeight = parseInt(
          thumbStyle.getPropertyValue('--thumb-max-height')
        );

        // Use client dimensions instead of offset dimensions to exclude borders.
        const { clientWidth, clientHeight } = this.thumbnailPreview;
        const maxThumbRatio = Math.min(
          thumbMaxWidth / clientWidth,
          thumbMaxHeight / clientHeight
        );
        const minThumbRatio = Math.max(
          thumbMinWidth / clientWidth,
          thumbMinHeight / clientHeight
        );
        const thumbnailLeft = thumbnailOffset - clientWidth / 2;
        // maxThumbRatio scales down and takes priority, minThumbRatio scales up.
        const thumbScale =
          maxThumbRatio < 1
            ? maxThumbRatio
            : minThumbRatio > 1
            ? minThumbRatio
            : 1;

        this.thumbnailPreview.style.transform = `translateX(${thumbnailLeft}px) scale(${thumbScale})`;
        this.thumbnailPreview.style.borderWidth = `${Math.round(
          2 / thumbScale
        )}px`;
        this.thumbnailPreview.style.borderRadius = `${Math.round(
          2 / thumbScale
        )}px`;

        const detail = mousePercent * duration;
        const mediaPreviewEvt = new window.CustomEvent(
          MediaUIEvents.MEDIA_PREVIEW_REQUEST,
          { composed: true, bubbles: true, detail }
        );
        this.dispatchEvent(mediaPreviewEvt);
      };
      window.addEventListener('mousemove', mouseMoveHandler, false);
    };

    const stopTrackingMouse = () => {
      window.removeEventListener('mousemove', mouseMoveHandler);
    };

    // Trigger when the mouse moves over the range
    let rangeEntered = false;
    let rangeMouseMoveHander = (evt) => {
      const mediaDurationStr = this.getAttribute(
        MediaUIAttributes.MEDIA_DURATION
      );
      if (!rangeEntered && mediaDurationStr) {
        rangeEntered = true;
        trackMouse();

        let offRangeHandler = (evt) => {
          if (evt.target != this && !this.contains(evt.target)) {
            window.removeEventListener('mousemove', offRangeHandler);
            rangeEntered = false;
            stopTrackingMouse();
          }
        };
        window.addEventListener('mousemove', offRangeHandler, false);
      }
    };
    this.addEventListener('mousemove', rangeMouseMoveHander, false);
  }
}

defineCustomElement('media-time-range', MediaTimeRange);

export default MediaTimeRange;
