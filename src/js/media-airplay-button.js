import MediaChromeButton from './media-chrome-button.js';
import { defineCustomElement } from './utils/defineCustomElement.js';
import {
  Window as window,
  Document as document,
} from './utils/server-safe-globals.js';
import { MediaUIEvents, MediaUIAttributes } from './constants.js';
import { verbs } from './labels/labels.js';
const airplayIcon = `<svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 18"><title>Mux Player SVG Icons_v3</title><path d="M19.13,0H.87A.87.87,0,0,0,0,.87V14.13A.87.87,0,0,0,.87,15h3.4L6,13H2V2H18V13H14l1.72,2h3.4a.87.87,0,0,0,.87-.87V.87A.87.87,0,0,0,19.13,0ZM10.38,11.44a.5.5,0,0,0-.76,0L4.71,17.17a.5.5,0,0,0,.38.83h9.82a.5.5,0,0,0,.38-.83Z"/></svg>`;

const slotTemplate = document.createElement('template');
// Followup task: determine how/where we want to handle checks and style updates for (1) unsupported & (2) unavailable
slotTemplate.innerHTML = `
  <style>
  </style>

  <slot name="airplay">${airplayIcon}</slot>
`;

class MediaAirplayButton extends MediaChromeButton {
  static get observedAttributes() {
    return [...super.observedAttributes];
  }

  constructor(options = {}) {
    super({ slotTemplate, ...options });
  }

  connectedCallback() {
    this.setAttribute('aria-label', verbs.AIRPLAY());
    super.connectedCallback();
  }

  handleClick(_e) {
    const evt = new window.CustomEvent(MediaUIEvents.MEDIA_AIRPLAY_REQUEST, {
      composed: true,
      bubbles: true,
    });
    this.dispatchEvent(evt);
  }
}

defineCustomElement('media-airplay-button', MediaAirplayButton);

export default MediaAirplayButton;
