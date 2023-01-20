import MediaChromeListbox from './media-chrome-listbox.js';
import { window, document } from './utils/server-safe-globals.js';
import { MediaUIAttributes, MediaUIEvents } from './constants.js';
import { parseTextTracksStr, parseTextTrackStr, formatTextTrackObj } from './utils/captions.js';
import { toggleSubsCaps } from './utils/captions.js';

const captionsIndicatorInlineStyle = `
  fill: var(--media-icon-color, #eee);
  height: var(--media-captions-indicator-height, 1em);
  vertical-align: var(--media-captions-indicator-vertical-align, bottom);
  margin-inline-start: 1ch;
`;

const ccIcon = `
<svg style="${captionsIndicatorInlineStyle}" aria-hidden="true" viewBox="0 0 26 24">
  <path d="M22.83 5.68a2.58 2.58 0 0 0-2.3-2.5c-3.62-.24-11.44-.24-15.06 0a2.58 2.58 0 0 0-2.3 2.5c-.23 4.21-.23 8.43 0 12.64a2.58 2.58 0 0 0 2.3 2.5c3.62.24 11.44.24 15.06 0a2.58 2.58 0 0 0 2.3-2.5c.23-4.21.23-8.43 0-12.64Zm-11.39 9.45a3.07 3.07 0 0 1-1.91.57 3.06 3.06 0 0 1-2.34-1 3.75 3.75 0 0 1-.92-2.67 3.92 3.92 0 0 1 .92-2.77 3.18 3.18 0 0 1 2.43-1 2.94 2.94 0 0 1 2.13.78c.364.359.62.813.74 1.31l-1.43.35a1.49 1.49 0 0 0-1.51-1.17 1.61 1.61 0 0 0-1.29.58 2.79 2.79 0 0 0-.5 1.89 3 3 0 0 0 .49 1.93 1.61 1.61 0 0 0 1.27.58 1.48 1.48 0 0 0 1-.37 2.1 2.1 0 0 0 .59-1.14l1.4.44a3.23 3.23 0 0 1-1.07 1.69Zm7.22 0a3.07 3.07 0 0 1-1.91.57 3.06 3.06 0 0 1-2.34-1 3.75 3.75 0 0 1-.92-2.67 3.88 3.88 0 0 1 .93-2.77 3.14 3.14 0 0 1 2.42-1 3 3 0 0 1 2.16.82 2.8 2.8 0 0 1 .73 1.31l-1.43.35a1.49 1.49 0 0 0-1.51-1.21 1.61 1.61 0 0 0-1.29.58A2.79 2.79 0 0 0 15 12a3 3 0 0 0 .49 1.93 1.61 1.61 0 0 0 1.27.58 1.44 1.44 0 0 0 1-.37 2.1 2.1 0 0 0 .6-1.15l1.4.44a3.17 3.17 0 0 1-1.1 1.7Z"/>
</svg>`;

const slotTemplate = document.createElement('template');
slotTemplate.innerHTML = `
  <slot hidden name="captions-indicator">${ccIcon}</slot>
`;

const compareTracks = (a, b) => {
  return a.label === b.label && a.language === b.language;
}

class MediaCaptionsListbox extends MediaChromeListbox {
  #subs = [];
  #caps = [];
  #offOption;
  #captionsIndicator;

  static get observedAttributes() {
    return [
      ...super.observedAttributes,
      'aria-multiselectable',
      MediaUIAttributes.MEDIA_CAPTIONS_LIST,
      MediaUIAttributes.MEDIA_CAPTIONS_SHOWING,
      MediaUIAttributes.MEDIA_SUBTITLES_LIST,
      MediaUIAttributes.MEDIA_SUBTITLES_SHOWING,
    ];
  }

  constructor() {
    super({slotTemplate});

    const offOption = document.createElement('media-chrome-listitem');

    offOption.value = 'off';
    offOption.textContent = 'Off';
    this.#offOption = offOption;

    const captionsIndicatorSlot = this.shadowRoot.querySelector('[name="captions-indicator"]')

    this.#captionsIndicator = captionsIndicatorSlot.firstElementChild;
    captionsIndicatorSlot.addEventListener('slotchange', () => {
      let els = captionsIndicatorSlot.assignedElements();

      // slotted svg from outside of media-captions-menu-button
      if (els.length === 1 && els[0].nodeName.toLowerCase() === 'slot') {
        const assignedElements = els[0].assignedElements();

        if (assignedElements.length === 0) {
          this.#captionsIndicator = els[0].firstElementChild;
        } else if (assignedElements.length === 1) {
          this.#captionsIndicator = assignedElements[0]
        }
      }

      if (!this.#captionsIndicator) {
        this.#captionsIndicator = captionsIndicatorSlot.firstElementChild;
      }

      this.#captionsIndicator = this.#captionsIndicator.cloneNode(true);
      this.#captionsIndicator.removeAttribute('slot');
      this.#captionsIndicator.setAttribute('style', captionsIndicatorInlineStyle);
    });
  }

