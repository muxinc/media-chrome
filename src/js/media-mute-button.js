import MediaChromeButton from './media-chrome-button.js';
import { defineCustomElement } from './utils/defineCustomElement.js';
import { MEDIA_MUTE_REQUEST, MEDIA_UNMUTE_REQUEST } from './media-ui-events.js';

const offIcon =
  '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path class="icon" d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/><path d="M0 0h24v24H0z" fill="none"/></svg>';

const lowIcon =
  '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path class="icon" d="M18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5z"/><path d="M0 0h24v24H0z" fill="none"/></svg>';

const highIcon =
  '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path class="icon" d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/><path d="M0 0h24v24H0z" fill="none"/></svg>';

const slotTemplate = document.createElement('template');
slotTemplate.innerHTML = `
  <style>
  :host([media-volume-level=off]) slot:not([name=off]) > *, 
  :host([media-volume-level=off]) ::slotted(:not([slot=off])) {
    display: none;
  }

  :host([media-volume-level=low]) slot:not([name=low]) > *, 
  :host([media-volume-level=low]) ::slotted(:not([slot=low])) {
    display: none;
  }

  :host([media-volume-level=medium]) slot:not([name=medium]) > *, 
  :host([media-volume-level=medium]) ::slotted(:not([slot=medium])) {
    display: none;
  }

  :host([media-volume-level=high]) slot:not([name=high]) > *, 
  :host([media-volume-level=high]) ::slotted(:not([slot=high])) {
    display: none;
  }
  </style>

  <slot name="muted">${offIcon}</slot>
  <slot name="off">${offIcon}</slot>
  <slot name="low">${lowIcon}</slot>
  <slot name="medium">${lowIcon}</slot>
  <slot name="high">${highIcon}</slot>
`;

class MediaMuteButton extends MediaChromeButton {
  constructor(options={}) {
    options = Object.assign({
      slotTemplate: slotTemplate
    }, options);

    super(options); 
  }

  handleClick(e) {
    const eventName = (this.mediaMuted) ? MEDIA_UNMUTE_REQUEST : MEDIA_MUTE_REQUEST;
    this.dispatchMediaEvent(eventName);
  }
}

defineCustomElement('media-mute-button', MediaMuteButton);

export default MediaMuteButton;