import { MediaChromeSelectMenu } from './media-chrome-selectmenu.js';
import './media-audio-track-button.js';
import './media-audio-track-listbox.js';
import { MediaUIAttributes } from '../constants.js';
import { globalThis, document } from '../utils/server-safe-globals.js';

/**
 * @attr {string} mediaaudiotrackenabled - (read-only) Set to the selected audio track id.
 * @attr {(unavailable|unsupported)} mediaaudiotrackunavailable - (read-only) Set if audio track selection is unavailable.
 *
 * @csspart button - The default button that's in the shadow DOM.
 * @csspart listbox - The default listbox that's in the shadow DOM.
 * @csspart option - A part that targets each option of the listbox.
 */
class MediaAudioTrackSelectMenu extends MediaChromeSelectMenu {
  static get observedAttributes() {
    return [
      ...super.observedAttributes,
      MediaUIAttributes.MEDIA_AUDIO_TRACK_ENABLED,
      MediaUIAttributes.MEDIA_AUDIO_TRACK_UNAVAILABLE,
    ];
  }

  init() {
    const audioTrackButton = document.createElement('media-audio-track-button');
    audioTrackButton.part.add('button');
    audioTrackButton.preventClick = true;

    const audioTrackListbox = document.createElement(
      'media-audio-track-listbox'
    );
    audioTrackListbox.part.add('listbox');
    audioTrackListbox.setAttribute(
      'exportparts',
      'option, option-selected, indicator'
    );

    const buttonSlot = this.shadowRoot.querySelector('slot[name=button]');
    const listboxSlot = this.shadowRoot.querySelector('slot[name=listbox]');

    buttonSlot.textContent = '';
    listboxSlot.textContent = '';

    buttonSlot.append(audioTrackButton);
    listboxSlot.append(audioTrackListbox);
  }
}

if (!globalThis.customElements.get('media-audio-track-selectmenu')) {
  globalThis.customElements.define(
    'media-audio-track-selectmenu',
    MediaAudioTrackSelectMenu
  );
}

export { MediaAudioTrackSelectMenu };
export default MediaAudioTrackSelectMenu;
