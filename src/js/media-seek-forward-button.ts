import { MediaChromeButton } from './media-chrome-button.js';
import { globalThis, document } from './utils/server-safe-globals.js';
import { MediaUIEvents, MediaUIAttributes } from './constants.js';
import { getNumericAttr, setNumericAttr } from './utils/element-utils.js';
import { tooltipLabels, verbs } from './labels/labels.js';
import { getSlotted, updateIconText } from './utils/element-utils.js';

export const Attributes = {
  SEEK_OFFSET: 'seekoffset',
};

const DEFAULT_SEEK_OFFSET = 30;

const forwardIcon = `<svg aria-hidden="true" viewBox="0 0 20 24"><defs><style>.text{font-size:8px;font-family:Arial-BoldMT, Arial;font-weight:700;}</style></defs><text class="text value" transform="translate(8.9 19.87)">${DEFAULT_SEEK_OFFSET}</text><path d="M10 6V3l5.61 4L10 10.94V8a5.54 5.54 0 0 0-1.9 10.48v2.12A7.5 7.5 0 0 1 10 6Z"/></svg>`;

const slotTemplate: HTMLTemplateElement = document.createElement('template');
slotTemplate.innerHTML = `
  <slot name="icon">${forwardIcon}</slot>
`;

const DEFAULT_TIME = 0;

/**
 * @slot icon - The element shown for the seek forward button’s display.
 *
 * @attr {string} seekoffset - Adjusts how much time (in seconds) the playhead should seek forward.
 * @attr {string} mediacurrenttime - (read-only) Set to the current media time.
 *
 * @cssproperty [--media-seek-forward-button-display = inline-flex] - `display` property of button.
 */
class MediaSeekForwardButton extends MediaChromeButton {
  static get observedAttributes(): string[] {
    return [
      ...super.observedAttributes,
      MediaUIAttributes.MEDIA_CURRENT_TIME,
      Attributes.SEEK_OFFSET,
    ];
  }

  constructor(options = {}) {
    super({
      slotTemplate,
      tooltipContent: tooltipLabels.SEEK_FORWARD,
      ...options,
    });
  }

  connectedCallback(): void {
    this.seekOffset = getNumericAttr(
      this,
      Attributes.SEEK_OFFSET,
      DEFAULT_SEEK_OFFSET
    );
    super.connectedCallback();
  }

  attributeChangedCallback(
    attrName: string,
    _oldValue: string | null,
    newValue: string | null
  ): void {
    if (attrName === Attributes.SEEK_OFFSET) {
      this.seekOffset = getNumericAttr(
        this,
        Attributes.SEEK_OFFSET,
        DEFAULT_SEEK_OFFSET
      );
    }

    super.attributeChangedCallback(attrName, _oldValue, newValue);
  }

  // Own props

  /**
   * Seek amount in seconds
   */
  get seekOffset(): number {
    return getNumericAttr(this, Attributes.SEEK_OFFSET, DEFAULT_SEEK_OFFSET);
  }

  set seekOffset(value: number) {
    setNumericAttr(this, Attributes.SEEK_OFFSET, value);
    this.setAttribute(
      'aria-label',
      verbs.SEEK_FORWARD_N_SECS({ seekOffset: this.seekOffset })
    );
    updateIconText(getSlotted(this, 'icon'), this.seekOffset as any);
  }

  // Props derived from Media UI Attributes

  /**
   * The current time in seconds
   */
  get mediaCurrentTime(): number {
    return getNumericAttr(
      this,
      MediaUIAttributes.MEDIA_CURRENT_TIME,
      DEFAULT_TIME
    );
  }

  set mediaCurrentTime(time: number) {
    setNumericAttr(this, MediaUIAttributes.MEDIA_CURRENT_TIME, time);
  }

  handleClick(): void {
    const detail = this.mediaCurrentTime + this.seekOffset;
    const evt = new globalThis.CustomEvent(MediaUIEvents.MEDIA_SEEK_REQUEST, {
      composed: true,
      bubbles: true,
      detail,
    });
    this.dispatchEvent(evt);
  }
}

if (!globalThis.customElements.get('media-seek-forward-button')) {
  globalThis.customElements.define(
    'media-seek-forward-button',
    MediaSeekForwardButton
  );
}

export default MediaSeekForwardButton;
