import MediaChromeSelectMenu from './media-chrome-selectmenu.js';
import './media-chrome-option.js';
import { DEFAULT_RATES } from '../media-playback-rate-button.js';
import './media-playback-rate-listbox.js';
import { globalThis, document, } from '../utils/server-safe-globals.js';

const createItem = (rate) => {
  const item = document.createElement('media-chrome-option');
  item.part.add('option');
  item.value = rate;
  item.textContent = rate + 'x';

  return item;
}

/**
 * @attr {string} rates - Set custom playback rates for the user to choose from.
 *
 * @csspart button - The default button that's in the shadow DOM.
 * @csspart listbox - The default listbox that's in the shadow DOM.
 * @csspart option - A part that targets each option of the listbox.
 */
class MediaPlaybackrateSelectMenu extends MediaChromeSelectMenu {
  static get observedAttributes() {
    return [
      ...super.observedAttributes,
      'rates'
    ];
  }

  constructor() {
    super();
  }

  init() {
    const playbackrateButton = document.createElement('media-playback-rate-button');
    playbackrateButton.part.add('button');

    playbackrateButton.preventClick = true;

    const playbackrateListbox = document.createElement('media-playback-rate-listbox');
    playbackrateListbox.part.add('listbox');
    playbackrateListbox.setAttribute('exportparts', 'option');

    DEFAULT_RATES.forEach(rate => {
      playbackrateListbox.append(createItem(rate));
    });

    const buttonSlot = this.shadowRoot.querySelector('slot[name=button]');
    const listboxSlot = this.shadowRoot.querySelector('slot[name=listbox]');

    buttonSlot.textContent = '';
    listboxSlot.textContent = '';

    buttonSlot.append(playbackrateButton);
    listboxSlot.append(playbackrateListbox);
  }

  attributeChangedCallback(attrName, oldValue, newValue) {

    if (attrName === 'rates' && oldValue !== newValue) {
      const listbox = this.shadowRoot.querySelector('media-playback-rate-listbox');

      listbox.textContent = '';

      const rates = newValue ? newValue.trim().split(' ') : DEFAULT_RATES;

      rates.forEach(rate => {
        listbox.append(createItem(rate));
      });
    }

    super.attributeChangedCallback(attrName, oldValue, newValue);
  }
}

if (!globalThis.customElements.get('media-playback-rate-selectmenu')) {
  globalThis.customElements.define('media-playback-rate-selectmenu', MediaPlaybackrateSelectMenu);
}

export default MediaPlaybackrateSelectMenu;
