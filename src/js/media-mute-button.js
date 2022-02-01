import MediaChromeButton from './media-chrome-button.js';
import { defineCustomElement } from './utils/defineCustomElement.js';
import {
  Window as window,
  Document as document,
} from './utils/server-safe-globals.js';
import { MediaUIEvents, MediaUIAttributes } from './constants.js';
import { verbs } from './labels/labels.js';

const offIcon =
  '<svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18"><title>Mux Player SVG Icons_v3</title><path d="M13.5,9A4.5,4.5,0,0,0,11,5V7.18l2.45,2.45A4.23,4.23,0,0,0,13.5,9ZM16,9a6.84,6.84,0,0,1-.54,2.64L17,13.15A8.8,8.8,0,0,0,18,9,9,9,0,0,0,11,.23V2.29A7,7,0,0,1,16,9ZM1.27,0,0,1.27,4.73,6H0v6H4l5,5V10.27l4.25,4.25A6.92,6.92,0,0,1,11,15.7v2.06A9,9,0,0,0,14.69,16l2,2.05L18,16.73l-9-9ZM9,1,6.91,3.09,9,5.18Z"/></svg>';

const lowIcon =
  '<svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18"><title>Mux Player SVG Icons_v3</title><path d="M0,6v6H4l5,5V1L4,6ZM13.5,9A4.5,4.5,0,0,0,11,5V13A4.47,4.47,0,0,0,13.5,9Z"/></svg>';

const highIcon =
  '<svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18"><title>Mux Player SVG Icons_v3</title><path d="M0,6v6H4l5,5V1L4,6ZM13.5,9A4.5,4.5,0,0,0,11,5V13A4.47,4.47,0,0,0,13.5,9ZM11,.23V2.29a7,7,0,0,1,0,13.42v2.06A9,9,0,0,0,11,.23Z"/></svg>';

const slotTemplate = document.createElement('template');
slotTemplate.innerHTML = `
  <style>
  /* Default to High slot/icon. */
  :host(:not([${MediaUIAttributes.MEDIA_VOLUME_LEVEL}])) slot:not([name=high]) > *, 
  :host(:not([${MediaUIAttributes.MEDIA_VOLUME_LEVEL}])) ::slotted(:not([slot=high])),
  :host([${MediaUIAttributes.MEDIA_VOLUME_LEVEL}=high]) slot:not([name=high]) > *, 
  :host([${MediaUIAttributes.MEDIA_VOLUME_LEVEL}=high]) ::slotted(:not([slot=high])) {
    display: none !important;
  }

  :host([${MediaUIAttributes.MEDIA_VOLUME_LEVEL}=off]) slot:not([name=off]) > *, 
  :host([${MediaUIAttributes.MEDIA_VOLUME_LEVEL}=off]) ::slotted(:not([slot=off])) {
    display: none !important;
  }

  :host([${MediaUIAttributes.MEDIA_VOLUME_LEVEL}=low]) slot:not([name=low]) > *, 
  :host([${MediaUIAttributes.MEDIA_VOLUME_LEVEL}=low]) ::slotted(:not([slot=low])) {
    display: none !important;
  }

  :host([${MediaUIAttributes.MEDIA_VOLUME_LEVEL}=medium]) slot:not([name=medium]) > *, 
  :host([${MediaUIAttributes.MEDIA_VOLUME_LEVEL}=medium]) ::slotted(:not([slot=medium])) {
    display: none !important;
  }
  </style>

  <slot name="off">${offIcon}</slot>
  <slot name="low">${lowIcon}</slot>
  <slot name="medium">${lowIcon}</slot>
  <slot name="high">${highIcon}</slot>
`;

const updateAriaLabel = (el) => {
  const muted = el.getAttribute(MediaUIAttributes.MEDIA_VOLUME_LEVEL) === 'off';
  const label = muted ? verbs.UNMUTE() : verbs.MUTE();
  el.setAttribute('aria-label', label);
};

class MediaMuteButton extends MediaChromeButton {
  static get observedAttributes() {
    return [...super.observedAttributes, MediaUIAttributes.MEDIA_VOLUME_LEVEL];
  }

  constructor(options = {}) {
    super({ slotTemplate, ...options });
  }

  connectedCallback() {
    updateAriaLabel(this);
    super.connectedCallback();
  }

  attributeChangedCallback(attrName, oldValue, newValue) {
    if (attrName === MediaUIAttributes.MEDIA_VOLUME_LEVEL) {
      updateAriaLabel(this);
    }
    super.attributeChangedCallback(attrName, oldValue, newValue);
  }

  handleClick(_e) {
    const eventName =
      this.getAttribute(MediaUIAttributes.MEDIA_VOLUME_LEVEL) === 'off'
        ? MediaUIEvents.MEDIA_UNMUTE_REQUEST
        : MediaUIEvents.MEDIA_MUTE_REQUEST;
    this.dispatchEvent(
      new window.CustomEvent(eventName, { composed: true, bubbles: true })
    );
  }
}

defineCustomElement('media-mute-button', MediaMuteButton);

export default MediaMuteButton;
