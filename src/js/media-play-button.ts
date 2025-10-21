import { MediaChromeButton } from './media-chrome-button.js';
import { globalThis } from './utils/server-safe-globals.js';
import { MediaUIEvents, MediaUIAttributes } from './constants.js';
import { t } from './utils/i18n.js';
import { getBooleanAttr, setBooleanAttr } from './utils/element-utils.js';

const playIcon = `<svg aria-hidden="true" viewBox="0 0 24 24">
  <path d="m6 21 15-9L6 3v18Z"/>
</svg>`;

const pauseIcon = `<svg aria-hidden="true" viewBox="0 0 24 24">
  <path d="M6 20h4V4H6v16Zm8-16v16h4V4h-4Z"/>
</svg>`;

function getSlotTemplateHTML(_attrs: Record<string, string>) {
  return /*html*/ `
    <style>
      :host([${MediaUIAttributes.MEDIA_PAUSED}]) slot[name=pause],
      :host(:not([${MediaUIAttributes.MEDIA_PAUSED}])) slot[name=play] {
        display: none !important;
      }

      :host([${MediaUIAttributes.MEDIA_PAUSED}]) slot[name=tooltip-pause],
      :host(:not([${MediaUIAttributes.MEDIA_PAUSED}])) slot[name=tooltip-play] {
        display: none;
      }
    </style>

    <slot name="icon">
      <slot name="play">${playIcon}</slot>
      <slot name="pause">${pauseIcon}</slot>
    </slot>
  `;
}

function getTooltipContentHTML() {
  return /*html*/ `
    <slot name="tooltip-play">${t('Play')}</slot>
    <slot name="tooltip-pause">${t('Pause')}</slot>
  `;
}

const updateAriaLabel = (el: MediaPlayButton) => {
  const label = el.mediaPaused ? t('play') : t('pause');
  el.setAttribute('aria-label', label);
};

/**
 * @slot play - An element shown when the media is paused and pressing the button will start media playback.
 * @slot pause - An element shown when the media is playing and pressing the button will pause media playback.
 * @slot icon - An element for representing play and pause states in a single icon
 *
 * @attr {boolean} mediapaused - (read-only) Present if the media is paused.
 *
 * @cssproperty [--media-play-button-display = inline-flex] - `display` property of button.
 */
class MediaPlayButton extends MediaChromeButton {
  static getSlotTemplateHTML = getSlotTemplateHTML;
  static getTooltipContentHTML = getTooltipContentHTML;

  static get observedAttributes(): string[] {
    return [
      ...super.observedAttributes,
      MediaUIAttributes.MEDIA_PAUSED,
      MediaUIAttributes.MEDIA_ENDED,
    ];
  }

  connectedCallback(): void {
    super.connectedCallback();
    updateAriaLabel(this);
  }

  attributeChangedCallback(
    attrName: string,
    oldValue: string | null,
    newValue: string | null
  ): void {
    super.attributeChangedCallback(attrName, oldValue, newValue);

    if (attrName === MediaUIAttributes.MEDIA_PAUSED || attrName === MediaUIAttributes.MEDIA_LANG) {
      updateAriaLabel(this);
    }
  }

  /**
   * Is the media paused
   */
  get mediaPaused(): boolean {
    return getBooleanAttr(this, MediaUIAttributes.MEDIA_PAUSED);
  }

  set mediaPaused(value: boolean) {
    setBooleanAttr(this, MediaUIAttributes.MEDIA_PAUSED, value);
  }

  handleClick(): void {
    const eventName = this.mediaPaused
      ? MediaUIEvents.MEDIA_PLAY_REQUEST
      : MediaUIEvents.MEDIA_PAUSE_REQUEST;
    this.dispatchEvent(
      new globalThis.CustomEvent(eventName, { composed: true, bubbles: true })
    );
  }
}

if (!globalThis.customElements.get('media-play-button')) {
  globalThis.customElements.define('media-play-button', MediaPlayButton);
}

export { MediaPlayButton };
export default MediaPlayButton;
