import { window, document } from './utils/server-safe-globals.js';
import { MediaUIAttributes, MediaStateReceiverAttributes } from './constants.js';
import { getOrInsertCSSRule } from './utils/element-utils.js';

const template = document.createElement('template');
template.innerHTML = /*html*/`
  <style>
    :host {
      box-sizing: border-box;
      display: var(--media-control-display, var(--media-preview-thumbnail-display, inline-block));
      overflow: hidden;
    }

    img {
      display: none;
      position: relative;
    }
  </style>
  <img crossorigin loading="eager" decoding="async">
`;

/**
 * @extends {HTMLElement}
 *
 * @attr {string} mediacontroller - The element `id` of the media controller to connect to (if not nested within).
 * @attr {string} mediapreviewimage - (read-only) Set to the timeline preview image URL.
 * @attr {string} mediapreviewcoords - (read-only) Set to the active preview image coordinates.
 *
 * @cssproperty [--media-preview-thumbnail-display = inline-block] - `display` property of display.
 * @cssproperty [--media-control-display = inline-block] - `display` property of control.
 */
class MediaPreviewThumbnail extends window.HTMLElement {
  #mediaController;

  static get observedAttributes() {
    return [
      MediaStateReceiverAttributes.MEDIA_CONTROLLER,
      MediaUIAttributes.MEDIA_PREVIEW_IMAGE,
      MediaUIAttributes.MEDIA_PREVIEW_COORDS,
    ];
  }

  constructor() {
    super();

    if (!this.shadowRoot) {
      // Set up the Shadow DOM if not using Declarative Shadow DOM.
      this.attachShadow({ mode: 'open' });
      this.shadowRoot.appendChild(template.content.cloneNode(true));
    }
  }

  connectedCallback() {
    const mediaControllerId = this.getAttribute(
      MediaStateReceiverAttributes.MEDIA_CONTROLLER
    );
    if (mediaControllerId) {
      // @ts-ignore
      this.#mediaController = this.getRootNode()?.getElementById(mediaControllerId);
      this.#mediaController?.associateElement?.(this);
    }
  }

  disconnectedCallback() {
    // Use cached mediaController, getRootNode() doesn't work if disconnected.
    this.#mediaController?.unassociateElement?.(this);
    this.#mediaController = null;
  }

  attributeChangedCallback(attrName, oldValue, newValue) {
    if (
      [
        MediaUIAttributes.MEDIA_PREVIEW_IMAGE,
        MediaUIAttributes.MEDIA_PREVIEW_COORDS,
      ].includes(attrName)
    ) {
      this.update();
    }
    if (attrName === MediaStateReceiverAttributes.MEDIA_CONTROLLER) {
      if (oldValue) {
        this.#mediaController?.unassociateElement?.(this);
        this.#mediaController = null;
      }
      if (newValue) {
        // @ts-ignore
        this.#mediaController = this.getRootNode()?.getElementById(newValue);
        this.#mediaController?.associateElement?.(this);
      }
    }
  }

  update() {
    const mediaPreviewCoordsStr = this.getAttribute(
      MediaUIAttributes.MEDIA_PREVIEW_COORDS
    );
    const mediaPreviewImage = this.getAttribute(
      MediaUIAttributes.MEDIA_PREVIEW_IMAGE
    );
    if (!(mediaPreviewCoordsStr && mediaPreviewImage)) return;

    const [x, y, w, h] = mediaPreviewCoordsStr
      .split(/\s+/)
      .map((coord) => +coord);
    const src = mediaPreviewImage.split('#')[0];

    const computedStyle = getComputedStyle(this);
    const { maxWidth, maxHeight, minWidth, minHeight } = computedStyle;
    const maxRatio = Math.min(parseInt(maxWidth) / w, parseInt(maxHeight) / h);
    const minRatio = Math.max(parseInt(minWidth) / w, parseInt(minHeight) / h);

    // maxRatio scales down and takes priority, minRatio scales up.
    const isScalingDown = maxRatio < 1;
    const scale = isScalingDown ? maxRatio : minRatio > 1 ? minRatio : 1;

    const { style } = getOrInsertCSSRule(this.shadowRoot, ':host');
    const imgStyle = getOrInsertCSSRule(this.shadowRoot, 'img').style;
    const img = this.shadowRoot.querySelector('img');

    // Revert one set of extremum to its initial value on a known scale direction.
    const extremum = isScalingDown ? 'min' : 'max';
    style.setProperty(`${extremum}-width`, 'initial', 'important');
    style.setProperty(`${extremum}-height`, 'initial', 'important');
    style.width = `${w * scale}px`;
    style.height = `${h * scale}px`;

    const resize = () => {
      imgStyle.width = `${this.imgWidth * scale}px`;
      imgStyle.height = `${this.imgHeight * scale}px`;
      imgStyle.display = 'block';
    };

    if (img.src !== src) {
      img.onload = () => {
        this.imgWidth = img.naturalWidth;
        this.imgHeight = img.naturalHeight;
        resize();
      };
      img.src = src;
      resize();
    }

    resize();
    imgStyle.transform = `translate(-${x * scale}px, -${y * scale}px)`;
  }
}

if (!window.customElements.get('media-preview-thumbnail')) {
  window.customElements.define('media-preview-thumbnail', MediaPreviewThumbnail);
}

export default MediaPreviewThumbnail;
