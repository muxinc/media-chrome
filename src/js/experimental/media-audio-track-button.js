import { MediaChromeButton } from '../media-chrome-button.js';
import { globalThis, document } from '../utils/server-safe-globals.js';
import { getStringAttr, setStringAttr } from '../utils/element-utils.js';
import { MediaUIAttributes } from '../constants.js';

const audioTrackIcon = /*html*/`<svg aria-hidden="true" viewBox="0 0 24 24">
  <path d="M13.5 2.5h2v6h-2v-2h-11v-2h11v-2Zm4 2h4v2h-4v-2Zm-12 4h2v6h-2v-2h-3v-2h3v-2Zm4 2h12v2h-12v-2Zm1 4h2v6h-2v-2h-8v-2h8v-2Zm4 2h7v2h-7v-2Z" />
</svg>`;

const slotTemplate = document.createElement('template');
slotTemplate.innerHTML = /*html*/`
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
  globalThis.customElements.define('media-audio-track-button', MediaAudioTrackButton);
}

export { MediaAudioTrackButton };
export default MediaAudioTrackButton;
