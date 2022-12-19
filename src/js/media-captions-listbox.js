import MediaChromeListbox from './media-chrome-listbox.js';
import { window, document } from './utils/server-safe-globals.js';
import { MediaUIAttributes, MediaUIEvents } from './constants.js';
import { parseTextTracksStr, parseTextTrackStr, formatTextTrackObj } from './utils/captions.js';

const compareTracks = (a, b) => {
  return a.label === b.label && a.language === b.language;
}

class MediaCaptionsListbox extends MediaChromeListbox {
  #subs = [];
  #caps = [];
  #offOption;

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
    super();

    const offOption = document.createElement('media-chrome-listitem');

    offOption.value = 'off';
    offOption.textContent = 'Off';
    this.#offOption = offOption;
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
        option.textContent = track.label + (track.kind === 'captions' ? ' (cc)' : '');
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
    let currentlySelectedTrack = this.#caps.find(track => track.selected);
    let oldType = 'cc';

    if (!currentlySelectedTrack) {
      currentlySelectedTrack = this.#subs.find(track => track.selected);
      oldType = 'subs';
    }

    if (currentlySelectedTrack) {
      const disableEvent = new window.CustomEvent(
        oldType === 'cc' ? MediaUIEvents.MEDIA_DISABLE_CAPTIONS_REQUEST : MediaUIEvents.MEDIA_DISABLE_SUBTITLES_REQUEST,
        {
          composed: true,
          bubbles: true,
          detail: formatTextTrackObj(currentlySelectedTrack)
        }
      );
      this.dispatchEvent(disableEvent);
    }

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
