import MediaChromeSelectMenu from './media-chrome-selectmenu.js';
import './media-chrome-listitem.js';
import { DEFAULT_RATES } from '../media-playback-rate-button.js';
import './media-playback-rate-listbox.js';
import { window, document, } from '../utils/server-safe-globals.js';

const createItem = (rate) => {
  const item = document.createElement('media-chrome-listitem');
  item.value = rate;
  item.textContent = rate + 'x';

  return item;
}

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
    playbackrateListbox.setAttribute('exportparts', 'listitem');

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

      const rates = newValue.trim().split(' ');

      rates.forEach(rate => {
        listbox.append(createItem(rate));
      });
    }

    super.attributeChangedCallback(attrName, oldValue, newValue);
  }
}

if (!window.customElements.get('media-playback-rate-selectmenu')) {
  window.customElements.define('media-playback-rate-selectmenu', MediaPlaybackrateSelectMenu);
}

export default MediaPlaybackrateSelectMenu;
