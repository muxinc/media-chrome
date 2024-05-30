import { MediaChromeSelectMenu } from './media-chrome-selectmenu.js';
import '../media-playback-rate-button.js';
import './media-playback-rate-listbox.js';
import { globalThis, document } from '../utils/server-safe-globals.js';

/**
 * @csspart button - The default button that's in the shadow DOM.
 * @csspart listbox - The default listbox that's in the shadow DOM.
 * @csspart option - A part that targets each option of the listbox.
 */
class MediaPlaybackRateSelectMenu extends MediaChromeSelectMenu {
  init() {
    const playbackRateButton = document.createElement(
      'media-playback-rate-button'
    );
    playbackRateButton.part.add('button');
    playbackRateButton.preventClick = true;

    const playbackRateListbox = document.createElement(
      'media-playback-rate-listbox'
    );
    playbackRateListbox.part.add('listbox');
    playbackRateListbox.setAttribute(
      'exportparts',
      'option, option-selected, indicator'
    );

    const buttonSlot = this.shadowRoot.querySelector('slot[name=button]');
    const listboxSlot = this.shadowRoot.querySelector('slot[name=listbox]');

    buttonSlot.textContent = '';
    listboxSlot.textContent = '';

    buttonSlot.append(playbackRateButton);
    listboxSlot.append(playbackRateListbox);
  }
}

if (!globalThis.customElements.get('media-playback-rate-selectmenu')) {
  globalThis.customElements.define(
    'media-playback-rate-selectmenu',
    MediaPlaybackRateSelectMenu
  );
}

export { MediaPlaybackRateSelectMenu };
export default MediaPlaybackRateSelectMenu;
