import MediaTextDisplay from "./media-text-display.js";
import { globalThis } from "./utils/server-safe-globals.js";
import { MediaUIAttributes } from "./constants.js";
import { getStringAttr, setStringAttr } from "./utils/element-utils.js";

/**
 * @attr {string} mediapreviewchapter - (read-only) Set to the timeline preview chapter.
 *
 * @cssproperty [--media-preview-chapter-display-display = inline-flex] - `display` property of display.
 */
class MediaPreviewChapterDisplay extends MediaTextDisplay {
  #slot: HTMLSlotElement;

  static get observedAttributes(): string[] {
    return [
      ...super.observedAttributes,
      MediaUIAttributes.MEDIA_PREVIEW_CHAPTER,
    ];
  }

  constructor() {
    super();
    this.#slot = this.shadowRoot.querySelector("slot") as HTMLSlotElement;
  }

  attributeChangedCallback(attrName: string, oldValue: string | null, newValue: string | null): void {
    super.attributeChangedCallback(attrName, oldValue, newValue);

    if (attrName === MediaUIAttributes.MEDIA_PREVIEW_CHAPTER) {
      // Only update if it changed, preview events are called a few times per second.
      if (newValue !== oldValue && newValue != null) {
        this.#slot.textContent = newValue;

        if (newValue !== "") {
