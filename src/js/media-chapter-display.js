import MediaTextDisplay from './media-text-display.js';
import { window } from './utils/server-safe-globals.js';
import { MediaUIAttributes } from './constants.js';
// import { nouns } from './labels/labels.js';

export const Attributes = {
};

const updateAriaValueText = (el) => {
  el.setAttribute('aria-valuetext', 'Something');
};

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

  connectedCallback() {
    if (!this.hasAttribute('disabled')) {
      this.enable();
    }

    // this.setAttribute('role', 'progressbar');
    // this.setAttribute('aria-label', nouns.PLAYBACK_TIME());

    super.connectedCallback();
  }

  disconnectedCallback() {
    this.disable();
    super.disconnectedCallback();
  }

  attributeChangedCallback(attrName, oldValue, newValue) {
    if (
      [
        MediaUIAttributes.MEDIA_PREVIEW_CHAPTER,
      ].includes(attrName)
    ) {
      this.update();
    } else if (attrName === 'disabled' && newValue !== oldValue) {
      if (newValue == null) {
        this.enable();
      } else {
        this.disable();
      }
    }

    super.attributeChangedCallback(attrName, oldValue, newValue);
  }

  enable() {
    this.tabIndex = 0;
  }

  disable() {
    this.tabIndex = -1;
  }

  update() {
    const label = this.getAttribute(MediaUIAttributes.MEDIA_PREVIEW_CHAPTER);
    updateAriaValueText(this);
    // Only update if it changed, timeupdate events are called a few times per second.
    if (label !== this.#slot.innerHTML) {
      this.#slot.innerHTML = label;
    }
  }
}

if (!window.customElements.get('media-chapter-display')) {
  window.customElements.define('media-chapter-display', MediaChapterDisplay);
}

export default MediaChapterDisplay;
