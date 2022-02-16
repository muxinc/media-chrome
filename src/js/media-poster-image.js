import { defineCustomElement } from './utils/defineCustomElement.js';
import {
  Window as window,
  Document as document,
} from './utils/server-safe-globals.js';
import { MediaUIAttributes } from './constants.js';

const template = document.createElement('template');

template.innerHTML = `
  <style>
    :host {
      height: 100%;
      width: 100%;
      position: relative;
      pointer-events: none;
    }

    div {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-position: center;
      background-size: cover;
      background-repeat: no-repeat;
    }

    :host([${MediaUIAttributes.MEDIA_HAS_PLAYED}]) div {
      display: none;
    }
  </style>

  <div part="placeholder"></div>
  <div part="image"></div>
`;

const setBackgroundImage = (el, image) => {
  el.style['background-image'] = `url('${image}')`;
}

class MediaPosterImage extends window.HTMLElement {
  static get observedAttributes() {
    return [MediaUIAttributes.MEDIA_HAS_PLAYED, 'placeholder-src', 'src'];
  }

  constructor() {
    super();

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    this.placeholder = this.shadowRoot.querySelector('[part=placeholder]');
    this.image = this.shadowRoot.querySelector('[part=image]');
  }

  attributeChangedCallback(attrName, _oldValue, newValue) {
    if (attrName === 'src') {
      setBackgroundImage(this.image, newValue);
    }

    if (attrName === 'placeholder-src') {
      setBackgroundImage(this.placeholder, newValue);
    }
  }
}

defineCustomElement('media-poster-image', MediaPosterImage);

export default MediaPosterImage;
