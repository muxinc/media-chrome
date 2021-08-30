/*
  <media-thumbnail-preview media="#myVideo" time="10.00">

  Uses the "thumbnails" track of a video element to show an image relative to
  the video time given in the `time` attribute.
*/
import { Window as window, Document as document } from './utils/server-safe-globals.js';
import { defineCustomElement } from './utils/defineCustomElement.js';
import { MediaUIAttributes } from './constants.js';

const template = document.createElement('template');

template.innerHTML = `
  <style>
    :host {
      box-sizing: border-box;
      background-color: #000;
      width: 284px;
      height: 160px;
      overflow: hidden;
    }

    img {
      position: absolute;
      left: 0;
      top: 0;
    }
  </style>
  <img crossorigin loading="eager" decoding="async" />
`;

class MediaThumbnailPreviewElement extends window.HTMLElement {
  static get observedAttributes() {
    return [MediaUIAttributes.MEDIA_CONTROLLER, 'time', MediaUIAttributes.MEDIA_PREVIEW_IMAGE, MediaUIAttributes.MEDIA_PREVIEW_COORDS];
  }

  constructor() {
    super();

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  connectedCallback() {
    this.setAttribute(MediaUIAttributes.MEDIA_CHROME_ATTRIBUTES, this.constructor.observedAttributes.join(' '));
    const mediaControllerId = this.getAttribute(MediaUIAttributes.MEDIA_CONTROLLER);
    if (mediaControllerId) {
      const mediaControllerEl = document.getElementById(mediaControllerId);
      mediaControllerEl?.associateDescendantsOf?.(this);
    }
  }

  disconnectedCallback() {
    const mediaControllerSelector = this.getAttribute(MediaUIAttributes.MEDIA_CONTROLLER);
    if (mediaControllerSelector) {
      const mediaControllerEl = document.getElementById(mediaControllerId);
      mediaControllerEl?.unassociateDescendantsOf?.(this);
    }
  }

  attributeChangedCallback(attrName, oldValue, newValue) {
    if (['time', MediaUIAttributes.MEDIA_PREVIEW_IMAGE, MediaUIAttributes.MEDIA_PREVIEW_COORDS].includes(attrName)) {
      this.update();
    }
    if (attrName === MediaUIAttributes.MEDIA_CONTROLLER) {
      if (oldValue) {
        const mediaControllerEl = document.getElementById(oldValue);
        mediaControllerEl?.unassociateDescendantsOf?.(this);
      }
      if (newValue) {
        const mediaControllerEl = document.getElementById(newValue);
        mediaControllerEl?.associateDescendantsOf?.(this);
      }
    }
  }

  update() {
    const mediaPreviewCoordsStr = this.getAttribute(MediaUIAttributes.MEDIA_PREVIEW_COORDS);
    const mediaPreviewImage = this.getAttribute(MediaUIAttributes.MEDIA_PREVIEW_IMAGE);
    if (!(mediaPreviewCoordsStr && mediaPreviewImage)) return;
    // const { offsetWidth } = this;
    const offsetWidth = this.offsetWidth;
    const img = this.shadowRoot.querySelector('img');
    const [x,y,w,_h] = mediaPreviewCoordsStr.split(/\s+/).map(coord => +coord);
    const src = mediaPreviewImage;
    const scale = (offsetWidth / w) || 1;

    const resize = () => {
      img.style.width = `${scale * img.naturalWidth}px`;
      img.style.height = `${scale * img.naturalHeight}px`;
    };

    if (img.src !== src) {
      img.onload = resize;
      img.src = src;
      resize();
    }

    resize();
    img.style.left = `-${scale * x}px`;
    img.style.top = `-${scale * y}px`;
  }
}

defineCustomElement('media-thumbnail-preview', MediaThumbnailPreviewElement);

export default MediaThumbnailPreviewElement;
