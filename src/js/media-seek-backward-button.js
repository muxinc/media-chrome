import MediaChromeButton from './media-chrome-button.js';
import { window, document } from './utils/server-safe-globals.js';
import { MediaUIEvents, MediaUIAttributes } from './constants.js';
import { verbs } from './labels/labels.js';
import { getSlotted, updateIconText } from './utils/element-utils.js';

const DEFAULT_SEEK_OFFSET = '30';

const backwardIcon =
  `<svg aria-hidden="true" viewBox="0 0 20 24"><defs><style>.text{font-size:8px;font-family:Arial-BoldMT, Arial;font-weight:700;}</style></defs><text class="text value" transform="translate(2.18 19.87)">${DEFAULT_SEEK_OFFSET}</text><path d="M10 6V3L4.37 7 10 10.94V8a5.54 5.54 0 0 1 1.9 10.48v2.12A7.5 7.5 0 0 0 10 6Z"/></svg>`;

const slotTemplate = document.createElement('template');
slotTemplate.innerHTML = `  
  <slot name="backward">${backwardIcon}</slot>
`;

const DEFAULT_TIME = 0;

const updateAriaLabel = (el) => {
  // NOTE: seek direction is described via text, so always use positive numeric representation
  const seekOffset = Math.abs(+el.getAttribute('seek-offset'));
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
    return [
      ...super.observedAttributes,
      'seek-offset',
      MediaUIAttributes.MEDIA_CURRENT_TIME
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
    const detail = Math.max(currentTime - seekOffset, 0);
    const evt = new window.CustomEvent(MediaUIEvents.MEDIA_SEEK_REQUEST, {
      composed: true,
      bubbles: true,
      detail,
    });
    this.dispatchEvent(evt);
  }
}

if (!window.customElements.get('media-seek-backward-button')) {
  window.customElements.define('media-seek-backward-button', MediaSeekBackwardButton);
}

export default MediaSeekBackwardButton;
