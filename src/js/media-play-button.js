import MediaChromeButton from './media-chrome-button.js';
import { Document as document } from './utils/server-safe-globals.js';
import { defineCustomElement } from './utils/defineCustomElement.js';
import { MediaUIEvents, MediaUIAttributes } from './constants';

const playIcon =
  '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path class="icon" d="M8 5v14l11-7z"/><path d="M0 0h24v24H0z" fill="none"/></svg>';
const pauseIcon =
  '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path class="icon" d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/><path d="M0 0h24v24H0z" fill="none"/></svg>';

const slotTemplate = document.createElement('template');
slotTemplate.innerHTML = `
  <style>
  :host([${MediaUIAttributes.MEDIA_PAUSED}]) slot[name=pause] > *, 
  :host([${MediaUIAttributes.MEDIA_PAUSED}]) ::slotted([slot=pause]) {
    display: none;
  }

  :host(:not([${MediaUIAttributes.MEDIA_PAUSED}])) slot[name=play] > *, 
  :host(:not([${MediaUIAttributes.MEDIA_PAUSED}])) ::slotted([slot=play]) {
    display: none;
  }
  </style>

  <slot name="play">${playIcon}</slot>
  <slot name="pause">${pauseIcon}</slot>
`;

class MediaPlayButton extends MediaChromeButton {

  static get observedAttributes() {
    return [MediaUIAttributes.MEDIA_PAUSED];
  }

  constructor(options={}) {
    super({ slotTemplate, ...options });
  }

  connectedCallback() {
    /** Option 1 */
    const evt = new Event(MediaUIEvents.MEDIA_CHROME_ELEMENT_CONNECTED, { composed: true, bubbles: true });
    evt.details = this.constructor.observedAttributes;
    this.dispatchEvent(evt);
    /** Option 2 */
    this.setAttribute(MediaUIAttributes.MEDIA_CHROME_ATTRIBUTES, this.constructor.observedAttributes.join(' '));
  }

  handleClick(_e) {
    const eventName = (this.getAttribute(MediaUIAttributes.MEDIA_PAUSED) != null)
      ? MediaUIEvents.MEDIA_PLAY_REQUEST
      : MediaUIEvents.MEDIA_PAUSE_REQUEST;
    this.dispatchEvent(new Event(eventName, { composed: true, bubbles: true }));
  }
}

defineCustomElement('media-play-button', MediaPlayButton);

export default MediaPlayButton;
