import MediaChromeButton from './media-chrome-button.js';
import { window, document } from './utils/server-safe-globals.js';
import { MediaUIEvents, MediaUIAttributes } from './constants.js';
import { updateAriaLabel, updateSeekIconValue } from './utils/seek';

export const Attributes = {
  SEEK_OFFSET: 'seekoffset',
};

const DEFAULT_SEEK_OFFSET = '30';

const backwardIcon = `<svg aria-hidden="true" viewBox="0 0 20 24"><defs><style>.text{font-size:8px;font-family:Arial-BoldMT, Arial;font-weight:700;}</style></defs><text class="text value" transform="translate(2.18 19.87)">${DEFAULT_SEEK_OFFSET}</text><path d="M10 6V3L4.37 7 10 10.94V8a5.54 5.54 0 0 1 1.9 10.48v2.12A7.5 7.5 0 0 0 10 6Z"/></svg>`;

const slotTemplate = document.createElement('template');
slotTemplate.innerHTML = `
  <slot name="backward">${backwardIcon}</slot>
`;

const DEFAULT_TIME = 0;

/**
 * @slot backward - The element shown for the seek backward button’s display.
 *
 * @attr {string} seekoffset - Adjusts how much time (in seconds) the playhead should seek backward.
 * @attr {string} mediacurrenttime - (read-only) Set to the current media time.
 *
 * @cssproperty [--media-seek-backward-button-display = inline-flex] - `display` property of button.
 */
class MediaSeekBackwardButton extends MediaChromeButton {
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
    if (!this.hasAttribute(Attributes.SEEK_OFFSET)) {
      this.setAttribute(Attributes.SEEK_OFFSET, DEFAULT_SEEK_OFFSET);
    }
    updateAriaLabel(this);
    updateSeekIconValue(this);
    super.connectedCallback();
  }

  attributeChangedCallback(attrName, _oldValue, newValue) {
    if (attrName === Attributes.SEEK_OFFSET) {
      if (newValue == undefined) {
        this.setAttribute(Attributes.SEEK_OFFSET, DEFAULT_SEEK_OFFSET);
      }
      updateSeekIconValue(this);
      updateAriaLabel(this);
    }

    super.attributeChangedCallback(attrName, _oldValue, newValue);
  }

  // Own props

  /**
   * @type {number} Seek amount in seconds
   */
  get seekOffset() {
    return +this.getAttribute(Attributes.SEEK_OFFSET);
  }

  set seekOffset(value) {
    // avoid triggeting a set if no change
    if (value === this.seekOffset) return;
    this.setAttribute(Attributes.SEEK_OFFSET, value.toString(10));
  }

  // Props derived from Media UI Attributes

  /**
   * The current time
   * @type {number | undefined} In seconds
   */
  get mediaCurrentTime() {
    const attrVal = this.getAttribute(MediaUIAttributes.MEDIA_CURRENT_TIME);
    return attrVal != null ? +attrVal : undefined;
  }

  set mediaCurrentTime(time) {
    this.setAttribute(MediaUIAttributes.MEDIA_CURRENT_TIME, time.toString(10));
  }

  handleClick() {
    const currentTimeStr = this.getAttribute(
      MediaUIAttributes.MEDIA_CURRENT_TIME
    );
    const seekOffset = +this.getAttribute(Attributes.SEEK_OFFSET);
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
  window.customElements.define(
    'media-seek-backward-button',
    MediaSeekBackwardButton
  );
}

export default MediaSeekBackwardButton;
