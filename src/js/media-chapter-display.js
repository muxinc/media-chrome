import MediaTextDisplay from './media-text-display.js';
import { globalThis } from './utils/server-safe-globals.js';
import { MediaUIAttributes } from './constants.js';

class MediaChapterDisplay extends MediaTextDisplay {
  #slot;

  static get observedAttributes() {
    return [
      ...super.observedAttributes,
      MediaUIAttributes.MEDIA_PREVIEW_CHAPTER
    ];
  }

  constructor() {
    super();
    this.#slot = this.shadowRoot.querySelector('slot');
  }

  attributeChangedCallback(attrName, oldValue, newValue) {
    super.attributeChangedCallback(attrName, oldValue, newValue);

    if (attrName === MediaUIAttributes.MEDIA_PREVIEW_CHAPTER && newValue != null) {

      // Only update if it changed, preview events are called a few times per second.
      if (newValue !== this.#slot.textContent) {
        this.#slot.textContent = newValue;
        this.setAttribute('aria-valuetext', newValue);
      }
    }
  }
}

if (!globalThis.customElements.get('media-chapter-display')) {
  globalThis.customElements.define('media-chapter-display', MediaChapterDisplay);
}

export default MediaChapterDisplay;
