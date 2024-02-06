import MediaTextDisplay from './media-text-display.js';
import { globalThis } from './utils/server-safe-globals.js';
import { MediaUIAttributes } from './constants.js';
import { getStringAttr, setStringAttr } from './utils/element-utils.js';

/**
 * @attr {string} mediapreviewchapter - (read-only) Set to the timeline preview chapter.
 *
 * @cssproperty [--media-preview-chapter-display-display = inline-flex] - `display` property of display.
 */
class MediaPreviewChapterDisplay extends MediaTextDisplay {
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

    if (attrName === MediaUIAttributes.MEDIA_PREVIEW_CHAPTER) {

      // Only update if it changed, preview events are called a few times per second.
      if (newValue !== oldValue) {

        if (newValue == null) {
          this.#slot.textContent = '';
          this.removeAttribute('aria-valuetext');
          return;
        }

        this.#slot.textContent = newValue;
        this.setAttribute('aria-valuetext', `chapter: ${newValue}`);
      }
    }
  }

  /**
   * @type {string | undefined} Timeline preview chapter
   */
  get mediaPreviewChapter() {
    return getStringAttr(this, MediaUIAttributes.MEDIA_PREVIEW_CHAPTER);
  }

  set mediaPreviewChapter(value) {
    setStringAttr(this, MediaUIAttributes.MEDIA_PREVIEW_CHAPTER, value);
  }
}

if (!globalThis.customElements.get('media-preview-chapter-display')) {
  globalThis.customElements.define('media-preview-chapter-display', MediaPreviewChapterDisplay);
}

export default MediaPreviewChapterDisplay;
