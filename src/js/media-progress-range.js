import MediaChromeRange from './media-chrome-range.js';
import MediaThumbnailPreviewElement from './media-thumbnail-preview-element.js';

const template = document.createElement('template');

template.innerHTML = `
  <style>
    media-thumbnail-preview {
      /* display: none; */
      position: absolute;
      top: 0;
      border: 1.5px solid #fff;
      background-color: #000;
      width: 160px;
      height: 90px;
      margin-left: -80px;
      margin-top: -90px;
      left: var(--mouse-x, 0);
      top: 0;
    }

    :host(:hover) media-thumbnail-preview {
      display: block;
      border: 1.5px solid #f00;
    }
  </style>
`;

class MediaProgressRange extends MediaChromeRange {
  static get observedAttributes() {
    return ['thumbnails'].concat(super.observedAttributes || []);
  }

  constructor() {
    super();

    this.shadowRoot.appendChild(template.content.cloneNode(true));

    this.setMediaTimeWithRange = () => {
      const media = this.media;
      const range = this.range;

      // Can't set the time before the media is ready
      // Ignore if readyState isn't supported
      if (media.readyState > 0 || media.readyState === undefined) {
        media.currentTime = Math.round((range.value / 1000) * media.duration);
      }
    };
    this.range.addEventListener('input', this.setMediaTimeWithRange);

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
  }

  mediaSetCallback() {
    const media = this.media;
    const range = this.range;

    media.addEventListener('timeupdate', this.updateRangeWithMediaTime);

    // If readyState is supported, and the range is used before
    // the media is ready, use the play promise to set the time.
    if (media.readyState !== undefined && media.readyState == 0) {
      // range.addEventListener('change', this.playIfNotReady);
    }

    media.addEventListener('progress', this.updateBar.bind(this));
  }

  mediaUnsetCallback() {
    const media = this.media;
    const range = this.range;

    media.removeEventListener('timeupdate', this.updateRangeWithMediaTime);
    range.removeEventListener('change', this.playIfNotReady);
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

  set thumbnails(url) {
    if (this.thumbnailPreview) {
      this.shadowRoot.removeChild(this.thumbnailPreview);
    }

    if (!url) return;

    this.thumbnailPreview = document.createElement('media-thumbnail-preview');
    this.thumbnailPreview.setAttribute('url', url);
    this.shadowRoot.appendChild(this.thumbnailPreview);

    let mouseMoveHandler;
    const trackMouse = () => {
      mouseMoveHandler = (evt) => {
        const duration = this.media && this.media.duration;

        // If no duration we can't calculate which time to show
        if (!duration) return;

        // Get mouse position percent
        const rangeRect = this.range.getBoundingClientRect();
        let mousePercent = (evt.clientX - rangeRect.left) / rangeRect.width;

        // Lock between 0 and 1
        mousePercent = Math.max(0, Math.min(1, mousePercent));

        // Get thumbnail center position
        const elPadding = rangeRect.left - this.getBoundingClientRect().left;

        this.thumbnailPreview.style.left = elPadding + (mousePercent * rangeRect.width);
        this.thumbnailPreview.time = mousePercent * this.media.duration;
      };
      window.addEventListener('mousemove', mouseMoveHandler, false);
    };

    const stopTrackingMouse = () => {
      window.removeEventListener('mousemove', mouseMoveHandler);
    };

    let rangeEntered = false;
    let rangeMouseMoveHander = (evt) => {
      if (!rangeEntered && this.media && this.media.duration) {
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
    };
    this.addEventListener('mousemove', rangeMouseMoveHander, false);
  }

  get thumbnails() {
    return this.getAttribute('thumbnails');
  }
}

if (!window.customElements.get('media-progress-range')) {
  window.customElements.define('media-progress-range', MediaProgressRange);
  window.MediaProgressRange = MediaProgressRange;
}

export default MediaProgressRange;
