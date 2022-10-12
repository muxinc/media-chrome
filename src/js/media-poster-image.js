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
    }

    #container {
      background-repeat: no-repeat;
      background-position: var(--media-background-position, var(--media-object-position, center));
      background-size: var(--media-background-size, var(--media-object-fit, contain));
    }
    img {
      max-width: 100%;
      max-height: 100%;
      min-width: 100%;
      min-height: 100%;
      object-fit: var(--media-object-fit, contain);
      object-position: var(--media-object-position, center);
      opacity: 1;
    }
    img.fade {
      opacity: 0;
      transition: opacity 0.15s ease;
    }
    img.fade.loaded {
      opacity: 1;
    }

    :host([${MediaUIAttributes.MEDIA_HAS_PLAYED}]) img {
      display: none;
    }
  </style>

  <div aria-hidden="true" id="container">
    <img id="image" class="fade"/>
  </div>
`;

const unsetBackgroundImage = (el) => {
  el.style.removeProperty('background-image');
}
const setBackgroundImage = (el, image) => {
  el.style['background-image'] = `url('${image}')`;
}
const enableFade = (el) => {
  el.classList.add('fade');
}
const disableFade = (el) => {
  el.classList.remove('fade');
}
const loadFade = (el) => {
  el.classList.add('loaded');
}

class MediaPosterImage extends window.HTMLElement {
  static get observedAttributes() {
    return [MediaUIAttributes.MEDIA_HAS_PLAYED, 'no-fade', 'placeholder-src', 'src'];
  }

  constructor() {
    super();

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    this.container = this.shadowRoot.querySelector('#container');
    this.image = this.shadowRoot.querySelector('#image');

    this.image.addEventListener('load', () => loadFade(this.image));
  }

  attributeChangedCallback(attrName, _oldValue, newValue) {
    if (attrName === 'src') {
      if (newValue == null) {
        this.image.removeAttribute('src');
      } else {
        this.image.setAttribute('src', newValue);
      }
    } 

    if (attrName === 'placeholder-src') {
      if (newValue == null) {
        unsetBackgroundImage(this.container);
      } else {
        setBackgroundImage(this.container, newValue);
      }
    }
    if (
      attrName === 'no-fade' &&
      _oldValue !== newValue
    ) {
      if (newValue == null) {
        enableFade(this.image);
      } else {
        disableFade(this.image);
      }
    }
  }
}

defineCustomElement('media-poster-image', MediaPosterImage);

export default MediaPosterImage;
