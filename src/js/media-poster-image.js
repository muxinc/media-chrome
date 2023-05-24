import { window, document } from './utils/server-safe-globals.js';
import { getStringAttr, setStringAttr } from './utils/element-utils.js';

export const Attributes = {
  PLACEHOLDER_SRC: 'placeholdersrc',
  SRC: 'src',
};

const template = document.createElement('template');

template.innerHTML = /*html*/ `
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
      background-position: var(--media-poster-image-background-position, var(--media-object-position, center));
      background-size: var(--media-poster-image-background-size, var(--media-object-fit, contain));
      object-fit: var(--media-object-fit, contain);
      object-position: var(--media-object-position, center);
    }
  </style>

  <img aria-hidden="true" id="image"/>
`;

const unsetBackgroundImage = (el) => {
  el.style.removeProperty('background-image');
};
const setBackgroundImage = (el, image) => {
  el.style['background-image'] = `url('${image}')`;
};

/**
 * @attr {string} placeholdersrc - Placeholder image source URL, often a blurhash data URL.
 * @attr {string} src - Poster image source URL.
 *
 * @cssproperty --media-poster-image-display - `display` property of poster image.
 * @cssproperty --media-poster-image-background-position - `background-position` of poster image.
 * @cssproperty --media-poster-image-background-size - `background-size` of poster image.
 * @cssproperty --media-object-fit - `object-fit` of poster image.
 * @cssproperty --media-object-position - `object-position` of poster image.
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

  /**
   * @type {string | undefined}
   */
  get placeholderSrc() {
    return getStringAttr(this, Attributes.PLACEHOLDER_SRC);
  }

  set placeholderSrc(value) {
    setStringAttr(this, Attributes.SRC, value);
  }

  /**
   * @type {string | undefined}
   */
  get src() {
    return getStringAttr(this, Attributes.SRC);
  }

  set src(value) {
    setStringAttr(this, Attributes.SRC, value);
  }
}

if (!window.customElements.get('media-poster-image')) {
  window.customElements.define('media-poster-image', MediaPosterImage);
}

export default MediaPosterImage;
