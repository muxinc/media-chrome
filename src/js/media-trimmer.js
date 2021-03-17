import MediaChromeHTMLElement from './media-chrome-html-element.js';
import { defineCustomElement } from './utils/defineCustomElement.js';
import { createTemplate } from './utils/createTemplate.js';
import { Window } from './utils/browser-env.js';
import MediaThumbnailPreviewElement from './media-thumbnail-preview-element.js';

const template = createTemplate();

const HANDLE_W = 10;

function lockBetweenZeroAndOne (num) {
  return Math.max(0, Math.min(1, num));
}

template.innerHTML = `
  <style>
    #trimmerContainer {
      background-color: #ccc;
      height: 100%;
      width: 100%;
      display: flex;
      position: relative;
    }

    #startHandle, #endHandle {
      cursor: pointer;
      height: 110%;
      width: ${HANDLE_W}px;
      background-color: royalblue;
    }

    #playhead {
      height: 100%;
      width: 3px;
      background-color: #aaa;
      position: absolute;
      display: none;
    }

    #selection {
      display: flex;
      width: 25%;
    }

    #leftTrim {
      width: 25%;
    }

    #spacer {
      flex: 1;
      background-color: cornflowerblue;
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
    <div id="playhead"></div>
    <div id="leftTrim"></div>
    <div id="selection">
      <div id="startHandle"></div>
      <div id="spacer"></div>
      <div id="endHandle"></div>
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

    this.draggingEl = null;

    this.wrapper = this.shadowRoot.querySelector('#trimmerContainer');
    this.selection = this.shadowRoot.querySelector('#selection');
    this.playhead = this.shadowRoot.querySelector('#playhead');
    this.leftTrim = this.shadowRoot.querySelector('#leftTrim');
    this.spacerFirst = this.shadowRoot.querySelector('#spacerFirst');
    this.startHandle = this.shadowRoot.querySelector('#startHandle');
    this.spacerMiddle = this.shadowRoot.querySelector('#spacerMiddle');
    this.endHandle = this.shadowRoot.querySelector('#endHandle');
    this.spacerLast = this.shadowRoot.querySelector('#spacerLast');

    this._clickHandler = this.handleClick.bind(this);
    this._dragStart = this.dragStart.bind(this);
    this._dragEnd = this.dragEnd.bind(this);
    this._drag = this.drag.bind(this);
    /*
     * TODO - teardown these handlers later
     */
    this.wrapper.addEventListener('click', this._clickHandler, false);

    this.wrapper.addEventListener('touchstart', this._dragStart, false);
    this.wrapper.addEventListener('touchend', this._dragEnd, false);
    this.wrapper.addEventListener('touchmove', this._drag, false);

    this.wrapper.addEventListener('mousedown', this._dragStart, false);
    this.wrapper.addEventListener('mouseup', this._dragEnd, false);
    this.wrapper.addEventListener('mousemove', this._drag, false);


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
    const mousePercent = lockBetweenZeroAndOne(this.getMousePercent(evt));
    return (mousePercent * duration);
  }

  getXPositionFromMouse (evt) {
    /*
      if (evt.type === "touchstart") {
        initialX = evt.touches[0].clientX - xOffset;
      } else {
        initialX = evt.clientX - xOffset;
      }
    */
    return evt.clientX
  }

  getMousePercent (evt) {
    const rangeRect = this.wrapper.getBoundingClientRect();
    const mousePercent = (this.getXPositionFromMouse(evt) - rangeRect.left) / rangeRect.width;
    return lockBetweenZeroAndOne(mousePercent);
  }

  dragStart (evt) {
    if (evt.target === this.startHandle) {
      this.draggingEl = this.startHandle;
    }
    if (evt.target === this.endHandle) {
      this.draggingEl = this.endHandle;
    }

    /*
    if (evt.type === "touchstart") {
      initialX = evt.touches[0].clientX - xOffset;
    } else {
      initialX = evt.clientX - xOffset;
    }
    */

    this.initialX = this.getXPositionFromMouse(evt);
  }

  dragEnd (evt) {
    this.initialX = null;
    this.draggingEl = null;
  }

  drag (evt) {
    if (!this.draggingEl) {
      return;
    }
    evt.preventDefault();

    const rangeRect = this.wrapper.getBoundingClientRect();
    const fullWidth = rangeRect.width;

    const endXPosition = this.getXPositionFromMouse(evt);
    const xDelta = endXPosition - this.initialX;
    const percent = this.getMousePercent(evt);
    const selectionW = this.selection.getBoundingClientRect().width;

    if (this.draggingEl === this.startHandle) {
      this.initialX = this.getXPositionFromMouse(evt);
      const leftTrimW = percent * fullWidth;
      this.leftTrim.style.width = `${leftTrimW}px`;
      this.selection.style.width = `${selectionW - xDelta}px`;
    }
    if (this.draggingEl === this.endHandle) {
      this.initialX = this.getXPositionFromMouse(evt);
      this.selection.style.width = `${selectionW + xDelta}px`;
    }
  }

  getCurrentClipBounds () {
    const rangeRect = this.wrapper.getBoundingClientRect();
    const leftTrimRect = this.leftTrim.getBoundingClientRect();
    const selectionRect = this.selection.getBoundingClientRect();

    const percentStart = lockBetweenZeroAndOne(leftTrimRect.width / rangeRect.width);
    const percentEnd = lockBetweenZeroAndOne((leftTrimRect.width + HANDLE_W) + selectionRect.width);

    return {
      startTime: percentStart * this.media.duration,
      endTime: percentEnd * this.media.duration,
    };
  }

  handleClick (evt) {
    /*
    const { startTime, endTime } = this.getCurrentClipBounds();
    if (evt.target == this.wrapper) {
      console.log('debug we in the wrapper', evt.target);
    }
    if (evt.target == this.startHandle) {
      if (this.media) {
        this.media.currentTime = startTime;
        return;
      }
    }
    if (evt.target == this.endHandle) {
      if (this.media) {
        this.media.currentTime = endTime;
      }
    }
    */

    if (this.media) {
      const mousePercent = this.getMousePercent(evt);
      this.media.currentTime = mousePercent * this.media.duration;
    }
  }

  mediaSetCallback(media) {
    super.mediaSetCallback(media);

    this._timeUpdated = this.timeUpdated.bind(this);
    media.addEventListener('timeupdate', this._timeUpdated);

    /*
    // If readyState is supported, and the range is used before
    // the media is ready, use the play promise to set the time.
    if (media.readyState !== undefined && media.readyState == 0) {
      // range.addEventListener('change', this.playIfNotReady);
    }

    // TODO: Update value if video already played
    media.addEventListener('progress', this.updateBar.bind(this));
    */

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

  timeUpdated (evt) {
    const percentComplete = lockBetweenZeroAndOne(this.media.currentTime / this.media.duration);
    const fullW = this.wrapper.getBoundingClientRect().width;
    const progressW = (percentComplete * fullW);
    this.playhead.style.left = `${progressW}px`;
    this.playhead.style.display = 'block';
  }

  mediaUnsetCallback(media) {
    super.mediaUnsetCallback(media);

    media.removeEventListener('timeupdate', this._timeUpdated);
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
