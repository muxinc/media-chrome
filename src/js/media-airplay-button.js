import MediaChromeButton from './media-chrome-button.js';
import { defineCustomElement } from './utils/defineCustomElement.js';
import {
  Window as window,
  Document as document,
} from './utils/server-safe-globals.js';
import { MediaUIEvents, MediaUIAttributes } from './constants.js';
import { verbs } from './labels/labels.js';
const airplayIcon = `<svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 18"><defs><style>.cls-1{fill:var(--media-icon-color, #eee);}</style></defs><title>Mux Player SVG Icons_v2</title><path class="cls-1" d="M10.19,11.22a.25.25,0,0,0-.38,0L4.35,17.59a.25.25,0,0,0,.19.41H15.46a.25.25,0,0,0,.19-.41Z"/><path class="cls-1" d="M19,0H1A1,1,0,0,0,0,1V14a1,1,0,0,0,1,1H3.94L5,13.75H1.25V1.25h17.5v12.5H15L16.06,15H19a1,1,0,0,0,1-1V1A1,1,0,0,0,19,0Z"/></svg>`;

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
