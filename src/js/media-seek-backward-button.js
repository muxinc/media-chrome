import MediaChromeButton from './media-chrome-button.js';
import { defineCustomElement } from './utils/defineCustomElement.js';
import {
  Window as window,
  Document as document,
} from './utils/server-safe-globals.js';
import { MediaUIEvents, MediaUIAttributes } from './constants.js';
import { verbs } from './labels/labels.js';

const backwardIcon =
  '<svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15 18"><defs><style>.cls-1{font-size:8px;font-family:Arial-BoldMT, Arial;font-weight:700;}</style></defs><title>Mux Player SVG Icons_v3</title><text class="cls-1" transform="translate(0.18 17.6)">30</text><path d="M8,3V0L2.37,4,8,7.94V5A5.54,5.54,0,0,1,9.9,15.48V17.6A7.5,7.5,0,0,0,8,3Z"/></svg>';

const slotTemplate = document.createElement('template');
slotTemplate.innerHTML = `  
  <slot name="backward">${backwardIcon}</slot>
`;

const DEFAULT_TIME = 0;
const DEFAULT_SEEK_OFFSET = -30;

const updateAriaLabel = (el) => {
  // NOTE: seek direction is described via text, so always use positive numeric representation
  const seekOffset = Math.abs(DEFAULT_SEEK_OFFSET);
  const label = verbs.SEEK_BACK_N_SECS({ seekOffset });
  el.setAttribute('aria-label', label);
};

class MediaSeekBackwardButton extends MediaChromeButton {
  static get observedAttributes() {
    return [...super.observedAttributes, MediaUIAttributes.MEDIA_CURRENT_TIME];
  }

  constructor(options = {}) {
    super({ slotTemplate, ...options });
  }

  connectedCallback() {
    // NOTE: currently don't support changing the seek value, so only need to set this once on initialization.
    updateAriaLabel(this);
    super.connectedCallback();
  }

  handleClick() {
    const currentTimeStr = this.getAttribute(
      MediaUIAttributes.MEDIA_CURRENT_TIME
    );
    const currentTime =
      currentTimeStr && !Number.isNaN(+currentTimeStr)
        ? +currentTimeStr
        : DEFAULT_TIME;
    const detail = Math.max(currentTime + DEFAULT_SEEK_OFFSET, 0);
    const evt = new window.CustomEvent(MediaUIEvents.MEDIA_SEEK_REQUEST, {
      composed: true,
      bubbles: true,
      detail,
    });
    this.dispatchEvent(evt);
  }
}

defineCustomElement('media-seek-backward-button', MediaSeekBackwardButton);

export default MediaSeekBackwardButton;
