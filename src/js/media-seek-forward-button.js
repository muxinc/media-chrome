import MediaChromeButton from './media-chrome-button.js';
import { defineCustomElement } from './utils/defineCustomElement.js';
import {
  Window as window,
  Document as document,
} from './utils/server-safe-globals.js';
import { MediaUIEvents, MediaUIAttributes } from './constants.js';
import { verbs } from './labels/labels.js';

const forwardIcon =
  '<svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15 18"><defs><style>.cls-1{font-size:8px;font-family:Arial-BoldMT, Arial;font-weight:700;}</style></defs><title>Mux Player SVG Icons_v3</title><text class="cls-1" transform="translate(5.9 17.6)">30</text><path d="M7,3V0l5.61,4L7,7.94V5A5.54,5.54,0,0,0,5.1,15.48V17.6A7.5,7.5,0,0,1,7,3Z"/></svg>';

const slotTemplate = document.createElement('template');
slotTemplate.innerHTML = `  
  <slot name="forward">${forwardIcon}</slot>
`;

const DEFAULT_TIME = 0;
const DEFAULT_SEEK_OFFSET = 30;

const updateAriaLabel = (el) => {
  // NOTE: seek direction is described via text, so always use positive numeric representation
  const seekOffset = Math.abs(DEFAULT_SEEK_OFFSET);
  const label = verbs.SEEK_FORWARD_N_SECS({ seekOffset });
  el.setAttribute('aria-label', label);
};

class MediaSeekForwardButton extends MediaChromeButton {
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
    const detail = currentTime + DEFAULT_SEEK_OFFSET;
    const evt = new window.CustomEvent(MediaUIEvents.MEDIA_SEEK_REQUEST, {
      composed: true,
      bubbles: true,
      detail,
    });
    this.dispatchEvent(evt);
  }
}

defineCustomElement('media-seek-forward-button', MediaSeekForwardButton);

export default MediaSeekForwardButton;
