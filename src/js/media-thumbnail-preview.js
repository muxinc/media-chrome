/*
  <media-thumbnail-preview media="#myVideo" time="10.00">

  Uses the "thumbnails" track of a video element to show an image relative to
  the video time given in the `time` attribute.
*/
import {
  Window as window,
  Document as document,
} from './utils/server-safe-globals.js';
import { defineCustomElement } from './utils/defineCustomElement.js';
import { MediaUIAttributes } from './constants.js';

const template = document.createElement('template');

template.innerHTML = `
  <style>
    :host {
      background-color: #000;
      box-sizing: border-box;
      display: inline-block;
      overflow: hidden;
    }

    img {
      display: none;
      position: relative;
    }
  </style>
  <img crossorigin loading="eager" decoding="async" />
`;

class MediaThumbnailPreviewElement extends window.HTMLElement {
  static get observedAttributes() {
    return [
      MediaUIAttributes.MEDIA_CONTROLLER,
      'time',
      MediaUIAttributes.MEDIA_PREVIEW_IMAGE,
      MediaUIAttributes.MEDIA_PREVIEW_COORDS,
    ];
  }

  constructor() {
    super();

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  connectedCallback() {
    const mediaControllerId = this.getAttribute(
      MediaUIAttributes.MEDIA_CONTROLLER
    );
    if (mediaControllerId) {
      const mediaControllerEl = document.getElementById(mediaControllerId);
      mediaControllerEl?.associateElement?.(this);
    }
  }

  disconnectedCallback() {
    const mediaControllerSelector = this.getAttribute(
      MediaUIAttributes.MEDIA_CONTROLLER
    );
    if (mediaControllerSelector) {
      const mediaControllerEl = document.getElementById(mediaControllerId);
      mediaControllerEl?.unassociateElement?.(this);
    }
  }

  attributeChangedCallback(attrName, oldValue, newValue) {
    if (
      [
        'time',
        MediaUIAttributes.MEDIA_PREVIEW_IMAGE,
        MediaUIAttributes.MEDIA_PREVIEW_COORDS,
      ].includes(attrName)
    ) {
      this.update();
    }
    if (attrName === MediaUIAttributes.MEDIA_CONTROLLER) {
      if (oldValue) {
        const mediaControllerEl = document.getElementById(oldValue);
        mediaControllerEl?.unassociateElement?.(this);
      }
      if (newValue) {
        const mediaControllerEl = document.getElementById(newValue);
        mediaControllerEl?.associateElement?.(this);
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

    const maxThumbRatio = Math.min(
      parseInt(maxWidth) / w,
      parseInt(maxHeight) / h
    );
    const minThumbRatio = Math.max(
      parseInt(minWidth) / w,
      parseInt(minHeight) / h
    );

    // maxThumbRatio scales down and takes priority, minThumbRatio scales up.
    const thumbScale =
      maxThumbRatio < 1 ? maxThumbRatio : minThumbRatio > 1 ? minThumbRatio : 1;

    this.style.width = `${w * thumbScale}px`;
    this.style.height = `${h * thumbScale}px`;
    this.style.aspectRatio = `${w} / ${h}`;

    const img = this.shadowRoot.querySelector('img');

    const resize = () => {
      img.style.width = `${this.imgWidth * thumbScale}px`;
      img.style.height = `${this.imgHeight * thumbScale}px`;
      img.style.display = 'block';
    };

    if (img.src !== src) {
      img.onload = () => {
        this.imgWidth = img.naturalWidth;
        this.imgHeight = img.naturalHeight;
        resize();
      }
      img.src = src;
      resize();
    }

    resize();
    img.style.left = `-${x * thumbScale}px`;
    img.style.top = `-${y * thumbScale}px`;
  }
}

defineCustomElement('media-thumbnail-preview', MediaThumbnailPreviewElement);

export default MediaThumbnailPreviewElement;
