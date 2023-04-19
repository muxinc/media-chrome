import { window, document } from './utils/server-safe-globals.js';

export const Attributes = {
  PLACEHOLDER_SRC: 'placeholdersrc',
  SRC: 'src',
}

const template = document.createElement('template');

template.innerHTML = /*html*/`
  <style>
    :host {
      pointer-events: none;
      display: var(--media-poster-image-display, inline-block);
      box-sizing: border-box;
    }

    img {
      max-width: 100%;
      max-height: 100%;
      min-width: 100%;
      min-height: 100%;
      background-repeat: no-repeat;
      background-position: var(--media-background-position, var(--media-object-position, center));
      background-size: var(--media-background-size, var(--media-object-fit, contain));
      object-fit: var(--media-object-fit, contain);
      object-position: var(--media-object-position, center);
    }
  </style>

  <img aria-hidden="true" id="image"/>
`;

const unsetBackgroundImage = (el) => {
  el.style.removeProperty('background-image');
}
const setBackgroundImage = (el, image) => {
  el.style['background-image'] = `url('${image}')`;
}

/**
 * @preserve
 */
class MediaPosterImage extends window.HTMLElement {
  static get observedAttributes() {
    return [Attributes.PLACEHOLDER_SRC, Attributes.SRC];
  }

  constructor() {
    super();

    if (!this.shadowRoot) {
      // Set up the Shadow DOM if not using Declarative Shadow DOM.
      this.attachShadow({ mode: 'open' });
      this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    this.image = this.shadowRoot.querySelector('#image');
  }

  attributeChangedCallback(attrName, _oldValue, newValue) {
    if (attrName === Attributes.SRC) {
      if (newValue == null) {
        this.image.removeAttribute(Attributes.SRC);
      } else {
        this.image.setAttribute(Attributes.SRC, newValue);
      }
    }

    if (attrName === Attributes.PLACEHOLDER_SRC) {
      if (newValue == null) {
        unsetBackgroundImage(this.image);
      } else {
        setBackgroundImage(this.image, newValue);
      }
    }
  }
}

if (!window.customElements.get('media-poster-image')) {
  window.customElements.define('media-poster-image', MediaPosterImage);
}

export default MediaPosterImage;
