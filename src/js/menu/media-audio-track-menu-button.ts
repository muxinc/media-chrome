import { MediaUIAttributes } from '../constants.js';
import { MediaChromeMenuButton } from './media-chrome-menu-button.js';
import { globalThis } from '../utils/server-safe-globals.js';
import {
  getStringAttr,
  setStringAttr,
  getMediaController,
} from '../utils/element-utils.js';
import { t } from '../utils/i18n.js';

const audioTrackIcon = /*html*/ `<svg aria-hidden="true" viewBox="0 0 24 24">
  <path d="M11 17H9.5V7H11v10Zm-3-3H6.5v-4H8v4Zm6-5h-1.5v6H14V9Zm3 7h-1.5V8H17v8Z"/>
  <path d="M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10Zm-2 0a8 8 0 1 0-16 0 8 8 0 0 0 16 0Z"/>
</svg>`;

function getSlotTemplateHTML() {
  return /*html*/ `
    <style>
      :host([aria-expanded="true"]) slot[name=tooltip] {
        display: none;
      }
    </style>
    <slot name="icon">${audioTrackIcon}</slot>
  `;
}

function getTooltipContentHTML() {
  return t('Audio');
}

const updateAriaLabel = (el: MediaAudioTrackMenuButton) => {
  const label = t('Audio')
  el.setAttribute('aria-label', label);
};

/**
 * @attr {string} mediaaudiotrackenabled - (read-only) Set to the selected audio track id.
 * @attr {(unavailable|unsupported)} mediaaudiotrackunavailable - (read-only) Set if audio track selection is unavailable.
 *
 * @cssproperty [--media-audio-track-menu-button-display = inline-flex] - `display` property of button.
 */
class MediaAudioTrackMenuButton extends MediaChromeMenuButton {
  static getSlotTemplateHTML = getSlotTemplateHTML;
  static getTooltipContentHTML = getTooltipContentHTML;

  static get observedAttributes(): string[] {
    return [
      ...super.observedAttributes,
      MediaUIAttributes.MEDIA_AUDIO_TRACK_ENABLED,
      MediaUIAttributes.MEDIA_AUDIO_TRACK_UNAVAILABLE,
    ];
  }

  connectedCallback(): void {
    super.connectedCallback();
    updateAriaLabel(this);
  }

  attributeChangedCallback(
    attrName: string,
    _oldValue: string | null,
    newValue: string | null
  ): void {
    super.attributeChangedCallback(attrName, _oldValue, newValue);

    if (attrName === MediaUIAttributes.MEDIA_LANG){
      updateAriaLabel(this);
    }
  }

  /**
   * Returns the element with the id specified by the `invoketarget` attribute.
   * @return {HTMLElement | null}
   */
  get invokeTargetElement(): HTMLElement | null {
    if (this.invokeTarget != undefined) return super.invokeTargetElement;
    return getMediaController(this)?.querySelector('media-audio-track-menu');
  }

  /**
   * Get enabled audio track id.
   * @return {string}
   */
  get mediaAudioTrackEnabled(): string {
    return (
      getStringAttr(this, MediaUIAttributes.MEDIA_AUDIO_TRACK_ENABLED) ?? ''
    );
  }

  set mediaAudioTrackEnabled(id: string) {
    setStringAttr(this, MediaUIAttributes.MEDIA_AUDIO_TRACK_ENABLED, id);
  }
}

if (!globalThis.customElements.get('media-audio-track-menu-button')) {
  globalThis.customElements.define(
    'media-audio-track-menu-button',
    MediaAudioTrackMenuButton
  );
}

export { MediaAudioTrackMenuButton };
export default MediaAudioTrackMenuButton;
