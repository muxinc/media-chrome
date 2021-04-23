/*
  <media-fullscreen-button media="#myVideo" fullscreen-element="#myContainer">

  The fullscreen-element attribute can be used to say which element
  to make fullscreen.
  If none, the button will look for the closest media-container element to the media.
  If none, the button will make the media fullscreen.
*/
import MediaChromeButton from "./media-chrome-button.js";
import { defineCustomElement } from './utils/defineCustomElement.js';
import { Document as document } from './utils/server-safe-globals.js';
import { MEDIA_ENTER_FULLSCREEN_REQUEST, MEDIA_EXIT_FULLSCREEN_REQUEST } from './media-ui-events.js';

const enterFullscreenIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
  <path d="M0 0h24v24H0z" fill="none"/>
  <path class="icon" d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
</svg>`;

const exitFullscreenIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
  <path d="M0 0h24v24H0z" fill="none"/>
  <path class="icon" d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"/>
</svg>`;

const slotTemplate = document.createElement('template');
slotTemplate.innerHTML = `
  <style>
  :host([media-is-fullscreen]) slot:not([name=exit]) > *, 
  :host([media-is-fullscreen]) ::slotted(:not([slot=exit])) {
    display: none;
  }

  /* Double negative, but safer if display doesn't equal 'block' */
  :host(:not([media-is-fullscreen])) slot:not([name=enter]) > *, 
  :host(:not([media-is-fullscreen])) ::slotted(:not([slot=enter])) {
    display: none;
  }
  </style>

  <slot name="enter">${enterFullscreenIcon}</slot>
  <slot name="exit">${exitFullscreenIcon}</slot>
`;

class MediaFullscreenButton extends MediaChromeButton {
  constructor(options={}) {
    options = Object.assign({
      slotTemplate: slotTemplate
    }, options);

    super(options); 
  }

  handleClick(e) {
    const eventName = (this.mediaIsFullscreen)
     ? MEDIA_EXIT_FULLSCREEN_REQUEST 
     : MEDIA_ENTER_FULLSCREEN_REQUEST;

    this.dispatchMediaEvent(eventName);
  }

  // Need to update fullscreenElement setting for media-controller
  static get observedAttributes() {
    return ['fullscreen-element'].concat(super.observedAttributes || []);
  }
  get fullscreenElement() {
    return this._fullscreenElement
      || (this.media && this.media.closest('media-container, media-chrome'))
      || this.media;
  }
  set fullscreenElement(val) {
    this._fullscreenElement = document.querySelector(val);
  }
}

defineCustomElement('media-fullscreen-button', MediaFullscreenButton);

export default MediaFullscreenButton;
