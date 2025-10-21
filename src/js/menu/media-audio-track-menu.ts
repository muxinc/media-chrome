import { globalThis } from '../utils/server-safe-globals.js';
import { MediaUIAttributes, MediaUIEvents } from '../constants.js';
import { parseAudioTrackList } from '../utils/utils.js';
import {
  MediaChromeMenu,
  createMenuItem,
  createIndicator,
} from './media-chrome-menu.js';
import {
  getStringAttr,
  setStringAttr,
  getMediaController,
} from '../utils/element-utils.js';
import { TextTrackLike } from '../utils/TextTrackLike.js';

/**
 * @extends {MediaChromeMenu}
 * 
 * @slot - Default slotted elements.node
 * @slot header - An element shown at the top of the menu.
 * @slot checked-indicator - An icon element indicating a checked menu-item.
 *
 * @attr {string} mediaaudiotrackenabled - (read-only) Set to the enabled audio track.
 * @attr {string} mediaaudiotracklist - (read-only) Set to the audio track list.
 */
class MediaAudioTrackMenu extends MediaChromeMenu {
  static get observedAttributes() {
    return [
      ...super.observedAttributes,
      MediaUIAttributes.MEDIA_AUDIO_TRACK_LIST,
      MediaUIAttributes.MEDIA_AUDIO_TRACK_ENABLED,
      MediaUIAttributes.MEDIA_AUDIO_TRACK_UNAVAILABLE,
    ];
  }

  #audioTrackList: TextTrackLike[] = [];
  #prevState: string | undefined;

  attributeChangedCallback(
    attrName: string,
    oldValue: string | null,
    newValue: string | null
  ): void {
    super.attributeChangedCallback(attrName, oldValue, newValue);

    if (
      attrName === MediaUIAttributes.MEDIA_AUDIO_TRACK_ENABLED &&
      oldValue !== newValue
    ) {
      this.value = newValue;
    } else if (
      attrName === MediaUIAttributes.MEDIA_AUDIO_TRACK_LIST &&
      oldValue !== newValue
    ) {
      this.#audioTrackList = parseAudioTrackList(newValue ?? '');
      this.#render();
    }
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.addEventListener('change', this.#onChange);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener('change', this.#onChange);
  }

  /**
   * Returns the anchor element when it is a floating menu.
   */
  get anchorElement() {
    if (this.anchor !== 'auto') return super.anchorElement;
    return getMediaController(this)?.querySelector<HTMLElement>(
      'media-audio-track-menu-button'
    );
  }

  get mediaAudioTrackList(): TextTrackLike[] {
    return this.#audioTrackList;
  }

  set mediaAudioTrackList(list: TextTrackLike[]) {
    this.#audioTrackList = list;
    this.#render();
  }

  /**
   * Get enabled audio track id.
   */
  get mediaAudioTrackEnabled(): string {
    return (
      getStringAttr(this, MediaUIAttributes.MEDIA_AUDIO_TRACK_ENABLED) ?? ''
    );
  }

  set mediaAudioTrackEnabled(id: string) {
    setStringAttr(this, MediaUIAttributes.MEDIA_AUDIO_TRACK_ENABLED, id);
  }

  #render(): void {
    if (this.#prevState === JSON.stringify(this.mediaAudioTrackList)) return;
    this.#prevState = JSON.stringify(this.mediaAudioTrackList);

    const audioTrackList = this.mediaAudioTrackList;

    this.defaultSlot.textContent = '';
    
    audioTrackList.sort((a, b) => a.id.localeCompare(b.id, undefined, {numeric: true}));
    for (const audioTrack of audioTrackList) {
      const text = this.formatMenuItemText(audioTrack.label, audioTrack);

      const item = createMenuItem({
        type: 'radio',
        text,
        value: `${audioTrack.id}`,
        checked: audioTrack.enabled,
      });
      item.prepend(createIndicator(this, 'checked-indicator'));
      this.defaultSlot.append(item);
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
  globalThis.customElements.define(
    'media-audio-track-menu',
    MediaAudioTrackMenu
  );
}

export { MediaAudioTrackMenu };
export default MediaAudioTrackMenu;