  attributeChangedCallback(attrName, oldValue, newValue) {
    if (attrName === MediaUIAttributes.MEDIA_SUBTITLES_LIST && oldValue !== newValue) {

      this.#subs = this.#perTypeUpdate(newValue, this.#subs);

      this.#render();

    } else if (attrName === MediaUIAttributes.MEDIA_CAPTIONS_LIST && oldValue !== newValue) {

      this.#caps = this.#perTypeUpdate(newValue, this.#caps);

      this.#render();

    } else if (attrName === MediaUIAttributes.MEDIA_SUBTITLES_SHOWING && oldValue !== newValue) {
      const selectedTrack = parseTextTrackStr(newValue ?? '');

      this.#subs.forEach(track => {
        track.selected = track.language === selectedTrack.language && track.label === selectedTrack.label;
      });
      this.#render();

    } else if (attrName === MediaUIAttributes.MEDIA_CAPTIONS_SHOWING && oldValue !== newValue) {
      const selectedTrack = parseTextTrackStr(newValue ?? '');

      this.#caps.forEach(track => {
        track.selected = track.language === selectedTrack.language && track.label === selectedTrack.label;
      });
      this.#render();

    } else if (attrName === 'aria-multiselectable') {
      // diallow aria-multiselectable
      this.removeAttribute('aria-multiselectable');
      console.warn("Captions List doesn't currently support multiple selections. You can enable multiple items via the media.textTrack API.");
    }

    super.attributeChangedCallback(attrName, oldValue, newValue);
  }

  connectedCallback() {
    this.#render();

    this.addEventListener('change', this.#onChange);

    super.connectedCallback();
  }

  disconnectedCallback() {
    this.removeEventListener('change', this.#onChange);

    super.disconnectedCallback();
  }

  #perTypeUpdate(newValue, oldItems) {
    const newItems = newValue ? parseTextTracksStr(newValue ?? '') : [];

    const removedTracks = [];
    const newTracks = [];

    // find all the items that are no longer available
    oldItems.forEach(track => {
      if (!newItems.some(newTrack => compareTracks(newTrack, track))) {
        removedTracks.push(track);
      }
    });
    // find all the new items
    newItems.forEach(track => {
      if (!oldItems.some(newTrack => compareTracks(newTrack, track))) {
        newTracks.push(track);
      }
    });

    // remove the removed tracks from the DOM
    removedTracks.forEach(track => track.el.remove());

    // filter out the removed tracks and include the new ones
    return oldItems.filter(track => !removedTracks.includes(track)).concat(newTracks);
  }

  #perTypeRender(tracks, type) {
    tracks.forEach(track => {
      let option = track.el;
      let alreadyInDom = true;

      if (!option) {
        option = document.createElement('media-chrome-listitem');
        alreadyInDom = false;

        option.value = type + '!' + formatTextTrackObj(track);
        option.textContent = track.label;

        // add CC icon for captions
        if (type === 'cc') {
          option.append(this.#captionsIndicator.cloneNode(true));
        }
      }


      if (track.selected) {
        option.setAttribute('aria-selected', 'true');
      } else {
        option.setAttribute('aria-selected', 'false');
      }

      if (!alreadyInDom) {
        this.append(option);
        track.el = option;
      }
    });
  }

  #render() {
    if (!this.contains(this.#offOption)) {
      this.append(this.#offOption);
    }

    if (!this.hasAttribute(MediaUIAttributes.MEDIA_CAPTIONS_SHOWING) && !this.hasAttribute(MediaUIAttributes.MEDIA_SUBTITLES_SHOWING)) {
      this.#offOption.setAttribute('aria-selected', 'true');
      this.#offOption.setAttribute('tabindex', '0');
    } else {
      this.#offOption.setAttribute('aria-selected', 'false');
      this.#offOption.setAttribute('tabindex', '-1');
    }

    this.#perTypeRender(this.#caps, 'cc');
    this.#perTypeRender(this.#subs, 'subs');
  }

  #onChange() {
    const [newType, selectedOption] = this.selectedOptions[0]?.value?.split('!') ?? [];

    // turn off currently selected tracks
    toggleSubsCaps(this);

    if (!selectedOption) return;

    const event = new window.CustomEvent(
      newType === 'cc' ? MediaUIEvents.MEDIA_SHOW_CAPTIONS_REQUEST : MediaUIEvents.MEDIA_SHOW_SUBTITLES_REQUEST,
      {
        composed: true,
        bubbles: true,
        detail: selectedOption,
      }
    );
    this.dispatchEvent(event);
  }
}

if (!window.customElements.get('media-captions-listbox')) {
  window.customElements.define('media-captions-listbox', MediaCaptionsListbox);
}

export default MediaCaptionsListbox;
