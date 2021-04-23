/*
  <media-thumbnail-preview media="#myVideo" time="10.00">

  Uses the "thumbnails" track of a video element to show an image relative to
  the video time given in the `time` attribute.
*/
import MediaChromeHTMLElement from './media-chrome-html-element.js';
import { Window as window, Document as document } from './utils/server-safe-globals.js';
import { defineCustomElement } from './utils/defineCustomElement.js';

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

class MediaThumbnailPreviewElement extends MediaChromeHTMLElement {
  static get observedAttributes() {
    return ['time'].concat(super.observedAttributes || []);
  }

  constructor() {
    super();

    const shadow = this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  mediaPreviewImageSet(imageSrc) {
    this.update();
  }

  mediaPreviewCoordsSet(coords) {
    this.update();
  }

  update() {
    if (!this.mediaPreviewCoords || !this.mediaPreviewImage) return;

    const img = this.shadowRoot.querySelector('img');
    const [x,y,w,h] = this.mediaPreviewCoords;
    const src = this.mediaPreviewImage;
    const scale = this.offsetWidth / w;

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
