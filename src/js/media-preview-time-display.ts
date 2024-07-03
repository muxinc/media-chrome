import { MediaTextDisplay } from './media-text-display.js';
import { globalThis } from './utils/server-safe-globals.js';
import { formatTime } from './utils/time.js';
import { MediaUIAttributes } from './constants.js';
import { getNumericAttr, setNumericAttr } from './utils/element-utils.js';
// Todo: Use data locals: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleTimeString

/**
 * @attr {string} mediapreviewtime - (read-only) Set to the timeline preview time.
 *
 * @cssproperty [--media-preview-time-display-display = inline-flex] - `display` property of display.
 */
class MediaPreviewTimeDisplay extends MediaTextDisplay {
  #slot: HTMLSlotElement;

  static get observedAttributes() {
    return [...super.observedAttributes, MediaUIAttributes.MEDIA_PREVIEW_TIME];
  }

  constructor() {
    super();
    this.#slot = this.shadowRoot.querySelector('slot');
    this.#slot.textContent = formatTime(0);
  }

  attributeChangedCallback(
    attrName: string,
    oldValue: string | null,
    newValue: string | null
  ): void {
    super.attributeChangedCallback(attrName, oldValue, newValue);

    if (attrName === MediaUIAttributes.MEDIA_PREVIEW_TIME && newValue != null) {
      this.#slot.textContent = formatTime(parseFloat(newValue));
    }
  }

  /**
   * Timeline preview time
   */
  get mediaPreviewTime(): number | undefined {
    return getNumericAttr(this, MediaUIAttributes.MEDIA_PREVIEW_TIME);
  }

  set mediaPreviewTime(value: number | undefined) {
    setNumericAttr(this, MediaUIAttributes.MEDIA_PREVIEW_TIME, value);
  }
}

if (!globalThis.customElements.get('media-preview-time-display')) {
  globalThis.customElements.define(
    'media-preview-time-display',
    MediaPreviewTimeDisplay
  );
}

export default MediaPreviewTimeDisplay;
