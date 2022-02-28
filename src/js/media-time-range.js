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
      display: none;
    }

    media-thumbnail-preview {
      /* Scale the thumbnail preview to 50% and reposition appropriately to not take up too much real-estate. */
      transform: scale(0.5) translateY(50%) translateX(-100%);
      position: absolute;
      bottom: calc(100% + 5px);
      border: 2px solid #fff;
      border-radius: 2px;
      background-color: #000;
    }

    /* Can't get this working. Trying a downward triangle. */
    /* media-thumbnail-preview::after {
      content: "";
      display: block;
      width: 300px;
      height: 300px;
      margin: 100px;
      background-color: #ff0;
    } */

    :host([${MediaUIAttributes.MEDIA_PREVIEW_IMAGE}]:hover) #thumbnailContainer {
      display: block;
      animation: fadeIn ease 0.5s;
    }

    @keyframes fadeIn {
      0% {
        /* transform-origin: bottom center; */
        /* transform: scale(0.7); */
        margin-top: 10px;
        opacity: 0;
      }
      100% {
        /* transform-origin: bottom center; */
        /* transform: scale(1); */
        margin-top: 0;
        opacity: 1;
      }
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
    const buffPercent =
      (buffered[buffered.length - 1][1] / this.mediaDuration) * 100;
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
        const thumbnailLeft = leftPadding + mousePercent * rangeRect.width;

        this.thumbnailPreview.style.left = `${thumbnailLeft}px`;

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
