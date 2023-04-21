import MediaChromeButton from './media-chrome-button.js';
import { window, document } from './utils/server-safe-globals.js';
import { MediaUIEvents, MediaUIAttributes } from './constants.js';
import { verbs } from './labels/labels.js';

const playIcon = `<svg aria-hidden="true" viewBox="0 0 24 24">
  <path d="m6 21 15-9L6 3v18Z"/>
</svg>`;

const pauseIcon = `<svg aria-hidden="true" viewBox="0 0 24 24">
  <path d="M6 20h4V4H6v16Zm8-16v16h4V4h-4Z"/>
</svg>`;

const slotTemplate = document.createElement('template');
slotTemplate.innerHTML = `
  <style>
  :host([${MediaUIAttributes.MEDIA_PAUSED}]) slot[name=pause] > *, 
  :host([${MediaUIAttributes.MEDIA_PAUSED}]) ::slotted([slot=pause]) {
    display: none !important;
  }

  :host(:not([${MediaUIAttributes.MEDIA_PAUSED}])) slot[name=play] > *, 
  :host(:not([${MediaUIAttributes.MEDIA_PAUSED}])) ::slotted([slot=play]) {
    display: none !important;
  }
  </style>

  <slot name="play">${playIcon}</slot>
  <slot name="pause">${pauseIcon}</slot>
`;

const updateAriaLabel = (el) => {
  const paused = el.getAttribute(MediaUIAttributes.MEDIA_PAUSED) != null;
  const label = paused ? verbs.PLAY() : verbs.PAUSE();
  el.setAttribute('aria-label', label);
};

/**
 * @slot play
 * @slot pause
 *
 * @cssproperty [--media-play-button-display = inline-flex]
 */
class MediaPlayButton extends MediaChromeButton {
  static get observedAttributes() {
    return [...super.observedAttributes, MediaUIAttributes.MEDIA_PAUSED];
  }

  constructor(options = {}) {
    super({ slotTemplate, ...options });
  }

  connectedCallback() {
    updateAriaLabel(this);
    super.connectedCallback();
  }

  attributeChangedCallback(attrName, oldValue, newValue) {
    if (attrName === MediaUIAttributes.MEDIA_PAUSED) {
      updateAriaLabel(this);
    }
    super.attributeChangedCallback(attrName, oldValue, newValue);
  }

  handleClick() {
    const eventName =
      this.getAttribute(MediaUIAttributes.MEDIA_PAUSED) != null
        ? MediaUIEvents.MEDIA_PLAY_REQUEST
        : MediaUIEvents.MEDIA_PAUSE_REQUEST;
    this.dispatchEvent(
      new window.CustomEvent(eventName, { composed: true, bubbles: true })
    );
  }
}

if (!window.customElements.get('media-play-button')) {
  window.customElements.define('media-play-button', MediaPlayButton);
}

export default MediaPlayButton;
