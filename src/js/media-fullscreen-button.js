/*
  <media-fullscreen-button media="#myVideo" fullscreen-element="#myContainer">

  The fullscreen-element attribute can be used to say which element
  to make fullscreen.
  If none, the button will look for the closest media-container element to the media.
  If none, the button will make the media fullscreen.
*/
import MediaChromeButton from './media-chrome-button.js';
import { defineCustomElement } from './utils/defineCustomElement.js';
import { Window as window, Document as document } from './utils/server-safe-globals.js';
import { MediaUIEvents, MediaUIAttributes } from './constants.js';
import { verbs } from './labels/labels.js';

const enterFullscreenIcon = `<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
  <path d="M0 0h24v24H0z" fill="none"/>
  <path class="icon" d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
</svg>`;

const exitFullscreenIcon = `<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
  <path d="M0 0h24v24H0z" fill="none"/>
  <path class="icon" d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"/>
</svg>`;

const slotTemplate = document.createElement('template');
slotTemplate.innerHTML = `
  <style>
  :host([${MediaUIAttributes.MEDIA_IS_FULLSCREEN}]) slot:not([name=exit]) > *, 
  :host([${MediaUIAttributes.MEDIA_IS_FULLSCREEN}]) ::slotted(:not([slot=exit])) {
    display: none;
  }

  /* Double negative, but safer if display doesn't equal 'block' */
  :host(:not([${MediaUIAttributes.MEDIA_IS_FULLSCREEN}])) slot:not([name=enter]) > *, 
  :host(:not([${MediaUIAttributes.MEDIA_IS_FULLSCREEN}])) ::slotted(:not([slot=enter])) {
    display: none;
  }
  </style>

  <slot name="enter">${enterFullscreenIcon}</slot>
  <slot name="exit">${exitFullscreenIcon}</slot>
`;

const updateAriaLabel = (el) => {
  const isFullScreen = el.getAttribute(MediaUIAttributes.MEDIA_IS_FULLSCREEN) != null;
  const label = isFullScreen ? verbs.EXIT_FULLSCREEN() : verbs.ENTER_FULLSCREEN();
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
    const eventName = (this.getAttribute(MediaUIAttributes.MEDIA_IS_FULLSCREEN) != null)
      ? MediaUIEvents.MEDIA_EXIT_FULLSCREEN_REQUEST
      : MediaUIEvents.MEDIA_ENTER_FULLSCREEN_REQUEST;
    this.dispatchEvent(new window.CustomEvent(eventName, { composed: true, bubbles: true }));
  }
}

defineCustomElement('media-fullscreen-button', MediaFullscreenButton);

export default MediaFullscreenButton;
