import { MediaChromeButton } from '../media-chrome-button.js';
import { globalThis, document } from '../utils/server-safe-globals.js';
import { getStringAttr, setStringAttr } from '../utils/element-utils.js';
import { MediaUIAttributes } from '../constants.js';

const audioTrackIcon = /*html*/ `<svg aria-hidden="true" viewBox="0 0 24 24">
  <path d="M11 17H9.5V7H11v10Zm-3-3H6.5v-4H8v4Zm6-5h-1.5v6H14V9Zm3 7h-1.5V8H17v8Z"/>
  <path d="M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10Zm-2 0a8 8 0 1 0-16 0 8 8 0 0 0 16 0Z"/>
</svg>`;

const slotTemplate = document.createElement('template');
slotTemplate.innerHTML = /*html*/ `
  <slot name="icon">${audioTrackIcon}</slot>
`;

/**
 * @attr {string} mediaaudiotrackenabled - (read-only) Set to the selected audio track id.
 * @attr {(unavailable|unsupported)} mediaaudiotrackunavailable - (read-only) Set if audio track selection is unavailable.
 *
 * @cssproperty [--media-audio-track-button-display = inline-flex] - `display` property of button.
 */
class MediaAudioTrackButton extends MediaChromeButton {
  static get observedAttributes() {
    return [
      ...super.observedAttributes,
      MediaUIAttributes.MEDIA_AUDIO_TRACK_ENABLED,
      MediaUIAttributes.MEDIA_AUDIO_TRACK_UNAVAILABLE,
    ];
  }

  constructor() {
    super({ slotTemplate });
  }

  /**
   * Get enabled audio track id.
   * @return {string}
   */
  get mediaAudioTrackEnabled() {
    return getStringAttr(this, MediaUIAttributes.MEDIA_AUDIO_TRACK_ENABLED);
  }

  set mediaAudioTrackEnabled(id) {
    setStringAttr(this, MediaUIAttributes.MEDIA_AUDIO_TRACK_ENABLED, id);
  }
}

if (!globalThis.customElements.get('media-audio-track-button')) {
  globalThis.customElements.define(
    'media-audio-track-button',
    MediaAudioTrackButton
  );
}

export { MediaAudioTrackButton };
export default MediaAudioTrackButton;
