import MediaChromeButton from './media-chrome-button.js';
import { defineCustomElement } from './utils/defineCustomElement.js';
import {
  Window as window,
  Document as document,
} from './utils/server-safe-globals.js';
import { MediaUIEvents, MediaUIAttributes } from './constants.js';
import { verbs } from './labels/labels.js';
import { getSlotted, updateIconText } from './utils/element-utils.js';

const DEFAULT_SEEK_OFFSET = 30;

const backwardIcon =
  `<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="-3 -3 24 24"><defs><style>.text{font-size:8px;font-family:Arial-BoldMT, Arial;font-weight:700;}</style></defs><text class="text value" transform="translate(1.68 17.6)">${DEFAULT_SEEK_OFFSET}</text><path d="M9.48,3V0L3.87,4l5.61,4V5a5.54,5.54,0,0,1,1.92,10.5V17.6A7.5,7.5,0,0,0,9.48,3Z"/></svg>`;

const slotTemplate = document.createElement('template');
slotTemplate.innerHTML = `  
  <slot name="backward">${backwardIcon}</slot>
`;

const DEFAULT_TIME = 0;

const updateAriaLabel = (el) => {
  // NOTE: seek direction is described via text, so always use positive numeric representation
  const seekOffset = Math.abs(DEFAULT_SEEK_OFFSET);
  const label = verbs.SEEK_BACK_N_SECS({ seekOffset });
  el.setAttribute('aria-label', label);
};

const updateSeekIconValue = (el) => {
  const svg = getSlotted(el, 'backward');
  const value = el.getAttribute('seek-offset');
  updateIconText(svg, value);
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
    if (!this.hasAttribute('seek-offset')) {
      this.setAttribute('seek-offset', DEFAULT_SEEK_OFFSET);
    }
    updateAriaLabel(this);
    updateSeekIconValue(this);
    super.connectedCallback();
  }

  attributeChangedCallback(attrName, _oldValue, newValue) {
    if (attrName === 'seek-offset') {
      if (newValue == undefined) {
        this.setAttribute('seek-offset', DEFAULT_SEEK_OFFSET);
      }
      updateSeekIconValue(this);
    }
  }

  handleClick() {
    const currentTimeStr = this.getAttribute(
      MediaUIAttributes.MEDIA_CURRENT_TIME
    );
    const seekOffset = +this.getAttribute('seek-offset');
    const currentTime =
      currentTimeStr && !Number.isNaN(+currentTimeStr)
        ? +currentTimeStr
        : DEFAULT_TIME;
    const detail = Math.max(currentTime - seekOffset, 0);
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
