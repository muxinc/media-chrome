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

const forwardIcon =
  `<svg aria-hidden="true" viewBox="0 0 20 24"><defs><style>.text{font-size:8px;font-family:Arial-BoldMT, Arial;font-weight:700;}</style></defs><text class="text value" transform="translate(8.9 19.87)">${DEFAULT_SEEK_OFFSET}</text><path d="M10 6V3l5.61 4L10 10.94V8a5.54 5.54 0 0 0-1.9 10.48v2.12A7.5 7.5 0 0 1 10 6Z"/></svg>`;

const slotTemplate = document.createElement('template');
slotTemplate.innerHTML = `  
  <slot name="forward">${forwardIcon}</slot>
`;

const DEFAULT_TIME = 0;

const updateAriaLabel = (el) => {
  // NOTE: seek direction is described via text, so always use positive numeric representation
  const seekOffset = Math.abs(+el.getAttribute('seek-offset'));
  const label = verbs.SEEK_FORWARD_N_SECS({ seekOffset });
  el.setAttribute('aria-label', label);
};

const updateSeekIconValue = (el) => {
  const svg = getSlotted(el, 'forward');
  const value = el.getAttribute('seek-offset');
  updateIconText(svg, value);
};

class MediaSeekForwardButton extends MediaChromeButton {
  static get observedAttributes() {
    return [
      ...super.observedAttributes,
      MediaUIAttributes.MEDIA_CURRENT_TIME,
      'seek-offset',
    ];
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
      updateAriaLabel(this);
    }

    super.attributeChangedCallback(attrName, _oldValue, newValue);
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
    const detail = currentTime + seekOffset;
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
