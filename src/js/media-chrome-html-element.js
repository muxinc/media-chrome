import { defineCustomElement } from './utils/defineCustomElement.js';
import { dashedToCamel } from './utils/dashedToCamel.js';
import { Window as window, Document as document } from './utils/server-safe-globals.js';

class MediaChromeHTMLElement extends window.HTMLElement {
  constructor() {
    super();
    this._media = null;
  }

  // Observe changes to the media attribute
  static get observedAttributes() {
    return ['media', 'media-controller'].concat(super.observedAttributes || []);
  }

  // Model the basic HTML attribute functionality of matching props
  attributeChangedCallback(attrName, oldValue, newValue) {
    // Assume attrs with dashes match camelCase props
    const propName = dashedToCamel(attrName);

    // Deprecate
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

    if (propName == 'mediaController') {
      this[propName] = document.getElementById(newValue);
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
  disconnectedCallback() { }
  mediaSetCallback() { }
  mediaUnsetCallback() { }

  get mediaController() {
    return this._mediaController || null;
  }

  set mediaController(controller) {
    if (controller === this._mediaController) return;

    if (this._mediaController) this._mediaController.unassociateElement(this);

    if (controller) { 
      this._mediaController = controller;
      controller.associateElement(this);
    }
  }
}

/*
  Recursively set the media prop of all child MediaChromeHTMLElements
*/
export function setAndPropagateMedia(el, media) {
  const elName = el.nodeName.toLowerCase();

  // Can't set <media-chrome> media
  // and shouldn't propagate into a child media-chrome
  if (elName == 'media-chrome') return;

  // Only custom elements might have the correct media attribute
  if (elName.includes('-')) {
    window.customElements.whenDefined(elName).then(()=>{
      if (el instanceof MediaChromeHTMLElement) {
        // Media-chrome html els propogate to their children automatically
        // including to shadow dom children
        el.media = media;
      } else {
        // Otherwise continue to this el's children
        propagateMedia(el, media);
      }
    });
  } else if (el.slot !== 'media') {
    // If not a custom element or media element, continue to children
    propagateMedia(el, media);
  }
};

export function propagateMedia(parent, media) {
  Array.prototype.forEach.call(parent.children, (child)=>{
    setAndPropagateMedia(child, media);
  });
}

defineCustomElement('media-chrome-html-element', MediaChromeHTMLElement);

export default MediaChromeHTMLElement;
