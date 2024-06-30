import { globalThis, document } from './utils/server-safe-globals.js';
import {
  MediaUIAttributes,
  MediaStateReceiverAttributes,
} from './constants.js';
import {
  getOrInsertCSSRule,
  getStringAttr,
  setStringAttr,
} from './utils/element-utils.js';
import MediaController from './media-controller.js';

const template: HTMLTemplateElement = document.createElement('template');
template.innerHTML = /*html*/ `
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
 *
 * @attr {string} mediacontroller - The element `id` of the media controller to connect to (if not nested within).
 * @attr {string} mediapreviewimage - (read-only) Set to the timeline preview image URL.
 * @attr {string} mediapreviewcoords - (read-only) Set to the active preview image coordinates.
 *
 * @cssproperty [--media-preview-thumbnail-display = inline-block] - `display` property of display.
 * @cssproperty [--media-control-display = inline-block] - `display` property of control.
 */
class MediaPreviewThumbnail extends globalThis.HTMLElement {
  #mediaController: MediaController;

  static get observedAttributes() {
    return [
      MediaStateReceiverAttributes.MEDIA_CONTROLLER,
      MediaUIAttributes.MEDIA_PREVIEW_IMAGE,
      MediaUIAttributes.MEDIA_PREVIEW_COORDS,
    ];
  }

  imgWidth: number;
  imgHeight: number;

  constructor() {
    super();

    if (!this.shadowRoot) {
      // Set up the Shadow DOM if not using Declarative Shadow DOM.
      this.attachShadow({ mode: 'open' });
      this.shadowRoot.appendChild(template.content.cloneNode(true));
    }
  }

  connectedCallback(): void {
    const mediaControllerId = this.getAttribute(
      MediaStateReceiverAttributes.MEDIA_CONTROLLER
    );
    if (mediaControllerId) {
      this.#mediaController =
        // @ts-ignore
        this.getRootNode()?.getElementById(mediaControllerId);
      this.#mediaController?.associateElement?.(this);
    }
  }

  disconnectedCallback(): void {
    // Use cached mediaController, getRootNode() doesn't work if disconnected.
    this.#mediaController?.unassociateElement?.(this);
    this.#mediaController = null;
  }

  attributeChangedCallback(
    attrName: string,
    oldValue: string | null,
    newValue: string | null
  ): void {
    if (
      [
        MediaUIAttributes.MEDIA_PREVIEW_IMAGE,
        MediaUIAttributes.MEDIA_PREVIEW_COORDS,
      ].includes(attrName as any)
    ) {
      this.update();
    }
    if (attrName === MediaStateReceiverAttributes.MEDIA_CONTROLLER) {
      if (oldValue) {
        this.#mediaController?.unassociateElement?.(this);
        this.#mediaController = null;
      }
      if (newValue && this.isConnected) {
        // @ts-ignore
        this.#mediaController = this.getRootNode()?.getElementById(newValue);
        this.#mediaController?.associateElement?.(this);
      }
    }
  }

  /**
   * @type {string | undefined} The url of the preview image
   */
  get mediaPreviewImage() {
    return getStringAttr(this, MediaUIAttributes.MEDIA_PREVIEW_IMAGE);
  }

  set mediaPreviewImage(value) {
    setStringAttr(this, MediaUIAttributes.MEDIA_PREVIEW_IMAGE, value);
  }

  /**
   * @type {Array<number> | undefined} Fixed length array [x, y, width, height] or undefined
   */
  get mediaPreviewCoords() {
    const attrVal = this.getAttribute(MediaUIAttributes.MEDIA_PREVIEW_COORDS);

    if (!attrVal) return undefined;

    return attrVal.split(/\s+/).map((coord) => +coord);
  }

  set mediaPreviewCoords(value) {
    if (!value) {
      this.removeAttribute(MediaUIAttributes.MEDIA_PREVIEW_COORDS);
      return;
    }

    this.setAttribute(MediaUIAttributes.MEDIA_PREVIEW_COORDS, value.join(' '));
  }

  update(): void {
    const coords = this.mediaPreviewCoords;
    const previewImage = this.mediaPreviewImage;

    if (!(coords && previewImage)) return;

    const [x, y, w, h] = coords;
    const src = previewImage.split('#')[0];

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

if (!globalThis.customElements.get('media-preview-thumbnail')) {
  globalThis.customElements.define(
    'media-preview-thumbnail',
    MediaPreviewThumbnail
  );
}

export default MediaPreviewThumbnail;
