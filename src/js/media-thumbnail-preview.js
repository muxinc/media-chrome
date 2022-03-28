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
      height: auto;
      width: auto;
    }

    img {
      object-fit: none;
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

    if (!this.shadowRoot) {
      // Set up the Shadow DOM if not using Declarative Shadow DOM.
      this.attachShadow({ mode: 'open' });
      this.shadowRoot.appendChild(template.content.cloneNode(true));
    }
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
    const img = this.shadowRoot.querySelector('img');
    const [x, y, w, h] = mediaPreviewCoordsStr
      .split(/\s+/)
      .map((coord) => +coord);
    const src = mediaPreviewImage;

    const resize = () => {
      img.style.height = `${h}px`;
      img.style['aspect-ratio'] = `${w} / ${h}`;
    };

    if (img.src !== src) {
      img.onload = resize;
      img.src = src;
      resize();
    }

    resize();
    img.style['object-position'] = `-${x}px -${y}px`
  }
}

defineCustomElement('media-thumbnail-preview', MediaThumbnailPreviewElement);

export default MediaThumbnailPreviewElement;
