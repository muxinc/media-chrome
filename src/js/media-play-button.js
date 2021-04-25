import MediaChromeButton from './media-chrome-button.js';
import { defineCustomElement } from './utils/defineCustomElement.js';
import { mediaUIEvents } from './media-chrome-html-element.js';

const playIcon =
  '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path class="icon" d="M8 5v14l11-7z"/><path d="M0 0h24v24H0z" fill="none"/></svg>';
const pauseIcon =
  '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path class="icon" d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/><path d="M0 0h24v24H0z" fill="none"/></svg>';

const slotTemplate = document.createElement('template');
slotTemplate.innerHTML = `
  <style>
  :host([media-paused]) slot[name=pause] > *, 
  :host([media-paused]) ::slotted([slot=pause]) {
    display: none;
  }

  :host(:not([media-paused])) slot[name=play] > *, 
  :host(:not([media-paused])) ::slotted([slot=play]) {
    display: none;
  }
  </style>

  <slot name="play">${playIcon}</slot>
  <slot name="pause">${pauseIcon}</slot>
`;

class MediaPlayButton extends MediaChromeButton {
  constructor(options={}) {
    options = Object.assign({
      slotTemplate: slotTemplate
    }, options);

    super(options);

    // False unless media-paused attr exists
    this._mediaPaused = false;    
  }

  static get observedAttributes() {
    return ['media-paused'].concat(super.observedAttributes || []);
  }

  get mediaPaused() {
    return this._mediaPaused;
  }

  set mediaPaused(paused) {
    paused = !!paused;

    this._mediaPaused = paused;

    // Update the attribute first if needed, but don't inf loop
    const attrBoolValue = this.getAttribute('media-paused') !== null;

    if (paused !== attrBoolValue) {
      if (paused) {
        this.setAttribute('media-paused', 'media-paused');
      } else {
        this.removeAttribute('media-paused');
      }      
    }
  }

  handleClick(e) {
    const eventName = (this.mediaPaused)
      ? mediaUIEvents.MEDIA_PLAY_REQUEST
      : mediaUIEvents.MEDIA_PAUSE_REQUEST;
    this.dispatchMediaEvent(eventName);
  }
}

defineCustomElement('media-play-button', MediaPlayButton);

export default MediaPlayButton;