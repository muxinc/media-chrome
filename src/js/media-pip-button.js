import MediaChromeButton from './media-chrome-button.js';
import { defineCustomElement } from './utils/defineCustomElement.js';
import { Document as document } from './utils/server-safe-globals.js';
import { MediaUIEvents, MediaUIAttributes } from './constants';

const pipIcon =
  '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path class="icon" d="M19 7h-8v6h8V7zm2-4H3c-1.1 0-2 .9-2 2v14c0 1.1.9 1.98 2 1.98h18c1.1 0 2-.88 2-1.98V5c0-1.1-.9-2-2-2zm0 16.01H3V4.98h18v14.03z"/><path d="M0 0h24v24H0z" fill="none"/></svg>';

const slotTemplate = document.createElement('template');
slotTemplate.innerHTML = `
  <style>
  :host([${MediaUIAttributes.MEDIA_IS_PIP}]) slot:not([name=exit]) > *, 
  :host([${MediaUIAttributes.MEDIA_IS_PIP}]) ::slotted(:not([slot=exit])) {
    display: none;
  }

  /* Double negative, but safer if display doesn't equal 'block' */
  :host(:not([${MediaUIAttributes.MEDIA_IS_PIP}])) slot:not([name=enter]) > *, 
  :host(:not([${MediaUIAttributes.MEDIA_IS_PIP}])) ::slotted(:not([slot=enter])) {
    display: none;
  }
  </style>

  <slot name="enter">${pipIcon}</slot>
  <slot name="exit">${pipIcon}</slot>
`;

class MediaPipButton extends MediaChromeButton {
  
  static get observedAttributes() {
    return [MediaUIAttributes.MEDIA_IS_PIP];
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
    const eventName = (this.getAttribute(MediaUIAttributes.MEDIA_IS_PIP) != null)
      ? MediaUIEvents.MEDIA_EXIT_PIP_REQUEST
      : MediaUIEvents.MEDIA_ENTER_PIP_REQUEST;
    this.dispatchEvent(new Event(eventName, { composed: true, bubbles: true }));
  }
}

defineCustomElement('media-pip-button', MediaPipButton);

export default MediaPipButton;
