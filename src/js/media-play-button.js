import MediaChromeButton from './media-chrome-button.js';
import {
  Window as window,
  Document as document,
} from './utils/server-safe-globals.js';
import { defineCustomElement } from './utils/defineCustomElement.js';
import { MediaUIEvents, MediaUIAttributes } from './constants.js';
import { verbs } from './labels/labels.js';

const playIcon = `<svg aria-hidden="true" viewBox="0 0 18 18">
  <path d="M3 18L18 9L3 0V18Z"/>
</svg>`;

const pauseIcon = `<svg aria-hidden="true" viewBox="0 0 18 18">
  <path d="M3 17H7V1H3V17ZM11 1V17H15V1H11Z"/>
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

  handleClick(_e) {
    const eventName =
      this.getAttribute(MediaUIAttributes.MEDIA_PAUSED) != null
        ? MediaUIEvents.MEDIA_PLAY_REQUEST
        : MediaUIEvents.MEDIA_PAUSE_REQUEST;
    this.dispatchEvent(
      new window.CustomEvent(eventName, { composed: true, bubbles: true })
    );
  }
}

defineCustomElement('media-play-button', MediaPlayButton);

export default MediaPlayButton;
