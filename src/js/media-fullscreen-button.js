/*
  <media-fullscreen-button media="#myVideo" fullscreen-element="#myContainer">

  The fullscreen-element attribute can be used to say which element
  to make fullscreen.
  If none, the button will look for the closest media-container element to the media.
  If none, the button will make the media fullscreen.
*/
import MediaChromeButton from './media-chrome-button.js';
import { defineCustomElement } from './utils/defineCustomElement.js';
import {
  Window as window,
  Document as document,
} from './utils/server-safe-globals.js';
import { MediaUIEvents, MediaUIAttributes } from './constants.js';
import { verbs } from './labels/labels.js';

const enterFullscreenIcon = `<svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18"><title>Mux Player SVG Icons_v3</title><path d="M12,0V2.5h3.5V6H18V0ZM0,6H2.5V2.5H6V0H0Zm15.5,9.5H12V18h6V12H15.5ZM2.5,12H0v6H6V15.5H2.5Z"/></svg>`;

const exitFullscreenIcon = `<svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18"><title>Mux Player SVG Icons_v3</title><path d="M14.5,3.5V0H12V6h6V3.5ZM12,18h2.5V14.5H18V12H12ZM0,14.5H3.5V18H6V12H0Zm3.5-11H0V6H6V0H3.5Z"/></svg>`;

const slotTemplate = document.createElement('template');
slotTemplate.innerHTML = `
  <style>
  :host([${MediaUIAttributes.MEDIA_IS_FULLSCREEN}]) slot:not([name=exit]) > *, 
  :host([${MediaUIAttributes.MEDIA_IS_FULLSCREEN}]) ::slotted(:not([slot=exit])) {
    display: none !important;
  }

  /* Double negative, but safer if display doesn't equal 'block' */
  :host(:not([${MediaUIAttributes.MEDIA_IS_FULLSCREEN}])) slot:not([name=enter]) > *, 
  :host(:not([${MediaUIAttributes.MEDIA_IS_FULLSCREEN}])) ::slotted(:not([slot=enter])) {
    display: none !important;
  }
  </style>

  <slot name="enter">${enterFullscreenIcon}</slot>
  <slot name="exit">${exitFullscreenIcon}</slot>
`;

const updateAriaLabel = (el) => {
  const isFullScreen =
    el.getAttribute(MediaUIAttributes.MEDIA_IS_FULLSCREEN) != null;
  const label = isFullScreen
    ? verbs.EXIT_FULLSCREEN()
    : verbs.ENTER_FULLSCREEN();
  el.setAttribute('aria-label', label);
};

class MediaFullscreenButton extends MediaChromeButton {
  static get observedAttributes() {
    return [...super.observedAttributes, MediaUIAttributes.MEDIA_IS_FULLSCREEN];
  }

  constructor(options = {}) {
    super({ slotTemplate, ...options });
  }

  connectedCallback() {
    updateAriaLabel(this);
    super.connectedCallback();
  }

  attributeChangedCallback(attrName, oldValue, newValue) {
    if (attrName === MediaUIAttributes.MEDIA_IS_FULLSCREEN) {
      updateAriaLabel(this);
    }
    super.attributeChangedCallback(attrName, oldValue, newValue);
  }

  handleClick(_e) {
    const eventName =
      this.getAttribute(MediaUIAttributes.MEDIA_IS_FULLSCREEN) != null
        ? MediaUIEvents.MEDIA_EXIT_FULLSCREEN_REQUEST
        : MediaUIEvents.MEDIA_ENTER_FULLSCREEN_REQUEST;
    this.dispatchEvent(
      new window.CustomEvent(eventName, { composed: true, bubbles: true })
    );
  }
}

defineCustomElement('media-fullscreen-button', MediaFullscreenButton);

export default MediaFullscreenButton;
