import { MediaChromeMenu, createMenuItem, createIndicator } from './media-chrome-menu.js';
import './media-chrome-menu-item.js';
import { globalThis } from '../../utils/server-safe-globals.js';
import { getStringAttr, setStringAttr } from '../../utils/element-utils.js';
import { parseAudioTrackList } from '../../utils/utils.js';
import { MediaUIAttributes, MediaUIEvents } from '../../constants.js';

/**
 * @attr {string} mediaaudiotrackenabled - (read-only) Set to the enabled audio track.
 * @attr {string} mediaaudiotracklist - (read-only) Set to the audio track list.
 */
class MediaAudioTrackMenu extends MediaChromeMenu {
  static get observedAttributes() {
    return [
      ...super.observedAttributes,
      MediaUIAttributes.MEDIA_AUDIO_TRACK_LIST,
      MediaUIAttributes.MEDIA_AUDIO_TRACK_ENABLED,
    ];
  }

  #audioTrackList = [];
  #prevState;

  attributeChangedCallback(attrName, oldValue, newValue) {
    super.attributeChangedCallback(attrName, oldValue, newValue);

    if (attrName === MediaUIAttributes.MEDIA_AUDIO_TRACK_ENABLED && oldValue !== newValue) {
      this.value = newValue;
    }
    else if (attrName === MediaUIAttributes.MEDIA_AUDIO_TRACK_LIST && oldValue !== newValue) {
      this.#audioTrackList = parseAudioTrackList(newValue);
      this.#render();
    }
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('change', this.#onChange);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('change', this.#onChange);
  }

  get mediaAudioTrackList() {
    return this.#audioTrackList;
  }

  set mediaAudioTrackList(list) {
    this.#audioTrackList = list;
    this.#render();
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

  #render() {
    if (this.#prevState === JSON.stringify(this.mediaAudioTrackList)) return;
    this.#prevState = JSON.stringify(this.mediaAudioTrackList);

    const audioTrackList = this.mediaAudioTrackList;

    const container = this.shadowRoot.querySelector('#container');
    container.textContent = '';

    for (const audioTrack of audioTrackList) {

      const text = this.formatMenuItemText(
        audioTrack.label,
        audioTrack
      );

      /** @type {HTMLOptionElement} */
      const option = createMenuItem({
        type: 'radio',
        text,
        value: `${audioTrack.id}`,
        checked: audioTrack.enabled
      });
      option.prepend(createIndicator(this, 'check-indicator'));

      container.append(option);
    }
  }

  #onChange() {
    if (this.value == null) return;

    const event = new globalThis.CustomEvent(
      MediaUIEvents.MEDIA_AUDIO_TRACK_REQUEST,
      {
        composed: true,
        bubbles: true,
        detail: this.value,
      }
    );
    this.dispatchEvent(event);
  }
}

if (!globalThis.customElements.get('media-audio-track-menu')) {
  globalThis.customElements.define('media-audio-track-menu', MediaAudioTrackMenu);
}

export { MediaAudioTrackMenu };
export default MediaAudioTrackMenu;
