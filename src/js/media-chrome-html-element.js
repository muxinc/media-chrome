import { defineCustomElement } from './utils/defineCustomElement.js';
import { dashedToCamel } from './utils/dashedToCamel.js';
import { propagateMedia }  from './utils/propagateMedia.js';

class MediaChromeHTMLElement extends HTMLElement {
  constructor() {
    super();
    this._media = null;
  }

  static get observedAttributes() {
    return ['media'].concat(super.observedAttributes || []);
  }

  // Model the basic HTML attribute functionality of matching props
  attributeChangedCallback(attrName, oldValue, newValue) {
    // Assume attrs with dashes match camelCase props
    const propName = dashedToCamel(attrName);

    if (propName == 'media') {
      if (newValue === null) {
        this.media = null;
        return;
      }

      let media = document.querySelector(newValue);

      if (!media || !media.play) {
        throw new Error(
          'Supplied media attribute does not appear to match a media element.'
        );
      }

      this.media = media;
      return;
    }

    // Boolean props should never start as null
    if (typeof this[propName] == 'boolean') {
      // null is returned when attributes are removed i.e. boolean attrs
      if (newValue === null) {
        this[propName] = false;
      } else {
        // The new value might be an empty string, which is still true
        // for boolean attributes
        this[propName] = true;
      }
    } else {
      this[propName] = newValue;
    }
  }

  set media(media) {
    if (media === this._media) return;

    if (this._media) {
      this.mediaUnsetCallback(this._media);
    }

    this._media = media;

    // Update light and shadow children even if null
    // Media-chrome can't access shadow dom of separately loaded els
    propagateMedia(this, media);
    propagateMedia(this.shadowRoot, media);

    if (media) {
      const mediaName = media.nodeName.toLowerCase();

      if (mediaName.includes('-')) {
        window.customElements.whenDefined(mediaName).then(()=>{
          this.mediaSetCallback(media);
        });
      } else {
        this.mediaSetCallback(media);
      }
    }
  }

  get media() {
    return this._media;
  }

  connectedCallback() { }
  mediaSetCallback() { }
  mediaUnsetCallback() { }
}

defineCustomElement('media-chrome-html-element', MediaChromeHTMLElement);

export default MediaChromeHTMLElement;
