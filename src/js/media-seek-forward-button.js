import { MediaChromeButton } from './media-chrome-button.js';
import { window, document } from './utils/server-safe-globals.js';
import { MediaUIEvents, MediaUIAttributes } from './constants.js';
import { updateAriaLabel, updateSeekIconValue } from './utils/seek.js';
import { getNumericAttr, setNumericAttr } from './utils/element-utils.js';

export const Attributes = {
  SEEK_OFFSET: 'seekoffset',
};

const DEFAULT_SEEK_OFFSET = 30;

const forwardIcon = `<svg aria-hidden="true" viewBox="0 0 20 24"><defs><style>.text{font-size:8px;font-family:Arial-BoldMT, Arial;font-weight:700;}</style></defs><text class="text value" transform="translate(8.9 19.87)">${DEFAULT_SEEK_OFFSET}</text><path d="M10 6V3l5.61 4L10 10.94V8a5.54 5.54 0 0 0-1.9 10.48v2.12A7.5 7.5 0 0 1 10 6Z"/></svg>`;

const slotTemplate = document.createElement('template');
slotTemplate.innerHTML = `
  <slot name="forward">${forwardIcon}</slot>
`;

const DEFAULT_TIME = 0;

/**
 * @slot forward - The element shown for the seek forward button’s display.
 *
 * @attr {string} seekoffset - Adjusts how much time (in seconds) the playhead should seek forward.
 * @attr {string} mediacurrenttime - (read-only) Set to the current media time.
 *
 * @cssproperty [--media-seek-forward-button-display = inline-flex] - `display` property of button.
 */
class MediaSeekForwardButton extends MediaChromeButton {
  static get observedAttributes() {
    return [
      ...super.observedAttributes,
      MediaUIAttributes.MEDIA_CURRENT_TIME,
      Attributes.SEEK_OFFSET,
    ];
  }

  constructor(options = {}) {
    super({ slotTemplate, ...options });
  }

  connectedCallback() {
    updateAriaLabel(this);
    updateSeekIconValue(this, 'forward');
    super.connectedCallback();
  }

  attributeChangedCallback(attrName, _oldValue, newValue) {
    if (attrName === Attributes.SEEK_OFFSET) {
      updateSeekIconValue(this, 'forward');
      updateAriaLabel(this);
    }

    super.attributeChangedCallback(attrName, _oldValue, newValue);
  }

  // Own props

  /**
   * @type {number | undefined} Seek amount in seconds
   */
  get seekOffset() {
    return getNumericAttr(this, Attributes.SEEK_OFFSET) ?? DEFAULT_SEEK_OFFSET;
  }

  set seekOffset(value) {
    setNumericAttr(this, Attributes.SEEK_OFFSET, value);
  }

  // Props derived from Media UI Attributes

  /**
   * The current time
   * @type {number | undefined} In seconds
   */
  get mediaCurrentTime() {
    return getNumericAttr(this, MediaUIAttributes.MEDIA_CURRENT_TIME) ?? DEFAULT_TIME;
  }

  set mediaCurrentTime(time) {
    setNumericAttr(this, MediaUIAttributes.MEDIA_CURRENT_TIME, time);
  }

  handleClick() {
    const detail = this.mediaCurrentTime + this.seekOffset;
    const evt = new window.CustomEvent(MediaUIEvents.MEDIA_SEEK_REQUEST, {
      composed: true,
      bubbles: true,
      detail,
    });
    this.dispatchEvent(evt);
  }
}

if (!window.customElements.get('media-seek-forward-button')) {
  window.customElements.define(
    'media-seek-forward-button',
    MediaSeekForwardButton
  );
}

export default MediaSeekForwardButton;
