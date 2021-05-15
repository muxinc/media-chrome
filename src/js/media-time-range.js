import MediaChromeRange from './media-chrome-range.js';
import { defineCustomElement } from './utils/defineCustomElement.js';
import { Window as window, Document as document } from './utils/server-safe-globals.js';
import MediaThumbnailPreviewElement from './media-thumbnail-preview-element.js';
import { mediaUIEvents } from './media-chrome-html-element.js';

const template = document.createElement('template');

template.innerHTML = `
  <style>
    #thumbnailContainer {
      display: none;
      position: absolute;
      top: 0;
    }

    media-thumbnail-preview {
      position: absolute;
      bottom: 10px;
      border: 2px solid #fff;
      border-radius: 2px;
      background-color: #000;
      width: 160px;
      height: 90px;

      /* Negative offset of half to center on the handle */
      margin-left: -80px;
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

    :host([media-preview-image]:hover) #thumbnailContainer {
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
    return ['thumbnails'].concat(super.observedAttributes || []);
  }

  constructor() {
    super();

    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.setMediaTimeWithRange = () => {
      const time = Math.round((this.range.value / 1000) * this.mediaDuration);

      this.dispatchMediaEvent(mediaUIEvents.MEDIA_SEEK_REQUEST, {
        detail: time
      });
    };
    this.range.addEventListener('input', this.setMediaTimeWithRange);

    // The following listeners need to be removeable
    this.updateRangeWithMediaTime = () => {
      this.range.value = Math.round(
        (this.mediaCurrentTime / this.mediaDuration) * 1000
      );

      this.updateBar();
    };

    // Come back to this feature
    // this.playIfNotReady = e => {
    //   this.range.removeEventListener('change', this.playIfNotReady);
    //   const media = this.media;
    //   media.play().then(this.setMediaTimeWithRange);
    // };

    this.enableThumbnails();
  }

  mediaCurrentTimeSet(time) {
    this.updateRangeWithMediaTime();
  }

  mediaDurationSet(time) {
    this.updateRangeWithMediaTime();
  }

  mediaBufferedSet(bufferedRanges) {
    this.updateBar();
  }

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

    if (!this.mediaBuffered || !this.mediaBuffered.length || this.mediaDuration <= 0) {
      return colorsArray;
    }

    const buffered = this.mediaBuffered;
    const buffPercent = (buffered[buffered.length-1][1] / this.mediaDuration) * 100;
    colorsArray.splice(1, 0, ['var(--media-time-buffered-color, #777)', buffPercent]);
    return colorsArray;
  }

  enableThumbnails() {
    this.thumbnailPreview = this.shadowRoot.querySelector('media-thumbnail-preview');
    const thumbnailContainer = this.shadowRoot.querySelector('#thumbnailContainer');
    thumbnailContainer.classList.add('enabled');

    let mouseMoveHandler;
    const trackMouse = () => {
      mouseMoveHandler = (evt) => {
        const duration = this.mediaDuration;

        // If no duration we can't calculate which time to show
        if (!duration) return;

        // Get mouse position percent
        const rangeRect = this.range.getBoundingClientRect();
        let mousePercent = (evt.clientX - rangeRect.left) / rangeRect.width;

        // Lock between 0 and 1
        mousePercent = Math.max(0, Math.min(1, mousePercent));

        // Get thumbnail center position
        const leftPadding = rangeRect.left - this.getBoundingClientRect().left;
        const thumbnailLeft = leftPadding + (mousePercent * rangeRect.width);

        this.thumbnailPreview.style.left = `${thumbnailLeft}px`;

        this.dispatchMediaEvent(mediaUIEvents.MEDIA_PREVIEW_REQUEST, {
          detail: mousePercent * duration
        });
      };
      window.addEventListener('mousemove', mouseMoveHandler, false);
    };

    const stopTrackingMouse = () => {
      window.removeEventListener('mousemove', mouseMoveHandler);
    };

    // Trigger when the mouse moves over the range
    let rangeEntered = false;
    let rangeMouseMoveHander = (evt) => {
      if (!rangeEntered && this.mediaDuration) {
        rangeEntered = true;
        this.thumbnailPreview.style.display = 'block';
        trackMouse();

        let offRangeHandler = (evt) => {
          if (evt.target != this && !this.contains(evt.target)) {
            this.thumbnailPreview.style.display = 'none';
            window.removeEventListener('mousemove', offRangeHandler);
            rangeEntered = false;
            stopTrackingMouse();
          }
        }
        window.addEventListener('mousemove', offRangeHandler, false);
      }

      if (!this.mediaDuration) {
        this.thumbnailPreview.style.display = 'none';
      }
    };
    this.addEventListener('mousemove', rangeMouseMoveHander, false);
  }
}

defineCustomElement('media-time-range', MediaTimeRange);

export default MediaTimeRange;
