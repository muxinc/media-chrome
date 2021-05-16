import MediaChromeButton from './media-chrome-button.js';
import { defineCustomElement } from './utils/defineCustomElement.js';
import { mediaUIEvents } from './media-chrome-html-element.js';

const pipIcon =
  '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path class="icon" d="M19 7h-8v6h8V7zm2-4H3c-1.1 0-2 .9-2 2v14c0 1.1.9 1.98 2 1.98h18c1.1 0 2-.88 2-1.98V5c0-1.1-.9-2-2-2zm0 16.01H3V4.98h18v14.03z"/><path d="M0 0h24v24H0z" fill="none"/></svg>';

const slotTemplate = document.createElement('template');
slotTemplate.innerHTML = `
  <style>
  :host([media-is-pip]) slot:not([name=exit]) > *, 
  :host([media-is-pip]) ::slotted(:not([slot=exit])) {
    display: none;
  }

  /* Double negative, but safer if display doesn't equal 'block' */
  :host(:not([media-is-pip])) slot:not([name=enter]) > *, 
  :host(:not([media-is-pip])) ::slotted(:not([slot=enter])) {
    display: none;
  }
  </style>

  <slot name="enter">${pipIcon}</slot>
  <slot name="exit">${pipIcon}</slot>
`;

class MediaPipButton extends MediaChromeButton {
  constructor(options={}) {
    options = Object.assign({
      slotTemplate: slotTemplate
    }, options);

    super(options); 
  }

  handleClick(e) {
    const eventName = (this.mediaIsPip)
      ? mediaUIEvents.MEDIA_EXIT_PIP_REQUEST
      : mediaUIEvents.MEDIA_ENTER_PIP_REQUEST;

    this.dispatchMediaEvent(eventName);
  }
}

defineCustomElement('media-pip-button', MediaPipButton);

export default MediaPipButton;
