import MediaTextDisplay from './media-text-display.js';
import { globalThis } from './utils/server-safe-globals.js';
import { MediaUIAttributes } from './constants.js';
import {
  getNumericAttr,
  getStringAttr,
  setNumericAttr,
  setStringAttr,
} from './utils/element-utils.js';

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
      MediaUIAttributes.MEDIA_PREVIEW_CHAPTER,
      MediaUIAttributes.MEDIA_PREVIEW_TIME,
    ];
  }

  constructor() {
    super();
    this.#slot = this.shadowRoot.querySelector('slot');
  }

  attributeChangedCallback(attrName, oldValue, newValue) {
    super.attributeChangedCallback(attrName, oldValue, newValue);

    if (
      attrName === MediaUIAttributes.MEDIA_PREVIEW_CHAPTER &&
      newValue !== oldValue
    ) {
      this.#update();
    }
  }

  #update() {
    // Defer since state is updated one attr/prop at a time.
    queueMicrotask(() => {
      // Like other preview components, only update the actual UI state with set values
      if (this.mediaPreviewChapter != null) {
        this.#slot.textContent = this.mediaPreviewChapter;
        this.setAttribute(
          'aria-valuetext',
          `chapter: ${this.mediaPreviewChapter}`
        );
        // Except (unlike other preview components), clear state if there is no preview chapter
        // when there still is a preview time (aka there isn't a corresponding preview chapter for this time)
      } else if (!Number.isNaN(this.mediaPreviewTime)) {
        this.#slot.textContent = '';
        this.removeAttribute('aria-valuetext');
      }
    });
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

  /**
   * @type {number | undefined}
   */
  get mediaPreviewTime() {
    return getNumericAttr(this, MediaUIAttributes.MEDIA_PREVIEW_TIME);
  }

  set mediaPreviewTime(value) {
    setNumericAttr(this, MediaUIAttributes.MEDIA_PREVIEW_TIME, value);
  }
}

if (!globalThis.customElements.get('media-preview-chapter-display')) {
  globalThis.customElements.define(
    'media-preview-chapter-display',
    MediaPreviewChapterDisplay
  );
}

export default MediaPreviewChapterDisplay;
