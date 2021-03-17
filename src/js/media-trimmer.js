import MediaChromeHTMLElement from './media-chrome-html-element.js';
import { defineCustomElement } from './utils/defineCustomElement.js';
import { createTemplate } from './utils/createTemplate.js';
import { Window } from './utils/browser-env.js';
import MediaThumbnailPreviewElement from './media-thumbnail-preview-element.js';

const template = createTemplate();

template.innerHTML = `
  <style>
    #trimmerContainer {
      background-color: #ccc;
      height: 100%;
      width: 100%;
      display: flex;
    }

    #selection {
      height: 100%;
      background-color: red;
      width: 25%;
      margin-left: 25%;
      display: flex;
    }

    #startHandle, #endHandle {
      cursor: pointer;
      height: 110%;
      width: 5px;
      background-color: blue;
    }

    .spacer {
      flex: 1;
    }

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

    :host(:hover) #thumbnailContainer.enabled {
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
  <div id="trimmerContainer">
    <div id="selection">
      <div id="startHandle">
      </div>
      <div class="spacer"></div>
      <div id="endHandle">
      </div>
    </div>
  </div>
`;

class MediaTrimmer extends MediaChromeHTMLElement {
  static get observedAttributes() {
    return ['thumbnails'].concat(super.observedAttributes || []);
  }

  constructor() {
    super();

    var shadow = this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.wrapper = this.shadowRoot.querySelector('#trimmerContainer');
    this._clickHandler = this.handleClick.bind(this);
    /*
     * TODO - teardown this click handler
     */
    this.wrapper.addEventListener('click', this._clickHandler);


    /*
    this.setMediaTimeWithRange = () => {
      const media = this.media;
      const range = this.range;

      // Can't set the time before the media is ready
      // Ignore if readyState isn't supported
      if (media.readyState > 0 || media.readyState === undefined) {
        media.currentTime = Math.round((range.value / 1000) * media.duration);
      }
    };
    // this.range.addEventListener('input', this.setMediaTimeWithRange);

    // The following listeners need to be removeable
    this.updateRangeWithMediaTime = () => {
      const media = this.media;
      this.range.value = Math.round(
        (media.currentTime / media.duration) * 1000
      );

      this.updateBar();
    };

    this.playIfNotReady = e => {
      this.range.removeEventListener('change', this.playIfNotReady);
      const media = this.media;
      media.play().then(this.setMediaTimeWithRange);
    };
    */
  }

  /*
   * pass in a mouse event (evt.clientX)
   * calculates the percentage progress based on the bounding rectang
   * converts the percentage progress into a duration in seconds
   */
  getPlayheadBasedOnMouseEvent (evt) {
    const duration = this.media && this.media.duration;
    if (!duration) return;
    let mousePercent = this.getMousePercent(evt);
    mousePercent = Math.max(0, Math.min(1, mousePercent));
    return (mousePercent * duration);
  }

  getMousePercent (evt) {
    const rangeRect = this.wrapper.getBoundingClientRect();
    const mousePercent = (evt.clientX - rangeRect.left) / rangeRect.width;
    // Lock between 0 and 1
    return Math.max(0, Math.min(1, mousePercent));
  }

  handleClick (evt) {
    const playhead = this.getPlayheadBasedOnMouseEvent(evt);
    console.log('debug', playhead);
  }

  mediaSetCallback(media) {
    super.mediaSetCallback(media);

    const range = this.range;

    media.addEventListener('timeupdate', this.updateRangeWithMediaTime);

    // If readyState is supported, and the range is used before
    // the media is ready, use the play promise to set the time.
    if (media.readyState !== undefined && media.readyState == 0) {
      // range.addEventListener('change', this.playIfNotReady);
    }

    // TODO: Update value if video already played

    // media.addEventListener('progress', this.updateBar.bind(this));

    // Initialize thumbnails
    if (media.textTracks && media.textTracks.length) {
      const thumbnailTrack = Array.prototype.find.call(media.textTracks, t => t.label == 'thumbnails');

      if (thumbnailTrack) {
        this.enableThumbnails();
      } else {
        this.thumbnailPreview.style.display = 'none';
      }
    }
  }

  mediaUnsetCallback(media) {
    super.mediaUnsetCallback(media);

    media.removeEventListener('timeupdate', this.updateRangeWithMediaTime);
    this.range.removeEventListener('change', this.playIfNotReady);

    // TODO: Reset value after media is unset
  }

  /* Add a buffered progress bar */
  getBarColors() {
    const media = this.media;
    let colorsArray = super.getBarColors();

    if (!media || !media.buffered || !media.buffered.length || media.duration <= 0) {
      return colorsArray;
    }

    const buffered = media.buffered;
    const buffPercent = (buffered.end(buffered.length-1) / media.duration) * 100;
    colorsArray.splice(1, 0, ['var(--media-progress-buffered-color, #777)', buffPercent]);
    return colorsArray;
  }

  enableThumbnails() {
    this.thumbnailPreview = this.shadowRoot.querySelector('media-thumbnail-preview');
    const thumbnailContainer = this.shadowRoot.querySelector('#thumbnailContainer');
    thumbnailContainer.classList.add('enabled');

    let mouseMoveHandler;
    const trackMouse = () => {
      mouseMoveHandler = (evt) => {
        const duration = this.media && this.media.duration;

        // If no duration we can't calculate which time to show
        if (!duration) return;

        // Get mouse position percent
        const rangeRect = this.wrapper.getBoundingClientRect();
        const mousePercent = this.getMousePercent(evt);

        // Get thumbnail center position
        const leftPadding = rangeRect.left - this.getBoundingClientRect().left;
        const thumbnailLeft = leftPadding + (mousePercent * rangeRect.width);

        this.thumbnailPreview.style.left = `${thumbnailLeft}px`;
        this.thumbnailPreview.time = mousePercent * this.media.duration;
      };
      Window.addEventListener('mousemove', mouseMoveHandler, false);
    };

    const stopTrackingMouse = () => {
      Window.removeEventListener('mousemove', mouseMoveHandler);
    };

    // Trigger when the mouse moves over the range
    let rangeEntered = false;
    let rangeMouseMoveHander = (evt) => {
      if (!rangeEntered && this.media && this.media.duration) {
        rangeEntered = true;
        this.thumbnailPreview.style.display = 'block';
        trackMouse();

        let offRangeHandler = (evt) => {
          if (evt.target != this && !this.contains(evt.target)) {
            this.thumbnailPreview.style.display = 'none';
            Window.removeEventListener('mousemove', offRangeHandler);
            rangeEntered = false;
            stopTrackingMouse();
          }
        }
        Window.addEventListener('mousemove', offRangeHandler, false);
      }

      if (!this.media || !this.media.duration) {
        this.thumbnailPreview.style.display = 'none';
      }
    };
    this.addEventListener('mousemove', rangeMouseMoveHander, false);
  }

  disableThumbnails() {
    thumbnailContainer.classList.remove('enabled');
  }
}

defineCustomElement('media-trimmer', MediaTrimmer);

export default MediaTrimmer;
