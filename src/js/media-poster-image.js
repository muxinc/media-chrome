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
      pointer-events: none;
      display: inline-block;
      box-sizing: border-box;
  
      width: auto;
      height: auto;
    }
  
    img {
      max-width: 100%;
      max-height: 100%;
      min-width: 100%;
      min-height: 100%;
      background-size: cover;
      background-repeat: no-repeat;
    }
  
    :host([${MediaUIAttributes.MEDIA_HAS_PLAYED}]) img {
      display: none;
    }
  </style>

  <img aria-hidden="true" id="image"/>
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

    this.image = this.shadowRoot.querySelector('#image');
  }

  attributeChangedCallback(attrName, _oldValue, newValue) {
    if (attrName === 'src') {
      this.image.setAttribute('src', newValue);
    }

    if (attrName === 'placeholder-src') {
      setBackgroundImage(this.image, newValue);
    }
  }
}

defineCustomElement('media-poster-image', MediaPosterImage);

export default MediaPosterImage;
